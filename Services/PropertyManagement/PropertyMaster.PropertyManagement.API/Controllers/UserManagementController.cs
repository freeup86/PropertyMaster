using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;

        public UserManagementController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserDto>> GetUser(Guid userId)
        {
            try
            {
                var user = await _userManagementService.GetUserByIdAsync(userId);
                if (user == null)
                    return NotFound();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            try
            {
                var users = await _userManagementService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("role")]
        public async Task<ActionResult<UserDto>> UpdateUserRole([FromBody] UpdateUserRoleDto updateDto)
        {
            try
            {
                var user = await _userManagementService.UpdateUserRoleAsync(updateDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{userId}/disable")]
        public async Task<ActionResult<UserDto>> DisableUser(Guid userId)
        {
            try
            {
                var user = await _userManagementService.DisableUserAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{userId}/enable")]
        public async Task<ActionResult<UserDto>> EnableUser(Guid userId)
        {
            try
            {
                var user = await _userManagementService.EnableUserAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        
    }
}