using VictoryLane.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var total = await _db.Users.CountAsync();
        var customers = await _db.Users.CountAsync(u => u.Role == "customer");
        var admins = await _db.Users.CountAsync(u => u.Role == "admin");
        return Ok(new { success = true, total, customers, admins });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Password is [JsonIgnore] on the model, so it's excluded automatically
        var users = await _db.Users.ToListAsync();
        return Ok(new { success = true, users });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return NotFound(new { success = false, message = "User not found" });

        if (user.Role == "admin")
            return BadRequest(new { success = false, message = "Cannot delete admin user" });

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return Ok(new { success = true, message = "User deleted" });
    }
}
