using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.DTOs.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int RestaurantId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = default!;
        public string PaymentStatus { get; set; } = default!;
        public string? DeliveryAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int MenuItemId { get; set; }
        public string? MenuItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

   }