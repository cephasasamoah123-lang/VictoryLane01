using VictoryLane.Api.Data;
using VictoryLane.Api.Models;
using VictoryLane.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly PaystackService _paystack;
    private static readonly Random _rng = new();

    public OrdersController(AppDbContext db, PaystackService paystack)
    {
        _db = db;
        _paystack = paystack;
    }

    public record OrderItemInput(string? ProductId, string? Id, string Name, int Quantity, decimal Price, string? Image);
    public record ShippingAddressInput(string? Name, string? Email, string? Phone, string? Address, string? City, string? Region);
    public record CreateOrderRequest(List<OrderItemInput> Items, ShippingAddressInput ShippingAddress, string PaymentMethod, string? PaymentReference);
    public record UpdateStatusRequest(string Status);

    private static string GenerateOrderNumber()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var suffix = new string(Enumerable.Range(0, 4).Select(_ => chars[_rng.Next(chars.Length)]).ToArray());
        return $"VL-{timestamp}-{suffix}";
    }

    private string? CurrentUserId => User.FindFirst("_id")?.Value;
    private bool IsAdmin => User.FindFirst("role")?.Value == "admin";

    [HttpGet("stats")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Stats()
    {
        var all = await _db.Orders.Include(o => o.Items).ToListAsync();
        var totalOrders = all.Count;
        var totalRevenue = all.Where(o => o.Status != "cancelled").Sum(o => o.Total);

        var byStatus = new Dictionary<string, int>
        {
            ["pending"] = all.Count(o => o.Status == "pending"),
            ["processing"] = all.Count(o => o.Status == "processing"),
            ["shipped"] = all.Count(o => o.Status == "shipped"),
            ["delivered"] = all.Count(o => o.Status == "delivered"),
            ["cancelled"] = all.Count(o => o.Status == "cancelled"),
        };

        var recent = all.OrderByDescending(o => o.CreatedAt).Take(5).ToList();

        return Ok(new { success = true, totalOrders, totalRevenue = totalRevenue.ToString("F2"), ordersByStatus = byStatus, recentOrders = recent });
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> MyOrders()
    {
        var userId = CurrentUserId;
        var orders = await _db.Orders.Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(new { success = true, orders });
    }

    [HttpGet("track/{orderNumber}")]
    public async Task<IActionResult> Track(string orderNumber)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
        if (order is null)
            return NotFound(new { success = false, message = "Order not found" });

        return Ok(new
        {
            success = true,
            order = new
            {
                orderNumber = order.OrderNumber,
                status = order.Status,
                items = order.Items.Select(i => new { name = i.Name, quantity = i.Quantity, price = i.Price, image = i.Image }),
                total = order.Total,
                createdAt = order.CreatedAt,
                updatedAt = order.UpdatedAt,
                city = order.ShippingAddress.City,
            }
        });
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var query = _db.Orders.Include(o => o.Items).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(o => o.Status == status);

        var all = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLowerInvariant();
            all = all.Where(o =>
                (o.OrderNumber ?? "").ToLowerInvariant().Contains(s) ||
                (o.CustomerName ?? "").ToLowerInvariant().Contains(s) ||
                (o.CustomerEmail ?? "").ToLowerInvariant().Contains(s)
            ).ToList();
        }

        var total = all.Count;
        var totalPages = (int)Math.Ceiling(total / (double)limit);
        var paged = all.Skip((page - 1) * limit).Take(limit).ToList();

        return Ok(new { success = true, orders = paged, total, page, totalPages });
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order is null)
            return NotFound(new { success = false, message = "Order not found" });

        if (!IsAdmin && order.UserId != CurrentUserId)
            return StatusCode(403, new { success = false, message = "Access denied" });

        return Ok(new { success = true, order });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req)
    {
        if (req.Items is null || req.Items.Count == 0 || req.ShippingAddress is null || string.IsNullOrEmpty(req.PaymentMethod))
            return BadRequest(new { success = false, message = "Items, shipping address, and payment method are required" });

        var paymentMethod = req.PaymentMethod.ToLowerInvariant();
        if (!new[] { "card", "momo", "bank" }.Contains(paymentMethod))
            return BadRequest(new { success = false, message = "Unsupported payment method" });

        // optional auth: user may or may not be logged in
        var userId = CurrentUserId;
        var userEmail = User.FindFirst("email")?.Value;

        decimal serverTotal = 0;
        var resolvedItems = new List<(Product product, OrderItemInput input)>();

        foreach (var item in req.Items)
        {
            var productIdStr = item.ProductId ?? item.Id;
            if (string.IsNullOrEmpty(productIdStr) || !Guid.TryParse(productIdStr, out var productId))
                return BadRequest(new { success = false, message = "Invalid item in order" });

            var product = await _db.Products.FindAsync(productId);
            if (product is null)
                return BadRequest(new { success = false, message = $"Product not found: {item.Name ?? productIdStr}" });

            if (item.Quantity <= 0)
                return BadRequest(new { success = false, message = $"Invalid quantity for: {product.Name}" });

            if (product.Stock < item.Quantity)
                return BadRequest(new { success = false, message = $"Not enough stock for: {product.Name}" });

            serverTotal += product.Price * item.Quantity;
            resolvedItems.Add((product, item));
        }

        if (string.IsNullOrEmpty(req.ShippingAddress.Email) && string.IsNullOrEmpty(userEmail))
            return BadRequest(new { success = false, message = "Email is required" });

        var paymentReference = req.PaymentReference?.Trim() ?? "";
        var paymentStatus = "pending";
        if (paymentMethod is "card" or "momo")
        {
            if (string.IsNullOrEmpty(paymentReference))
                return BadRequest(new { success = false, message = "A payment reference is required" });

            if (await _db.Orders.AnyAsync(o => o.PaymentReference == paymentReference))
                return Conflict(new { success = false, message = "This payment reference has already been used" });

            var verification = await _paystack.VerifyTransactionAsync(paymentReference);
            if (!verification.Success || !string.Equals(verification.Currency, "GHS", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { success = false, message = verification.FailureReason ?? "Payment could not be verified" });

            if (Math.Round(verification.AmountMajorUnits, 2) != Math.Round(serverTotal, 2))
                return BadRequest(new { success = false, message = "Verified payment amount does not match this order" });

            paymentStatus = "paid";
        }
        else if (string.IsNullOrEmpty(paymentReference))
        {
            return BadRequest(new { success = false, message = "Your bank transfer reference is required" });
        }

        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            UserId = userId,
            CustomerName = req.ShippingAddress.Name ?? "",
            CustomerEmail = req.ShippingAddress.Email ?? userEmail ?? "",
            ShippingAddress = new ShippingAddress
            {
                Name = req.ShippingAddress.Name ?? "",
                Email = req.ShippingAddress.Email ?? "",
                Phone = req.ShippingAddress.Phone ?? "",
                Address = req.ShippingAddress.Address ?? "",
                City = req.ShippingAddress.City ?? "",
                Region = req.ShippingAddress.Region ?? "",
            },
            PaymentMethod = paymentMethod,
            PaymentReference = paymentReference,
            PaymentStatus = paymentStatus,
            Status = "pending",
            Total = Math.Round(serverTotal, 2),
            Items = resolvedItems.Select(r => new OrderItem
            {
                ProductId = r.product.Id.ToString(),
                Name = r.product.Name,
                Quantity = r.input.Quantity,
                Price = r.product.Price,
                Image = r.product.Image,
            }).ToList(),
        };

        _db.Orders.Add(order);

        // decrement stock
        foreach (var (product, input) in resolvedItems)
            product.Stock -= input.Quantity;

        await _db.SaveChangesAsync();

        return StatusCode(201, new { success = true, order });
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest req)
    {
        var valid = new[] { "pending", "processing", "shipped", "delivered", "cancelled" };
        if (!valid.Contains(req.Status))
            return BadRequest(new { success = false, message = "Valid status is required" });

        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order is null)
            return NotFound(new { success = false, message = "Order not found" });

        if (req.Status == "cancelled" && order.Status != "cancelled")
        {
            foreach (var item in order.Items)
            {
                if (Guid.TryParse(item.ProductId, out var pid))
                {
                    var product = await _db.Products.FindAsync(pid);
                    if (product is not null) product.Stock += item.Quantity;
                }
            }
        }

        order.Status = req.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { success = true, order });
    }
}
