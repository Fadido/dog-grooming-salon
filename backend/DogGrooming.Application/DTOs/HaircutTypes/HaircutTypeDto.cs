namespace DogGrooming.Application.DTOs.HaircutTypes;

public class HaircutTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
}
