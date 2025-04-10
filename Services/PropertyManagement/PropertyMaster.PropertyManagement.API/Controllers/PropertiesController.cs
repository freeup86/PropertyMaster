using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims; 

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(
            IPropertyService propertyService,
            ILogger<PropertiesController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties()
        {
            try
            {
                var userId = GetCurrentUserId();
                var properties = await _propertyService.GetPropertiesByUserIdAsync(userId);
                return Ok(properties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving properties");
                return StatusCode(500, "An error occurred while retrieving properties");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDto>> GetProperty(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var property = await _propertyService.GetPropertyByIdAsync(id, userId);
                
                if (property == null)
                    return NotFound();
                
                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving property with ID {PropertyId}", id);
                return StatusCode(500, "An error occurred while retrieving the property");
            }
        }

        [HttpPost]
        public async Task<ActionResult<PropertyDto>> CreateProperty(CreatePropertyDto propertyDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var property = await _propertyService.CreatePropertyAsync(propertyDto, userId);
                
                return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating property");
                return StatusCode(500, "An error occurred while creating the property");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProperty(Guid id, UpdatePropertyDto propertyDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var property = await _propertyService.UpdatePropertyAsync(id, propertyDto, userId);
                
                if (property == null)
                    return NotFound();
                
                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating property with ID {PropertyId}", id);
                return StatusCode(500, "An error occurred while updating the property");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _propertyService.DeletePropertyAsync(id, userId);
                
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting property with ID {PropertyId}", id);
                return StatusCode(500, "An error occurred while deleting the property");
            }
        }

        private Guid GetCurrentUserId()
        {
            // Retrieve the User ID claim, which was added during token generation in AuthController
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                // This should ideally not happen if the [Authorize] attribute is working correctly
                // and the token was generated properly, but good to handle defensively.
                _logger.LogError("User ID claim (NameIdentifier) is missing or invalid in the token.");
                // Throwing an exception might be too harsh, depending on requirements.
                // Returning Guid.Empty or throwing might be options.
                // For now, we throw to indicate a serious issue with auth context.
                throw new InvalidOperationException("User ID not found or invalid in token claims.");
            }
            return userId;
        }
    }
}