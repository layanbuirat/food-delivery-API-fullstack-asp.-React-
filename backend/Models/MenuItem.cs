// MenuItem.cs
namespace FoodDeliveryAPI.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }
    }
}