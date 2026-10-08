using VictoryLane.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<CustomRequest> Requests => Set<CustomRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.ToTable("products");
            e.Property(p => p.Price).HasColumnType("numeric(12,2)");
            // Store Images (List<string>) and Specifications (Dictionary) as jsonb
            e.Property(p => p.Images).HasColumnType("jsonb");
            e.Property(p => p.Specifications).HasColumnType("jsonb");

            // Speeds up the common product-list query: filter by category/stock,
            // sort by price/rating/newest.
            e.HasIndex(p => p.Category);
            e.HasIndex(p => p.Stock);
            e.HasIndex(p => p.Price);
            e.HasIndex(p => p.Rating);
            e.HasIndex(p => p.CreatedAt);
        });

        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("categories");
            e.HasIndex(c => c.Slug).IsUnique();
            // Used by GetAll's ?group= filter (looks up all category slugs in a department).
            e.HasIndex(c => c.Group);
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.ToTable("orders");
            e.Property(o => o.Total).HasColumnType("numeric(12,2)");
            e.HasIndex(o => o.OrderNumber).IsUnique();

            // ShippingAddress stored as an owned type (separate columns, prefixed)
            e.OwnsOne(o => o.ShippingAddress, sa =>
            {
                sa.Property(p => p.Name).HasColumnName("shipping_name");
                sa.Property(p => p.Email).HasColumnName("shipping_email");
                sa.Property(p => p.Phone).HasColumnName("shipping_phone");
                sa.Property(p => p.Address).HasColumnName("shipping_address");
                sa.Property(p => p.City).HasColumnName("shipping_city");
                sa.Property(p => p.Region).HasColumnName("shipping_region");
            });

            e.HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.ToTable("order_items");
            e.Property(i => i.Price).HasColumnType("numeric(12,2)");
        });

        modelBuilder.Entity<CustomRequest>(e =>
        {
            e.ToTable("requests");
        });
    }
}