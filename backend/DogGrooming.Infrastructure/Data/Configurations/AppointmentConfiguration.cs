using DogGrooming.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DogGrooming.Infrastructure.Data.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("Appointments");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.ScheduledTime).IsRequired();
        builder.Property(a => a.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        builder.Property(a => a.FinalPrice).HasColumnType("decimal(10,2)");

        builder.HasOne(a => a.HaircutType)
            .WithMany(h => h.Appointments)
            .HasForeignKey(a => a.HaircutTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.ScheduledTime);
        builder.HasIndex(a => a.UserId);
    }
}
