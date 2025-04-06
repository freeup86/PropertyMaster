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
        
        public Guid CategoryId { get; set; }
        
        public Guid AccountId { get; set; }
        
        public TransactionType Type { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        [MaxLength(255)]
        public string Description { get; set; }
        
        public string Notes { get; set; }
        
        public bool IsRecurring { get; set; }

        // Navigation properties
        public virtual Property Property { get; set; }
        public virtual Unit Unit { get; set; }
    }
}