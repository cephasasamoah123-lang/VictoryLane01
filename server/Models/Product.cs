using System.Text.Json.Serialization;

namespace VictoryLane.Api.Models;

public class Product
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public string Category { get; set; } = "";
    public int Stock { get; set; } = 0;
    public string Image { get; set; } = "";
    public List<string> Images { get; set; } = new();
    public string Brand { get; set; } = "";
    public double Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    public Dictionary<string, string> Specifications { get; set; } = new();
    public string Status { get; set; } = "active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
