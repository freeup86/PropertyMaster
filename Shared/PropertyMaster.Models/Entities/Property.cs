using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public enum PropertyType
    {
        SingleFamily,
        MultiFamily,
        Condominium,
        Apartment,
        Commercial,
        Other
    }

    public class Property : BaseEntity
    {
        [Required]
        public Guid OwnerId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Address { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string City { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string State { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string ZipCode { get; set; }
        
        [MaxLength(50)]
        public string Country { get; set; }
        
        public PropertyType Type { get; set; }
        
        public DateTime AcquisitionDate { get; set; }
        
        public decimal AcquisitionPrice { get; set; }
        
        public decimal CurrentValue { get; set; }
        
        public DateTime LastValuationDate { get; set; }

        // Navigation properties
        public virtual User Owner { get; set; }
        public virtual ICollection<Unit> Units { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}