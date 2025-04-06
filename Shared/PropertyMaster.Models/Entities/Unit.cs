using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public class Unit : BaseEntity
    {
        [Required]
        public Guid PropertyId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string UnitNumber { get; set; }
        
        public decimal Size { get; set; }
        
        public int Bedrooms { get; set; }
        
        public int Bathrooms { get; set; }
        
        public decimal MarketRent { get; set; }
        
        public bool IsOccupied { get; set; }

        // Navigation properties
        public virtual Property Property { get; set; }
    }
}