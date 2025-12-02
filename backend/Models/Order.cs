namespace FoodDeliveryAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User? Customer { get; set; }
        public int RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Preparing, Delivered, Canceled
        public string PaymentStatus { get; set; } = "Unpaid"; // Unpaid, Paid
        public string? DeliveryAddress { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public List<OrderItem> Items { get; set; } = new();
    }
}