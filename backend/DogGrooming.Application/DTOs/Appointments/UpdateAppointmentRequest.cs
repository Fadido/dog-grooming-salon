using System.ComponentModel.DataAnnotations;

namespace DogGrooming.Application.DTOs.Appointments;

public class UpdateAppointmentRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "יש לבחור סוג תספורת")]
    public int HaircutTypeId { get; set; }

    [Required(ErrorMessage = "יש לבחור מועד הגעה")]
    public DateTime ScheduledTime { get; set; }
}
