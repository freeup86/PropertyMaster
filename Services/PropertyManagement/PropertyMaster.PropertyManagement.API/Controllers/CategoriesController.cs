using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Required for ToListAsync()
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.Entities; // Namespace for your Category entity
using PropertyMaster.PropertyManagement.API; // Namespace for your DbContext
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
// Optional: using Microsoft.AspNetCore.Authorization;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    //[Authorize] // Add this later if category access should be restricted
    [ApiController]
    [Route("api/[controller]")] // This makes the route /api/categories
    public class CategoriesController : ControllerBase
    {
        private readonly PropertyMasterApiContext _context;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(PropertyMasterApiContext context, ILogger<CategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/categories
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Category>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            try
            {
                _logger.LogInformation("Fetching all categories");
                // Directly return the Category entities for now
                // Consider mapping to a DTO (e.g., CategoryDto) using AutoMapper for a cleaner design
                var categories = await _context.Categories.ToListAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return StatusCode(500, "An internal error occurred while retrieving categories");
            }
        }

        // You can add other actions later (GET by ID, POST, PUT, DELETE) if needed
        // Example:
        // [HttpGet("{id}")]
        // public async Task<ActionResult<Category>> GetCategory(Guid id) { ... }
    }
}
// Add using Microsoft.AspNetCore.Http; if StatusCodes is not recognized