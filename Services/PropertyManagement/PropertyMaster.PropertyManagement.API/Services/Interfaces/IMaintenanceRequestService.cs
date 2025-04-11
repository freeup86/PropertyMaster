using System;
  using System.Collections.Generic;
  using System.Threading.Tasks;
  using PropertyMaster.Models.DTOs;

  namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
  {
      public interface IMaintenanceRequestService
      {
          Task<IEnumerable<MaintenanceRequestDto>> GetMaintenanceRequestsByPropertyIdAsync(Guid propertyId);
          Task<IEnumerable<MaintenanceRequestDto>> GetMaintenanceRequestsByUnitIdAsync(Guid unitId);
          Task<MaintenanceRequestDto> GetMaintenanceRequestByIdAsync(Guid id);
          Task<MaintenanceRequestDto> CreateMaintenanceRequestAsync(CreateMaintenanceRequestDto requestDto);
          Task<MaintenanceRequestDto> UpdateMaintenanceRequestAsync(Guid id, UpdateMaintenanceRequestDto requestDto);
          Task<bool> DeleteMaintenanceRequestAsync(Guid id);
          Task<IEnumerable<MaintenanceRequestDto>> GetAllMaintenanceRequestsAsync();
      }
  }