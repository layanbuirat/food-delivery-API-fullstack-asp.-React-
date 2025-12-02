// Controllers/AuthController.cs
using FoodDeliveryAPI.DTOs.Auth;
using FoodDeliveryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) { _auth = auth; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto) =>
            Ok(await _auth.RegisterAsync(dto));

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _auth.ValidateUserAsync(dto);
            if (user == null) return Unauthorized();
            return Ok(new { user });
        }
    }
}