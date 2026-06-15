using DogGrooming.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DogGrooming.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<HaircutType> HaircutTypes => Set<HaircutType>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    /// <summary>Read-only projection backed by the <c>vw_AppointmentQueue</c> SQL view.</summary>
    public DbSet<AppointmentQueueItem> AppointmentQueue => Set<AppointmentQueueItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
