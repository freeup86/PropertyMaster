using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PropertyMaster.Models.DTOs;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface ITaxDocumentService
    {
        Task<IEnumerable<TaxDocumentDto>> GetTaxDocumentsByPropertyIdAsync(Guid propertyId, int? taxYear = null);
        Task<TaxDocumentDto> GetTaxDocumentByIdAsync(Guid id);
        Task<TaxDocumentDto> UploadTaxDocumentAsync(CreateTaxDocumentDto documentDto, IFormFile file);
        Task<TaxDocumentDto> UpdateTaxDocumentAsync(Guid id, UpdateTaxDocumentDto documentDto);
        Task<bool> DeleteTaxDocumentAsync(Guid id);
        Task<byte[]> DownloadTaxDocumentAsync(Guid id);
    }
}