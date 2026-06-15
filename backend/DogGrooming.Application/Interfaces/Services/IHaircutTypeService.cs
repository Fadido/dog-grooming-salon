using DogGrooming.Application.DTOs.HaircutTypes;

namespace DogGrooming.Application.Interfaces.Services;

public interface IHaircutTypeService
{
    Task<IReadOnlyList<HaircutTypeDto>> GetAllAsync();
}
