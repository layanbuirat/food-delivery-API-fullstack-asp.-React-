// services/AuthService.cs (stub)
using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs.Auth;
using FoodDeliveryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        public AuthService(ApplicationDbContext db) { _db = db; }

        public async Task<User> RegisterAsync(RegisterDto dto)
        {
            var user = new User { Username = dto.Username, Email = dto.Email, Role = dto.Role, PasswordHash = dto.Password };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<User?> ValidateUserAsync(LoginDto dto)
        {
            return await Task.FromResult(_db.Users.FirstOrDefault(u => u.Email == dto.Email));
        }
    }
}