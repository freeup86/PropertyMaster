// Shared/PropertyMaster.Models/DTOs/NotificationSettingsDto.cs
using System;

namespace PropertyMaster.Models.DTOs
{
    public class NotificationSettingsDto
    {
        public Guid Id { get; set; }
        public bool LeaseExpirationReminders { get; set; }
        public bool RentDueReminders { get; set; }
        public bool MaintenanceReminders { get; set; }
        public int AdvanceNoticeDays { get; set; }
    }

    public class UpdateNotificationSettingsDto
    {
        public bool LeaseExpirationReminders { get; set; }
        public bool RentDueReminders { get; set; }
        public bool MaintenanceReminders { get; set; }
        public int AdvanceNoticeDays { get; set; }
    }
}