using EVM.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EVM.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Activity> Activities => Set<Activity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>(entity =>
        {
            entity.ToTable("Projects");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).HasMaxLength(200).IsRequired();
            entity.Property(p => p.Description).HasMaxLength(1000);
            entity.HasIndex(p => p.Name).IsUnique();
        });

        modelBuilder.Entity<Activity>(entity =>
        {
            entity.ToTable("Activities");
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Name).HasMaxLength(200).IsRequired();
            entity.Property(a => a.Bac).HasColumnType("decimal(18,2)");
            entity.Property(a => a.PlannedPercent).HasColumnType("decimal(5,2)");
            entity.Property(a => a.ActualPercent).HasColumnType("decimal(5,2)");
            entity.Property(a => a.ActualCost).HasColumnType("decimal(18,2)");

            entity.HasOne(a => a.Project)
                  .WithMany(p => p.Activities)
                  .HasForeignKey(a => a.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}