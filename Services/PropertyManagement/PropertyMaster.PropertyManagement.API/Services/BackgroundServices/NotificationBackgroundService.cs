// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Services/BackgroundServices/NotificationBackgroundService.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Services.BackgroundServices
{
    public class NotificationBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationBackgroundService> _logger;
        private readonly TimeSpan _period = TimeSpan.FromHours(24); // Run once a day

        public NotificationBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<NotificationBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Notification Background Service is starting.");

            using var timer = new PeriodicTimer(_period);

            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                await ProcessNotificationsAsync(stoppingToken);
            }
        }

        private async Task ProcessNotificationsAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Running scheduled notifications at: {time}", DateTimeOffset.Now);

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                await notificationService.SendLeaseExpirationRemindersAsync();
                await notificationService.SendRentDueRemindersAsync();
                await notificationService.SendMaintenanceStatusUpdatesAsync();

                _logger.LogInformation("Scheduled notifications completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running scheduled notifications");
            }
        }
    }
}