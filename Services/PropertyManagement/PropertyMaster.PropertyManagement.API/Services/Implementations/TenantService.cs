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

            _mapper.Map(tenantDto, tenant);
            tenant.ModifiedDate = DateTime.UtcNow;
            
            _context.Tenants.Update(tenant);
            await _context.SaveChangesAsync();

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