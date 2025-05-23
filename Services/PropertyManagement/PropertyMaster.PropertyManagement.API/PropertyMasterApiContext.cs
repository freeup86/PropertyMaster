using Microsoft.EntityFrameworkCore;
using PropertyMaster.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;


namespace PropertyMaster.PropertyManagement.API
{
    public class PropertyMasterApiContext : DbContext
    {
        public PropertyMasterApiContext(DbContextOptions<PropertyMasterApiContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Represents the collection of entries in the database.
        /// </summary>
        public DbSet<Property> Properties { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
        public DbSet<NotificationSettings> NotificationSettings { get; set; }
        public DbSet<UnitImage> UnitImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

             modelBuilder.Entity<UnitImage>()
                .HasOne(ui => ui.Unit)
                .WithMany(u => u.Images)
                .HasForeignKey(ui => ui.UnitId)
                .OnDelete(DeleteBehavior.Cascade);

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

            modelBuilder.Entity<Document>()
                .HasOne(d => d.Property)
                .WithMany()
                .HasForeignKey(d => d.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Unit)
                .WithMany()
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.NoAction);
                
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Tenant)
                .WithMany()
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<NotificationSettings>()
                .HasOne(ns => ns.User)
                .WithOne() // Assuming one-to-one relationship
                .HasForeignKey<NotificationSettings>(ns => ns.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}