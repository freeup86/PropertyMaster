// File: PropertyMaster/Services/PropertyManagement/PropertyMaster.PropertyManagement.API/Controllers/CalendarController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PropertyMaster.Models.DTOs;         // Our new DTO
using PropertyMaster.Models.Entities;     // Database entities
using PropertyMaster.PropertyManagement.API; // DbContext namespace
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;       // For logging errors

[ApiController]
[Route("api/[controller]")] // Sets the route to /api/calendar
public class CalendarController : ControllerBase
{
    private readonly PropertyMasterApiContext _context;
    private readonly ILogger<CalendarController> _logger;

    // Inject the DbContext and Logger via the constructor
    public CalendarController(PropertyMasterApiContext context, ILogger<CalendarController> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet] // Handles GET requests to /api/calendar
    [ProducesResponseType(typeof(IEnumerable<CalendarEventDto>), 200)] // Success
    [ProducesResponseType(500)] // Internal Server Error
    public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetCalendarEvents(
        [FromQuery] DateTime? startDate, // Optional query parameter for start date
        [FromQuery] DateTime? endDate)   // Optional query parameter for end date
    {
        try
        {
            _logger.LogInformation("Fetching calendar events from {StartDate} to {EndDate}", startDate, endDate);

            var events = new List<CalendarEventDto>();
            var queryStartDate = startDate ?? DateTime.MinValue; // Default if not provided
            // Default to end of day if only date is provided, or MaxValue if no end date
            var queryEndDate = endDate.HasValue ? endDate.Value.Date.AddDays(1).AddTicks(-1) : DateTime.MaxValue;

            // --- 1. Lease Renewals ---
            // Get tenants whose lease end date falls within the query range
            var leaseRenewals = await _context.Tenants
                .Include(t => t.Unit) // Include Unit to get PropertyId and UnitNumber if needed
                .Where(t => t.LeaseEndDate.HasValue && t.LeaseEndDate.Value >= queryStartDate && t.LeaseEndDate.Value <= queryEndDate)
                .Select(t => new CalendarEventDto {
                    Id = t.Id, // Use TenantId as a unique ID for this event
                    Title = $"Lease Renewal: {t.FirstName} {t.LastName}" + (t.Unit != null ? $" (Unit {t.Unit.UnitNumber})" : ""),
                    Start = t.LeaseEndDate.Value,
                    End = t.LeaseEndDate.Value, // Same day event
                    EventType = "LeaseRenewal",
                    Color = "orange", // Example color
                    RelatedEntityId = t.Id,
                    // UnitId = t.UnitId,
                    // PropertyId = t.Unit?.PropertyId
                })
                .ToListAsync(); // Execute query asynchronously
            events.AddRange(leaseRenewals);
            _logger.LogInformation("Found {Count} lease renewal events.", leaseRenewals.Count);

            // --- 2. Rent Collection ---
            // Get 'Rent' transactions with a NextDueDate in the range
            // Modify this logic if you use 'Date' instead of 'NextDueDate' for non-recurring rent
            var rentPayments = await _context.Transactions
                .Include(tr => tr.Unit) // Include Unit for context in title
                .Where(tr => tr.TransactionCategory == "Rent" &&
                             tr.NextDueDate.HasValue &&
                             tr.NextDueDate.Value >= queryStartDate &&
                             tr.NextDueDate.Value <= queryEndDate &&
                             !tr.IsPaid) // Optional: Only show unpaid rent due dates
                .Select(tr => new CalendarEventDto {
                    Id = tr.Id, // Use TransactionId
                    Title = $"Rent Due: {tr.Amount:C}" + (tr.Unit != null ? $" (Unit {tr.Unit.UnitNumber})" : ""),
                    Start = tr.NextDueDate.Value,
                    End = tr.NextDueDate.Value,
                    EventType = "Rent",
                    Color = "blue",
                    RelatedEntityId = tr.Id,
                    // UnitId = tr.UnitId,
                    // PropertyId = tr.PropertyId
                })
                .ToListAsync();
            events.AddRange(rentPayments);
            _logger.LogInformation("Found {Count} rent collection events.", rentPayments.Count);

            // --- 3. Maintenance Events ---
            // Get maintenance requests based on RequestDate or a potential 'ScheduledDate'
            // Adjust the date field (mr.RequestDate) if you add a dedicated schedule date
            var maintenanceRequests = await _context.MaintenanceRequests
                .Include(mr => mr.Unit) // Include Unit for context
                .Where(mr => mr.RequestDate >= queryStartDate && mr.RequestDate <= queryEndDate)
                // Add status filter if needed (e.g., only show 'Scheduled' or 'Open' requests)
                // .Where(mr => mr.Status == "Open" || mr.Status == "Scheduled")
                .Select(mr => new CalendarEventDto {
                    Id = mr.Id, // Use MaintenanceRequestId
                    Title = $"Maint: {mr.Category}" + (mr.Unit != null ? $" (Unit {mr.Unit.UnitNumber})" : ""),
                    Start = mr.RequestDate, // Or use a different date like ScheduledDate if available
                    End = mr.RequestDate,   // Or use a different date
                    EventType = "Maintenance",
                    Color = "red",
                    RelatedEntityId = mr.Id,
                    // UnitId = mr.UnitId,
                    // PropertyId = mr.PropertyId,
                    // Status = mr.Status
                })
                .ToListAsync();
            events.AddRange(maintenanceRequests);
            _logger.LogInformation("Found {Count} maintenance request events.", maintenanceRequests.Count);


            // Return the combined list, ordered by start date
            return Ok(events.OrderBy(e => e.Start));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching calendar events for range {StartDate} to {EndDate}", startDate, endDate);
            // Return a generic 500 error to the client
            return StatusCode(500, "An error occurred while fetching calendar events.");
        }
    }
}