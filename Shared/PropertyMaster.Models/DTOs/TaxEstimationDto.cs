using System;
using System.Collections.Generic;

namespace PropertyMaster.Models.DTOs
{
    public class TaxEstimationRequestDto
    {
        public Guid PropertyId { get; set; }
        public int TaxYear { get; set; }
        public decimal TaxRate { get; set; }
        public decimal AdditionalIncome { get; set; }
        public decimal AdditionalDeductions { get; set; }
    }

    public class TaxEstimationDto
    {
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public int TaxYear { get; set; }
        public decimal CurrentTaxableIncome { get; set; }
        public decimal EstimatedTaxableIncome { get; set; }
        public decimal TaxRate { get; set; }
        public decimal EstimatedTaxLiability { get; set; }
        public decimal AdditionalIncome { get; set; }
        public decimal AdditionalDeductions { get; set; }
        public decimal ProjectedSavings { get; set; }
    }
}