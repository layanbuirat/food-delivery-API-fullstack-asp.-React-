namespace FoodDeliveryAPI.DTOs.Orders
{
    public class CreateOrderDto
    {
        public int CustomerId { get; set; }
        public int RestaurantId { get; set; }
        public string DeliveryAddress { get; set; } = default!;
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
    }
}