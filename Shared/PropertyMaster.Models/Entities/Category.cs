using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; }
        
        public bool IsTaxDeductible { get; set; }

        // Navigation properties
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}