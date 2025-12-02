using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AdminController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("users")]
        public async Task<IActionResult> Users()
        {
            var users = await _db.Users
                .Select(u => new { u.Id, u.Username, u.Email, u.Role, u.CreatedAt })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("restaurants")]
        public async Task<IActionResult> Restaurants()
        {
            var restaurants = await _db.Restaurants
                .Include(r => r.Owner)
                .Select(r => new {
                    r.Id,
                    r.Name,
                    r.OwnerId,
                    OwnerName = r.Owner.Username ?? "Unknown",
                    r.CuisineType,
                    r.Rating
                })
                .ToListAsync();
            return Ok(restaurants);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> Orders()
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                RestaurantId = o.RestaurantId,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                DeliveryAddress = o.DeliveryAddress,
                OrderDate = o.CreatedAt,
                Items = o.Items.Select(oi => new OrderItemDto
                {
                    MenuItemId = oi.MenuItemId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    MenuItemName = oi.MenuItem.Name
                }).ToList()
            });

            return Ok(result);
        }
    }
}