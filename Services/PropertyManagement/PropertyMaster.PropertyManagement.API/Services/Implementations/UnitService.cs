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
    public class UnitService : IUnitService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<UnitService> _logger;

        public UnitService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<UnitService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
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
            var unit = await _context.Units
                .Include(u => u.Property)
                .FirstOrDefaultAsync(u => u.Id == unitId && u.PropertyId == propertyId);
            
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
    }
}