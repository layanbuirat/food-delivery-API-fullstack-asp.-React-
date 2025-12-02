using FoodDeliveryAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("api/restaurants")]
    public class RestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RestaurantsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var restaurants = await _db.Restaurants
                .Include(r => r.MenuItems)
                .ToListAsync();
            return Ok(restaurants);
        }
    }
}