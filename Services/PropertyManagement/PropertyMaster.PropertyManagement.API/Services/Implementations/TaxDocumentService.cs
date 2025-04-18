using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Services.Implementations
{
    public class TaxDocumentService : ITaxDocumentService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<TaxDocumentService> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly string _taxDocumentsFolder;

        public TaxDocumentService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<TaxDocumentService> logger,
            IWebHostEnvironment environment)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _environment = environment;
            
            // Create tax documents folder if it doesn't exist
            _taxDocumentsFolder = Path.Combine(_environment.ContentRootPath, "TaxDocuments");
            if (!Directory.Exists(_taxDocumentsFolder))
            {
                Directory.CreateDirectory(_taxDocumentsFolder);
            }
        }

        public async Task<IEnumerable<TaxDocumentDto>> GetTaxDocumentsByPropertyIdAsync(Guid propertyId, int? taxYear = null)
        {
            var query = _context.Documents
                .Include(d => d.Property)
                .Where(d => d.PropertyId == propertyId && d.DocumentType.StartsWith("Tax-"));
                
            if (taxYear.HasValue)
            {
                // Filter by tax year which is stored in the Description field for tax documents
                query = query.Where(d => d.Description.Contains($"Tax Year: {taxYear}"));
            }
            
            var documents = await query.ToListAsync();
            
            var taxDocs = documents.Select(doc => new TaxDocumentDto
            {
                Id = doc.Id,
                PropertyId = doc.PropertyId,
                PropertyName = doc.Property?.Name ?? "Unknown Property",
                TaxYear = ExtractTaxYear(doc.Description),
                DocumentType = doc.DocumentType.Replace("Tax-", ""),
                FileName = doc.FileName,
                ContentType = doc.ContentType,
                FileSize = doc.FileSize,
                Description = ExtractDescription(doc.Description),
                UploadDate = doc.CreatedDate,
                Category = ExtractCategory(doc.DocumentType)
            });
            
            return taxDocs;
        }

        public async Task<TaxDocumentDto> GetTaxDocumentByIdAsync(Guid id)
        {
            var document = await _context.Documents
                .Include(d => d.Property)
                .FirstOrDefaultAsync(d => d.Id == id && d.DocumentType.StartsWith("Tax-"));
                
            if (document == null)
                return null;
                
            return new TaxDocumentDto
            {
                Id = document.Id,
                PropertyId = document.PropertyId,
                PropertyName = document.Property?.Name ?? "Unknown Property",
                TaxYear = ExtractTaxYear(document.Description),
                DocumentType = document.DocumentType.Replace("Tax-", ""),
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSize = document.FileSize,
                Description = ExtractDescription(document.Description),
                UploadDate = document.CreatedDate,
                Category = ExtractCategory(document.DocumentType)
            };
        }

        public async Task<TaxDocumentDto> UploadTaxDocumentAsync(CreateTaxDocumentDto documentDto, IFormFile file)
        {
            try
            {
                // Validate property exists
                var property = await _context.Properties.FindAsync(documentDto.PropertyId);
                if (property == null)
                    throw new Exception($"Property with ID {documentDto.PropertyId} not found");

                // Ensure description is not null
                var description = documentDto.Description ?? string.Empty;

                // Generate unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(_taxDocumentsFolder, uniqueFileName);

                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Format description to include tax year
                var formattedDescription = $"Tax Year: {documentDto.TaxYear} | {description}";
                
                // Format document type to indicate it's a tax document
                var documentType = $"Tax-{documentDto.DocumentType} | {documentDto.Category}";

                // Create document record
                var document = new Document
                {
                    Id = Guid.NewGuid(),
                    PropertyId = documentDto.PropertyId,
                    UnitId = null,
                    TenantId = null,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    FileSize = file.Length,
                    DocumentType = documentType,
                    Description = formattedDescription,
                    ExpirationDate = null,
                    FilePath = uniqueFileName,
                    CreatedDate = DateTime.UtcNow,
                    ModifiedDate = DateTime.UtcNow
                };

                await _context.Documents.AddAsync(document);
                await _context.SaveChangesAsync();

                // Load property for mapping
                _context.Entry(document).Reference(d => d.Property).Load();

                return new TaxDocumentDto
                {
                    Id = document.Id,
                    PropertyId = document.PropertyId,
                    PropertyName = document.Property?.Name ?? "Unknown Property",
                    TaxYear = documentDto.TaxYear,
                    DocumentType = documentDto.DocumentType,
                    FileName = document.FileName,
                    ContentType = document.ContentType,
                    FileSize = document.FileSize,
                    Description = description,
                    UploadDate = document.CreatedDate,
                    Category = documentDto.Category
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UploadTaxDocumentAsync: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<TaxDocumentDto> UpdateTaxDocumentAsync(Guid id, UpdateTaxDocumentDto documentDto)
        {
            var document = await _context.Documents
                .Include(d => d.Property)
                .FirstOrDefaultAsync(d => d.Id == id && d.DocumentType.StartsWith("Tax-"));
                
            if (document == null)
                return null;

            // Extract existing values
            var taxYear = ExtractTaxYear(document.Description);
            var existingCategory = ExtractCategory(document.DocumentType);
            
            // Update values
            if (!string.IsNullOrEmpty(documentDto.Description))
            {
                document.Description = $"Tax Year: {taxYear} | {documentDto.Description}";
            }
            
            if (!string.IsNullOrEmpty(documentDto.DocumentType) || !string.IsNullOrEmpty(documentDto.Category))
            {
                var docType = !string.IsNullOrEmpty(documentDto.DocumentType) 
                    ? documentDto.DocumentType 
                    : document.DocumentType.Split('|')[0].Replace("Tax-", "");
                    
                var category = !string.IsNullOrEmpty(documentDto.Category)
                    ? documentDto.Category
                    : existingCategory;
                    
                document.DocumentType = $"Tax-{docType} | {category}";
            }
            
            document.ModifiedDate = DateTime.UtcNow;

            _context.Documents.Update(document);
            await _context.SaveChangesAsync();

            return new TaxDocumentDto
            {
                Id = document.Id,
                PropertyId = document.PropertyId,
                PropertyName = document.Property?.Name ?? "Unknown Property",
                TaxYear = taxYear,
                DocumentType = document.DocumentType.Split('|')[0].Replace("Tax-", ""),
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSize = document.FileSize,
                Description = ExtractDescription(document.Description),
                UploadDate = document.CreatedDate,
                Category = ExtractCategory(document.DocumentType)
            };
        }

        public async Task<bool> DeleteTaxDocumentAsync(Guid id)
        {
            var document = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == id && d.DocumentType.StartsWith("Tax-"));
                
            if (document == null)
                return false;

            // Delete the physical file
            var filePath = Path.Combine(_taxDocumentsFolder, document.FilePath);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<byte[]> DownloadTaxDocumentAsync(Guid id)
        {
            var document = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == id && d.DocumentType.StartsWith("Tax-"));
                
            if (document == null)
                throw new Exception($"Tax document with ID {id} not found");

            var filePath = Path.Combine(_taxDocumentsFolder, document.FilePath);
            if (!File.Exists(filePath))
                throw new Exception($"File not found on server");

            return await File.ReadAllBytesAsync(filePath);
        }

        private int ExtractTaxYear(string description)
        {
            if (string.IsNullOrEmpty(description))
                return DateTime.Now.Year;
                
            var parts = description.Split('|');
            if (parts.Length > 0 && parts[0].StartsWith("Tax Year:"))
            {
                var yearStr = parts[0].Replace("Tax Year:", "").Trim();
                if (int.TryParse(yearStr, out int year))
                    return year;
            }
            
            return DateTime.Now.Year;
        }

        private string ExtractDescription(string description)
        {
            if (string.IsNullOrEmpty(description))
                return "";
                
            var parts = description.Split('|');
            if (parts.Length > 1)
                return parts[1];
                
            return description;
        }

        private string ExtractCategory(string documentType)
        {
            if (string.IsNullOrEmpty(documentType))
                return "Other";
                
            var parts = documentType.Split('|');
            if (parts.Length > 1)
                return parts[1];
                
            return "Other";
        }
    }
}