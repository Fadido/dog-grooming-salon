using DogGrooming.Domain.Entities;

namespace DogGrooming.Application.Interfaces.Repositories;

public interface IHaircutTypeRepository
{
    Task<IReadOnlyList<HaircutType>> GetAllAsync();
    Task<HaircutType?> GetByIdAsync(int id);
}
