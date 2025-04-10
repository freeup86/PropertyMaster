using System;
using System.ComponentModel.DataAnnotations;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class CreateTransactionDto
    {
        [Required]
        public Guid PropertyId { get; set; }
        
        public Guid? UnitId { get; set; }
        
        [Required]
        public Guid CategoryId { get; set; }
        
        public Guid? AccountId { get; set; }
        
        [Required]
        public TransactionType Type { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        [MaxLength(255)]
        public string Description { get; set; }
        
        public string Notes { get; set; }
        
        public bool IsRecurring { get; set; }
        
        public RecurrencePattern? RecurrencePattern { get; set; }
        
        public DateTime? NextDueDate { get; set; }
        
        public bool IsTaxDeductible { get; set; }
        
        public bool IsPaid { get; set; }
        
        public DateTime? PaidDate { get; set; }
    }
}