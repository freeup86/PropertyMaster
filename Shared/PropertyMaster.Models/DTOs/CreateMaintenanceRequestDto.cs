using System;
  using System.ComponentModel.DataAnnotations;

  namespace PropertyMaster.Models.DTOs
  {
      public class CreateMaintenanceRequestDto
      {
          [Required]
          public Guid UnitId { get; set; }

          public Guid? TenantId { get; set; }

          [Required]
          public Guid PropertyId { get; set; }

          [Required]
          public DateTime RequestDate { get; set; }

          [Required]
          [MaxLength(1000)]
          public string Description { get; set; }

          [Required]
          [MaxLength(50)]
          public string Category { get; set; }

          [Required]
          [MaxLength(50)]
          public string Priority { get; set; }
      }
  }