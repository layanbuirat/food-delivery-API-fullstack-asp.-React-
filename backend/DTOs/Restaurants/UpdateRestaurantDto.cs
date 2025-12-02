// DTOs/Restaurants/UpdateRestaurantDto.cs
namespace FoodDeliveryAPI.DTOs.Restaurants
{
    public class UpdateRestaurantDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? CuisineType { get; set; }
    }
}