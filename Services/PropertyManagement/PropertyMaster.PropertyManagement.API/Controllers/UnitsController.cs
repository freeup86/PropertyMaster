using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using PropertyMaster.PropertyManagement.API;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [ApiController]
    [Route("api/properties/{propertyId}/units")]
    public class UnitsController : ControllerBase
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IUnitService _unitService;
        private readonly ILogger<UnitsController> _logger;

        public UnitsController(
            PropertyMasterApiContext context,
            IUnitService unitService,
            ILogger<UnitsController> logger)
        {
            _context = context;
            _unitService = unitService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnitDto>>> GetUnits(Guid propertyId)
        {
            try
            {
                var units = await _unitService.GetUnitsByPropertyIdAsync(propertyId);
                return Ok(units);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving units for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while retrieving units");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UnitDto>> GetUnit(Guid propertyId, Guid id)
        {
            try
            {
                var unit = await _unitService.GetUnitByIdAsync(id, propertyId);
                
                if (unit == null)
                    return NotFound();
                
                return Ok(unit);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving unit {UnitId} for property {PropertyId}", id, propertyId);
                return StatusCode(500, "An error occurred while retrieving the unit");
            }
        }

        [HttpPost]
        public async Task<ActionResult<UnitDto>> CreateUnit(Guid propertyId, CreateUnitDto unitDto)
        {
            try
            {
                var unit = await _unitService.CreateUnitAsync(unitDto, propertyId);
                return CreatedAtAction(nameof(GetUnit), new { propertyId, id = unit.Id }, unit);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating unit for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while creating the unit");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUnit(Guid propertyId, Guid id, UpdateUnitDto unitDto)
        {
            _logger.LogInformation("Updating unit {UnitId} for property {PropertyId} with data {@UnitDto}", id, propertyId, unitDto);
            try
            {
                var unit = await _unitService.UpdateUnitAsync(id, unitDto, propertyId);
                
                if (unit == null)
                    return NotFound();
                
                return Ok(unit);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating unit {UnitId} for property {PropertyId}", id, propertyId);
                return StatusCode(500, "An error occurred while updating the unit");
            }
        }

                    
        [HttpDelete("{unitId}/images")]
        public async Task<IActionResult> DeleteUnitImage(
            [FromRoute] Guid propertyId, 
            [FromRoute] Guid unitId, 
            [FromBody] DeleteImageRequest request)
        {
            try 
            {
                _logger.LogInformation(
                    "Delete Image Request: PropertyId={PropertyId}, UnitId={UnitId}, ContentType={ContentType}, Base64ImageLength={Base64ImageLength}", 
                    propertyId, 
                    unitId, 
                    request?.ContentType, 
                    request?.Base64Image?.Length
                );

                // Validate input
                if (request == null || string.IsNullOrEmpty(request.Base64Image))
                {
                    _logger.LogWarning("Delete image request received with invalid data");
                    return BadRequest(new { message = "Invalid image data" });
                }

                // Find the unit
                var unit = await _context.Units
                    .Include(u => u.Images)
                    .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
                
                if (unit == null)
                {
                    _logger.LogWarning($"Unit not found: {unitId} for property {propertyId}");
                    return NotFound(new { message = "Unit not found" });
                }

                // Find the matching image
                var imageToDelete = unit.Images
                    .FirstOrDefault(img => 
                        img.ContentType == request.ContentType && 
                        Convert.ToBase64String(img.ImageData) == request.Base64Image
                    );

                if (imageToDelete == null)
                {
                    _logger.LogWarning($"Image not found for Unit {unitId}");
                    return NotFound(new { message = "Image not found" });
                }

                // Remove the image
                _context.UnitImages.Remove(imageToDelete);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully deleted image for Unit {unitId}");
                return Ok(new { message = "Image deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex, 
                    "Error deleting image for Unit {UnitId}", 
                    unitId
                );
                return StatusCode(500, new { message = "An error occurred while deleting the image" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(Guid propertyId, Guid id)
        {
            try
            {
                var result = await _unitService.DeleteUnitAsync(id, propertyId);
                
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting unit {UnitId} for property {PropertyId}", id, propertyId);
                return StatusCode(500, "An error occurred while deleting the unit");
            }
        }

        [HttpPost("{id}/images")]
        public async Task<ActionResult<UnitImageDto>> UploadUnitImages(
            Guid propertyId,
            Guid id,
            IFormFile image)
        {
            try
            {
                var result = await _unitService.UploadUnitImageAsync(propertyId, id, image);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading unit image for unit {id}");
                return StatusCode(500, "An error occurred while uploading image");
            }
        }
                
        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<UnitImageDto>>> GetUnitImages(Guid propertyId, Guid id)
        {
            try 
            {
                var images = await _unitService.GetUnitImagesAsync(propertyId, id);
                return Ok(images);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving unit images for unit {id}");
                return StatusCode(500, "An error occurred while retrieving images");
            }
        }

        // DTO for image deletion
        public class DeleteImageRequest
        {
            public string ContentType { get; set; }
            public string Base64Image { get; set; }
        }
    }
}