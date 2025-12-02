namespace FoodDeliveryAPI.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string? CuisineType { get; set; }
        public double Rating { get; set; } = 0;
        public int OwnerId { get; set; }         
        public User? Owner { get; set; }          
        public List<MenuItem> MenuItems { get; set; } = new();
    }
}