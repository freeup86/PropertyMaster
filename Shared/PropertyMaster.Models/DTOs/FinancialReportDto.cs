using System;
using System.Collections.Generic;

namespace PropertyMaster.Models.DTOs
{
    public class FinancialReportDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetOperatingIncome { get; set; }
        public decimal CashFlow { get; set; }
        public decimal ExpenseRatio { get; set; }
        public List<CategorySummaryDto> IncomeByCategory { get; set; }
        public List<CategorySummaryDto> ExpensesByCategory { get; set; }
        public List<MonthlyFinancialSummaryDto> MonthlySummary { get; set; }
    }

    public class CategorySummaryDto
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public decimal Amount { get; set; }
        public decimal Percentage { get; set; }
    }

    public class MonthlyFinancialSummaryDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Income { get; set; }
        public decimal Expenses { get; set; }
        public decimal NetOperatingIncome { get; set; }
        public decimal CashFlow { get; set; }
    }
}