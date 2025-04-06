using System;
using System.ComponentModel.DataAnnotations;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class CreatePropertyDto
    {
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
        
        [Required]
        public DateTime AcquisitionDate { get; set; }
        
        [Required]
        public decimal AcquisitionPrice { get; set; }
        
        public decimal CurrentValue { get; set; }
    }
}