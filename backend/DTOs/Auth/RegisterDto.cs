// DTOs/Auth/RegisterDto.cs
namespace FoodDeliveryAPI.DTOs.Auth
{
    public class RegisterDto
    {
        public string Username { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public string Role { get; set; } = "Customer";
    }
}