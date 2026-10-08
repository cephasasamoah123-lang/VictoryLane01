using System.Collections.Concurrent;
using VictoryLane.Api.Models;
using VictoryLane.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly GeminiService _ai;

    // Very small in-memory rate limiter per IP so a single visitor can't rack up
    // unbounded API costs. Good enough for a small store; swap for a proper
    // store (Redis) if you scale up.
    private static readonly ConcurrentDictionary<string, (int Count, DateTime ResetAt)> Hits = new();

    public AiController(GeminiService ai)
    {
        _ai = ai;
    }

    public record ChatRequest(string? Message, List<HistoryMessage>? History);
    public record ProductRequest(string? ProductId);
    public record DescriptionRequest(string? Name, string? Category, string? Brand, string? Keywords);

    private bool TooManyRequests(int max, TimeSpan window)
    {
        var key = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var now = DateTime.UtcNow;

        var entry = Hits.GetOrAdd(key, _ => (0, now.Add(window)));
        if (now > entry.ResetAt) entry = (0, now.Add(window));
        entry.Count++;
        Hits[key] = entry;

        return entry.Count > max;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest req)
    {
        if (TooManyRequests(30, TimeSpan.FromMinutes(1)))
            return StatusCode(429, new { success = false, message = "Too many AI requests, please slow down." });

        if (string.IsNullOrWhiteSpace(req.Message))
            return BadRequest(new { success = false, message = "message is required" });

        try
        {
            var (reply, actions) = await _ai.ChatWithAssistantAsync(req.Message.Trim(), req.History ?? new());
            return Ok(new { success = true, reply, actions });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"AI chat error: {ex}");
            return StatusCode(500, new { success = false, message = "Assistant is unavailable right now" });
        }
    }

    [HttpPost("recommendations")]
    public async Task<IActionResult> Recommendations([FromBody] ProductRequest req)
    {
        if (TooManyRequests(60, TimeSpan.FromMinutes(1)))
            return StatusCode(429, new { success = false, message = "Too many AI requests, please slow down." });

        if (string.IsNullOrEmpty(req.ProductId))
            return BadRequest(new { success = false, message = "productId is required" });

        try
        {
            var recommendations = await _ai.GetRecommendationsAsync(req.ProductId);
            return Ok(new { success = true, recommendations });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"AI recommendations error: {ex}");
            return StatusCode(500, new { success = false, message = "Could not load recommendations" });
        }
    }

    [HttpPost("style-advice")]
    public async Task<IActionResult> StyleAdvice([FromBody] ProductRequest req)
    {
        if (TooManyRequests(60, TimeSpan.FromMinutes(1)))
            return StatusCode(429, new { success = false, message = "Too many AI requests, please slow down." });

        if (string.IsNullOrEmpty(req.ProductId))
            return BadRequest(new { success = false, message = "productId is required" });

        try
        {
            var result = await _ai.GetStyleAdviceAsync(req.ProductId);
            return Ok(new { success = true, advice = result.Advice, picks = result.Picks });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"AI style advice error: {ex}");
            return StatusCode(500, new { success = false, message = "Could not load style advice" });
        }
    }

    [HttpPost("generate-description")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GenerateDescription([FromBody] DescriptionRequest req)
    {
        if (TooManyRequests(30, TimeSpan.FromMinutes(1)))
            return StatusCode(429, new { success = false, message = "Too many AI requests, please slow down." });

        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { success = false, message = "Product name is required" });

        try
        {
            var description = await _ai.GenerateProductDescriptionAsync(req.Name, req.Category, req.Brand, req.Keywords);
            return Ok(new { success = true, description });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"AI description generation error: {ex}");
            return StatusCode(500, new { success = false, message = "Could not generate description" });
        }
    }
}
