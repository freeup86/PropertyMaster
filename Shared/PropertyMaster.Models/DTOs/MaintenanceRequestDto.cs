using System;

  namespace PropertyMaster.Models.DTOs
  {
      public class MaintenanceRequestDto
      {
          public Guid Id { get; set; }
          public Guid UnitId { get; set; }
          public Guid? TenantId { get; set; }
          public Guid PropertyId { get; set; }
          public DateTime RequestDate { get; set; }
          public string Description { get; set; }
          public string Status { get; set; }
          public string Category { get; set; }
          public string Priority { get; set; }
          public string AssignedTo { get; set; }
          public string Notes { get; set; }
          public DateTime CreatedDate { get; set; }
          public DateTime ModifiedDate { get; set; }

          // Navigation properties for display
          public string UnitNumber { get; set; }
          public string TenantName { get; set; }
          public string PropertyName { get; set; }
      }
  }