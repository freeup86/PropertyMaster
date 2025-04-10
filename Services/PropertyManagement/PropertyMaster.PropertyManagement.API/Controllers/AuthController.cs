using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // For IConfiguration
using Microsoft.Extensions.Logging;     // For ILogger
using Microsoft.IdentityModel.Tokens;
using PropertyMaster.Models.Entities; // Your ApplicationUser namespace
using PropertyMaster.PropertyManagement.API.Services.Interfaces; // For IEmailSender
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // For validation attributes
using System.IdentityModel.Tokens.Jwt;
using System.Linq; // For error selection
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web; // For HttpUtility.UrlEncode / UrlDecode
using Microsoft.AspNetCore.Http; // For StatusCodes

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Route("api/[controller]")] // Route will be /api/auth
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly IEmailSender _emailSender;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ILogger<AuthController> logger,
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _emailSender = emailSender;
        }

        // --- DTOs for Auth ---
        // Using records for simpler DTOs
        public record RegisterDto([Required][MaxLength(100)] string FirstName, [Required][MaxLength(100)] string LastName, [Required][EmailAddress] string Email, [Required] string Password);
        public record LoginDto([Required][EmailAddress] string Email, [Required] string Password);
        public record AuthResponseDto(string Token, DateTime Expiration, string Email, Guid UserId, string FirstName, string LastName);
        public record ForgotPasswordDto([Required][EmailAddress] string Email);

        // --- ResetPasswordDto as a Class for proper validation attribute placement ---
        public class ResetPasswordDto
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Token { get; set; }

            [Required]
            [MinLength(8)] // Example: Enforce minimum password length
            public string Password { get; set; }

            [Required]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")] // Correct placement
            public string ConfirmPassword { get; set; }
        }


        // --- Registration Endpoint ---
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
                if (userExists != null) return BadRequest(new { message = "Email address may already be in use." });

                var user = new ApplicationUser {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    UserName = registerDto.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(user, registerDto.Password);
                if (!result.Succeeded)
                {
                    _logger.LogWarning("User registration failed for {Email}. Errors: {Errors}", registerDto.Email, result.Errors.Select(e => e.Description));
                    return BadRequest(new { message = "User creation failed. Please check details and try again.", errors = result.Errors });
                }
                _logger.LogInformation("User {Email} registered successfully.", registerDto.Email);
                return Ok(new { message = "User created successfully! Please log in." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during registration for email {Email}", registerDto.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An internal error occurred." });
            }
        }

        // --- Login Endpoint ---
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
             if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
                {
                    if (!user.IsActive) return Unauthorized(new { message = "User account is inactive." });

                    var authClaims = new List<Claim> {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim("userId", user.Id.ToString()),
                        new Claim("firstName", user.FirstName ?? ""),
                        new Claim("lastName", user.LastName ?? ""),
                    };
                    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var tokenValidityInMinutes = _configuration.GetValue<int>("Jwt:DurationInMinutes", 60);
                    var tokenExpiration = DateTime.UtcNow.AddMinutes(tokenValidityInMinutes);
                    var tokenDescriptor = new SecurityTokenDescriptor {
                         Subject = new ClaimsIdentity(authClaims),
                         Expires = tokenExpiration,
                         Issuer = _configuration["Jwt:Issuer"],
                         Audience = _configuration["Jwt:Audience"],
                         SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var jwtToken = tokenHandler.WriteToken(token);

                    _logger.LogInformation("User {Email} logged in successfully.", loginDto.Email);
                    user.LastLoginDate = DateTime.UtcNow;
                    await _userManager.UpdateAsync(user);

                    return Ok(new AuthResponseDto(jwtToken, token.ValidTo, user.Email, user.Id, user.FirstName, user.LastName));
                }
                _logger.LogWarning("Login attempt failed for user {Email}.", loginDto.Email);
                return Unauthorized(new { message = "Invalid email or password." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during login for email {Email}", loginDto.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An internal error occurred." });
            }
        }

        // --- Forgot Password Endpoint ---
        [HttpPost("forgot-password")]
        [ProducesResponseType(StatusCodes.Status200OK)] // Always return OK for security
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    _logger.LogInformation("Password reset requested for non-existent email {Email}", forgotPasswordDto.Email);
                    return Ok(new { message = "If an account with this email exists, a password reset link has been sent." });
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var encodedToken = HttpUtility.UrlEncode(token);

                var frontendBaseUrl = _configuration["FrontendBaseUrl"];
                if (string.IsNullOrEmpty(frontendBaseUrl))
                {
                     _logger.LogError("FrontendBaseUrl configuration is missing in appsettings.json");
                     return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server configuration error enabling password reset." });
                }
                var resetLink = $"{frontendBaseUrl}/reset-password?token={encodedToken}&email={HttpUtility.UrlEncode(user.Email)}";

                _logger.LogInformation("Password reset link generated for {Email}. Sending email...", user.Email);

                var subject = "Reset Your PropertyMaster Password";
                var message = $"<html><body>Hi {user.FirstName},<br/><br/>" +
                              $"Please click the link below to reset your password. This link is valid for a limited time.<br/><br/>" +
                              $"<a href='{resetLink}'>Reset Your Password</a><br/><br/>" +
                              $"If you did not request a password reset, please ignore this email.<br/><br/>" +
                              $"Thanks,<br/>The PropertyMaster Team</body></html>";

                await _emailSender.SendEmailAsync(user.Email, subject, message);

                _logger.LogInformation("Password reset email sending initiated for {Email}.", user.Email);
                return Ok(new { message = "If an account with this email exists, a password reset link has been sent." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during forgot password for email {Email}", forgotPasswordDto.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An internal error occurred while processing your request." });
            }
        }

        // --- Reset Password Endpoint ---
        [HttpPost("reset-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetDto) // Uses the class DTO now
        {
            // ModelState validation now works correctly for the class DTO with attributes
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = await _userManager.FindByEmailAsync(resetDto.Email);
                if (user == null)
                {
                    _logger.LogWarning("Password reset attempt for non-existent email {Email}", resetDto.Email);
                    return BadRequest(new { message = "Password reset failed. Please try the 'forgot password' process again." });
                }

                var decodedToken = resetDto.Token.Replace(' ', '+'); // Basic handling for potential encoding issues

                var result = await _userManager.ResetPasswordAsync(user, decodedToken, resetDto.Password);

                if (!result.Succeeded)
                {
                    _logger.LogWarning("Password reset failed for user {Email}. Errors: {Errors}", resetDto.Email, result.Errors.Select(e => e.Description));
                     var errorMessages = result.Errors.Select(e => e.Description).ToList();
                     if (errorMessages.Any(m => m.Contains("Invalid token"))) {
                         return BadRequest(new { message = "Password reset failed. The reset link may be invalid or expired. Please request a new one.", errors = errorMessages });
                     } else {
                          return BadRequest(new { message = "Password reset failed. Please check your new password and try again.", errors = errorMessages });
                     }
                }

                _logger.LogInformation("Password reset successfully for user {Email}", resetDto.Email);
                return Ok(new { message = "Password has been reset successfully. Please log in with your new password." });

            }
            catch (Exception ex)
            {
                 _logger.LogError(ex, "An unexpected error occurred during password reset for email {Email}", resetDto.Email);
                 return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An internal error occurred." });
            }
        }
    }
}