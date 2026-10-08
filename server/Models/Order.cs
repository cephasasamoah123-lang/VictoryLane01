using System.Text.Json.Serialization;

namespace VictoryLane.Api.Models;

public class OrderItem
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OrderId { get; set; }
    [JsonIgnore]
    public Order? Order { get; set; }

    public string ProductId { get; set; } = "";
    public string Name { get; set; } = "";
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; } = "";
}

public class ShippingAddress
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string Region { get; set; } = "";
}

public class Order
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string OrderNumber { get; set; } = "";
    public string? UserId { get; set; }
    public string CustomerName { get; set; } = "";
    public string CustomerEmail { get; set; } = "";

    public List<OrderItem> Items { get; set; } = new();
    public ShippingAddress ShippingAddress { get; set; } = new();

    public string PaymentMethod { get; set; } = "";
    public string PaymentReference { get; set; } = "";
    public string PaymentStatus { get; set; } = "pending";
    public string Status { get; set; } = "pending"; // pending|processing|shipped|delivered|cancelled
    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
