using FoodDeliveryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // تعريف الجداول (DbSets)
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Restaurant> Restaurants { get; set; } = null!;
        public DbSet<MenuItem> MenuItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==============================================
            // 🔧 إعدادات الجداول والعلاقات
            // ==============================================

            // ---------- إعدادات جدول Users ----------
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Username)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Role)
                    .HasMaxLength(20)
                    .HasDefaultValue("Customer");

                entity.Property(u => u.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");
            });

            // ---------- إعدادات جدول Restaurants ----------
            modelBuilder.Entity<Restaurant>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(r => r.Description)
                    .HasMaxLength(500);

                entity.Property(r => r.CuisineType)
                    .HasMaxLength(100);

                entity.Property(r => r.Rating)
                    .HasDefaultValue(0.0);

                // العلاقة مع Owner (User)
                entity.HasOne(r => r.Owner)
                    .WithMany()
                    .HasForeignKey(r => r.OwnerId)
                    .OnDelete(DeleteBehavior.Restrict);  // ⭐ مهم: Restrict بدلاً من Cascade
            });

            // ---------- إعدادات جدول MenuItems ----------
            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(m => m.Price)
                    .HasPrecision(10, 2);

                // العلاقة مع Restaurant
                entity.HasOne(m => m.Restaurant)
                    .WithMany(r => r.MenuItems)
                    .HasForeignKey(m => m.RestaurantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- إعدادات جدول Orders ----------
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Status)
                    .HasMaxLength(50)
                    .HasDefaultValue("Pending");

                entity.Property(o => o.PaymentStatus)
                    .HasMaxLength(50)
                    .HasDefaultValue("Unpaid");

                entity.Property(o => o.DeliveryAddress)
                    .HasMaxLength(500);

                entity.Property(o => o.TotalAmount)
                    .HasPrecision(10, 2);

                entity.Property(o => o.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                // العلاقة مع Customer (User)
                entity.HasOne(o => o.Customer)
                    .WithMany()
                    .HasForeignKey(o => o.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);  // ⭐ مهم: Restrict

                // العلاقة مع Restaurant
                entity.HasOne(o => o.Restaurant)
                    .WithMany()
                    .HasForeignKey(o => o.RestaurantId)
                    .OnDelete(DeleteBehavior.Restrict);  // ⭐ مهم: Restrict
            });

            // ---------- إعدادات جدول OrderItems ----------
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);

                entity.Property(oi => oi.Quantity)
                    .HasDefaultValue(1);

                entity.Property(oi => oi.UnitPrice)
                    .HasPrecision(10, 2);

                // العلاقة مع Order
                entity.HasOne(oi => oi.Order)
                    .WithMany(o => o.Items)
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                // العلاقة مع MenuItem
                entity.HasOne(oi => oi.MenuItem)
                    .WithMany()
                    .HasForeignKey(oi => oi.MenuItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ==============================================
            // 📊 إضافة بيانات تجريبية (Seed Data) - اختياري
            // ==============================================

            /*
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    Username = "admin", 
                    Email = "admin@fooddelivery.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                },
                new User 
                { 
                    Id = 2, 
                    Username = "customer1", 
                    Email = "customer@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    Role = "Customer",
                    CreatedAt = DateTime.UtcNow
                }
            );
            */
        }
    }
}