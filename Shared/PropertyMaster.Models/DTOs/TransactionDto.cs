using System;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public Guid? UnitId { get; set; }
        public string UnitNumber { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryType { get; set; }
        public Guid? AccountId { get; set; }
        public string AccountName { get; set; }
        public TransactionType Type { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrencePattern? RecurrencePattern { get; set; }
        public DateTime? NextDueDate { get; set; }
        public bool IsTaxDeductible { get; set; }
        public bool IsPaid { get; set; }
        public DateTime? PaidDate { get; set; }
        public string TransactionCategory { get; set; }
        public string SubCategory { get; set; }
    }
}