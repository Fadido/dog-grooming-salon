using DogGrooming.Application.Common;
using DogGrooming.Application.DTOs.Appointments;
using DogGrooming.Application.Interfaces.Repositories;
using DogGrooming.Application.Interfaces.Services;
using DogGrooming.Domain;
using DogGrooming.Domain.Entities;

namespace DogGrooming.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointments;
    private readonly IHaircutTypeRepository _haircutTypes;

    public AppointmentService(IAppointmentRepository appointments, IHaircutTypeRepository haircutTypes)
    {
        _appointments = appointments;
        _haircutTypes = haircutTypes;
    }

    public async Task<IReadOnlyList<AppointmentQueueDto>> GetQueueAsync(AppointmentFilter filter, int currentUserId)
    {
        var items = await _appointments.QueryQueueAsync(filter);
        var today = DateTime.UtcNow.Date;

        return items.Select(i =>
        {
            var isMine = i.UserId == currentUserId;
            return new AppointmentQueueDto
            {
                Id = i.AppointmentId,
                CustomerFirstName = i.CustomerFirstName,
                DogType = i.DogType,
                DurationMinutes = i.DurationMinutes,
                ScheduledTime = i.ScheduledTime,
                FinalPrice = i.FinalPrice,
                DiscountApplied = i.DiscountApplied,
                CreatedAt = i.CreatedAt,
                IsMine = isMine,
                CanEdit = isMine,
                CanDelete = isMine && i.ScheduledTime.Date != today
            };
        }).ToList();
    }

    public async Task<AppointmentDetailsDto> GetByIdAsync(int id, int currentUserId)
    {
        var appointment = await _appointments.GetByIdAsync(id)
            ?? throw new NotFoundException("Appointment not found.");

        return MapDetails(appointment, currentUserId);
    }

    public async Task<AppointmentDetailsDto> CreateAsync(CreateAppointmentRequest request, int currentUserId)
    {
        if (request.ScheduledTime <= DateTime.UtcNow)
            throw new BusinessRuleException("The scheduled time must be in the future.");

        var haircutType = await _haircutTypes.GetByIdAsync(request.HaircutTypeId)
            ?? throw new BusinessRuleException("The selected haircut type does not exist.");

        // Price and loyalty discount are computed inside the sp_CreateAppointment stored procedure.
        var created = await _appointments.CreateViaProcedureAsync(
            currentUserId, haircutType.Id, request.ScheduledTime);

        // Re-fetch with navigation properties for a complete response.
        var appointment = await _appointments.GetByIdAsync(created.Id) ?? created;
        return MapDetails(appointment, currentUserId);
    }

    public async Task<AppointmentDetailsDto> UpdateAsync(int id, UpdateAppointmentRequest request, int currentUserId)
    {
        var appointment = await _appointments.GetByIdAsync(id)
            ?? throw new NotFoundException("Appointment not found.");

        // A customer may only edit their own records.
        if (appointment.UserId != currentUserId)
            throw new ForbiddenException("You can only edit your own appointments.");

        if (request.ScheduledTime <= DateTime.UtcNow)
            throw new BusinessRuleException("The scheduled time must be in the future.");

        var haircutType = await _haircutTypes.GetByIdAsync(request.HaircutTypeId)
            ?? throw new BusinessRuleException("The selected haircut type does not exist.");

        appointment.HaircutTypeId = haircutType.Id;
        appointment.ScheduledTime = request.ScheduledTime;

        // Recompute the price for the (possibly new) haircut type, preserving the loyalty
        // status that was already earned on this appointment.
        appointment.FinalPrice = appointment.DiscountApplied
            ? haircutType.Price * LoyaltyPolicy.DiscountedMultiplier
            : haircutType.Price;

        await _appointments.UpdateAsync(appointment);

        var refreshed = await _appointments.GetByIdAsync(appointment.Id) ?? appointment;
        return MapDetails(refreshed, currentUserId);
    }

    public async Task DeleteAsync(int id, int currentUserId)
    {
        var appointment = await _appointments.GetByIdAsync(id)
            ?? throw new NotFoundException("Appointment not found.");

        // A customer may only delete their own records.
        if (appointment.UserId != currentUserId)
            throw new ForbiddenException("You can only delete your own appointments.");

        // A customer cannot delete an appointment scheduled for today.
        if (appointment.ScheduledTime.Date == DateTime.UtcNow.Date)
            throw new BusinessRuleException("You cannot delete an appointment scheduled for today.");

        await _appointments.DeleteAsync(appointment);
    }

    private static AppointmentDetailsDto MapDetails(Appointment a, int currentUserId) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        CustomerFirstName = a.User?.FirstName ?? string.Empty,
        Username = a.User?.Username ?? string.Empty,
        HaircutTypeId = a.HaircutTypeId,
        DogType = a.HaircutType?.Name ?? string.Empty,
        DurationMinutes = a.HaircutType?.DurationMinutes ?? 0,
        ScheduledTime = a.ScheduledTime,
        FinalPrice = a.FinalPrice,
        DiscountApplied = a.DiscountApplied,
        CreatedAt = a.CreatedAt,
        IsMine = a.UserId == currentUserId
    };
}
