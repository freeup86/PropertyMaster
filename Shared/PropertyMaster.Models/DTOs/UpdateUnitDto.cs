using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.DTOs
{
    public class UpdateUnitDto
    {
        [MaxLength(50)]
        public string UnitNumber { get; set; }
        
        public decimal? Size { get; set; }
        
        public int? Bedrooms { get; set; }
        
        public int? Bathrooms { get; set; }
        
        public decimal? MarketRent { get; set; }
        
        public bool? IsOccupied { get; set; }
    }
}