using System;

namespace PropertyMaster.Models.DTOs
{
    public class TenantDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? LeaseStartDate { get; set; }
        public DateTime? LeaseEndDate { get; set; }
        public Guid UnitId { get; set; }
        public string UnitNumber { get; set; }
        public Guid PropertyId { get; set; }
        public string PropertyName { get; set; }
    }
}