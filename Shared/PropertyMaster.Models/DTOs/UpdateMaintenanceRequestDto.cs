using System;
  using System.ComponentModel.DataAnnotations;

  namespace PropertyMaster.Models.DTOs
  {
      public class UpdateMaintenanceRequestDto
      {
          [MaxLength(50)]
          public string Status { get; set; }

          [MaxLength(100)]
          public string Category { get; set; }

          [MaxLength(50)]
          public string Priority { get; set; }

          [MaxLength(255)]
          public string AssignedTo { get; set; }

          public string Notes { get; set; }
      }
  }