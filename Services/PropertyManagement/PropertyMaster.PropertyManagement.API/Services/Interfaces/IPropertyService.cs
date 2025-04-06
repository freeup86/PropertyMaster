using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PropertyMaster.Models.DTOs;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface IPropertyService
    {
        Task<IEnumerable<PropertyDto>> GetPropertiesByUserIdAsync(Guid userId);
        Task<PropertyDto> GetPropertyByIdAsync(Guid propertyId, Guid userId);
        Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto propertyDto, Guid userId);
        Task<PropertyDto> UpdatePropertyAsync(Guid propertyId, UpdatePropertyDto propertyDto, Guid userId);
        Task<bool> DeletePropertyAsync(Guid propertyId, Guid userId);
    }
}