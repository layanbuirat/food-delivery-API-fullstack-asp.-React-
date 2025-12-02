using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs.Restaurants;
using FoodDeliveryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly ApplicationDbContext _db;

        public RestaurantService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<Restaurant>> GetAllAsync()
        {
            return await _db.Restaurants
                .Include(r => r.MenuItems)
                .Include(r => r.Owner)
                .ToListAsync();
        }

        public async Task<Restaurant?> GetByIdAsync(int id)
        {
            return await _db.Restaurants
                .Include(r => r.MenuItems)
                .Include(r => r.Owner)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Restaurant> CreateAsync(CreateRestaurantDto dto)
        {
            var restaurant = new Restaurant
            {
                Name = dto.Name,
                Description = dto.Description,
                CuisineType = dto.CuisineType,
                OwnerId = dto.OwnerId
            };

            _db.Restaurants.Add(restaurant);
            await _db.SaveChangesAsync();
            return restaurant;
        }

        public async Task<Restaurant?> UpdateAsync(int id, UpdateRestaurantDto dto)
        {
            var restaurant = await _db.Restaurants.FindAsync(id);
            if (restaurant == null) return null;

            restaurant.Name = dto.Name ?? restaurant.Name;
            restaurant.Description = dto.Description ?? restaurant.Description;
            restaurant.CuisineType = dto.CuisineType ?? restaurant.CuisineType;

            await _db.SaveChangesAsync();
            return restaurant;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var restaurant = await _db.Restaurants.FindAsync(id);
            if (restaurant == null) return false;

            _db.Restaurants.Remove(restaurant);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}