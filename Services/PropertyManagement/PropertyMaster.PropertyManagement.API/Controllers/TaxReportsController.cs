using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/tax-reports")]
    public class TaxReportsController : ControllerBase
    {
        private readonly IFinancialService _financialService;
        private readonly ILogger<TaxReportsController> _logger;

        public TaxReportsController(
            IFinancialService financialService,
            ILogger<TaxReportsController> logger)
        {
            _financialService = financialService;
            _logger = logger;
        }

        [HttpGet("property/{propertyId}/{taxYear}")]
        public async Task<ActionResult<TaxReportDto>> GetPropertyTaxReport(Guid propertyId, int taxYear)
        {
            try
            {
                var report = await _financialService.GetTaxReportAsync(propertyId, taxYear);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating tax report for property {PropertyId} for year {TaxYear}", propertyId, taxYear);
                return StatusCode(500, "An error occurred while generating the tax report");
            }
        }

        [HttpGet("all-properties/{taxYear}")]
        public async Task<ActionResult<IEnumerable<TaxReportDto>>> GetAllPropertiesTaxReport(int taxYear)
        {
            try
            {
                var userId = GetCurrentUserId();
                var reports = await _financialService.GetAllPropertiesTaxReportAsync(userId, taxYear);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating tax reports for all properties for year {TaxYear}", taxYear);
                return StatusCode(500, "An error occurred while generating the tax reports");
            }
        }

        private Guid GetCurrentUserId()
        {
            // Retrieve the User ID claim, which was added during token generation in AuthController
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                throw new InvalidOperationException("User ID not found or invalid in token claims.");
            }
            return userId;
        }

        [HttpGet("property/{propertyId}/comparison")]
        public async Task<ActionResult<MultiYearTaxComparisonDto>> GetMultiYearTaxComparison(
            Guid propertyId, 
            [FromQuery] int startYear, 
            [FromQuery] int endYear)
        {
            try
            {
                if (startYear > endYear)
                    return BadRequest("Start year must be less than or equal to end year");
                    
                if (endYear - startYear > 5)
                    return BadRequest("Maximum range is 5 years");
                    
                var comparison = await _financialService.GetMultiYearTaxComparisonAsync(propertyId, startYear, endYear);
                return Ok(comparison);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating multi-year tax comparison for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while generating the multi-year tax comparison");
            }
        }

        [HttpPost("estimate")]
        public async Task<ActionResult<TaxEstimationDto>> EstimateTaxes([FromBody] TaxEstimationRequestDto request)
        {
            try
            {
                var estimation = await _financialService.GetTaxEstimationAsync(request);
                return Ok(estimation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error estimating taxes for property {PropertyId} for year {TaxYear}", request.PropertyId, request.TaxYear);
                return StatusCode(500, "An error occurred while estimating taxes");
            }
        }

        [HttpPost("calculate-with-brackets")]
        public async Task<ActionResult<TaxBracketCalculationDto>> CalculateWithBrackets([FromBody] TaxBracketCalculationRequestDto request)
        {
            try
            {
                if (request.Brackets == null || !request.Brackets.Any())
                    return BadRequest("At least one tax bracket is required");
                    
                var calculation = await _financialService.CalculateTaxWithBracketsAsync(request);
                return Ok(calculation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating taxes with brackets for property {PropertyId} for year {TaxYear}", request.PropertyId, request.TaxYear);
                return StatusCode(500, "An error occurred while calculating taxes with brackets");
            }
        }
    }
}