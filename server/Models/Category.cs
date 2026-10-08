using System.Text.Json.Serialization;

namespace VictoryLane.Api.Models;

public class Category
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Image { get; set; } = "";
    public string Description { get; set; } = "";

    /// <summary>Department-level grouping only, e.g. "Women", "Men", "Kids", "Unisex".</summary>
    public string Group { get; set; } = "";

    [JsonPropertyName("order")]
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
