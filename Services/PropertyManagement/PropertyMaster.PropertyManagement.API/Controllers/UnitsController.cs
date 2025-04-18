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
            
        [HttpDelete("{unitId}/images")]
        public async Task<IActionResult> DeleteUnitImage(
            Guid propertyId, 
            Guid unitId, 
            [FromBody] DeleteImageRequest request)
        {
            try 
            {
                if (request == null || string.IsNullOrEmpty(request.Base64Image))
                {
                    return BadRequest("Invalid image data");
                }

                // Reconstruct the full image URL
                string imageUrl = $"data:{request.ContentType};base64,{request.Base64Image}";

                _logger.LogInformation($"Delete Image Request: PropertyId={propertyId}, UnitId={unitId}, ImageUrl={imageUrl}");

                var result = await _unitService.DeleteUnitImageAsync(unitId, propertyId, imageUrl);
                
                if (result)
                    return Ok();
                
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting unit image");
                return StatusCode(500, "An error occurred while deleting the image");
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