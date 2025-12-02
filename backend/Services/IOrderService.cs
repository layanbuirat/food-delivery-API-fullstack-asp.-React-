using FoodDeliveryAPI.DTOs.Orders;
using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Services
{
    public interface IOrderService
    {
        Task<Order> CreateAsync(CreateOrderDto dto);
        Task<List<Order>> GetCustomerOrdersAsync(int customerId);
        Task<Order?> GetByIdAsync(int id);
        Task<bool> CancelOrderAsync(int id);
        
        Task<bool> UpdateStatusAsync(int id, string status);
        Task<List<Order>> GetAllAsync();
    }
}