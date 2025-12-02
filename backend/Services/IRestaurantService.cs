using FoodDeliveryAPI.DTOs.Restaurants;
using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Services
{
    public interface IRestaurantService
    {
        Task<List<Restaurant>> GetAllAsync();
        Task<Restaurant?> GetByIdAsync(int id);
        Task<Restaurant> CreateAsync(CreateRestaurantDto dto);
        Task<Restaurant?> UpdateAsync(int id, UpdateRestaurantDto dto);
        Task<bool> DeleteAsync(int id);
    }
}