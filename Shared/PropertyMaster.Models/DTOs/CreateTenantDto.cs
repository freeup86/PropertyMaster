using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.DTOs
{
    public class CreateTenantDto : IValidatableObject
    {
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string LastName { get; set; }

        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }

        [Phone]
        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        public DateTime? LeaseStartDate { get; set; }

        public DateTime? LeaseEndDate { get; set; }

        [Required]
        public Guid UnitId { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrEmpty(Email) && string.IsNullOrEmpty(PhoneNumber))
            {
                yield return new ValidationResult(
                    "Either Email or Phone Number is required.",
                    new[] { "Email", "PhoneNumber" } // Members to which this validation result applies
                );
            }
        }
    }
}