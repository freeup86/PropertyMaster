using Microsoft.EntityFrameworkCore;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.Data
{
    public class PropertyMasterContext : DbContext
    {
        public PropertyMasterContext(DbContextOptions<PropertyMasterContext> options)
            : base(options)
        {
        }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships
            modelBuilder.Entity<Property>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Unit>()
                .HasOne(u => u.Property)
                .WithMany(p => p.Units)
                .HasForeignKey(u => u.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Property)
                .WithMany(p => p.Transactions)
                .HasForeignKey(t => t.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}