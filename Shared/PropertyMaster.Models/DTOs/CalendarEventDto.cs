// File: PropertyMaster/Shared/PropertyMaster.Models/DTOs/CalendarEventDto.cs
using System;

namespace PropertyMaster.Models.DTOs
{
    public class CalendarEventDto
    {
        // A unique identifier for the calendar event itself (can be the related entity's ID)
        public Guid Id { get; set; }

        // Text displayed on the calendar event (e.g., "Rent Due: Unit 101")
        public string Title { get; set; }

        // The start date/time of the event (required by most calendar libraries)
        public DateTime Start { get; set; }

        // The end date/time of the event (optional, can be same as start for single-day events)
        public DateTime? End { get; set; }

        // Type of event for potential filtering or styling (e.g., "Rent", "LeaseRenewal", "Maintenance")
        public string EventType { get; set; }

        // Optional color coding for different event types
        public string Color { get; set; }

        // The ID of the original entity (Tenant, Transaction, MaintenanceRequest) this event relates to
        public Guid? RelatedEntityId { get; set; }

        // Add other useful info if needed, e.g.:
        public Guid? PropertyId { get; set; }
        public Guid? UnitId { get; set; }
        public string Status { get; set; } // e.g., for Maintenance Requests
    }
}