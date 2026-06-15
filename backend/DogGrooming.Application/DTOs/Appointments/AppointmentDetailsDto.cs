namespace DogGrooming.Application.DTOs.Appointments;

/// <summary>Full appointment details shown in the popup.</summary>
public class AppointmentDetailsDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string CustomerFirstName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;

    public int HaircutTypeId { get; set; }
    public string DogType { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }

    public DateTime ScheduledTime { get; set; }
    public decimal FinalPrice { get; set; }
    public bool DiscountApplied { get; set; }

    /// <summary>When the customer created the booking request.</summary>
    public DateTime CreatedAt { get; set; }

    public bool IsMine { get; set; }
}
