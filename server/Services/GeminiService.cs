using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using VictoryLane.Api.Data;
using VictoryLane.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Services;

/// <summary>
/// Wraps calls to Google's Gemini API (https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent).
/// There is no official Gemini .NET SDK for this REST surface, so requests/responses
/// are built with System.Text.Json.Nodes for flexibility rather than strict DTOs -
/// this keeps function-call/function-response message plumbing simple and correct
/// without needing a large set of matching POCOs.
///
/// NOTE ON MODEL NAMES: Google renames/deprecates Gemini model ids frequently.
/// The constants below (FastModel/QualityModel) were current as of mid-2026. If you
/// get a 404 "model not found" error, check https://ai.google.dev/gemini-api/docs/models
/// for the current model id and update the constants below.
/// </summary>
public class GeminiService
{
    private readonly HttpClient _http;
    private readonly AppDbContext _db;

    // Cheaper/faster model for high-volume, low-complexity tasks (chat turns, recommendations).
    private const string FastModel = "gemini-3.5-flash";
    // Stronger model for tasks worth spending a bit more on (admin description generator).
    private const string QualityModel = "gemini-3.1-pro-preview";

    private const string StoreName = "VictoryLane";

    private static readonly JsonSerializerOptions CaseInsensitiveJson = new() { PropertyNameCaseInsensitive = true };
    private static readonly JsonSerializerOptions CamelCaseJson = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public GeminiService(HttpClient http, AppDbContext db)
    {
        _http = http;
        _db = db;
    }

    private static string StripFences(string text) => Regex.Replace(text, "```json|```", "").Trim();

    /// <summary>Gemini uses "user"/"model" roles, not Anthropic's "user"/"assistant".</summary>
    private static string ToGeminiRole(string? role) => role == "assistant" ? "model" : "user";

    private async Task<JsonNode?> SendGenerateContentAsync(string model, JsonObject requestBody)
    {
        var response = await _http.PostAsync(
     $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
             new StringContent(requestBody.ToJsonString(), Encoding.UTF8, "application/json"));
        var body = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Gemini API error ({(int)response.StatusCode}): {body}");

        return JsonNode.Parse(body);
    }

    /// <summary>Extracts the first candidate's content node (role + parts) from a response.</summary>
    private static JsonObject? GetFirstCandidateContent(JsonNode? responseNode) =>
        responseNode?["candidates"]?[0]?["content"] as JsonObject;

    private static string? ExtractText(JsonNode? responseNode)
    {
        var parts = GetFirstCandidateContent(responseNode)?["parts"]?.AsArray();
        var textPart = parts?.FirstOrDefault(p => p?["text"] is not null && p["functionCall"] is null);
        return textPart?["text"]?.GetValue<string>();
    }

