// Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Services/Interfaces/INotificationService.cs
using System.Threading.Tasks;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendLeaseExpirationRemindersAsync();
        Task SendMaintenanceStatusUpdatesAsync();
        Task SendRentDueRemindersAsync();
    }
}