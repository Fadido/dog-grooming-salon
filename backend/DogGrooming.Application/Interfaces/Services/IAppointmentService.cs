using DogGrooming.Application.DTOs.Appointments;

namespace DogGrooming.Application.Interfaces.Services;

public interface IAppointmentService
{
    Task<IReadOnlyList<AppointmentQueueDto>> GetQueueAsync(int currentUserId);
    Task<AppointmentDetailsDto> GetByIdAsync(int id, int currentUserId);
    Task<AppointmentDetailsDto> CreateAsync(CreateAppointmentRequest request, int currentUserId);
    Task<AppointmentDetailsDto> UpdateAsync(int id, UpdateAppointmentRequest request, int currentUserId);
    Task DeleteAsync(int id, int currentUserId);
}
