using System.ComponentModel.DataAnnotations;

namespace DogGrooming.Application.DTOs.Appointments;

public class CreateAppointmentRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "A valid haircut type must be selected.")]
    public int HaircutTypeId { get; set; }

    /// <summary>Designated arrival time (must be in the future).</summary>
    [Required]
    public DateTime ScheduledTime { get; set; }
}
