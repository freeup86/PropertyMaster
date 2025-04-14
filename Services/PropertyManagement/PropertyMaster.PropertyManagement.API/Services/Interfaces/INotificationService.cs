// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Services/Interfaces/INotificationService.cs
using System.Threading.Tasks;
using PropertyMaster.Models.DTOs;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendLeaseExpirationRemindersAsync();
        Task SendMaintenanceStatusUpdatesAsync();
        Task SendRentDueRemindersAsync();
        // Add these methods to your INotificationService interface
        Task<NotificationSettingsDto> GetNotificationSettingsAsync(Guid userId);
        Task<NotificationSettingsDto> CreateDefaultSettingsAsync(Guid userId);
        Task<NotificationSettingsDto> UpdateNotificationSettingsAsync(Guid userId, UpdateNotificationSettingsDto settingsDto);
    }
}