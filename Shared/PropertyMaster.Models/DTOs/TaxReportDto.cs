using System;
using System.Collections.Generic;

namespace PropertyMaster.Models.DTOs
{
    public class TaxReportDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public int TaxYear { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalDeductibleExpenses { get; set; }
        public decimal TaxableIncome { get; set; }
        public List<TaxCategoryDto> IncomeCategories { get; set; }
        public List<TaxCategoryDto> ExpenseCategories { get; set; }
    }

    public class TaxCategoryDto
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public decimal Amount { get; set; }
        public bool IsTaxDeductible { get; set; }
    }

    public class TaxReportRequestDto
    {
        public Guid PropertyId { get; set; }
        public int TaxYear { get; set; }
    }

    public class MultiYearTaxComparisonDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public List<YearlyTaxDataDto> YearlyData { get; set; }
    }

    public class YearlyTaxDataDto
    {
        public int Year { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalDeductibleExpenses { get; set; }
        public decimal TaxableIncome { get; set; }
        public decimal YearOverYearIncomeChange { get; set; } // Percentage change from previous year
        public decimal YearOverYearExpenseChange { get; set; } // Percentage change from previous year
    }
}