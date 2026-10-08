using System.Text.Json.Serialization;

namespace VictoryLane.Api.Models;

public class CustomRequest
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string UserId { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public string CustomerEmail { get; set; } = "";
    public string CustomerPhone { get; set; } = "";

    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Quantity { get; set; } = "";
    public string Budget { get; set; } = "";
    public string DeliveryDate { get; set; } = "";

    public string Status { get; set; } = "pending"; // pending|in-review|approved|rejected
    public string AdminNote { get; set; } = "";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
