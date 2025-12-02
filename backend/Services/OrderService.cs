using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs.Orders;
using FoodDeliveryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _db;

        public OrderService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Order> CreateAsync(CreateOrderDto dto)
        {
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                RestaurantId = dto.RestaurantId,
                DeliveryAddress = dto.DeliveryAddress,
                Status = "Pending",
                PaymentStatus = "Unpaid",
                CreatedAt = DateTime.UtcNow,
                Items = new List<OrderItem>() 
                          };

            decimal total = 0;
            
            foreach (var itemDto in dto.Items)
            {
                var menuItem = await _db.MenuItems.FindAsync(itemDto.MenuItemId);
                
                if (menuItem != null)
                {
                    total += menuItem.Price * itemDto.Quantity;
                    
                    var orderItem = new OrderItem
                    {
                        MenuItemId = itemDto.MenuItemId,
                        Quantity = itemDto.Quantity,
                        UnitPrice = menuItem.Price
                    };
                    
                    order.Items.Add(orderItem);
                }
            }
            
            order.TotalAmount = total;

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            
            return order;
        }

        public async Task<List<Order>> GetCustomerOrdersAsync(int customerId)
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Restaurant)
                .Include(o => o.Customer)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
                
            return orders;
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .FirstOrDefaultAsync(o => o.Id == id);
                
            return order;
        }

        public async Task<bool> CancelOrderAsync(int id)
        {
            var order = await _db.Orders.FindAsync(id);
            
            if (order == null)
                return false;
                
            if (order.Status == "Delivered")
                return false;
                
            order.Status = "Canceled";
            await _db.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            var order = await _db.Orders.FindAsync(id);
            
            if (order == null)
                return false;
                
            order.Status = status;
            await _db.SaveChangesAsync();
            
            return true;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _db.Orders
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }
}