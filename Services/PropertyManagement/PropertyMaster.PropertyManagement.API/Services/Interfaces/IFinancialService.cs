using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface IFinancialService
    {
        Task<IEnumerable<TransactionDto>> GetTransactionsByPropertyIdAsync(Guid propertyId, DateTime? startDate = null, DateTime? endDate = null);
        Task<IEnumerable<TransactionDto>> GetTransactionsByUnitIdAsync(Guid unitId, DateTime? startDate = null, DateTime? endDate = null);
        Task<TransactionDto> GetTransactionByIdAsync(Guid transactionId);
        Task<TransactionDto> CreateTransactionAsync(CreateTransactionDto transactionDto);
        Task<TransactionDto> UpdateTransactionAsync(Guid transactionId, UpdateTransactionDto transactionDto);
        Task<bool> DeleteTransactionAsync(Guid transactionId);
        Task<FinancialReportDto> GetFinancialReportAsync(Guid propertyId, DateTime startDate, DateTime endDate);
        Task<CashFlowReportDto> GetCashFlowReportAsync(Guid propertyId, DateTime? date = null);
        Task<PropertyPerformanceDto> GetPropertyPerformanceAsync(Guid propertyId);
        Task<IEnumerable<PropertyPerformanceDto>> GetPortfolioPerformanceAsync(Guid userId);
        Task<IEnumerable<FinancialReportDto>> GetGeneralFinancialReportAsync(Guid userId);
        Task<IEnumerable<PropertyPerformanceDto>> GetGeneralPortfolioPerformanceAsync(Guid userId);
        Task<TaxReportDto> GetTaxReportAsync(Guid propertyId, int taxYear);
        Task<IEnumerable<TaxReportDto>> GetAllPropertiesTaxReportAsync(Guid userId, int taxYear);
        Task<MultiYearTaxComparisonDto> GetMultiYearTaxComparisonAsync(Guid propertyId, int startYear, int endYear);
        Task<TaxEstimationDto> GetTaxEstimationAsync(TaxEstimationRequestDto request);
        Task<TaxBracketCalculationDto> CalculateTaxWithBracketsAsync(TaxBracketCalculationRequestDto request);
    }
}