using System;
using System.Collections.Generic;

namespace PropertyMaster.Models.DTOs
{
    public class TaxBracketDto
    {
        public decimal LowerBound { get; set; }
        public decimal UpperBound { get; set; }
        public decimal Rate { get; set; }
    }

    public class TaxBracketCalculationRequestDto
    {
        public Guid PropertyId { get; set; }
        public int TaxYear { get; set; }
        public List<TaxBracketDto> Brackets { get; set; }
        public decimal AdditionalIncome { get; set; }
        public decimal AdditionalDeductions { get; set; }
    }

    public class TaxBracketCalculationDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public int TaxYear { get; set; }
        public decimal TaxableIncome { get; set; }
        public decimal EstimatedTaxLiability { get; set; }
        public decimal EffectiveTaxRate { get; set; }
        public List<TaxBracketBreakdownDto> BracketBreakdown { get; set; }
    }

    public class TaxBracketBreakdownDto
    {
        public decimal LowerBound { get; set; }
        public decimal UpperBound { get; set; }
        public decimal Rate { get; set; }
        public decimal IncomeInBracket { get; set; }
        public decimal TaxForBracket { get; set; }
    }
}