// services/IAuthService.cs
using FoodDeliveryAPI.DTOs.Auth;
using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Services
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterDto dto);
        Task<User?> ValidateUserAsync(LoginDto dto);
    }
}