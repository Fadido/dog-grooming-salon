using DogGrooming.Application.DTOs.Appointments;
using DogGrooming.Domain.Entities;

namespace DogGrooming.Application.Interfaces.Repositories;

public interface IAppointmentRepository
{
    /// <summary>
    /// Creates an appointment through the <c>sp_CreateAppointment</c> stored procedure,
    /// which computes the loyalty discount and price, then returns the created row.
    /// </summary>
    Task<Appointment> CreateViaProcedureAsync(int userId, int haircutTypeId, DateTime scheduledTime);

    Task<Appointment?> GetByIdAsync(int id);

    Task UpdateAsync(Appointment appointment);

    Task DeleteAsync(Appointment appointment);

    /// <summary>Reads the queue from the <c>vw_AppointmentQueue</c> view, applying optional filters.</summary>
    Task<IReadOnlyList<AppointmentQueueItem>> QueryQueueAsync(AppointmentFilter filter);
}
