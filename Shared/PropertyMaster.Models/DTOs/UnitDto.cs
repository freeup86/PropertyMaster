using System;

namespace PropertyMaster.Models.DTOs
{
    public class UnitDto
    {
        public Guid Id { get; set; }
        public Guid PropertyId { get; set; }
        public string UnitNumber { get; set; }
        public decimal Size { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public decimal MarketRent { get; set; }
        public bool IsOccupied { get; set; }
        public string PropertyName { get; set; }
        public string[] ImageUrls { get; set; }
    }
}