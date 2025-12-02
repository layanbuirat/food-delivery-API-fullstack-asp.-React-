using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs.Orders;
using FoodDeliveryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public OrdersController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDto dto)
        {
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                RestaurantId = dto.RestaurantId,
                DeliveryAddress = dto.DeliveryAddress,
                Status = "Pending",
                PaymentStatus = "Unpaid",
                CreatedAt = DateTime.UtcNow
            };

            // حساب TotalAmount وإضافة العناصر
            decimal total = 0;
            foreach (var item in dto.Items)
            {
                var menuItem = await _db.MenuItems.FindAsync(item.MenuItemId);
                if (menuItem != null)
                {
                    total += menuItem.Price * item.Quantity;

                    order.Items.Add(new OrderItem
                    {
                        MenuItemId = item.MenuItemId,
                        Quantity = item.Quantity,
                        UnitPrice = menuItem.Price
                    });
                }
            }
            order.TotalAmount = total;

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // تحويل Order إلى OrderDto للعرض
            var orderDto = new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                RestaurantId = order.RestaurantId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                DeliveryAddress = order.DeliveryAddress,
                OrderDate = order.CreatedAt,
                Items = order.Items.Select(oi => new OrderItemDto
                {
                    MenuItemId = oi.MenuItemId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            };

            return Ok(orderDto);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Restaurant)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var orderDtos = orders.Select(o => new OrderDto
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
                    MenuItemName = oi.MenuItem?.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            });

            return Ok(orderDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            var orderDto = new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                RestaurantId = order.RestaurantId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                DeliveryAddress = order.DeliveryAddress,
                OrderDate = order.CreatedAt,
                Items = order.Items.Select(oi => new OrderItemDto
                {
                    MenuItemId = oi.MenuItemId,
                    MenuItemName = oi.MenuItem?.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            };

            return Ok(orderDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var orderDtos = orders.Select(o => new OrderDto
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
                    MenuItemName = oi.MenuItem?.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            });

            return Ok(orderDtos);
        }
    }
}