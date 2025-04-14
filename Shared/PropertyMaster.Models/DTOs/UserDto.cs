using System;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Models.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateUserRoleDto
    {
        public string UserId { get; set; }
        public UserRole Role { get; set; }
    }
}