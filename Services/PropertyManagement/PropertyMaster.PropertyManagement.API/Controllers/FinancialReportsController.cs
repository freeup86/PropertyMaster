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
    [Route("api/financial")]
    public class FinancialReportsController : ControllerBase
    {
        private readonly IFinancialService _financialService;
        private readonly ILogger<FinancialReportsController> _logger;

        public FinancialReportsController(
            IFinancialService financialService,
            ILogger<FinancialReportsController> logger)
        {
            _financialService = financialService;
            _logger = logger;
        }

        [HttpGet("reports/property/{propertyId}")]
        public async Task<ActionResult<FinancialReportDto>> GetFinancialReport(
            Guid propertyId, 
            [FromQuery] DateTime? startDate = null, 
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                // Default to current year if no dates provided
                var start = startDate ?? new DateTime(DateTime.UtcNow.Year, 1, 1);
                var end = endDate ?? new DateTime(DateTime.UtcNow.Year, 12, 31);
                
                var report = await _financialService.GetFinancialReportAsync(propertyId, start, end);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating financial report for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while generating the financial report");
            }
        }

        [HttpGet("cashflow/property/{propertyId}")]
        public async Task<ActionResult<CashFlowReportDto>> GetCashFlowReport(
            Guid propertyId,
            [FromQuery] DateTime? date = null)
        {
            try
            {
                var report = await _financialService.GetCashFlowReportAsync(propertyId, date);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating cash flow report for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while generating the cash flow report");
            }
        }

        [HttpGet("performance/property/{propertyId}")]
        public async Task<ActionResult<PropertyPerformanceDto>> GetPropertyPerformance(Guid propertyId)
        {
            try
            {
                var performance = await _financialService.GetPropertyPerformanceAsync(propertyId);
                return Ok(performance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving performance metrics for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while retrieving property performance metrics");
            }
        }

        [HttpGet("performance/portfolio/{userId}")]
        public async Task<ActionResult<IEnumerable<PropertyPerformanceDto>>> GetPortfolioPerformance(Guid userId)
        {
            try
            {
                var performance = await _financialService.GetPortfolioPerformanceAsync(userId);
                return Ok(performance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio performance metrics for user {UserId}", userId);
                return StatusCode(500, "An error occurred while retrieving portfolio performance metrics");
            }
        }

        [HttpGet("reports/general/{userId}")] // Assuming you need userId
        public async Task<ActionResult<IEnumerable<FinancialReportDto>>> GetGeneralFinancialReport(Guid userId)
        {
            try
            {
                var reports = await _financialService.GetGeneralFinancialReportAsync(userId); // New service method
                return Ok(reports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating general financial report for user {UserId}", userId);
                return StatusCode(500, "An error occurred while generating the general financial report");
            }
        }

        [HttpGet("performance/general/{userId}")] // Assuming you need userId
        public async Task<ActionResult<IEnumerable<PropertyPerformanceDto>>> GetGeneralPropertyPerformance(Guid userId)
        {
            try
            {
                var performance = await _financialService.GetGeneralPortfolioPerformanceAsync(userId); // New service method
                return Ok(performance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving general performance metrics for user {UserId}", userId);
                return StatusCode(500, "An error occurred while retrieving general performance metrics");
            }
        }
    }
}