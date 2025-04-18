using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PropertyMaster.Models.Entities
{
    public class UnitImage : BaseEntity
    {
        [Required]
        public Guid UnitId { get; set; }

        [Required]
        [Column(TypeName = "varbinary(max)")]
        public byte[] ImageData { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; }

        [Required]
        [MaxLength(100)]
        public string ContentType { get; set; }

        // Navigation property
        public virtual Unit Unit { get; set; }
    }
}