using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }
        
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }
        
        [Phone]
        [MaxLength(20)]
        public string PhoneNumber { get; set; }
        
        public DateTime LastLoginDate { get; set; }
        
        public bool IsActive { get; set; }
        
        [MaxLength(10)]
        public string PreferredCurrency { get; set; }
        
        [MaxLength(50)]
        public string TimeZone { get; set; }

        // Navigation properties
        public virtual ICollection<Property> Properties { get; set; }
    }
}