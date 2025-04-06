using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Services.Implementations
{
    public class PropertyService : IPropertyService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<PropertyService> _logger;

        public PropertyService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<PropertyService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesByUserIdAsync(Guid userId)
        {
            var properties = await _context.Properties
                .Where(p => p.OwnerId == userId)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<PropertyDto>>(properties);
        }

        public async Task<PropertyDto> GetPropertyByIdAsync(Guid propertyId, Guid userId)
        {
            var property = await _context.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId && p.OwnerId == userId);
            
            return _mapper.Map<PropertyDto>(property);
        }

        public async Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto propertyDto, Guid userId)
        {
            var property = _mapper.Map<Property>(propertyDto);
            property.OwnerId = userId;
            property.Id = Guid.NewGuid();
            property.CreatedDate = DateTime.UtcNow;
            property.ModifiedDate = DateTime.UtcNow;
            property.LastValuationDate = DateTime.UtcNow;

            await _context.Properties.AddAsync(property);
            await _context.SaveChangesAsync();

            return _mapper.Map<PropertyDto>(property);
        }

        public async Task<PropertyDto> UpdatePropertyAsync(Guid propertyId, UpdatePropertyDto propertyDto, Guid userId)
        {
            var property = await _context.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId && p.OwnerId == userId);
            
            if (property == null)
                return null;

            _mapper.Map(propertyDto, property);
            property.ModifiedDate = DateTime.UtcNow;
            
            _context.Properties.Update(property);
            await _context.SaveChangesAsync();

            return _mapper.Map<PropertyDto>(property);
        }

        public async Task<bool> DeletePropertyAsync(Guid propertyId, Guid userId)
        {
            var property = await _context.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId && p.OwnerId == userId);
            
            if (property == null)
                return false;

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}