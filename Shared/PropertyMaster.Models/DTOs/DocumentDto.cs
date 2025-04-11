// Shared/PropertyMaster.Models/DTOs/DocumentDto.cs
using System;

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
        public Guid PropertyId { get; set; }
        public Guid? UnitId { get; set; }
        public Guid? TenantId { get; set; }
        public string DocumentType { get; set; }
        public string Description { get; set; }
        public DateTime? ExpirationDate { get; set; }
        // File data will be sent separately in multipart form data
    }
    
    public class UpdateDocumentDto
    {
        public string DocumentType { get; set; }
        public string Description { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}