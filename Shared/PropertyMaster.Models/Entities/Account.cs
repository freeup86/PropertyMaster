using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public class Account : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; }  // Checking, Savings, Credit Card, etc.
        
        public decimal Balance { get; set; }
        
        [MaxLength(255)]
        public string Description { get; set; }
    }
}