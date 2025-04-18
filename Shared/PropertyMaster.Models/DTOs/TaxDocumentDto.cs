using System;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.DTOs
{
    public class TaxDocumentDto
    {
        public Guid Id { get; set; }
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public int TaxYear { get; set; }
        public string DocumentType { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
        public string Description { get; set; }
        public DateTime UploadDate { get; set; }
        public string Category { get; set; }
    }

    public class CreateTaxDocumentDto
    {
        [Required]
        public Guid PropertyId { get; set; }
        
        [Required]
        public int TaxYear { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string DocumentType { get; set; }
        
        // Make description nullable and set a default value
        [MaxLength(500)]
        public string Description { get; set; } = " "; // Use a space as default
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; }
    }

    public class UpdateTaxDocumentDto
    {
        [MaxLength(100)]
        public string DocumentType { get; set; }
        
        [MaxLength(500)]
        public string Description { get; set; }
        
        [MaxLength(50)]
        public string Category { get; set; }
    }
}