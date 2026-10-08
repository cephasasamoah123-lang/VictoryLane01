using VictoryLane.Api.Data;
using VictoryLane.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/requests")]
[Authorize]
public class RequestsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RequestsController(AppDbContext db)
    {
        _db = db;
    }

    public record RequestInput(string? Title, string? Description, string? Quantity, string? Budget, string? DeliveryDate);
    public record UpdateStatusInput(string Status, string? AdminNote);

    private string CurrentUserId => User.FindFirst("_id")!.Value;
    private bool IsAdmin => User.FindFirst("role")?.Value == "admin";

    [HttpGet("stats")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Stats()
    {
        var total = await _db.Requests.CountAsync();
        var pending = await _db.Requests.CountAsync(r => r.Status == "pending");
        var approved = await _db.Requests.CountAsync(r => r.Status == "approved");
        var rejected = await _db.Requests.CountAsync(r => r.Status == "rejected");
        return Ok(new { success = true, total, pending, approved, rejected });
    }

    [HttpGet("my")]
    public async Task<IActionResult> MyRequests()
    {
        var requests = await _db.Requests
            .Where(r => r.UserId == CurrentUserId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(new { success = true, requests });
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] string? search)
    {
        var query = _db.Requests.AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(r => r.Status == status);

        var results = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLowerInvariant();
            results = results.Where(r =>
                (r.Title ?? "").ToLowerInvariant().Contains(s) ||
                (r.CustomerName ?? "").ToLowerInvariant().Contains(s) ||
                (r.CustomerEmail ?? "").ToLowerInvariant().Contains(s)
            ).ToList();
        }

        return Ok(new { success = true, requests = results });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var request = await _db.Requests.FindAsync(id);
        if (request is null)
            return NotFound(new { success = false, message = "Request not found" });

        if (!IsAdmin && request.UserId != CurrentUserId)
            return StatusCode(403, new { success = false, message = "Access denied" });

        return Ok(new { success = true, request });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RequestInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Title) || string.IsNullOrWhiteSpace(input.Description))
            return BadRequest(new { success = false, message = "Title and description are required" });

        var user = await _db.Users.FindAsync(Guid.Parse(CurrentUserId));

        var request = new CustomRequest
        {
            UserId = CurrentUserId,
            CustomerName = user?.Name ?? "Unknown",
            CustomerEmail = user?.Email ?? "",
            CustomerPhone = user?.Phone ?? "",
            Title = input.Title,
            Description = input.Description,
            Quantity = input.Quantity ?? "",
            Budget = input.Budget ?? "",
            DeliveryDate = input.DeliveryDate ?? "",
            Status = "pending",
            AdminNote = "",
        };

        _db.Requests.Add(request);
        await _db.SaveChangesAsync();
        return StatusCode(201, new { success = true, request });
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusInput input)
    {
        var valid = new[] { "pending", "in-review", "approved", "rejected" };
        if (!valid.Contains(input.Status))
            return BadRequest(new { success = false, message = "Invalid status" });

        var request = await _db.Requests.FindAsync(id);
        if (request is null)
            return NotFound(new { success = false, message = "Request not found" });

        request.Status = input.Status;
        if (input.AdminNote is not null) request.AdminNote = input.AdminNote;
        request.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { success = true, request });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var request = await _db.Requests.FindAsync(id);
        if (request is null)
            return NotFound(new { success = false, message = "Request not found" });

        _db.Requests.Remove(request);
        await _db.SaveChangesAsync();
        return Ok(new { success = true, message = "Request deleted" });
    }
}