    private async Task<List<CatalogItem>> GetCatalogSnapshotAsync(Guid? excludeId = null, string? category = null, int limit = 80)
    {
        var query = _db.Products.Where(p => p.Status == "active" && p.Stock > 0);
        if (excludeId.HasValue) query = query.Where(p => p.Id != excludeId.Value);
        if (!string.IsNullOrEmpty(category)) query = query.Where(p => p.Category == category);

        var products = await query.Take(limit).ToListAsync();
        return products.Select(p => new CatalogItem
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            Category = p.Category,
            Price = p.Price,
            Brand = string.IsNullOrEmpty(p.Brand) ? null : p.Brand,
            Rating = p.Rating,
        }).ToList();
    }

    private async Task<List<CatalogItem>> SearchProductsAsync(string? query, string? category, decimal? maxPrice)
    {
        var q = _db.Products.Where(p => p.Status == "active" && p.Stock > 0);
        if (!string.IsNullOrEmpty(category)) q = q.Where(p => p.Category == category);
        if (!string.IsNullOrEmpty(query)) q = q.Where(p => EF.Functions.ILike(p.Name, $"%{query}%"));
        if (maxPrice.HasValue) q = q.Where(p => p.Price <= maxPrice.Value);

        var products = await q.Take(10).ToListAsync();
        return products.Select(p => new CatalogItem
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            Category = p.Category,
            Price = p.Price,
            Brand = string.IsNullOrEmpty(p.Brand) ? null : p.Brand,
            Rating = p.Rating,
            Stock = p.Stock,
        }).ToList();
    }

    private static JsonArray BuildChatTools() => new()
    {
        new JsonObject
        {
            ["functionDeclarations"] = new JsonArray
            {
                new JsonObject
                {
                    ["name"] = "search_products",
                    ["description"] = "Search the store catalog for products. Use this whenever the customer asks about specific items, categories, or price ranges, so you recommend real in-stock products rather than guessing.",
                    ["parameters"] = new JsonObject
                    {
                        ["type"] = "OBJECT",
                        ["properties"] = new JsonObject
                        {
                            ["query"] = new JsonObject { ["type"] = "STRING", ["description"] = "Keyword to match against product names, e.g. \"shirt\" or \"jeans\"" },
                            ["category"] = new JsonObject { ["type"] = "STRING", ["description"] = "Category slug to filter by, if known" },
                            ["maxPrice"] = new JsonObject { ["type"] = "NUMBER", ["description"] = "Maximum price filter, if the customer mentioned a budget" },
                        },
                    },
                },
                new JsonObject
                {
                    ["name"] = "add_to_cart",
                    ["description"] = "Add a specific product to the customer's cart. Only call this after the customer has clearly confirmed which exact product (and quantity, if relevant) they want added - never guess or add something they haven't agreed to.",
                    ["parameters"] = new JsonObject
                    {
                        ["type"] = "OBJECT",
                        ["properties"] = new JsonObject
                        {
                            ["productId"] = new JsonObject { ["type"] = "STRING", ["description"] = "The catalog id of the product to add, from a previous search_products result" },
                            ["quantity"] = new JsonObject { ["type"] = "NUMBER", ["description"] = "Quantity to add, defaults to 1" },
                        },
                        ["required"] = new JsonArray { "productId" },
                    },
                },
                new JsonObject
                {
                    ["name"] = "go_to_checkout",
                    ["description"] = "Take the customer to the checkout page. Only call this when the customer explicitly says they're ready to check out or pay.",
                    ["parameters"] = new JsonObject { ["type"] = "OBJECT", ["properties"] = new JsonObject() },
                },
            },
        },
    };

    /// <summary>
    /// Shopping assistant chat with tool use. Gemini can search the real catalog and
    /// request cart/checkout actions; those action tool calls are NOT executed here
    /// (cart state lives client-side) - they're collected and handed back so the
    /// frontend can perform the actual mutation and show a confirmation.
    /// </summary>
    public async Task<(string Reply, List<CartAction> Actions)> ChatWithAssistantAsync(string message, List<HistoryMessage> history)
    {
        var system = $"You are a friendly shopping assistant for {StoreName}, an online clothing store.\n" +
            "Help customers find products, compare options, answer general sizing/fit and policy questions (shipping, returns - only in general, non-committal terms since you don't have live policy data), and help them complete a purchase.\n" +
            "Use the search_products tool whenever a customer asks about items, categories, or budgets - never invent products that aren't in the catalog.\n" +
            "Use add_to_cart only after the customer clearly confirms the exact product they want.\n" +
            "Use go_to_checkout only when the customer says they're ready to pay/checkout.\n" +
            "Keep replies concise and conversational (2-4 sentences unless listing search results).\n" +
            "If asked something unrelated to shopping/fashion/this store, politely redirect to how you can help with their shopping.";

        var contents = new JsonArray();
        foreach (var h in history.TakeLast(10))
            contents.Add(new JsonObject { ["role"] = ToGeminiRole(h.Role), ["parts"] = new JsonArray { new JsonObject { ["text"] = h.Content ?? "" } } });
        contents.Add(new JsonObject { ["role"] = "user", ["parts"] = new JsonArray { new JsonObject { ["text"] = message } } });

        var actions = new List<CartAction>();
        const int maxTurns = 4;

        for (var turn = 0; turn < maxTurns; turn++)
        {
            var requestBody = new JsonObject
            {
                ["systemInstruction"] = new JsonObject { ["parts"] = new JsonArray { new JsonObject { ["text"] = system } } },
                ["tools"] = BuildChatTools(),
                ["contents"] = contents.DeepClone(),
            };

            var responseNode = await SendGenerateContentAsync(FastModel, requestBody);
            var candidateContent = GetFirstCandidateContent(responseNode);
            var parts = candidateContent?["parts"]?.AsArray();
            var functionCalls = parts?.Where(p => p?["functionCall"] is not null).ToList() ?? new List<JsonNode?>();

            if (functionCalls.Count == 0 || candidateContent is null)
                return (ExtractText(responseNode) ?? "", actions);

            // Echo the model's own function-call turn back into the conversation.
            contents.Add(candidateContent.DeepClone());

            var functionResponseParts = new JsonArray();
            foreach (var part in functionCalls)
            {
                var call = part!["functionCall"]!;
                var name = call["name"]!.GetValue<string>();
                var args = call["args"] as JsonObject;

                if (name == "search_products")
                {
                    var query = args?["query"]?.GetValue<string>();
                    var category = args?["category"]?.GetValue<string>();
                    decimal? maxPrice = args?["maxPrice"] is JsonValue mp && mp.TryGetValue<decimal>(out var mpv) ? mpv : null;

                    var results = await SearchProductsAsync(query, category, maxPrice);
                    functionResponseParts.Add(new JsonObject
                    {
                        ["functionResponse"] = new JsonObject
                        {
                            ["name"] = name,
                            ["response"] = JsonNode.Parse(JsonSerializer.Serialize(new { results }, CamelCaseJson)),
                        },
                    });
                }
                else if (name == "add_to_cart")
                {
                    var productIdStr = args?["productId"]?.GetValue<string>();
                    var quantity = args?["quantity"] is JsonValue qv && qv.TryGetValue<double>(out var qd) ? (int)qd : 1;

                    Product? product = null;
                    if (Guid.TryParse(productIdStr, out var pid))
                        product = await _db.Products.FindAsync(pid);

                    if (product is not null)
                    {
                        actions.Add(new CartAction
                        {
                            Type = "add_to_cart",
                            ProductId = product.Id.ToString(),
                            Name = product.Name,
                            Price = product.Price,
                            Image = product.Image,
                            Quantity = quantity,
                        });
                        functionResponseParts.Add(new JsonObject
                        {
                            ["functionResponse"] = new JsonObject
                            {
                                ["name"] = name,
                                ["response"] = new JsonObject { ["success"] = true, ["name"] = product.Name },
                            },
                        });
                    }
                    else
                    {
                        functionResponseParts.Add(new JsonObject
                        {
                            ["functionResponse"] = new JsonObject
                            {
                                ["name"] = name,
                                ["response"] = new JsonObject { ["success"] = false, ["message"] = "Product not found" },
                            },
                        });
                    }
                }
                else if (name == "go_to_checkout")
                {
                    actions.Add(new CartAction { Type = "go_to_checkout" });
                    functionResponseParts.Add(new JsonObject
                    {
                        ["functionResponse"] = new JsonObject { ["name"] = name, ["response"] = new JsonObject { ["success"] = true } },
                    });
                }
            }

            contents.Add(new JsonObject { ["role"] = "user", ["parts"] = functionResponseParts });
        }

        return ("I've got that set up for you - let me know if you need anything else!", actions);
    }

    /// <summary>"You might also like" - picks related products from the real catalog.</summary>
    public async Task<List<ProductPick>> GetRecommendationsAsync(string productId)
    {
        if (!Guid.TryParse(productId, out var pid))
            throw new ArgumentException("Invalid product id");

        var target = await _db.Products.FindAsync(pid) ?? throw new KeyNotFoundException("Product not found");
        var catalog = await GetCatalogSnapshotAsync(excludeId: pid, limit: 80);
        if (catalog.Count == 0) return new List<ProductPick>();

        var system = "You recommend complementary or similar products for an online clothing store.\n" +
            "Given the customer's currently-viewed product and a catalog snapshot, choose up to 4 products from the catalog that customers are likely to also want (similar style, complementary pairing, or common upsell like a matching accessory).\n" +
            "Respond with ONLY a JSON array, no preamble, no markdown fences. Each item: {\"id\": \"<catalog id>\", \"reason\": \"<max 8 words>\"}.\n" +
            "Only use ids that appear in the catalog snapshot.";

        var userMessage = "Currently viewing: " + JsonSerializer.Serialize(new
        {
            name = target.Name,
            category = target.Category,
            price = target.Price,
            brand = target.Brand,
        }, CamelCaseJson) + "\nCatalog: " + JsonSerializer.Serialize(catalog, CamelCaseJson);

        var requestBody = new JsonObject
        {
            ["systemInstruction"] = new JsonObject { ["parts"] = new JsonArray { new JsonObject { ["text"] = system } } },
            ["contents"] = new JsonArray { new JsonObject { ["role"] = "user", ["parts"] = new JsonArray { new JsonObject { ["text"] = userMessage } } } },
        };

        var responseNode = await SendGenerateContentAsync(FastModel, requestBody);
        var text = ExtractText(responseNode);
        if (string.IsNullOrEmpty(text)) return new List<ProductPick>();

        List<PickRaw>? picks;
        try { picks = JsonSerializer.Deserialize<List<PickRaw>>(StripFences(text), CaseInsensitiveJson); }
        catch { return new List<ProductPick>(); }
        if (picks is null) return new List<ProductPick>();

        var catalogById = catalog.ToDictionary(c => c.Id);
        return picks
            .Where(p => catalogById.ContainsKey(p.Id))
            .Select(p =>
            {
                var item = catalogById[p.Id];
                return new ProductPick
                {
                    Id = item.Id,
                    Name = item.Name,
                    Category = item.Category,
                    Price = item.Price,
                    Brand = item.Brand,
                    Rating = item.Rating,
                    Reason = p.Reason,
                };
            })
            .ToList();
    }

    /// <summary>"Complete the look" - styling tip plus up to 3 matching catalog items.</summary>
    public async Task<StyleAdviceResult> GetStyleAdviceAsync(string productId)
    {
        if (!Guid.TryParse(productId, out var pid))
            throw new ArgumentException("Invalid product id");

        var target = await _db.Products.FindAsync(pid) ?? throw new KeyNotFoundException("Product not found");
        var catalog = await GetCatalogSnapshotAsync(excludeId: pid, limit: 80);

        var system = "You are a fashion stylist for an online clothing store.\n" +
            "Given the customer's currently-viewed item and a catalog snapshot, suggest how to style/wear it and pick up to 3 catalog items that would complete the outfit.\n" +
            "Respond with ONLY JSON, no preamble, no markdown fences, in this exact shape:\n" +
            "{\"advice\": \"<2-3 sentence styling tip in a warm, helpful tone>\", \"picks\": [{\"id\": \"<catalog id>\", \"reason\": \"<max 8 words>\"}]}\n" +
            "Only use ids that appear in the catalog snapshot. If the catalog has nothing suitable, return an empty picks array but still give general styling advice.";

        var userMessage = "Currently viewing: " + JsonSerializer.Serialize(new
        {
            name = target.Name,
            category = target.Category,
            price = target.Price,
            brand = target.Brand,
        }, CamelCaseJson) + "\nCatalog: " + JsonSerializer.Serialize(catalog, CamelCaseJson);

        var requestBody = new JsonObject
        {
            ["systemInstruction"] = new JsonObject { ["parts"] = new JsonArray { new JsonObject { ["text"] = system } } },
            ["contents"] = new JsonArray { new JsonObject { ["role"] = "user", ["parts"] = new JsonArray { new JsonObject { ["text"] = userMessage } } } },
        };

        var responseNode = await SendGenerateContentAsync(FastModel, requestBody);
        var text = ExtractText(responseNode);
        if (string.IsNullOrEmpty(text)) return new StyleAdviceResult();

        StyleAdviceRaw? parsed;
        try { parsed = JsonSerializer.Deserialize<StyleAdviceRaw>(StripFences(text), CaseInsensitiveJson); }
        catch { return new StyleAdviceResult { Advice = text.Trim() }; }
        if (parsed is null) return new StyleAdviceResult();

        var catalogById = catalog.ToDictionary(c => c.Id);
        var picks = (parsed.Picks ?? new List<PickRaw>())
            .Where(p => catalogById.ContainsKey(p.Id))
            .Select(p =>
            {
                var item = catalogById[p.Id];
                return new ProductPick
                {
                    Id = item.Id,
                    Name = item.Name,
                    Category = item.Category,
                    Price = item.Price,
                    Brand = item.Brand,
                    Rating = item.Rating,
                    Reason = p.Reason,
                };
            })
            .ToList();

        return new StyleAdviceResult { Advice = parsed.Advice ?? "", Picks = picks };
    }

    /// <summary>Admin tool: generate polished product copy from basic fields.</summary>
    public async Task<string> GenerateProductDescriptionAsync(string name, string? category, string? brand, string? keywords)
    {
        var system = "You write concise, appealing e-commerce product descriptions for a clothing store.\n" +
            "Write 2-4 sentences: highlight material/fit/style feel and who it's great for. No emojis, no markdown, no headers. Plain prose only.";

        var userMessage = $"Product name: {name}\n" +
            $"Category: {category ?? "unspecified"}\n" +
            $"Brand: {brand ?? "unspecified"}\n" +
            $"Extra keywords/notes from the admin: {keywords ?? "none"}";

        var requestBody = new JsonObject
        {
            ["systemInstruction"] = new JsonObject { ["parts"] = new JsonArray { new JsonObject { ["text"] = system } } },
            ["contents"] = new JsonArray { new JsonObject { ["role"] = "user", ["parts"] = new JsonArray { new JsonObject { ["text"] = userMessage } } } },
        };

        var responseNode = await SendGenerateContentAsync(QualityModel, requestBody);
        return ExtractText(responseNode)?.Trim() ?? "";
    }
}
