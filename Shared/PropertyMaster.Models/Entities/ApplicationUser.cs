using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace PropertyMaster.Models.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.Owner;

        public DateTime LastLoginDate { get; set; }

        public bool IsActive { get; set; } = true;

        [MaxLength(10)]
        public string? PreferredCurrency { get; set; }

        [MaxLength(50)]
        public string? TimeZone { get; set; }

        // Navigation property for properties owned
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}