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
      public class MaintenanceRequestService : IMaintenanceRequestService
      {
          private readonly PropertyMasterApiContext _context;
          private readonly IMapper _mapper;
          private readonly ILogger<MaintenanceRequestService> _logger;

          public MaintenanceRequestService(
              PropertyMasterApiContext context,
              IMapper mapper,
              ILogger<MaintenanceRequestService> logger)
          {
              _context = context;
              _mapper = mapper;
              _logger = logger;
          }

          public async Task<IEnumerable<MaintenanceRequestDto>> GetMaintenanceRequestsByPropertyIdAsync(Guid propertyId)
          {
              var requests = await _context.MaintenanceRequests
                  .Include(r => r.Unit)
                  .Include(r => r.Tenant)
                  .Include(r => r.Property)
                  .Where(r => r.PropertyId == propertyId)
                  .ToListAsync();

              return _mapper.Map<IEnumerable<MaintenanceRequestDto>>(requests);
          }

          public async Task<IEnumerable<MaintenanceRequestDto>> GetMaintenanceRequestsByUnitIdAsync(Guid unitId)
          {
              var requests = await _context.MaintenanceRequests
                  .Include(r => r.Unit)
                  .Include(r => r.Tenant)
                  .Include(r => r.Property)
                  .Where(r => r.UnitId == unitId)
                  .ToListAsync();

              return _mapper.Map<IEnumerable<MaintenanceRequestDto>>(requests);
          }

          public async Task<MaintenanceRequestDto> GetMaintenanceRequestByIdAsync(Guid id)
          {
              var request = await _context.MaintenanceRequests
                  .Include(r => r.Unit)
                  .Include(r => r.Tenant)
                  .Include(r => r.Property)
                  .FirstOrDefaultAsync(r => r.Id == id);

              return _mapper.Map<MaintenanceRequestDto>(request);
          }

          public async Task<MaintenanceRequestDto> CreateMaintenanceRequestAsync(CreateMaintenanceRequestDto requestDto)
          {
              var request = _mapper.Map<MaintenanceRequest>(requestDto);
              request.Id = Guid.NewGuid();
              request.Status = "Open"; // Default status
              request.CreatedDate = DateTime.UtcNow;
              request.ModifiedDate = DateTime.UtcNow;

              _context.MaintenanceRequests.Add(request);
              await _context.SaveChangesAsync();

              // Load navigation properties for DTO mapping
              await _context.Entry(request).Reference(r => r.Unit).LoadAsync();
              await _context.Entry(request).Reference(r => r.Tenant).LoadAsync();
              await _context.Entry(request).Reference(r => r.Property).LoadAsync();

              return _mapper.Map<MaintenanceRequestDto>(request);
          }

          public async Task<MaintenanceRequestDto> UpdateMaintenanceRequestAsync(Guid id, UpdateMaintenanceRequestDto requestDto)
          {
              var request = await _context.MaintenanceRequests.FindAsync(id);
              if (request == null)
                  return null;

              _mapper.Map(requestDto, request);
              request.ModifiedDate = DateTime.UtcNow;

              _context.MaintenanceRequests.Update(request);
              await _context.SaveChangesAsync();

              // Load navigation properties for DTO mapping
              await _context.Entry(request).Reference(r => r.Unit).LoadAsync();
              await _context.Entry(request).Reference(r => r.Tenant).LoadAsync();
              await _context.Entry(request).Reference(r => r.Property).LoadAsync();

              return _mapper.Map<MaintenanceRequestDto>(request);
          }

          public async Task<bool> DeleteMaintenanceRequestAsync(Guid id)
          {
              var request = await _context.MaintenanceRequests.FindAsync(id);
              if (request == null)
                  return false;

              _context.MaintenanceRequests.Remove(request);
              await _context.SaveChangesAsync();

              return true;
          }

          public async Task<IEnumerable<MaintenanceRequestDto>> GetAllMaintenanceRequestsAsync()
          {
                try
                {
                    var requests = await _context.MaintenanceRequests
                        .Include(r => r.Unit)
                        .Include(r => r.Tenant)
                        .Include(r => r.Property)
                        .ToListAsync();

                    return _mapper.Map<IEnumerable<MaintenanceRequestDto>>(requests);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error retrieving maintenance requests");
                    // Return an empty list instead of propagating the exception
                    return new List<MaintenanceRequestDto>();
                }
          }
      }
  }