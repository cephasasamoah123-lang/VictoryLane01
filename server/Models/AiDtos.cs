namespace VictoryLane.Api.Models;

/// <summary>A trimmed product projection sent to Claude as catalog context.</summary>
public class CatalogItem
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal Price { get; set; }
    public string? Brand { get; set; }
    public double Rating { get; set; }
    public int? Stock { get; set; }
}

/// <summary>A recommended/style-matched product, with the model's reason for picking it.</summary>
public class ProductPick
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal Price { get; set; }
    public string? Brand { get; set; }
    public double Rating { get; set; }
    public string Reason { get; set; } = "";
}

/// <summary>Raw shape of a {id, reason} pick as returned in Claude's JSON output.</summary>
public class PickRaw
{
    public string Id { get; set; } = "";
    public string Reason { get; set; } = "";
}

/// <summary>Raw shape of the style-advice JSON response from Claude.</summary>
public class StyleAdviceRaw
{
    public string? Advice { get; set; }
    public List<PickRaw>? Picks { get; set; }
}

public class StyleAdviceResult
{
    public string Advice { get; set; } = "";
    public List<ProductPick> Picks { get; set; } = new();
}

/// <summary>
/// An action the chat assistant wants performed. Cart state lives client-side
/// (Zustand), so the server never mutates a cart directly - it just describes
/// what should happen and the frontend executes it.
/// </summary>
public class CartAction
{
    public string Type { get; set; } = ""; // "add_to_cart" | "go_to_checkout"
    public string? ProductId { get; set; }
    public string? Name { get; set; }
    public decimal? Price { get; set; }
    public string? Image { get; set; }
    public int? Quantity { get; set; }
}

public record HistoryMessage(string? Role, string? Content);
