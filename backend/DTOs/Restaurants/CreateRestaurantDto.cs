namespace FoodDeliveryAPI.DTOs.Restaurants
{
    public class CreateRestaurantDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }
        public string? CuisineType { get; set; }
              public int OwnerId { get; set; }
    }
}