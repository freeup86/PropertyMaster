using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PropertyMaster.Models.DTOs;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface ITenantService
    {
        Task<IEnumerable<TenantDto>> GetTenantsByPropertyIdAsync(Guid propertyId);
        Task<IEnumerable<TenantDto>> GetTenantsByUnitIdAsync(Guid unitId);
        Task<TenantDto> GetTenantByIdAsync(Guid tenantId);
        Task<TenantDto> CreateTenantAsync(CreateTenantDto tenantDto);
        Task<TenantDto> UpdateTenantAsync(Guid tenantId, UpdateTenantDto tenantDto);
        Task<bool> DeleteTenantAsync(Guid tenantId);
    }
}