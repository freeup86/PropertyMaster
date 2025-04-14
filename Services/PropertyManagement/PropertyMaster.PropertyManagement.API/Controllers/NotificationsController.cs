// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Controllers/NotificationsController.cs
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;
using System.Security.Claims; // Add this for claims

namespace PropertyMaster.PropertyManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(
            INotificationService notificationService,
            IEmailSender emailSender,
            ILogger<NotificationsController> logger)
        {
            _notificationService = notificationService;
            _emailSender = emailSender;
            _logger = logger;
        }

        [HttpPost("test")]
        public async Task<IActionResult> SendTestNotification([FromBody] TestNotificationRequest request)
        {
            try
            {
                // Validate email
                if (string.IsNullOrEmpty(request.Email))
                    return BadRequest("Email is required");

                string subject = "Test Notification";
                string message = "<html><body><h2>Test Notification</h2><p>This is a test notification from your Property Management System.</p></body></html>";

                await _emailSender.SendEmailAsync(request.Email, subject, message);

                return Ok(new { success = true, message = "Test notification sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending test notification");
                return StatusCode(500, "An error occurred while sending test notification");
            }
        }

        [HttpGet("settings")]
        public async Task<ActionResult<NotificationSettingsDto>> GetSettings()
        {
            try
            {
                var userId = GetCurrentUserId();
                var settings = await _notificationService.GetNotificationSettingsAsync(userId);
                
                if (settings == null)
                {
                    // Create default settings if none exists
                    settings = await _notificationService.CreateDefaultSettingsAsync(userId);
                }
                
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notification settings");
                return StatusCode(500, "An error occurred while retrieving notification settings");
            }
        }

        [HttpPut("settings")]
        public async Task<ActionResult<NotificationSettingsDto>> UpdateSettings(UpdateNotificationSettingsDto settingsDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var settings = await _notificationService.UpdateNotificationSettingsAsync(userId, settingsDto);
                
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating notification settings");
                return StatusCode(500, "An error occurred while updating notification settings");
            }
        }

        [HttpGet("run-scheduled")]
        [AllowAnonymous] // This endpoint will be called by a scheduled task
        public async Task<IActionResult> RunScheduledNotifications([FromQuery] string apiKey)
        {
            try
            {
                // Validate API key (should match a secure key stored in configuration)
                // This is a simple security measure to prevent unauthorized access
                if (apiKey != "YOUR_SECURE_API_KEY")
                    return Unauthorized();

                await _notificationService.SendLeaseExpirationRemindersAsync();
                await _notificationService.SendRentDueRemindersAsync();
                await _notificationService.SendMaintenanceStatusUpdatesAsync();

                return Ok(new { success = true, message = "Scheduled notifications processed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running scheduled notifications");
                return StatusCode(500, "An error occurred while running scheduled notifications");
            }
        }

        // Add this method to get the current user ID from the JWT token
        private Guid GetCurrentUserId()
        {
            // Retrieve the User ID claim, which was added during token generation in AuthController
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                // This should ideally not happen if the [Authorize] attribute is working correctly
                // and the token was generated properly, but good to handle defensively.
                _logger.LogError("User ID claim (NameIdentifier) is missing or invalid in the token.");
                // Throwing an exception might be too harsh, depending on requirements.
                // Returning Guid.Empty or throwing might be options.
                // For now, we throw to indicate a serious issue with auth context.
                throw new InvalidOperationException("User ID not found or invalid in token claims.");
            }
            return userId;
        }
    }

    public class TestNotificationRequest
    {
        public string Email { get; set; }
        public string Type { get; set; }
    }
}