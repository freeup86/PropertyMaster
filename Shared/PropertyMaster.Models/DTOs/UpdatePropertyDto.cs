// In UpdatePropertyDto.cs
using System;
using System.ComponentModel.DataAnnotations;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class UpdatePropertyDto
    {
        [MaxLength(100)]
        public string Name { get; set; }
        
        [MaxLength(200)]
        public string Address { get; set; }
        
        [MaxLength(100)]
        public string City { get; set; }
        
        [MaxLength(50)]
        public string State { get; set; }
        
        [MaxLength(20)]
        public string ZipCode { get; set; }
        
        [MaxLength(50)]
        public string Country { get; set; }
        
        public PropertyType? Type { get; set; }
        
        public decimal? AcquisitionPrice { get; set; }
        
        public decimal? CurrentValue { get; set; }
        
        public DateTime? LastValuationDate { get; set; }

        public DateTime? AcquisitionDate { get; set; }
    }
}