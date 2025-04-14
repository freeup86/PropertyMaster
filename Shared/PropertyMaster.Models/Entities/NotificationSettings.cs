// Shared/PropertyMaster.Models/Entities/NotificationSettings.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace PropertyMaster.Models.Entities
{
    public class NotificationSettings : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }
        
        public bool LeaseExpirationReminders { get; set; } = true;
        
        public bool RentDueReminders { get; set; } = true;
        
        public bool MaintenanceReminders { get; set; } = true;
        
        public int AdvanceNoticeDays { get; set; } = 30;
        
        // Navigation property
        public virtual ApplicationUser User { get; set; }
    }
}