namespace DogGrooming.Application.DTOs.Appointments;

/// <summary>Optional filters for the queue listing (by date range and customer name).</summary>
public class AppointmentFilter
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? CustomerName { get; set; }
}
