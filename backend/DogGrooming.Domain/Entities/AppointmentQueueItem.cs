namespace DogGrooming.Domain.Entities;

/// <summary>
/// Read model projected from the <c>vw_AppointmentQueue</c> SQL view.
/// Keyless: used only for queue listing and filtering, never tracked/persisted.
/// </summary>
public class AppointmentQueueItem
{
    public int AppointmentId { get; set; }
    public int UserId { get; set; }
    public string CustomerFirstName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string DogType { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public DateTime ScheduledTime { get; set; }
    public decimal FinalPrice { get; set; }
    public bool DiscountApplied { get; set; }
    public DateTime CreatedAt { get; set; }
}
