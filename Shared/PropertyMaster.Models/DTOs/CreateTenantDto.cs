using System;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.DTOs
{
    public class CreateTenantDto
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }
        
        [Required]
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
    }
}