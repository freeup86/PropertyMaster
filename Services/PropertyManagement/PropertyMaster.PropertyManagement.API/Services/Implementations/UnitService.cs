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
    public class UnitService : IUnitService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<UnitService> _logger;
        private readonly IWebHostEnvironment _environment;

        public UnitService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<UnitService> logger,
            IWebHostEnvironment environment)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _environment = environment;
        }

        public async Task<IEnumerable<UnitDto>> GetUnitsByPropertyIdAsync(Guid propertyId)
        {
            var units = await _context.Units
                .Where(u => u.PropertyId == propertyId)
                .Include(u => u.Property)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<UnitDto>>(units);
        }

        public async Task<UnitDto> GetUnitByIdAsync(Guid unitId, Guid propertyId)
        {
            var unit = await _context.Units
                .Include(u => u.Property)
                .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
            
            return _mapper.Map<UnitDto>(unit);
        }

        public async Task<UnitDto> CreateUnitAsync(CreateUnitDto unitDto, Guid propertyId)
        {
            // Check if property exists
            var property = await _context.Properties.FindAsync(propertyId);
            if (property == null)
                throw new Exception($"Property with ID {propertyId} not found");

            var unit = _mapper.Map<Unit>(unitDto);
            unit.Id = Guid.NewGuid();
            unit.PropertyId = propertyId;
            unit.CreatedDate = DateTime.UtcNow;
            unit.ModifiedDate = DateTime.UtcNow;

            await _context.Units.AddAsync(unit);
            await _context.SaveChangesAsync();

            // Load the property for mapping to DTO
            unit.Property = property;

            return _mapper.Map<UnitDto>(unit);
        }

        public async Task<UnitDto> UpdateUnitAsync(Guid unitId, UpdateUnitDto unitDto, Guid propertyId)
        {
            _logger.LogInformation("Updating unit {UnitId} for property {PropertyId} with data {@UnitDto}", unitId, propertyId, unitDto);
            
            var unit = await _context.Units
                .Include(u => u.Property)
                .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
            
            _logger.LogInformation("Retrieved unit: {@Unit}", unit);

            if (unit == null)
                return null;

            _mapper.Map(unitDto, unit);
            unit.ModifiedDate = DateTime.UtcNow;
            
            _context.Units.Update(unit);
            await _context.SaveChangesAsync();

            return _mapper.Map<UnitDto>(unit);
        }

        public async Task<bool> DeleteUnitAsync(Guid unitId, Guid propertyId)
        {
            var unit = await _context.Units
                .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
            
            if (unit == null)
                return false;

            _context.Units.Remove(unit);
            await _context.SaveChangesAsync();

            return true;
        }
        
        public async Task<bool> DeleteUnitImageAsync(Guid unitId, Guid propertyId, string imageUrl)
        {
            try 
            {
                // Extract content type and base64 data
                var parts = imageUrl.Split(',');
                if (parts.Length < 2)
                {
                    _logger.LogWarning($"Invalid image URL format for Unit {unitId}");
                    return false;
                }

                var contentType = parts[0].Split(':')[1].Split(';')[0];
                var base64Image = parts[1];

                // Fetch the unit with images, using AsEnumerable for client-side evaluation
                var unit = await _context.Units
                    .Include(u => u.Images)
                    .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
                
                if (unit == null)
                {
                    _logger.LogWarning($"Unit not found: {unitId} for property {propertyId}");
                    return false;
                }

                // Use client-side evaluation to find the matching image
                var imageToDelete = unit.Images
                    .AsEnumerable() // Switch to client-side evaluation
                    .FirstOrDefault(img => 
                        img.ContentType == contentType && 
                        Convert.ToBase64String(img.ImageData) == base64Image
                    );

                if (imageToDelete == null)
                {
                    _logger.LogWarning($"No image found to delete for Unit {unitId}");
                    return false;
                }

                // Remove the image from the database
                _context.UnitImages.Remove(imageToDelete);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully deleted image for Unit {unitId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting image for Unit {unitId}");
                throw; // Re-throw to preserve full exception details
            }
        }

        // Ensure this method is implemented as it was in the original code
        public async Task<UnitImageDto> UploadUnitImageAsync(Guid propertyId, Guid unitId, IFormFile image)
        {
            // Validate unit exists
            var unit = await _context.Units
                .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);

            if (unit == null)
                throw new Exception($"Unit with ID {unitId} not found");

            // Convert image to byte array
            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            var imageData = memoryStream.ToArray();

            // Create UnitImage entity
            var unitImage = new UnitImage
            {
                Id = Guid.NewGuid(),
                UnitId = unitId,
                ImageData = imageData,
                FileName = image.FileName,
                ContentType = image.ContentType,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            // Save to database
            _context.UnitImages.Add(unitImage);
            await _context.SaveChangesAsync();

            return new UnitImageDto
            {
                Id = unitImage.Id,
                UnitId = unitImage.UnitId,
                FileName = unitImage.FileName,
                ContentType = unitImage.ContentType,
                Base64ImageData = Convert.ToBase64String(unitImage.ImageData)
            };
        }

        public async Task<IEnumerable<UnitImageDto>> GetUnitImagesAsync(Guid propertyId, Guid unitId)
        {
            // Validate unit exists
            var unit = await _context.Units
                .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
            
            if (unit == null)
                throw new Exception($"Unit with ID {unitId} not found");

            // Fetch images
            var images = await _context.UnitImages
                .Where(ui => ui.UnitId == unitId)
                .ToListAsync();

            // Convert to DTOs with Base64 image data
            return images.Select(img => new UnitImageDto
            {
                Id = img.Id,
                UnitId = img.UnitId,
                FileName = img.FileName,
                ContentType = img.ContentType,
                Base64ImageData = Convert.ToBase64String(img.ImageData)
            });
        }
    }
}