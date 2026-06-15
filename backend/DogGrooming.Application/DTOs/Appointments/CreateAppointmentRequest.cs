using System.ComponentModel.DataAnnotations;

namespace DogGrooming.Application.DTOs.Appointments;

public class CreateAppointmentRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "יש לבחור סוג תספורת")]
    public int HaircutTypeId { get; set; }

    /// <summary>Designated arrival time (must be in the future).</summary>
    [Required(ErrorMessage = "יש לבחור מועד הגעה")]
    public DateTime ScheduledTime { get; set; }
}
