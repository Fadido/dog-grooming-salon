using DogGrooming.Api.Extensions;
using DogGrooming.Application.DTOs.Appointments;
using DogGrooming.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DogGrooming.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/appointments")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointments;

    public AppointmentsController(IAppointmentService appointments)
    {
        _appointments = appointments;
    }

    /// <summary>
    /// List the full grooming queue. Each row is flagged with whether it belongs to
    /// the caller and what actions are allowed. (Filtering by name/date is done client-side.)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AppointmentQueueDto>>> GetQueue()
    {
        var queue = await _appointments.GetQueueAsync(User.GetUserId());
        return Ok(queue);
    }

    /// <summary>Full details of a single appointment (used by the details popup).</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentDetailsDto>> GetById(int id)
    {
        var details = await _appointments.GetByIdAsync(id, User.GetUserId());
        return Ok(details);
    }

    /// <summary>Book a new appointment for the current customer.</summary>
    [HttpPost]
    public async Task<ActionResult<AppointmentDetailsDto>> Create(CreateAppointmentRequest request)
    {
        var created = await _appointments.CreateAsync(request, User.GetUserId());
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Edit one of the current customer's own appointments.</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AppointmentDetailsDto>> Update(int id, UpdateAppointmentRequest request)
    {
        var updated = await _appointments.UpdateAsync(id, request, User.GetUserId());
        return Ok(updated);
    }

    /// <summary>Delete one of the current customer's own appointments (not allowed on the same day).</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _appointments.DeleteAsync(id, User.GetUserId());
        return NoContent();
    }
}
