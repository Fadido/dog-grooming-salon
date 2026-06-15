using DogGrooming.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DogGrooming.Infrastructure.Data.Configurations;

public class HaircutTypeConfiguration : IEntityTypeConfiguration<HaircutType>
{
    public void Configure(EntityTypeBuilder<HaircutType> builder)
    {
        builder.ToTable("HaircutTypes");
        builder.HasKey(h => h.Id);

        builder.Property(h => h.Name).IsRequired().HasMaxLength(50);
        builder.Property(h => h.Price).HasColumnType("decimal(10,2)");

        // Seed the three dog sizes. Small is given by the spec; Medium/Large use sensible defaults.
        builder.HasData(
            new HaircutType { Id = 1, Name = "Small dog", DurationMinutes = 30, Price = 100m },
            new HaircutType { Id = 2, Name = "Medium dog", DurationMinutes = 60, Price = 150m },
            new HaircutType { Id = 3, Name = "Large dog", DurationMinutes = 90, Price = 200m }
        );
    }
}
