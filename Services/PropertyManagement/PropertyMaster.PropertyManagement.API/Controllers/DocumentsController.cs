// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Controllers/DocumentsController.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [ApiController]
    [Route("api/documents")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly ILogger<DocumentsController> _logger;

        public DocumentsController(
            IDocumentService documentService,
            ILogger<DocumentsController> logger)
        {
            _documentService = documentService;
            _logger = logger;
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<DocumentDto>>> GetDocumentsByProperty(Guid propertyId)
        {
            try
            {
                var documents = await _documentService.GetDocumentsByPropertyIdAsync(propertyId);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving documents for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while retrieving documents");
            }
        }

        [HttpGet("unit/{unitId}")]
        public async Task<ActionResult<IEnumerable<DocumentDto>>> GetDocumentsByUnit(Guid unitId)
        {
            try
            {
                var documents = await _documentService.GetDocumentsByUnitIdAsync(unitId);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving documents for unit {UnitId}", unitId);
                return StatusCode(500, "An error occurred while retrieving documents");
            }
        }

        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<DocumentDto>>> GetDocumentsByTenant(Guid tenantId)
        {
            try
            {
                var documents = await _documentService.GetDocumentsByTenantIdAsync(tenantId);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving documents for tenant {TenantId}", tenantId);
                return StatusCode(500, "An error occurred while retrieving documents");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentDto>> GetDocument(Guid id)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(id);
                
                if (document == null)
                    return NotFound();
                
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving document {DocumentId}", id);
                return StatusCode(500, "An error occurred while retrieving the document");
            }
        }

        [HttpPost]
        public async Task<ActionResult<DocumentDto>> UploadDocument([FromForm] CreateDocumentDto documentDto, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                var document = await _documentService.UploadDocumentAsync(documentDto, file);
                return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, "An error occurred while uploading the document");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(Guid id, UpdateDocumentDto documentDto)
        {
            try
            {
                var document = await _documentService.UpdateDocumentAsync(id, documentDto);
                
                if (document == null)
                    return NotFound();
                
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating document {DocumentId}", id);
                return StatusCode(500, "An error occurred while updating the document");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(Guid id)
        {
            try
            {
                var result = await _documentService.DeleteDocumentAsync(id);
                
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting document {DocumentId}", id);
                return StatusCode(500, "An error occurred while deleting the document");
            }
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadDocument(Guid id)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(id);
                
                if (document == null)
                    return NotFound();
                
                var fileBytes = await _documentService.DownloadDocumentAsync(id);
                return File(fileBytes, document.ContentType, document.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading document {DocumentId}", id);
                return StatusCode(500, "An error occurred while downloading the document");
            }
        }
    }
}