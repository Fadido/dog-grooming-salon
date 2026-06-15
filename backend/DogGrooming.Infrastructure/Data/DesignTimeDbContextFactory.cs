using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DogGrooming.Infrastructure.Data;

/// <summary>
/// Lets the EF Core CLI (migrations) build an AppDbContext at design time without
/// running the API host. Uses the local development database.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    // LocalDB fallback so migrations run out-of-the-box; override with the standard
    // ConnectionStrings__Default environment variable to target another server.
    private const string DefaultConnectionString =
        "Server=(localdb)\\MSSQLLocalDB;Database=DogGroomingDb;Trusted_Connection=True;TrustServerCertificate=True";

    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__Default") ?? DefaultConnectionString;

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new AppDbContext(options);
    }
}
