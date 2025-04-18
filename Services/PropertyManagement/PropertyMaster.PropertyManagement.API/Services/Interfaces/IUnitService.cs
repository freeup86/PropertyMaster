using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PropertyMaster.Models.DTOs;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface IUnitService
    {
        Task<IEnumerable<UnitDto>> GetUnitsByPropertyIdAsync(Guid propertyId);
        Task<UnitDto> GetUnitByIdAsync(Guid unitId, Guid propertyId);
        Task<UnitDto> CreateUnitAsync(CreateUnitDto unitDto, Guid propertyId);
        Task<UnitDto> UpdateUnitAsync(Guid unitId, UpdateUnitDto unitDto, Guid propertyId);
        Task<bool> DeleteUnitAsync(Guid unitId, Guid propertyId);
        Task<bool> DeleteUnitImageAsync(Guid unitId, Guid propertyId, string imageUrl);
        Task<UnitImageDto> UploadUnitImageAsync(Guid propertyId, Guid unitId, IFormFile image);
        Task<IEnumerable<UnitImageDto>> GetUnitImagesAsync(Guid propertyId, Guid unitId);
    }
}