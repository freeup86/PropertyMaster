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
    [Route("api/transactions")]
    public class TransactionsController : ControllerBase
    {
        private readonly IFinancialService _financialService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(
            IFinancialService financialService,
            ILogger<TransactionsController> logger)
        {
            _financialService = financialService;
            _logger = logger;
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByProperty(
            Guid propertyId, 
            [FromQuery] DateTime? startDate = null, 
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var transactions = await _financialService.GetTransactionsByPropertyIdAsync(propertyId, startDate, endDate);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for property {PropertyId}", propertyId);
                return StatusCode(500, "An error occurred while retrieving transactions");
            }
        }

        [HttpGet("unit/{unitId}")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByUnit(
            Guid unitId, 
            [FromQuery] DateTime? startDate = null, 
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var transactions = await _financialService.GetTransactionsByUnitIdAsync(unitId, startDate, endDate);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for unit {UnitId}", unitId);
                return StatusCode(500, "An error occurred while retrieving transactions");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransaction(Guid id)
        {
            try
            {
                var transaction = await _financialService.GetTransactionByIdAsync(id);
                
                if (transaction == null)
                    return NotFound();
                
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction {TransactionId}", id);
                return StatusCode(500, "An error occurred while retrieving the transaction");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDto>> CreateTransaction(CreateTransactionDto transactionDto)
        {
            try
            {
                var transaction = await _financialService.CreateTransactionAsync(transactionDto);
                return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transaction");
                return StatusCode(500, "An error occurred while creating the transaction");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(Guid id, UpdateTransactionDto transactionDto)
        {
            try
            {
                var transaction = await _financialService.UpdateTransactionAsync(id, transactionDto);
                
                if (transaction == null)
                    return NotFound();
                
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating transaction {TransactionId}", id);
                return StatusCode(500, "An error occurred while updating the transaction");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(Guid id)
        {
            try
            {
                var result = await _financialService.DeleteTransactionAsync(id);
                
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting transaction {TransactionId}", id);
                return StatusCode(500, "An error occurred while deleting the transaction");
            }
        }

        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByTenant(Guid tenantId)
        {
            try
            {
                var transactions = await _financialService.GetTransactionsByTenantIdAsync(tenantId);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for tenant {TenantId}", tenantId);
                return StatusCode(500, "An error occurred while retrieving transactions");
            }
        }
    }
}