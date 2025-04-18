using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/tax-documents")]
    public class TaxDocumentsController : ControllerBase
    {
        private readonly ITaxDocumentService _taxDocumentService;
        private readonly ILogger<TaxDocumentsController> _logger;

        public TaxDocumentsController(
            ITaxDocumentService taxDocumentService,
            ILogger<TaxDocumentsController> logger)
        {
            _taxDocumentService = taxDocumentService;
            _logger = logger;
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<TaxDocumentDto>>> GetTaxDocumentsByProperty(
            Guid propertyId, 
            [FromQuery] int? taxYear = null)
        {
            try
            {
                var documents = await _taxDocumentService.GetTaxDocumentsByPropertyIdAsync(propertyId, taxYear);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tax documents for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while retrieving tax documents");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaxDocumentDto>> GetTaxDocument(Guid id)
        {
            try
            {
                var document = await _taxDocumentService.GetTaxDocumentByIdAsync(id);
                
                if (document == null)
                    return NotFound();
                
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tax document {DocumentId}", id);
                return StatusCode(500, "An error occurred while retrieving the tax document");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TaxDocumentDto>> UploadTaxDocument([FromForm] CreateTaxDocumentDto documentDto, IFormFile file)
        {
            try
            {
                // Explicitly handle null description
                if (documentDto.Description == null)
                {
                    documentDto.Description = string.Empty;
                }

                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                var document = await _taxDocumentService.UploadTaxDocumentAsync(documentDto, file);
                return CreatedAtAction(nameof(GetTaxDocument), new { id = document.Id }, document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading tax document");
                return StatusCode(500, "An error occurred while uploading the tax document");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaxDocument(Guid id, UpdateTaxDocumentDto documentDto)
        {
            try
            {
                var document = await _taxDocumentService.UpdateTaxDocumentAsync(id, documentDto);
                
                if (document == null)
                    return NotFound();
                
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tax document {DocumentId}", id);
                return StatusCode(500, "An error occurred while updating the tax document");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaxDocument(Guid id)
        {
            try
            {
                var result = await _taxDocumentService.DeleteTaxDocumentAsync(id);
                
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting tax document {DocumentId}", id);
                return StatusCode(500, "An error occurred while deleting the tax document");
            }
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadTaxDocument(Guid id)
        {
            try
            {
                var document = await _taxDocumentService.GetTaxDocumentByIdAsync(id);
                
                if (document == null)
                    return NotFound();
                
                var fileBytes = await _taxDocumentService.DownloadTaxDocumentAsync(id);
                return File(fileBytes, document.ContentType, document.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading tax document {DocumentId}", id);
                return StatusCode(500, "An error occurred while downloading the tax document");
            }
        }
    }
}