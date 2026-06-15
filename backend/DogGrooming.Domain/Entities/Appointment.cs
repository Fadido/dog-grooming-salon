namespace DogGrooming.Domain.Entities;

/// <summary>
/// A booked place in the grooming queue, owned by a single customer.
/// </summary>
public class Appointment
{
    public int Id { get; set; }

    /// <summary>Owner of the appointment.</summary>
    public int UserId { get; set; }
    public User? User { get; set; }

    /// <summary>Selected grooming type (dog size).</summary>
    public int HaircutTypeId { get; set; }
    public HaircutType? HaircutType { get; set; }

    /// <summary>The designated arrival time for the customer.</summary>
    public DateTime ScheduledTime { get; set; }

    /// <summary>When the customer created the booking request.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Final price after any loyalty discount, computed at creation time.</summary>
    public decimal FinalPrice { get; set; }

    /// <summary>Whether the 10% loyalty discount was applied to this appointment.</summary>
    public bool DiscountApplied { get; set; }
}
