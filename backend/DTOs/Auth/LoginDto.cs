// DTOs/Auth/LoginDto.cs
namespace FoodDeliveryAPI.DTOs.Auth
{
    public class LoginDto
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}