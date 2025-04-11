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
      [Route("api/[controller]")]
      public class MaintenanceRequestsController : ControllerBase
      {
          private readonly IMaintenanceRequestService _requestService;
          private readonly ILogger<MaintenanceRequestsController> _logger;

          public MaintenanceRequestsController(
              IMaintenanceRequestService requestService,
              ILogger<MaintenanceRequestsController> logger)
          {
              _requestService = requestService;
              _logger = logger;
          }

          [HttpGet("property/{propertyId}")]
          public async Task<ActionResult<IEnumerable<MaintenanceRequestDto>>> GetRequestsByProperty(Guid propertyId)
          {
              try
              {
                  var requests = await _requestService.GetMaintenanceRequestsByPropertyIdAsync(propertyId);
                  return Ok(requests);
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error retrieving maintenance requests for property {PropertyId}", propertyId);
                  return StatusCode(500, "An error occurred while retrieving maintenance requests");
              }
          }

          [HttpGet("unit/{unitId}")]
          public async Task<ActionResult<IEnumerable<MaintenanceRequestDto>>> GetRequestsByUnit(Guid unitId)
          {
              try
              {
                  var requests = await _requestService.GetMaintenanceRequestsByUnitIdAsync(unitId);
                  return Ok(requests);
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error retrieving maintenance requests for unit {UnitId}", unitId);
                  return StatusCode(500, "An error occurred while retrieving maintenance requests");
              }
          }

          [HttpGet("{id}")]
          public async Task<ActionResult<MaintenanceRequestDto>> GetRequest(Guid id)
          {
              try
              {
                  var request = await _requestService.GetMaintenanceRequestByIdAsync(id);
                  if (request == null)
                      return NotFound();

                  return Ok(request);
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error retrieving maintenance request {RequestId}", id);
                  return StatusCode(500, "An error occurred while retrieving the maintenance request");
              }
          }

          [HttpPost]
          public async Task<ActionResult<MaintenanceRequestDto>> CreateRequest(CreateMaintenanceRequestDto requestDto)
          {
              try
              {
                  var request = await _requestService.CreateMaintenanceRequestAsync(requestDto);
                  return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, request);
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error creating maintenance request");
                  return StatusCode(500, "An error occurred while creating the maintenance request");
              }
          }

          [HttpPut("{id}")]
          public async Task<IActionResult> UpdateRequest(Guid id, UpdateMaintenanceRequestDto requestDto)
          {
              try
              {
                  var request = await _requestService.UpdateMaintenanceRequestAsync(id, requestDto);
                  if (request == null)
                      return NotFound();

                  return Ok(request);
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error updating maintenance request {RequestId}", id);
                  return StatusCode(500, "An error occurred while updating the maintenance request");
              }
          }

          [HttpDelete("{id}")]
          public async Task<IActionResult> DeleteRequest(Guid id)
          {
              try
              {
                  var result = await _requestService.DeleteMaintenanceRequestAsync(id);
                  if (!result)
                      return NotFound();

                  return NoContent();
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error deleting maintenance request {RequestId}", id);
                  return StatusCode(500, "An error occurred while deleting the maintenance request");
              }
          }

          [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceRequestDto>>> GetAllRequests()
        {
            try
            {
                var requests = await _requestService.GetAllMaintenanceRequestsAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all maintenance requests");
                return StatusCode(500, "An error occurred while retrieving maintenance requests");
            }
        }
      }
  }