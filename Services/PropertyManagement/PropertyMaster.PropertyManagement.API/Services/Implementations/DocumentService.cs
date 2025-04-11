// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Services/Implementations/DocumentService.cs
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
    public class DocumentService : IDocumentService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<DocumentService> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadsFolder;

        public DocumentService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<DocumentService> logger,
            IWebHostEnvironment environment)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _environment = environment;
            
            // Create uploads folder if it doesn't exist
            _uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads");
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }
        }

        public async Task<IEnumerable<DocumentDto>> GetDocumentsByPropertyIdAsync(Guid propertyId)
        {
            var documents = await _context.Documents
                .Include(d => d.Property)
                .Include(d => d.Unit)
                .Include(d => d.Tenant)
                .Where(d => d.PropertyId == propertyId)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<DocumentDto>>(documents);
        }

        public async Task<IEnumerable<DocumentDto>> GetDocumentsByUnitIdAsync(Guid unitId)
        {
            var documents = await _context.Documents
                .Include(d => d.Property)
                .Include(d => d.Unit)
                .Include(d => d.Tenant)
                .Where(d => d.UnitId == unitId)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<DocumentDto>>(documents);
        }

        public async Task<IEnumerable<DocumentDto>> GetDocumentsByTenantIdAsync(Guid tenantId)
        {
            var documents = await _context.Documents
                .Include(d => d.Property)
                .Include(d => d.Unit)
                .Include(d => d.Tenant)
                .Where(d => d.TenantId == tenantId)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<DocumentDto>>(documents);
        }

        public async Task<DocumentDto> GetDocumentByIdAsync(Guid documentId)
        {
            var document = await _context.Documents
                .Include(d => d.Property)
                .Include(d => d.Unit)
                .Include(d => d.Tenant)
                .FirstOrDefaultAsync(d => d.Id == documentId);
            
            return _mapper.Map<DocumentDto>(document);
        }

        public async Task<DocumentDto> UploadDocumentAsync(CreateDocumentDto documentDto, IFormFile file)
        {
            // Validate property exists
            var property = await _context.Properties.FindAsync(documentDto.PropertyId);
            if (property == null)
                throw new Exception($"Property with ID {documentDto.PropertyId} not found");

            // Validate unit belongs to property if specified
            if (documentDto.UnitId.HasValue)
            {
                var unit = await _context.Units
                    .FirstOrDefaultAsync(u => u.Id == documentDto.UnitId.Value && u.PropertyId == documentDto.PropertyId);
                
                if (unit == null)
                    throw new Exception($"Unit with ID {documentDto.UnitId} not found for the specified property");
            }

            // Validate tenant exists if specified
            if (documentDto.TenantId.HasValue)
            {
                var tenant = await _context.Tenants.FindAsync(documentDto.TenantId.Value);
                if (tenant == null)
                    throw new Exception($"Tenant with ID {documentDto.TenantId} not found");
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_uploadsFolder, uniqueFileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create document record
            var document = new Document
            {
                Id = Guid.NewGuid(),
                PropertyId = documentDto.PropertyId,
                UnitId = documentDto.UnitId,
                TenantId = documentDto.TenantId,
                FileName = file.FileName,
                ContentType = file.ContentType,
                FileSize = file.Length,
                DocumentType = documentDto.DocumentType,
                Description = documentDto.Description,
                ExpirationDate = documentDto.ExpirationDate,
                FilePath = uniqueFileName, // Store only the filename, not the full path
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();

            // Load navigation properties for mapping
            _context.Entry(document).Reference(d => d.Property).Load();
            
            if (document.UnitId.HasValue)
                _context.Entry(document).Reference(d => d.Unit).Load();
            
            if (document.TenantId.HasValue)
                _context.Entry(document).Reference(d => d.Tenant).Load();

            return _mapper.Map<DocumentDto>(document);
        }

        public async Task<DocumentDto> UpdateDocumentAsync(Guid documentId, UpdateDocumentDto documentDto)
        {
            var document = await _context.Documents
                .Include(d => d.Property)
                .Include(d => d.Unit)
                .Include(d => d.Tenant)
                .FirstOrDefaultAsync(d => d.Id == documentId);
            
            if (document == null)
                return null;

            // Update document properties
            document.DocumentType = documentDto.DocumentType;
            document.Description = documentDto.Description;
            document.ExpirationDate = documentDto.ExpirationDate;
            document.ModifiedDate = DateTime.UtcNow;

            _context.Documents.Update(document);
            await _context.SaveChangesAsync();

            return _mapper.Map<DocumentDto>(document);
        }

        public async Task<bool> DeleteDocumentAsync(Guid documentId)
        {
            var document = await _context.Documents.FindAsync(documentId);
            
            if (document == null)
                return false;

            // Delete the physical file
            var filePath = Path.Combine(_uploadsFolder, document.FilePath);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<byte[]> DownloadDocumentAsync(Guid documentId)
        {
            var document = await _context.Documents.FindAsync(documentId);
            
            if (document == null)
                throw new Exception($"Document with ID {documentId} not found");

            var filePath = Path.Combine(_uploadsFolder, document.FilePath);
            if (!File.Exists(filePath))
                throw new Exception($"File not found on server");

            return await File.ReadAllBytesAsync(filePath);
        }
    }
}