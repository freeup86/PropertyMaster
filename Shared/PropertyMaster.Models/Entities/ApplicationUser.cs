using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Keep existing attributes if needed

namespace PropertyMaster.Models.Entities
{
    // Inherit from IdentityUser, using Guid as the primary key type
    public class ApplicationUser : IdentityUser<Guid>
    {
        // --- Properties migrated from your original User.cs ---
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        // Email, PhoneNumber, UserName, NormalizedEmail, NormalizedUserName, PasswordHash etc.
        // are inherited from IdentityUser<Guid>.
        // Identity handles managing Email and PhoneNumber if populated.

        // --- Other properties from your original User.cs ---
        public DateTime LastLoginDate { get; set; } // You'll need to update this manually on login

        public bool IsActive { get; set; } = true; // We can use this flag in login logic

        [MaxLength(10)]
        public string? PreferredCurrency { get; set; }

        [MaxLength(50)]
        public string? TimeZone { get; set; }

        // --- Navigation Properties ---
        // Assuming the ApplicationUser is the owner of properties
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}