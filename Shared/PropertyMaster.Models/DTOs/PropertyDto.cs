using System;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class PropertyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public PropertyType Type { get; set; }
        public DateTime AcquisitionDate { get; set; }
        public decimal AcquisitionPrice { get; set; }
        public decimal CurrentValue { get; set; }
        public DateTime LastValuationDate { get; set; }
        public int UnitCount { get; set; }
    }
}