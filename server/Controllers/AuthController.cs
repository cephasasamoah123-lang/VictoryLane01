using VictoryLane.Api.Data;
using VictoryLane.Api.Models;
using VictoryLane.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokens;

    public AuthController(AppDbContext db, TokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    public record RegisterRequest(string FirstName, string LastName, string Email, string Phone, string Password);
    public record LoginRequest(string Email, string Password);

    private static object PublicUser(User u) => new
    {
        _id = u.Id,
        name = u.Name,
        firstName = u.FirstName,
        lastName = u.LastName,
        email = u.Email,
        phone = u.Phone,
        role = u.Role,
    };

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.FirstName) || string.IsNullOrWhiteSpace(req.LastName) ||
            string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Phone) ||
            string.IsNullOrWhiteSpace(req.Password))
        {
            return BadRequest(new { success = false, message = "First name, last name, email, phone, and password are required" });
        }

        if (req.Password.Length < 6)
            return BadRequest(new { success = false, message = "Password must be at least 6 characters" });

        var email = req.Email.ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email))
            return BadRequest(new { success = false, message = "Email already registered" });

        var user = new User
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Name = $"{req.FirstName} {req.LastName}",
            Email = email,
            Phone = req.Phone,
            Password = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = "customer",
            Status = "active",
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokens.GenerateToken(user);
        return StatusCode(201, new { success = true, user = PublicUser(user), token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { success = false, message = "Email and password are required" });

        var email = req.Email.ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
            return Unauthorized(new { success = false, message = "Invalid email or password" });

        var token = _tokens.GenerateToken(user);
        return Ok(new { success = true, user = PublicUser(user), token });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var id = Guid.Parse(User.FindFirst("_id")!.Value);
        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true, user = PublicUser(user) });
    }
}
