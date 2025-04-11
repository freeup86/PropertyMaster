using System;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public enum TransactionType
    {
        Income,
        Expense,
        Investment,
        Transfer
    }

    public class Transaction : BaseEntity
    {
        [Required]
        public Guid PropertyId { get; set; }
        
        public Guid? UnitId { get; set; }
        
        [Required]
        public Guid CategoryId { get; set; }
        
        public Guid? AccountId { get; set; } = null;
        public string AccountName { get; set; } = null;
        
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

        [Required]
        public string TransactionCategory { get; set; } // e.g., "Rent", "Mortgage", "Utilities"

        [Required]
        public string SubCategory { get; set; } // e.g., "Electricity", "Water", "Gas" (for Utilities)

        // Navigation properties
        public virtual Property Property { get; set; }
        public virtual Unit Unit { get; set; }
        public virtual Category Category { get; set; }
        //public virtual Account Account { get; set; }
    }
    
    public enum RecurrencePattern
    {
        Daily,
        Weekly,
        Biweekly,
        Monthly,
        Quarterly,
        Annually
    }
}