using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface IUserManagementService
    {
        Task<UserDto> GetUserByIdAsync(Guid userId);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> UpdateUserRoleAsync(UpdateUserRoleDto updateDto);
        Task<UserDto> DisableUserAsync(Guid userId);
        Task<UserDto> EnableUserAsync(Guid userId);
    }
}