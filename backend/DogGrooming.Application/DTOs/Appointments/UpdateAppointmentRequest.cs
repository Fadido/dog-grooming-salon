using System.ComponentModel.DataAnnotations;

namespace DogGrooming.Application.DTOs.Appointments;

public class UpdateAppointmentRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "A valid haircut type must be selected.")]
    public int HaircutTypeId { get; set; }

    [Required]
    public DateTime ScheduledTime { get; set; }
}
