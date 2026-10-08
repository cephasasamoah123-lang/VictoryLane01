using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VictoryLane.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace VictoryLane.Api.Services;

public class TokenService
{
    private readonly string _secret;

    public TokenService(IConfiguration config)
    {
        _secret = config["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret configuration is required.");
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim("_id", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("role", user.Role),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
