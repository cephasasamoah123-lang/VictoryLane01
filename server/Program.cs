using System.Text;
using VictoryLane.Api.Data;
using VictoryLane.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// --- Config ---
var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"]
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required. Set it in appsettings.json or via environment variable.");

var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret is required.");

// --- Services ---
// Npgsql 8+ requires explicit opt-in for writing List<T>/Dictionary<T> to jsonb columns
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dataSource));

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddHttpClient<PaystackService>();

// --- Gemini AI service (chatbot, recommendations, style advice, description generator) ---
var geminiApiKey = builder.Configuration["Gemini:ApiKey"];
builder.Services.AddHttpClient<GeminiService>(client =>
{
    client.BaseAddress = new Uri("https://generativelanguage.googleapis.com/v1beta/models/");
    if (!string.IsNullOrEmpty(geminiApiKey))
        client.DefaultRequestHeaders.Add("x-goog-api-key", geminiApiKey);
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // camelCase to match the existing Node/Express API responses exactly
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.Never;
});

// --- CORS (mirrors Node's allowedOrigins logic) ---
var frontendUrl = builder.Configuration["FrontendUrl"];
var allowedOrigins = new List<string> { "http://localhost:3000", "http://localhost:5173" };
if (!string.IsNullOrEmpty(frontendUrl)) allowedOrigins.Add(frontendUrl);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                allowedOrigins.Any(o => origin.StartsWith(o)) || origin.EndsWith(".vercel.app"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// --- JWT Auth ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Without this, ASP.NET Core silently renames short claim types (like "role")
        // to long Microsoft URIs during validation, breaking [Authorize(Roles = "admin")].
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        };
        // Map the "role" claim so [Authorize(Roles = "admin")] works with our custom JWT
        options.TokenValidationParameters.RoleClaimType = "role";
        options.TokenValidationParameters.NameClaimType = "_id";
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// --- Seed database on startup ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbInitializer.SeedAsync(db, app.Configuration);
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/health", async (AppDbContext db) =>
{
    try
    {
        if (!await db.Database.CanConnectAsync())
            return (IResult)Results.Problem("The database is unavailable.", statusCode: StatusCodes.Status503ServiceUnavailable);

        return (IResult)Results.Ok(new { status = "ok", database = "connected", timestamp = DateTime.UtcNow });
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Database health check failed");
        return Results.Problem("The database is unavailable.", statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
