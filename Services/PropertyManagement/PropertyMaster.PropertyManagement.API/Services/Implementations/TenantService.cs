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
    public class TenantService : ITenantService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<TenantService> _logger;

        public TenantService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<TenantService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<TenantDto>> GetTenantsByPropertyIdAsync(Guid propertyId)
        {
            var tenants = await _context.Tenants
                .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
                .Where(t => t.Unit.PropertyId == propertyId)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<TenantDto>>(tenants);
        }

        public async Task<IEnumerable<TenantDto>> GetTenantsByUnitIdAsync(Guid unitId)
        {
            var tenants = await _context.Tenants
                .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
                .Where(t => t.UnitId == unitId)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<TenantDto>>(tenants);
        }

        public async Task<TenantDto> GetTenantByIdAsync(Guid tenantId)
        {
            var tenant = await _context.Tenants
                .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
                .FirstOrDefaultAsync(t => t.Id == tenantId);
            
            return _mapper.Map<TenantDto>(tenant);
        }

        public async Task<TenantDto> CreateTenantAsync(CreateTenantDto tenantDto)
        {
            // Check if unit exists
            var unit = await _context.Units
                .Include(u => u.Property)
                .FirstOrDefaultAsync(u => u.Id == tenantDto.UnitId);
            
            if (unit == null)
                throw new Exception($"Unit with ID {tenantDto.UnitId} not found");

            var tenant = _mapper.Map<Tenant>(tenantDto);
            tenant.Id = Guid.NewGuid();
            tenant.CreatedDate = DateTime.UtcNow;
            tenant.ModifiedDate = DateTime.UtcNow;

            await _context.Tenants.AddAsync(tenant);
            
            // Update the unit's occupancy status
            unit.IsOccupied = true;
            _context.Units.Update(unit);
            
            await _context.SaveChangesAsync();

            // Load the unit and property for mapping to DTO
            tenant.Unit = unit;

            return _mapper.Map<TenantDto>(tenant);
        }

       public async Task<TenantDto> UpdateTenantAsync(Guid tenantId, UpdateTenantDto tenantDto)
        {
            var tenant = await _context.Tenants
                .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
                .FirstOrDefaultAsync(t => t.Id == tenantId);
            
            if (tenant == null)
                return null;

            // If a new unit is specified, validate it
            if (tenantDto.UnitId.HasValue)
            {
                var newUnit = await _context.Units
                    .FirstOrDefaultAsync(u => u.Id == tenantDto.UnitId.Value);
                
                if (newUnit == null)
                    throw new Exception($"Unit with ID {tenantDto.UnitId} not found");

                // Update unit-related logic
                tenant.UnitId = newUnit.Id;
            }

            // Map other properties
            _mapper.Map(tenantDto, tenant);
            tenant.ModifiedDate = DateTime.UtcNow;
            
            _context.Tenants.Update(tenant);
            
            // If unit changed, update unit occupancy
            if (tenantDto.UnitId.HasValue)
            {
                // Mark new unit as occupied
                var newUnit = await _context.Units
                    .FirstOrDefaultAsync(u => u.Id == tenantDto.UnitId.Value);
                
                if (newUnit != null)
                {
                    newUnit.IsOccupied = true;
                    _context.Units.Update(newUnit);
                }

                // If old unit had no other tenants, mark as unoccupied
                var oldUnitTenants = await _context.Tenants
                    .CountAsync(t => t.UnitId == tenant.UnitId);
                
                if (oldUnitTenants <= 1)
                {
                    var oldUnit = await _context.Units
                        .FirstOrDefaultAsync(u => u.Id == tenant.UnitId);
                    
                    if (oldUnit != null)
                    {
                        oldUnit.IsOccupied = false;
                        _context.Units.Update(oldUnit);
                    }
                }
            }

            await _context.SaveChangesAsync();

            // Reload navigation properties for mapping
            await _context.Entry(tenant)
                .Reference(t => t.Unit)
                .Query()
                .Include(u => u.Property)
                .LoadAsync();

            return _mapper.Map<TenantDto>(tenant);
        }

        public async Task<bool> DeleteTenantAsync(Guid tenantId)
        {
            var tenant = await _context.Tenants
                .Include(t => t.Unit)
                .FirstOrDefaultAsync(t => t.Id == tenantId);
            
            if (tenant == null)
                return false;

            // Check if this is the only tenant for the unit
            var otherTenants = await _context.Tenants
                .Where(t => t.UnitId == tenant.UnitId && t.Id != tenantId)
                .AnyAsync();
            
            if (!otherTenants)
            {
                // Update the unit's occupancy status
                var unit = tenant.Unit;
                unit.IsOccupied = false;
                _context.Units.Update(unit);
            }

            _context.Tenants.Remove(tenant);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}