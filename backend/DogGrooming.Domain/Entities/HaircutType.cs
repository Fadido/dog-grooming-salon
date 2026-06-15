namespace DogGrooming.Domain.Entities;

/// <summary>
/// A type of grooming determined by dog size. Each type has its own
/// duration and base price (e.g. Small dog – 30 min – ₪100).
/// </summary>
public class HaircutType
{
    public int Id { get; set; }

    /// <summary>Display name (Small / Medium / Large dog).</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>How long the grooming takes, in minutes.</summary>
    public int DurationMinutes { get; set; }

    /// <summary>Base price in shekels before any loyalty discount.</summary>
    public decimal Price { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
