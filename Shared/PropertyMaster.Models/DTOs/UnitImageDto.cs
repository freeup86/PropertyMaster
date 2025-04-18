using System;

namespace PropertyMaster.Models.DTOs
{
    public class UnitImageDto
    {
        public Guid Id { get; set; }
        public Guid UnitId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string Base64ImageData { get; set; }
    }
}