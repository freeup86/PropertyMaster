// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Services/Interfaces/IDocumentService.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PropertyMaster.Models.DTOs;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentDto>> GetDocumentsByPropertyIdAsync(Guid propertyId);
        Task<IEnumerable<DocumentDto>> GetDocumentsByUnitIdAsync(Guid unitId);
        Task<IEnumerable<DocumentDto>> GetDocumentsByTenantIdAsync(Guid tenantId);
        Task<DocumentDto> GetDocumentByIdAsync(Guid documentId);
        Task<DocumentDto> UploadDocumentAsync(CreateDocumentDto documentDto, IFormFile file);
        Task<DocumentDto> UpdateDocumentAsync(Guid documentId, UpdateDocumentDto documentDto);
        Task<bool> DeleteDocumentAsync(Guid documentId);
        Task<byte[]> DownloadDocumentAsync(Guid documentId);
    }
}