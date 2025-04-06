using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using PropertyMaster.Data;
using System.IO;

namespace PropertyMaster.PropertyManagement.API.Migrations
{
    public class PropertyMasterContextFactory : IDesignTimeDbContextFactory<PropertyMasterContext>
    {
        public PropertyMasterContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<PropertyMasterContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

            return new PropertyMasterContext(optionsBuilder.Options);
        }
    }
}