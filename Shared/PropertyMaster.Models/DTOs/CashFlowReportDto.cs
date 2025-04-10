using System;
using System.Collections.Generic;

namespace PropertyMaster.Models.DTOs
{
    public class CashFlowReportDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public decimal MonthlyRentalIncome { get; set; }
        public decimal OtherMonthlyIncome { get; set; }
        public decimal TotalMonthlyIncome { get; set; }
        public decimal VacancyLoss { get; set; }
        public decimal PropertyManagement { get; set; }
        public decimal PropertyTax { get; set; }
        public decimal Insurance { get; set; }
        public decimal Maintenance { get; set; }
        public decimal Utilities { get; set; }
        public decimal OtherExpenses { get; set; }
        public decimal TotalOperatingExpenses { get; set; }
        public decimal NetOperatingIncome { get; set; }
        public decimal MortgagePayment { get; set; }
        public decimal OtherFinancingCosts { get; set; }
        public decimal TotalFinancingCosts { get; set; }
        public decimal MonthlyCashFlow { get; set; }
        public decimal AnnualCashFlow { get; set; }
        public decimal CashOnCashReturn { get; set; }
        public decimal CapRate { get; set; }
        public List<MonthlyFinancialSummaryDto> MonthlyCashFlows { get; set; }
    }
}