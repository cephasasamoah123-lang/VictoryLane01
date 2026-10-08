using System.Text.Json.Serialization;

namespace VictoryLane.Api.Models;

public class User
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";

    [JsonIgnore]
    public string Password { get; set; } = "";

    public string Role { get; set; } = "customer"; // "customer" | "admin"
    public string Status { get; set; } = "active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
