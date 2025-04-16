using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using AutoMapper;

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<UserManagementController> _logger;

        public UserManagementController(
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            ILogger<UserManagementController> logger,
            IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
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

        [Authorize(Roles = "Admin")]
        [HttpPost("create-admin")]
        public async Task<ActionResult<UserDto>> CreateAdminUser([FromBody] CreateUserDto registerDto)
        {
            try 
            {
                // Check if an admin user with this email already exists
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "A user with this email already exists." });
                }

                var adminUser = new ApplicationUser 
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    UserName = registerDto.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    IsActive = true,
                    Role = UserRole.Admin
                };

                var result = await _userManager.CreateAsync(adminUser, registerDto.Password);
                
                if (!result.Succeeded)
                {
                    return BadRequest(new { 
                        message = "Admin user creation failed", 
                        errors = result.Errors 
                    });
                }

                // Optionally log the admin user creation
                _logger.LogInformation($"Admin user created: {adminUser.Email}");

                return Ok(_mapper.Map<UserDto>(adminUser));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating admin user");
                return StatusCode(500, new { message = "An error occurred while creating the admin user" });
            }
        }

        [HttpPost("promote-to-admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> PromoteUserToAdmin(string userId)
        {
            try 
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                user.Role = UserRole.Admin;

                var result = await _userManager.UpdateAsync(user);
                
                if (!result.Succeeded)
                {
                    return BadRequest(new { 
                        message = "Failed to promote user to admin", 
                        errors = result.Errors 
                    });
                }

                _logger.LogInformation($"User promoted to admin: {user.Email}");

                return Ok(_mapper.Map<UserDto>(user));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error promoting user to admin");
                return StatusCode(500, new { message = "An error occurred while promoting the user" });
            }
        }
    }
}