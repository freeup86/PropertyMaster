using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [ApiController]
    [Route("api/tenants")]
    public class TenantsController : ControllerBase
    {
        private readonly ITenantService _tenantService;
        private readonly ILogger<TenantsController> _logger;

        public TenantsController(
            ITenantService tenantService,
            ILogger<TenantsController> logger)
        {
            _tenantService = tenantService;
            _logger = logger;
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetTenantsByProperty(Guid propertyId)
        {
            try
            {
                var tenants = await _tenantService.GetTenantsByPropertyIdAsync(propertyId);
                return Ok(tenants);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenants for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while retrieving tenants");
            }
        }

        [HttpGet("unit/{unitId}")]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetTenantsByUnit(Guid unitId)
        {
            try
            {
                var tenants = await _tenantService.GetTenantsByUnitIdAsync(unitId);
                return Ok(tenants);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenants for unit {UnitId}", unitId);
                return StatusCode(500, "An error occurred while retrieving tenants");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TenantDto>> GetTenant(Guid id)
        {
            try
            {
                var tenant = await _tenantService.GetTenantByIdAsync(id);
                
                if (tenant == null)
                    return NotFound();
                
                return Ok(tenant);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenant {TenantId}", id);
                return StatusCode(500, "An error occurred while retrieving the tenant");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TenantDto>> CreateTenant(CreateTenantDto tenantDto)
        {
            try
            {
                var tenant = await _tenantService.CreateTenantAsync(tenantDto);
                return CreatedAtAction(nameof(GetTenant), new { id = tenant.Id }, tenant);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tenant");
                return StatusCode(500, "An error occurred while creating the tenant");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTenant(Guid id, UpdateTenantDto tenantDto)
        {
            try
            {
                var tenant = await _tenantService.UpdateTenantAsync(id, tenantDto);
                
                if (tenant == null)
                    return NotFound();
                
                return Ok(tenant);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tenant {TenantId}", id);
                return StatusCode(500, "An error occurred while updating the tenant");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTenant(Guid id)
        {
            try
            {
                var result = await _tenantService.DeleteTenantAsync(id);
                
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting tenant {TenantId}", id);
                return StatusCode(500, "An error occurred while deleting the tenant");
            }
        }
    }
}