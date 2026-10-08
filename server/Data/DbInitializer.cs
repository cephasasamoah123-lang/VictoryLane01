using VictoryLane.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace VictoryLane.Api.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext db, IConfiguration config)
    {
        // No EF Core migrations exist in this project (no Migrations/ folder), so
        // Database.MigrateAsync() would be a silent no-op and leave the DB without
        // any tables - every query then fails with a 500. EnsureCreatedAsync builds
        // the schema directly from the model instead.
        //
        // Trade-off: EnsureCreated does NOT update the schema of an already-created
        // database when you change a model later - it only creates what's missing on
        // a fresh DB. If you outgrow that, switch to real migrations instead:
        //   dotnet tool install --global dotnet-ef
        //   dotnet ef migrations add InitialCreate
        //   dotnet ef database update
        // and change this back to MigrateAsync().
        await db.Database.EnsureCreatedAsync();

        // --- Admin user ---
        // Credentials must always come from configuration. Never fall back to a
        // predictable default or keep a password in source control.
        var adminEmail = config["Admin:Email"];
        var adminPassword = config["Admin:Password"];
        if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException(
                "Admin:Email and Admin:Password are required. Set them with environment variables or an ignored appsettings.Development.json file.");
        }
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(adminPassword);

        var admin = db.Users.FirstOrDefault(u => u.Role == "admin");
        if (admin is null)
        {
            db.Users.Add(new User
            {
                FirstName = "Admin",
                LastName = "User",
                Name = "Admin User",
                Email = adminEmail,
                Phone = "0200000000",
                Password = hashedPassword,
                Role = "admin",
                Status = "active",
            });
            Console.WriteLine($"Admin user created: {adminEmail}");
        }
        else
        {
            admin.Email = adminEmail;
            admin.Password = hashedPassword;
            Console.WriteLine($"Admin credentials updated: {adminEmail}");
        }
        await db.SaveChangesAsync();

        // --- Products ---
        if (!db.Products.Any())
        {
            var seedProducts = new List<Product>
            {
            new Product { Name = "Classic Cotton T-Shirt", Price = 29.99m, Description = "Soft, breathable 100% cotton t-shirt for everyday wear. Available in multiple colors.", Category = "tshirts-polos", Brand = "ComfortWear", Rating = 4.4, ReviewCount = 132, Stock = 150, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "100% Cotton", ["Fit"] = "Regular" }, Status = "active" },
            new Product { Name = "Slim-Fit Polo Shirt", Price = 49.99m, Description = "Classic polo shirt with a modern slim fit, perfect for smart-casual occasions.", Category = "tshirts-polos", Brand = "UrbanFit", Rating = 4.5, ReviewCount = 98, Stock = 90, Image = "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Pique Cotton", ["Fit"] = "Slim" }, Status = "active" },
            new Product { Name = "Pullover Hoodie", Price = 59.99m, Description = "Warm fleece-lined hoodie with kangaroo pocket, ideal for cooler days.", Category = "hoodies-sweatshirts", Brand = "StreetLine", Rating = 4.6, ReviewCount = 156, Stock = 70, Image = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Cotton Blend Fleece" }, Status = "active" },
            new Product { Name = "Slim Fit Denim Jeans", Price = 79.99m, Description = "Classic denim jeans with a modern slim fit and stretch comfort.", Category = "jeans", Brand = "DenimCo", Rating = 4.4, ReviewCount = 112, Stock = 80, Image = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Denim", ["Fit"] = "Slim" }, Status = "active" },
            new Product { Name = "Chino Trousers", Price = 59.99m, Description = "Versatile cotton chino trousers, perfect for work or weekend wear.", Category = "chinos", Brand = "UrbanFit", Rating = 4.3, ReviewCount = 74, Stock = 65, Image = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Cotton Twill" }, Status = "active" },
            new Product { Name = "Jogger Sweatpants", Price = 44.99m, Description = "Comfortable tapered joggers with elastic cuffs, great for lounging or the gym.", Category = "trousers", Brand = "StreetLine", Rating = 4.5, ReviewCount = 121, Stock = 100, Image = "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Cotton Blend" }, Status = "active" },
            new Product { Name = "Classic Canvas Sneakers", Price = 69.99m, Description = "Stylish canvas sneakers for all-day wear with a durable rubber sole.", Category = "sneakers", Brand = "FootStyle", Rating = 4.3, ReviewCount = 145, Stock = 95, Image = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Canvas", ["Sole"] = "Rubber" }, Status = "active" },
            new Product { Name = "Leather Oxford Shoes", Price = 149.99m, Description = "Premium leather Oxford shoes with classic stitched detailing for formal occasions.", Category = "dress-shoes", Brand = "LeatherLux", Rating = 4.7, ReviewCount = 67, Stock = 30, Image = "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Genuine Leather" }, Status = "active" },
            new Product { Name = "Running Shoes Pro", Price = 129.99m, Description = "High-performance running shoes with advanced cushioning and breathable mesh upper.", Category = "athletic-shoes", Brand = "SportMax", Rating = 4.6, ReviewCount = 143, Stock = 55, Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" }, Specifications = new Dictionary<string, string> { ["Weight"] = "280g", ["Drop"] = "10mm" }, Status = "active" },
            new Product { Name = "Genuine Leather Belt", Price = 39.99m, Description = "Classic full-grain leather belt with a polished metal buckle.", Category = "belts", Brand = "LeatherLux", Rating = 4.5, ReviewCount = 88, Stock = 120, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Genuine Leather" }, Status = "active" },
            new Product { Name = "Reversible Business Belt", Price = 44.99m, Description = "Two-in-one reversible belt — black on one side, brown on the other.", Category = "belts", Brand = "UrbanFit", Rating = 4.4, ReviewCount = 52, Stock = 85, Image = "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Leather", ["Style"] = "Reversible" }, Status = "active" },
            new Product { Name = "Two-Piece Slim Fit Suit", Price = 349.99m, Description = "Tailored two-piece suit in a modern slim fit, perfect for business or events.", Category = "suits", Brand = "Savile & Co.", Rating = 4.7, ReviewCount = 41, Stock = 20, Image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Wool Blend", ["Fit"] = "Slim" }, Status = "active" },
            new Product { Name = "Classic Three-Piece Suit", Price = 449.99m, Description = "Elegant three-piece suit including jacket, trousers, and waistcoat.", Category = "suits", Brand = "Savile & Co.", Rating = 4.8, ReviewCount = 29, Stock = 12, Image = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Wool Blend", ["Pieces"] = "3" }, Status = "active" },
            new Product { Name = "Silk Necktie", Price = 24.99m, Description = "Premium silk necktie with a subtle textured pattern, suitable for any formal outfit.", Category = "ties", Brand = "Savile & Co.", Rating = 4.5, ReviewCount = 63, Stock = 140, Image = "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Silk" }, Status = "active" },
            new Product { Name = "Bow Tie Set", Price = 19.99m, Description = "Pre-tied bow tie with matching pocket square, ideal for weddings and events.", Category = "bow-ties", Brand = "Savile & Co.", Rating = 4.3, ReviewCount = 37, Stock = 110, Image = "https://images.unsplash.com/photo-1598522280319-4443c1dee2e5?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1598522280319-4443c1dee2e5?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Polyester Silk" }, Status = "active" },
            new Product { Name = "Classic Analog Watch", Price = 129.99m, Description = "Timeless analog watch with a stainless steel case and leather strap.", Category = "watches", Brand = "TimeKeeper", Rating = 4.6, ReviewCount = 174, Stock = 45, Image = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800" }, Specifications = new Dictionary<string, string> { ["Movement"] = "Quartz", ["Strap"] = "Leather" }, Status = "active" },
            new Product { Name = "Sports Chronograph Watch", Price = 179.99m, Description = "Rugged chronograph watch with stopwatch function and water resistance.", Category = "watches", Brand = "TimeKeeper", Rating = 4.7, ReviewCount = 98, Stock = 38, Image = "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800" }, Specifications = new Dictionary<string, string> { ["Water Resistance"] = "50m", ["Function"] = "Chronograph" }, Status = "active" },
            new Product { Name = "Leather Wallet", Price = 34.99m, Description = "Slim genuine leather bifold wallet with multiple card slots.", Category = "wallets", Brand = "LeatherLux", Rating = 4.5, ReviewCount = 102, Stock = 130, Image = "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Genuine Leather" }, Status = "active" },
            new Product { Name = "Aviator Sunglasses", Price = 44.99m, Description = "Classic aviator sunglasses with polarized UV400 protection lenses.", Category = "sunglasses", Brand = "SunShield", Rating = 4.5, ReviewCount = 112, Stock = 95, Image = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800" }, Specifications = new Dictionary<string, string> { ["Protection"] = "UV400", ["Lens"] = "Polarized" }, Status = "active" },
            new Product { Name = "Structured Baseball Cap", Price = 22.99m, Description = "Adjustable cotton baseball cap with a structured crown.", Category = "hats-caps", Brand = "StreetLine", Rating = 4.2, ReviewCount = 58, Stock = 160, Image = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500", Images = new List<string> { "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800" }, Specifications = new Dictionary<string, string> { ["Material"] = "Cotton" }, Status = "active" },
            };
            db.Products.AddRange(seedProducts);
            await db.SaveChangesAsync();
            Console.WriteLine($"{seedProducts.Count} products seeded");
        }

        // --- Categories ---
        // Seeded per-category (rather than "only if table is empty") so new categories
        // added here automatically backfill onto databases that were already seeded.
        // Revised per Gigaceph_Ecommerce_Clothing_Categories_and_Products.docx:
        // top-level groups are now gender/product-type based rather than Clothing/Shoes/Accessories.
        // "Brands" and "Collections" from that doc aren't categories - Brand is already its own
        // Product field, and Collections (New Arrivals/Best Sellers/Sale/Clearance) are filters,
        // not a taxonomy tier - so neither is seeded here.
        const string GMen = "Men";
        const string GWomen = "Women";
        const string GKids = "Kids";
        const string GUnisex = "Unisex";
        const string GShoes = "Shoes";
        const string GAccessories = "Accessories";
        const string GBags = "Bags & Luggage";
        const string GJewelry = "Jewelry";
        const string GBeauty = "Beauty & Grooming";
        const string GSportswear = "Sportswear";

        var allowedDepartments = new[] { GMen, GWomen, GKids, GUnisex, GAccessories, GJewelry };
        string NormalizeDepartment(string? group)
        {
            if (string.IsNullOrWhiteSpace(group)) return GUnisex;
            return allowedDepartments.Contains(group) ? group : GUnisex;
        }

        var desiredCategories = new List<Category>
        {
            // Men
            new() { Name = "Suits", Slug = "suits", Group = GMen, Image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", Description = "Business, wedding and formal suits", SortOrder = 1 },
            new() { Name = "Blazers", Slug = "blazers", Group = GMen, Image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", Description = "Blazers for smart-casual and formal wear", SortOrder = 2 },
            new() { Name = "Formal Shirts", Slug = "formal-shirts", Group = GMen, Image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", Description = "Dress shirts for business and formal wear", SortOrder = 3 },
            new() { Name = "Casual Shirts", Slug = "casual-shirts", Group = GMen, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", Description = "Everyday casual button-ups", SortOrder = 4 },
            new() { Name = "T-Shirts & Polos", Slug = "tshirts-polos", Group = GMen, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", Description = "T-shirts and polo shirts", SortOrder = 5 },
            new() { Name = "Trousers", Slug = "trousers", Group = GMen, Image = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop", Description = "Trousers and casual pants", SortOrder = 6 },
            new() { Name = "Jeans", Slug = "jeans", Group = GMen, Image = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop", Description = "Denim jeans", SortOrder = 7 },
            new() { Name = "Chinos", Slug = "chinos", Group = GMen, Image = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop", Description = "Cotton chino trousers", SortOrder = 8 },
            new() { Name = "Shorts", Slug = "shorts", Group = GMen, Image = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop", Description = "Casual and athletic shorts", SortOrder = 9 },
            new() { Name = "Sweaters & Knitwear", Slug = "sweaters-knitwear", Group = GMen, Image = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", Description = "Sweaters, cardigans and knitwear", SortOrder = 10 },
            new() { Name = "Hoodies & Sweatshirts", Slug = "hoodies-sweatshirts", Group = GMen, Image = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", Description = "Hoodies and sweatshirts", SortOrder = 11 },
            new() { Name = "Jackets", Slug = "jackets", Group = GMen, Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop", Description = "Casual and lightweight jackets", SortOrder = 12 },
            new() { Name = "Coats & Outerwear", Slug = "coats-outerwear", Group = GMen, Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop", Description = "Coats and heavier outerwear", SortOrder = 13 },
            new() { Name = "Traditional Wear", Slug = "traditional-wear", Group = GMen, Image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", Description = "Traditional and cultural wear", SortOrder = 14 },
            new() { Name = "Activewear", Slug = "activewear", Group = GMen, Image = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", Description = "Men's gym and training wear", SortOrder = 15 },
            new() { Name = "Sleepwear", Slug = "sleepwear", Group = GMen, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", Description = "Men's pajamas and loungewear", SortOrder = 16 },
            new() { Name = "Underwear", Slug = "underwear", Group = GMen, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", Description = "Men's underwear", SortOrder = 17 },

            // Women
            new() { Name = "Dresses", Slug = "womens-dresses", Group = GWomen, Image = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop", Description = "Casual and occasion dresses", SortOrder = 1 },
            new() { Name = "Tops", Slug = "womens-tops", Group = GWomen, Image = "https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=300&fit=crop", Description = "Everyday tops", SortOrder = 2 },
            new() { Name = "Blouses", Slug = "womens-blouses", Group = GWomen, Image = "https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=300&fit=crop", Description = "Blouses for work and occasion wear", SortOrder = 3 },
            new() { Name = "Shirts", Slug = "womens-shirts", Group = GWomen, Image = "https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=300&fit=crop", Description = "Button-up shirts", SortOrder = 4 },
            new() { Name = "T-Shirts", Slug = "womens-tshirts", Group = GWomen, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", Description = "Women's t-shirts", SortOrder = 5 },
            new() { Name = "Jeans", Slug = "womens-jeans", Group = GWomen, Image = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop", Description = "Women's denim jeans", SortOrder = 6 },
            new() { Name = "Trousers", Slug = "womens-trousers", Group = GWomen, Image = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop", Description = "Women's trousers and pants", SortOrder = 7 },
            new() { Name = "Skirts", Slug = "womens-skirts", Group = GWomen, Image = "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=300&h=300&fit=crop", Description = "Skirts", SortOrder = 8 },
            new() { Name = "Leggings", Slug = "womens-leggings", Group = GWomen, Image = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=300&h=300&fit=crop", Description = "Leggings", SortOrder = 9 },
            new() { Name = "Shorts", Slug = "womens-shorts", Group = GWomen, Image = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop", Description = "Women's shorts", SortOrder = 10 },
            new() { Name = "Jumpsuits", Slug = "womens-jumpsuits", Group = GWomen, Image = "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=300&h=300&fit=crop", Description = "Jumpsuits and rompers", SortOrder = 11 },
            new() { Name = "Blazers", Slug = "womens-blazers", Group = GWomen, Image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", Description = "Women's blazers", SortOrder = 12 },
            new() { Name = "Jackets", Slug = "womens-jackets", Group = GWomen, Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop", Description = "Women's jackets", SortOrder = 13 },
            new() { Name = "Coats", Slug = "womens-coats", Group = GWomen, Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop", Description = "Women's coats", SortOrder = 14 },
            new() { Name = "Hoodies", Slug = "womens-hoodies", Group = GWomen, Image = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", Description = "Women's hoodies", SortOrder = 15 },
            new() { Name = "Sweaters", Slug = "womens-sweaters", Group = GWomen, Image = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", Description = "Women's sweaters", SortOrder = 16 },
            new() { Name = "Lingerie", Slug = "lingerie", Group = GWomen, Image = "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=300&h=300&fit=crop", Description = "Lingerie", SortOrder = 17 },
            new() { Name = "Sleepwear", Slug = "womens-sleepwear", Group = GWomen, Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", Description = "Women's pajamas and loungewear", SortOrder = 18 },
            new() { Name = "Swimwear", Slug = "swimwear", Group = GWomen, Image = "https://images.unsplash.com/photo-1570976447640-ac859083963d?w=300&h=300&fit=crop", Description = "Swimwear", SortOrder = 19 },
            new() { Name = "Activewear", Slug = "womens-activewear", Group = GWomen, Image = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", Description = "Women's gym and training wear", SortOrder = 20 },

            // Kids
            new() { Name = "Boys Clothing", Slug = "boys-clothing", Group = GKids, Image = "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&h=300&fit=crop", Description = "Clothing for boys", SortOrder = 1 },
            new() { Name = "Girls Clothing", Slug = "girls-clothing", Group = GKids, Image = "https://images.unsplash.com/photo-1519457851622-3e0be5cbe2c1?w=300&h=300&fit=crop", Description = "Clothing for girls", SortOrder = 2 },
            new() { Name = "Baby Clothing", Slug = "baby-clothing", Group = GKids, Image = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop", Description = "Clothing for babies", SortOrder = 3 },
            new() { Name = "School Uniforms", Slug = "school-uniforms", Group = GKids, Image = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=300&fit=crop", Description = "School uniforms", SortOrder = 4 },
            new() { Name = "Baby Essentials", Slug = "baby-essentials", Group = GKids, Image = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop", Description = "Baby essentials", SortOrder = 5 },

            // Shoes
            new() { Name = "Dress Shoes", Slug = "dress-shoes", Group = GShoes, Image = "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=300&fit=crop", Description = "Oxfords, derbies and formal footwear", SortOrder = 1 },
            new() { Name = "Loafers", Slug = "loafers", Group = GShoes, Image = "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=300&fit=crop", Description = "Loafers and slip-ons", SortOrder = 2 },
            new() { Name = "Sneakers", Slug = "sneakers", Group = GShoes, Image = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=300&fit=crop", Description = "Casual and street sneakers", SortOrder = 3 },
            new() { Name = "Boots", Slug = "boots", Group = GShoes, Image = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=300&fit=crop", Description = "Boots for work and casual wear", SortOrder = 4 },
            new() { Name = "Sandals & Slides", Slug = "sandals-slides", Group = GShoes, Image = "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop", Description = "Sandals and slides", SortOrder = 5 },
            new() { Name = "Athletic Shoes", Slug = "athletic-shoes", Group = GShoes, Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", Description = "Running, training and performance shoes", SortOrder = 6 },
            new() { Name = "Heels", Slug = "heels", Group = GShoes, Image = "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=300&h=300&fit=crop", Description = "Heels", SortOrder = 7 },
            new() { Name = "Flats", Slug = "flats", Group = GShoes, Image = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop", Description = "Flats", SortOrder = 8 },
            new() { Name = "Kids Shoes", Slug = "kids-shoes", Group = GShoes, Image = "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=300&h=300&fit=crop", Description = "Shoes for kids", SortOrder = 9 },

            // Accessories
            new() { Name = "Ties", Slug = "ties", Group = GAccessories, Image = "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=300&h=300&fit=crop", Description = "Neckties", SortOrder = 1 },
            new() { Name = "Bow Ties", Slug = "bow-ties", Group = GAccessories, Image = "https://images.unsplash.com/photo-1598522280319-4443c1dee2e5?w=300&h=300&fit=crop", Description = "Bow ties", SortOrder = 2 },
            new() { Name = "Belts", Slug = "belts", Group = GAccessories, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", Description = "Leather and fashion belts", SortOrder = 3 },
            new() { Name = "Wallets", Slug = "wallets", Group = GAccessories, Image = "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop", Description = "Wallets and cardholders", SortOrder = 4 },
            new() { Name = "Watches", Slug = "watches", Group = GAccessories, Image = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=300&fit=crop", Description = "Analog, sports and dress watches", SortOrder = 5 },
            new() { Name = "Sunglasses", Slug = "sunglasses", Group = GAccessories, Image = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop", Description = "Sunglasses", SortOrder = 6 },
            new() { Name = "Cufflinks", Slug = "cufflinks", Group = GAccessories, Image = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=300&fit=crop", Description = "Cufflinks", SortOrder = 7 },
            new() { Name = "Pocket Squares", Slug = "pocket-squares", Group = GAccessories, Image = "https://images.unsplash.com/photo-1598522280319-4443c1dee2e5?w=300&h=300&fit=crop", Description = "Pocket squares", SortOrder = 8 },
            new() { Name = "Hats & Caps", Slug = "hats-caps", Group = GAccessories, Image = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop", Description = "Hats and caps", SortOrder = 9 },
            new() { Name = "Socks", Slug = "socks", Group = GAccessories, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", Description = "Socks", SortOrder = 10 },
            new() { Name = "Scarves", Slug = "scarves", Group = GAccessories, Image = "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=300&fit=crop", Description = "Scarves", SortOrder = 11 },
            new() { Name = "Gloves", Slug = "gloves", Group = GAccessories, Image = "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&h=300&fit=crop", Description = "Gloves", SortOrder = 12 },
            new() { Name = "Umbrellas", Slug = "umbrellas", Group = GAccessories, Image = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=300&h=300&fit=crop", Description = "Umbrellas", SortOrder = 13 },

            // Bags & Luggage
            new() { Name = "Backpacks", Slug = "backpacks", Group = GBags, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", Description = "Backpacks", SortOrder = 1 },
            new() { Name = "Laptop Bags", Slug = "laptop-bags", Group = GBags, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", Description = "Laptop bags", SortOrder = 2 },
            new() { Name = "Duffel Bags", Slug = "duffel-bags", Group = GBags, Image = "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=300&fit=crop", Description = "Duffel bags", SortOrder = 3 },
            new() { Name = "Messenger Bags", Slug = "messenger-bags", Group = GBags, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", Description = "Messenger bags", SortOrder = 4 },
            new() { Name = "Briefcases", Slug = "briefcases", Group = GBags, Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", Description = "Briefcases", SortOrder = 5 },
            new() { Name = "Handbags", Slug = "handbags", Group = GBags, Image = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop", Description = "Handbags", SortOrder = 6 },
            new() { Name = "Crossbody Bags", Slug = "crossbody-bags", Group = GBags, Image = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop", Description = "Crossbody bags", SortOrder = 7 },
            new() { Name = "Suitcases", Slug = "suitcases", Group = GBags, Image = "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=300&h=300&fit=crop", Description = "Suitcases and travel luggage", SortOrder = 8 },

            // Jewelry
            new() { Name = "Necklaces", Slug = "necklaces", Group = GJewelry, Image = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop", Description = "Necklaces", SortOrder = 1 },
            new() { Name = "Chains", Slug = "chains", Group = GJewelry, Image = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop", Description = "Chains", SortOrder = 2 },
            new() { Name = "Bracelets", Slug = "bracelets", Group = GJewelry, Image = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop", Description = "Bracelets", SortOrder = 3 },
            new() { Name = "Rings", Slug = "rings", Group = GJewelry, Image = "https://images.unsplash.com/photo-1602751584547-6d5a9b0b1e0e?w=300&h=300&fit=crop", Description = "Rings", SortOrder = 4 },
            new() { Name = "Earrings", Slug = "earrings", Group = GJewelry, Image = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop", Description = "Earrings", SortOrder = 5 },
            new() { Name = "Anklets", Slug = "anklets", Group = GJewelry, Image = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop", Description = "Anklets", SortOrder = 6 },
            new() { Name = "Brooches", Slug = "brooches", Group = GJewelry, Image = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop", Description = "Brooches", SortOrder = 7 },

            // Beauty & Grooming
            new() { Name = "Fragrances", Slug = "fragrances", Group = GBeauty, Image = "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=300&h=300&fit=crop", Description = "Colognes and fragrances", SortOrder = 1 },
            new() { Name = "Perfumes", Slug = "perfumes", Group = GBeauty, Image = "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=300&h=300&fit=crop", Description = "Perfumes", SortOrder = 2 },
            new() { Name = "Body Sprays", Slug = "body-sprays", Group = GBeauty, Image = "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=300&h=300&fit=crop", Description = "Body sprays", SortOrder = 3 },
            new() { Name = "Hair Care", Slug = "hair-care", Group = GBeauty, Image = "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&h=300&fit=crop", Description = "Hair care products", SortOrder = 4 },
            new() { Name = "Beard Care", Slug = "beard-care", Group = GBeauty, Image = "https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&h=300&fit=crop", Description = "Beard care products", SortOrder = 5 },
            new() { Name = "Skin Care", Slug = "skin-care", Group = GBeauty, Image = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop", Description = "Skin care products", SortOrder = 6 },
            new() { Name = "Makeup", Slug = "makeup", Group = GBeauty, Image = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop", Description = "Makeup", SortOrder = 7 },

            // Sportswear
            new() { Name = "Gym Wear", Slug = "gym-wear", Group = GSportswear, Image = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", Description = "Gym wear", SortOrder = 1 },
            new() { Name = "Running Wear", Slug = "running-wear", Group = GSportswear, Image = "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=300&h=300&fit=crop", Description = "Running wear", SortOrder = 2 },
            new() { Name = "Football Kits", Slug = "football-kits", Group = GSportswear, Image = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=300&fit=crop", Description = "Football kits", SortOrder = 3 },
            new() { Name = "Basketball Kits", Slug = "basketball-kits", Group = GSportswear, Image = "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=300&fit=crop", Description = "Basketball kits", SortOrder = 4 },
            new() { Name = "Yoga Wear", Slug = "yoga-wear", Group = GSportswear, Image = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop", Description = "Yoga wear", SortOrder = 5 },
            new() { Name = "Compression Wear", Slug = "compression-wear", Group = GSportswear, Image = "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=300&h=300&fit=crop", Description = "Compression wear", SortOrder = 6 },
        };

        foreach (var category in desiredCategories)
        {
            category.Group = NormalizeDepartment(category.Group);
        }

        var existingSlugs = db.Categories.Select(c => c.Slug).ToHashSet();
        var newCategories = desiredCategories.Where(c => !existingSlugs.Contains(c.Slug)).ToList();
        if (newCategories.Count > 0)
        {
            db.Categories.AddRange(newCategories);
            await db.SaveChangesAsync();
            Console.WriteLine($"{newCategories.Count} categories seeded");
        }

        // Sync Group on any pre-existing category rows to match this revision's taxonomy.
        // Covers both rows that predate the Group field entirely (Group == "") and rows
        // whose group changed in this revision (e.g. Clothing -> Men, Accessories -> Beauty & Grooming).
        var desiredBySlug = desiredCategories.ToDictionary(c => c.Slug);
        var groupBackfillCount = 0;
        foreach (var c in db.Categories.ToList())
        {
            if (desiredBySlug.TryGetValue(c.Slug, out var match) && c.Group != match.Group)
            {
                c.Group = match.Group;
                groupBackfillCount++;
            }
        }
        if (groupBackfillCount > 0) await db.SaveChangesAsync();

        // Ensure all categories use normalized department values only.
        var normalizationCount = 0;
        foreach (var c in db.Categories.ToList())
        {
            var normalized = NormalizeDepartment(c.Group);
            if (c.Group != normalized)
            {
                c.Group = normalized;
                normalizationCount++;
            }
        }
        if (normalizationCount > 0) await db.SaveChangesAsync();

        // Categories superseded by this revised taxonomy. Any product still tagged with one
        // of these legacy slugs gets remapped to the closest new category, and the stale
        // category record itself is removed so the admin/category list stays clean.
        var legacySlugRemap = new Dictionary<string, string>
        {
            ["shoes"] = "sneakers",
            ["tops"] = "tshirts-polos",
            ["bottoms"] = "trousers",
            ["outerwear"] = "jackets",
            ["accessories"] = "wallets",
            ["casual-shoes"] = "loafers",
            ["sandals-open-footwear"] = "sandals-slides",
            ["jewelry"] = "cufflinks",
            ["bags"] = "backpacks",
            ["grooming-products"] = "skin-care",
        };

        foreach (var (legacySlug, newSlug) in legacySlugRemap)
        {
            var legacyCategory = db.Categories.FirstOrDefault(c => c.Slug == legacySlug);
            if (legacyCategory is null) continue;

            var affectedProducts = db.Products.Where(p => p.Category == legacySlug).ToList();
            foreach (var p in affectedProducts) p.Category = newSlug;
            if (affectedProducts.Count > 0) await db.SaveChangesAsync();

            db.Categories.Remove(legacyCategory);
            await db.SaveChangesAsync();
            Console.WriteLine($"Migrated {affectedProducts.Count} product(s) off legacy '{legacySlug}' category (-> '{newSlug}') and removed it");
        }
    }
}
