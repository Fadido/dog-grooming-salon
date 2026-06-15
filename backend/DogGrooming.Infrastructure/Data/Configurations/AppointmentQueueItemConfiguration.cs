using DogGrooming.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DogGrooming.Infrastructure.Data.Configurations;

/// <summary>
/// Maps the keyless read model to the <c>vw_AppointmentQueue</c> SQL view.
/// The view itself is created in a migration via raw SQL.
/// </summary>
public class AppointmentQueueItemConfiguration : IEntityTypeConfiguration<AppointmentQueueItem>
{
    public void Configure(EntityTypeBuilder<AppointmentQueueItem> builder)
    {
        builder.HasNoKey();
        builder.ToView("vw_AppointmentQueue");

        builder.Property(x => x.FinalPrice).HasColumnType("decimal(10,2)");
    }
}
