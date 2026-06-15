namespace DogGrooming.Application.DTOs.Appointments;

/// <summary>A single row in the grooming queue listing.</summary>
public class AppointmentQueueDto
{
    public int Id { get; set; }
    public string CustomerFirstName { get; set; } = string.Empty;
    public string DogType { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public DateTime ScheduledTime { get; set; }
    public decimal FinalPrice { get; set; }
    public bool DiscountApplied { get; set; }
    public DateTime CreatedAt { get; set; }

    /// <summary>True when the appointment belongs to the requesting user.</summary>
    public bool IsMine { get; set; }

    /// <summary>True when the requesting user is allowed to edit this row (owner only).</summary>
    public bool CanEdit { get; set; }

    /// <summary>True when the requesting user may delete this row (owner and not scheduled for today).</summary>
    public bool CanDelete { get; set; }
}
