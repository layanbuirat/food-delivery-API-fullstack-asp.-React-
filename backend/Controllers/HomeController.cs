// Controllers/HomeController.cs
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new 
            { 
                message = "Food Delivery API is running! 🚀",
                endpoints = new 
                {
                    restaurants = "/api/restaurants",
                    orders = "/api/orders",
                    auth = "/api/auth",
                    admin = "/api/admin",
                    swagger = "/swagger"
                }
            });
        }
    }
}