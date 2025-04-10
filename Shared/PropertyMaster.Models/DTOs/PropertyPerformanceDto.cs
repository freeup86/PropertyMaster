using System;

namespace PropertyMaster.Models.DTOs
{
    public class PropertyPerformanceDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal Appreciation { get; set; }
        public decimal AppreciationPercentage { get; set; }
        public decimal TotalCashInvested { get; set; }
        public decimal AnnualCashFlow { get; set; }
        public decimal CashOnCashReturn { get; set; }
        public decimal CapRate { get; set; }
        public decimal TotalReturn { get; set; }
        public decimal AnnualizedReturn { get; set; }
        public decimal ExpenseRatio { get; set; }
        public decimal OccupancyRate { get; set; }
    }
}