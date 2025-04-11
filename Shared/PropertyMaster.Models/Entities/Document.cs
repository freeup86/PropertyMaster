// Shared/PropertyMaster.Models/Entities/Document.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public class Document : BaseEntity
    {
        [Required]
        public Guid PropertyId { get; set; }
        
        public Guid? UnitId { get; set; }
        
        public Guid? TenantId { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string FileName { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string ContentType { get; set; }
        
        [Required]
        public long FileSize { get; set; }
        
        [MaxLength(100)]
        public string DocumentType { get; set; } // Lease, Inspection, Insurance, etc.
        
        [MaxLength(500)]
        public string Description { get; set; }
        
        public DateTime? ExpirationDate { get; set; }
        
        [Required]
        public string FilePath { get; set; } // Path or blob storage reference
        
        // Navigation properties
        public virtual Property Property { get; set; }
        public virtual Unit Unit { get; set; }
        public virtual Tenant Tenant { get; set; }
    }
}