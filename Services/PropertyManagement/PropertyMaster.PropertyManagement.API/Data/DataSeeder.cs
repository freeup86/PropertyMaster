using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.PropertyManagement.API.Data
{
    public static class DataSeeder
    {
        public static IHost SeedData(this IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<PropertyMasterApiContext>();

                SeedUsers(context);
                SeedCategories(context);
            }

            return host;
        }

        private static void SeedUsers(PropertyMasterApiContext context)
        {
            if (!context.Users.Any(u => u.Id == Guid.Parse("00000000-0000-0000-0000-000000000001")))
            {
                var user = new User
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    PhoneNumber = "555-123-4567",
                    CreatedDate = DateTime.UtcNow,
                    ModifiedDate = DateTime.UtcNow,
                    LastLoginDate = DateTime.UtcNow,
                    IsActive = true,
                    PreferredCurrency = "USD",
                    TimeZone = "America/New_York"
                };

                context.Users.Add(user);
                context.SaveChanges();
            }
        }

        private static void SeedCategories(PropertyMasterApiContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new[]
                {
                    new Category 
                    { 
                        Id = Guid.NewGuid(), 
                        Name = "Rent", 
                        Type = "Income", 
                        IsTaxDeductible = false,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow
                    },
                    new Category 
                    { 
                        Id = Guid.NewGuid(), 
                        Name = "Mortgage", 
                        Type = "Expense", 
                        IsTaxDeductible = true,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow
                    },
                    new Category 
                    { 
                        Id = Guid.NewGuid(), 
                        Name = "Property Tax", 
                        Type = "Expense", 
                        IsTaxDeductible = true,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow
                    },
                    new Category 
                    { 
                        Id = Guid.NewGuid(), 
                        Name = "Insurance", 
                        Type = "Expense", 
                        IsTaxDeductible = true,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow
                    },
                    new Category 
                    { 
                        Id = Guid.NewGuid(), 
                        Name = "Maintenance", 
                        Type = "Expense", 
                        IsTaxDeductible = true,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow
                    }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }
    }
}