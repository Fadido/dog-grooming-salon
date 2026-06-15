namespace DogGrooming.Domain.Entities;

/// <summary>
/// A registered customer of the salon.
/// </summary>
public class User
{
    public int Id { get; set; }

    /// <summary>Unique login name.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Customer's first name, shown in the queue.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>PBKDF2 hash of the password (never the plain text).</summary>
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
