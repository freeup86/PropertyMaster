// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Services/Implementations/NotificationService.cs
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
    public class NotificationService : INotificationService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<NotificationService> _logger;
        private readonly IMapper _mapper;

        public NotificationService(
            PropertyMasterApiContext context,
            IEmailSender emailSender,
            ILogger<NotificationService> logger,
            IMapper mapper)
        {
            _context = context;
            _emailSender = emailSender;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<NotificationSettingsDto> GetNotificationSettingsAsync(Guid userId)
        {
            var settings = await _context.NotificationSettings
                .FirstOrDefaultAsync(ns => ns.UserId == userId);
            
            return _mapper.Map<NotificationSettingsDto>(settings);
        }

        public async Task<NotificationSettingsDto> CreateDefaultSettingsAsync(Guid userId)
        {
            var settings = new NotificationSettings
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LeaseExpirationReminders = true,
                RentDueReminders = true,
                MaintenanceReminders = true,
                AdvanceNoticeDays = 30,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };
            
            _context.NotificationSettings.Add(settings);
            await _context.SaveChangesAsync();
            
            return _mapper.Map<NotificationSettingsDto>(settings);
        }

        public async Task<NotificationSettingsDto> UpdateNotificationSettingsAsync(Guid userId, UpdateNotificationSettingsDto settingsDto)
        {
            var settings = await _context.NotificationSettings
                .FirstOrDefaultAsync(ns => ns.UserId == userId);
            
            if (settings == null)
            {
                // Create new settings if none exists
                return await CreateDefaultSettingsAsync(userId);
            }
            
            // Update settings
            settings.LeaseExpirationReminders = settingsDto.LeaseExpirationReminders;
            settings.RentDueReminders = settingsDto.RentDueReminders;
            settings.MaintenanceReminders = settingsDto.MaintenanceReminders;
            settings.AdvanceNoticeDays = settingsDto.AdvanceNoticeDays;
            settings.ModifiedDate = DateTime.UtcNow;
            
            _context.NotificationSettings.Update(settings);
            await _context.SaveChangesAsync();
            
            return _mapper.Map<NotificationSettingsDto>(settings);
        }

        // Existing methods
        public async Task SendLeaseExpirationRemindersAsync()
        {
            try
            {
                // Find tenants with leases expiring in the next 30 days
                var today = DateTime.UtcNow.Date;
                var thirtyDaysFromNow = today.AddDays(30);
                
                var tenantsWithExpiringLeases = await _context.Tenants
                    .Include(t => t.Unit)
                    .ThenInclude(u => u.Property)
                    .Where(t => t.LeaseEndDate.HasValue && 
                            t.LeaseEndDate.Value.Date <= thirtyDaysFromNow &&
                            t.LeaseEndDate.Value.Date >= today)
                    .ToListAsync();

                foreach (var tenant in tenantsWithExpiringLeases)
                {
                    if (string.IsNullOrEmpty(tenant.Email))
                        continue;

                    var daysRemaining = (tenant.LeaseEndDate.Value.Date - today).Days;
                    var subject = $"Lease Expiration Reminder - {daysRemaining} days remaining";
                    var message = $@"
                        <html>
                        <body>
                            <h2>Lease Expiration Reminder</h2>
                            <p>Dear {tenant.FirstName} {tenant.LastName},</p>
                            <p>This is a friendly reminder that your lease for Unit {tenant.Unit.UnitNumber} at {tenant.Unit.Property.Name} will expire in {daysRemaining} days on {tenant.LeaseEndDate.Value.ToString("MMMM d, yyyy")}.</p>
                            <p>Please contact us if you wish to discuss renewal options.</p>
                            <p>Thank you,<br/>The Property Management Team</p>
                        </body>
                        </html>";

                    await _emailSender.SendEmailAsync(tenant.Email, subject, message);
                    _logger.LogInformation($"Sent lease expiration reminder to {tenant.Email} for lease expiring on {tenant.LeaseEndDate.Value.ToShortDateString()}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending lease expiration reminders");
            }
        }

        public async Task SendMaintenanceStatusUpdatesAsync()
        {
            try
            {
                // Find recently updated maintenance requests within last 24 hours
                var yesterday = DateTime.UtcNow.AddDays(-1);
                
                var updatedRequests = await _context.MaintenanceRequests
                    .Include(r => r.Unit)
                    .Include(r => r.Tenant)
                    .Include(r => r.Property)
                    .Where(r => r.ModifiedDate >= yesterday && r.TenantId.HasValue)
                    .ToListAsync();

                foreach (var request in updatedRequests)
                {
                    if (request.Tenant == null || string.IsNullOrEmpty(request.Tenant.Email))
                        continue;

                    var subject = $"Update on Maintenance Request - {request.Category}";
                    var message = $@"
                        <html>
                        <body>
                            <h2>Maintenance Request Update</h2>
                            <p>Dear {request.Tenant.FirstName} {request.Tenant.LastName},</p>
                            <p>Your maintenance request for {request.Category} in Unit {request.Unit.UnitNumber} has been updated to status: <strong>{request.Status}</strong>.</p>
                            <p>Request Details:</p>
                            <ul>
                                <li>Date Requested: {request.RequestDate.ToString("MMMM d, yyyy")}</li>
                                <li>Category: {request.Category}</li>
                                <li>Priority: {request.Priority}</li>
                                <li>Description: {request.Description}</li>
                            </ul>
                            <p>If you have any questions, please contact the property management.</p>
                            <p>Thank you,<br/>The Property Management Team</p>
                        </body>
                        </html>";

                    await _emailSender.SendEmailAsync(request.Tenant.Email, subject, message);
                    _logger.LogInformation($"Sent maintenance update to {request.Tenant.Email} for request ID {request.Id}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending maintenance status updates");
            }
        }

        public async Task SendRentDueRemindersAsync()
        {
            try
            {
                // Find tenants with active leases to send rent reminders
                // Assuming rent is due on the 1st of each month
                var today = DateTime.UtcNow.Date;
                var firstOfMonth = new DateTime(today.Year, today.Month, 1);
                var fiveDaysBeforeMonthEnd = firstOfMonth.AddMonths(1).AddDays(-5);
                
                // Send reminders 5 days before the end of the month
                if (today == fiveDaysBeforeMonthEnd)
                {
                    var activeTenants = await _context.Tenants
                        .Include(t => t.Unit)
                        .ThenInclude(u => u.Property)
                        .Where(t => t.LeaseStartDate.HasValue && 
                               (!t.LeaseEndDate.HasValue || t.LeaseEndDate.Value.Date >= today))
                        .ToListAsync();

                    foreach (var tenant in activeTenants)
                    {
                        if (string.IsNullOrEmpty(tenant.Email))
                            continue;

                        var subject = "Rent Due Reminder - Payment Due on 1st of Next Month";
                        var nextMonth = firstOfMonth.AddMonths(1);
                        var message = $@"
                            <html>
                            <body>
                                <h2>Rent Due Reminder</h2>
                                <p>Dear {tenant.FirstName} {tenant.LastName},</p>
                                <p>This is a friendly reminder that your rent payment of {formatCurrency(tenant.Unit.MarketRent)} for Unit {tenant.Unit.UnitNumber} at {tenant.Unit.Property.Name} is due on {nextMonth.ToString("MMMM d, yyyy")}.</p>
                                <p>Please ensure your payment is made on time to avoid late fees.</p>
                                <p>Thank you,<br/>The Property Management Team</p>
                            </body>
                            </html>";

                        await _emailSender.SendEmailAsync(tenant.Email, subject, message);
                        _logger.LogInformation($"Sent rent due reminder to {tenant.Email} for rent due on {nextMonth.ToString("MMMM d, yyyy")}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending rent due reminders");
            }
        }

        private string formatCurrency(decimal amount)
        {
            return amount.ToString("C");
        }
    }
}