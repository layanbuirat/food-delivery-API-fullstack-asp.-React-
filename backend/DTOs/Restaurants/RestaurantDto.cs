namespace FoodDeliveryAPI.DTOs.Restaurants
{
    public class RestaurantDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Rating { get; set; }
        public string? CuisineType { get; set; }
        public List<MenuItemDto> MenuItems { get; set; } = new();
    }
}