// Shared/PropertyMaster.Models/DTOs/DocumentDto.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.DTOs
{
    public class DocumentDto
    {
        public Guid Id { get; set; }
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
        public Guid? UnitId { get; set; }
        public string UnitNumber { get; set; }
        public Guid? TenantId { get; set; }
        public string TenantName { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
        public string DocumentType { get; set; }
        public string Description { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime UploadDate { get; set; }
    }
    
    public class CreateDocumentDto
    {
        [Required]
        public Guid PropertyId { get; set; }
        
        public Guid? UnitId { get; set; }
        
        public Guid? TenantId { get; set; }
        
        // Add default value
        [MaxLength(100)]
        public string DocumentType { get; set; } = "Other";
        
        // Add default value
        [MaxLength(500)]
        public string Description { get; set; } = "No description provided";
        
        // Add the missing ExpirationDate property
        public DateTime? ExpirationDate { get; set; }
    }
        
    public class UpdateDocumentDto
    {
        public string DocumentType { get; set; }
        public string Description { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}