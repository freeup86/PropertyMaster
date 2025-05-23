using System;
using System.ComponentModel.DataAnnotations;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class UpdateTransactionDto
    {
        public Guid? CategoryId { get; set; }
        
        public Guid? AccountId { get; set; }
        
        public TransactionType? Type { get; set; }
        
        public DateTime? Date { get; set; }
        
        public decimal? Amount { get; set; }
        
        [MaxLength(255)]
        public string Description { get; set; }
        
        public string Notes { get; set; }
        
        public bool? IsRecurring { get; set; }
        
        public RecurrencePattern? RecurrencePattern { get; set; }
        
        public DateTime? NextDueDate { get; set; }
        
        public bool? IsTaxDeductible { get; set; }
        
        public bool? IsPaid { get; set; }
        
        public DateTime? PaidDate { get; set; }

        public string? TransactionCategory { get; set; }

        public string? SubCategory { get; set; }
    }
}