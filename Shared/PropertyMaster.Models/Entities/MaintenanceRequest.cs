using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PropertyMaster.Models.Entities
{
    public class MaintenanceRequest : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UnitId { get; set; }
        public Unit Unit { get; set; }

        public Guid? TenantId { get; set; }
        public Tenant Tenant { get; set; }

        [Required]
        public Guid PropertyId { get; set; }
        public Property Property { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        [Required]
        [MaxLength(100)]
        public string Category { get; set; }

        [Required]
        [MaxLength(50)]
        public string Priority { get; set; }

        [MaxLength(255)]
        public string AssignedTo { get; set; }

        public string Notes { get; set; }
    }
}