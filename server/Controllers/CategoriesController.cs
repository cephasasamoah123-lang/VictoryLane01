using VictoryLane.Api.Data;
using VictoryLane.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly string[] AllowedDepartments = { "Women", "Men", "Kids", "Unisex", "Accessories", "Jewelry" };

    public CategoriesController(AppDbContext db)
    {
        _db = db;
    }

    public record CategoryInput(string? Name, string? Slug, string? Image, string? Description, int? Order, string? Group);

    private static string Slugify(string s) => s.ToLowerInvariant().Trim().Replace(" ", "-");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        // Note: matches Node's response shape exactly - no "success" wrapper here
        return Ok(new { categories });
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CategoryInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Name) || string.IsNullOrWhiteSpace(input.Slug))
            return BadRequest(new { success = false, message = "Name and slug are required" });

        var slug = Slugify(input.Slug);
        if (await _db.Categories.AnyAsync(c => c.Slug == slug))
            return BadRequest(new { success = false, message = "A category with this slug already exists" });

        var group = (input.Group ?? string.Empty).Trim();
        if (string.IsNullOrEmpty(group))
            group = "Unisex";
        else if (!AllowedDepartments.Contains(group))
            return BadRequest(new { success = false, message = "Group must be one of Women, Men, Kids, Unisex, Accessories, or Jewelry" });

        var category = new Category
        {
            Name = input.Name,
            Slug = slug,
            Image = input.Image ?? "",
            Description = input.Description ?? "",
            SortOrder = input.Order ?? 0,
            Group = group,
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return StatusCode(201, new { success = true, category });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CategoryInput input)
    {
        if (input.Slug is not null)
        {
            var slug = Slugify(input.Slug);
            if (await _db.Categories.AnyAsync(c => c.Slug == slug && c.Id != id))
                return BadRequest(new { success = false, message = "A category with this slug already exists" });
        }

        var category = await _db.Categories.FindAsync(id);
        if (category is null)
            return NotFound(new { success = false, message = "Category not found" });

        if (input.Name is not null) category.Name = input.Name;
        if (input.Slug is not null) category.Slug = Slugify(input.Slug);
        if (input.Image is not null) category.Image = input.Image;
        if (input.Description is not null) category.Description = input.Description;
        if (input.Order is not null) category.SortOrder = input.Order.Value;
        if (input.Group is not null)
        {
            var group = input.Group.Trim();
            if (string.IsNullOrEmpty(group))
                group = "Unisex";
            else if (!AllowedDepartments.Contains(group))
                return BadRequest(new { success = false, message = "Group must be one of Women, Men, Kids, Unisex, Accessories, or Jewelry" });
            category.Group = group;
        }
        category.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { success = true, category });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null)
            return NotFound(new { success = false, message = "Category not found" });

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return Ok(new { success = true, message = "Category deleted" });
    }
}
