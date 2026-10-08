using VictoryLane.Api.Data;
using VictoryLane.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    public record ProductInput(string? Name, string? Description, decimal? Price, string? Category,
        int? Stock, string? Image, List<string>? Images, string? Brand, string? Status);

    [HttpGet("stats")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Stats()
    {
        var all = await _db.Products.ToListAsync();
        var total = all.Count;
        var active = all.Count(p => p.Stock > 0);
        var outOfStock = all.Count(p => p.Stock == 0);
        var totalValue = all.Sum(p => p.Price * p.Stock);
        var byCategory = all.GroupBy(p => p.Category).ToDictionary(g => g.Key, g => g.Count());

        return Ok(new { success = true, total, active, outOfStock, totalValue = totalValue.ToString("F2"), byCategory });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? group, [FromQuery] string? search,
        [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? inStock,
        [FromQuery] string? sort, [FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        var query = _db.Products.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category == category);

        if (!string.IsNullOrEmpty(group))
        {
            var slugsInGroup = await _db.Categories.Where(c => c.Group == group).Select(c => c.Slug).ToListAsync();
            query = query.Where(p => slugsInGroup.Contains(p.Category));
        }

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => EF.Functions.ILike(p.Name, $"%{search}%"));

        if (inStock == "true")
            query = query.Where(p => p.Stock > 0);

        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);

        query = sort switch
        {
            "price_asc" => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderBy(p => p.Id), // stable default order so pagination doesn't repeat/skip rows
        };

        var total = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(total / (double)limit);
        var paged = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

        return Ok(new { success = true, products = paged, total, page, totalPages });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null)
            return NotFound(new { success = false, message = "Product not found" });

        return Ok(new { success = true, product });
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] ProductInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Name) || input.Price is null || string.IsNullOrWhiteSpace(input.Category))
            return BadRequest(new { success = false, message = "Name, price, and category are required" });

        var product = new Product
        {
            Name = input.Name,
            Description = input.Description ?? "",
            Price = input.Price.Value,
            Category = input.Category,
            Stock = input.Stock ?? 0,
            Image = input.Image ?? "",
            Images = input.Images ?? (input.Image is not null ? new List<string> { input.Image } : new List<string>()),
            Brand = input.Brand ?? "",
            Rating = 0,
            ReviewCount = 0,
            Specifications = new Dictionary<string, string>(),
            Status = input.Status ?? "active",
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return StatusCode(201, new { success = true, product });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ProductInput input)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null)
            return NotFound(new { success = false, message = "Product not found" });

        if (input.Name is not null) product.Name = input.Name;
        if (input.Description is not null) product.Description = input.Description;
        if (input.Price is not null) product.Price = input.Price.Value;
        if (input.Category is not null) product.Category = input.Category;
        if (input.Stock is not null) product.Stock = input.Stock.Value;
        if (input.Image is not null) product.Image = input.Image;
        if (input.Images is not null) product.Images = input.Images;
        if (input.Brand is not null) product.Brand = input.Brand;
        if (input.Status is not null) product.Status = input.Status;
        product.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { success = true, product });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null)
            return NotFound(new { success = false, message = "Product not found" });

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return Ok(new { success = true, message = "Product deleted" });
    }
}