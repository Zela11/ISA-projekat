using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MedSupplyPortal.Domain.Entities;


namespace MedSupplyPortal.Infrastructure.Data;

public class AppDbContext : DbContext
   
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Equipment> Equipments { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Password).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Occupation).HasMaxLength(100);
            entity.Property(e => e.PenaltyPoints).IsRequired();
            entity.Property(e => e.Type).IsRequired();
            entity.Property(e => e.IsFirstLogin).IsRequired();
            // Configure Address as owned entity
            entity.OwnsOne(e => e.Address, a =>
            {
                a.Property(ad => ad.City).HasMaxLength(100).IsRequired();
                a.Property(ad => ad.Country).HasMaxLength(100).IsRequired();
                a.Property(ad => ad.Street).HasMaxLength(255).IsRequired();
                a.Property(ad => ad.Latitude).IsRequired(false);
                a.Property(ad => ad.Longitude).IsRequired(false);
            });
        });
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).HasMaxLength(500);

            entity.OwnsOne(c => c.Address, a =>
            {
                a.Property(ad => ad.City).HasMaxLength(100).IsRequired();
                a.Property(ad => ad.Country).HasMaxLength(100).IsRequired();
                a.Property(ad => ad.Street).HasMaxLength(255).IsRequired();
                a.Property(ad => ad.Latitude).IsRequired(false);
                a.Property(ad => ad.Longitude).IsRequired(false);
            });

            entity.HasMany(c => c.EquipmentList)
                  .WithOne()
                  .HasForeignKey(e => e.CompanyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(c => c.CompanyAdmins)
                  .WithOne()
                  .HasForeignKey(u => u.CompanyId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(c => c.Appointments)
                  .WithOne()
                  .HasForeignKey(a => a.CompanyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsAvailable).IsRequired();
            entity.Property(e => e.Amount).IsRequired();
            entity.Property(e => e.ReservedAmount).IsRequired();
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(a => new { a.CompanyId, a.AdministratorId, a.Slot });
            entity.Property(a => a.UserId).IsRequired(false);
            entity.Property(a => a.Duration).IsRequired();
            entity.Property(a => a.Slot).IsRequired();
            entity.Property(a => a.Status).IsRequired(); 
            entity.Property(a => a.EquipmentId).IsRequired(false); 
            entity.Property(a => a.EquipmentAmount).IsRequired(false);
            entity.Property(a => a.UniqueReservationId).IsRequired(false);
        });

    }
}
