using DogGrooming.Application.Interfaces.Repositories;
using DogGrooming.Domain.Entities;
using DogGrooming.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DogGrooming.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _db;

    public AppointmentRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Appointment> CreateViaProcedureAsync(int userId, int haircutTypeId, DateTime scheduledTime)
    {
        // The stored procedure computes the loyalty discount + price, inserts the row,
        // and returns the inserted record. Parameters are passed safely (no string concat).
        var parameters = new[]
        {
            new SqlParameter("@UserId", userId),
            new SqlParameter("@HaircutTypeId", haircutTypeId),
            new SqlParameter("@ScheduledTime", scheduledTime)
        };

        var rows = await _db.Appointments
            .FromSqlRaw("EXEC sp_CreateAppointment @UserId, @HaircutTypeId, @ScheduledTime", parameters)
            .AsNoTracking()
            .ToListAsync();

        return rows.Single();
    }

    public Task<Appointment?> GetByIdAsync(int id) =>
        _db.Appointments
            .Include(a => a.User)
            .Include(a => a.HaircutType)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task UpdateAsync(Appointment appointment)
    {
        _db.Appointments.Update(appointment);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Appointment appointment)
    {
        _db.Appointments.Remove(appointment);
        await _db.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<AppointmentQueueItem>> QueryQueueAsync()
    {
        // All queue reads go through the vw_AppointmentQueue SQL view.
        return await _db.AppointmentQueue
            .AsNoTracking()
            .OrderBy(x => x.ScheduledTime)
            .ToListAsync();
    }
}
