using DogGrooming.Application.DTOs.HaircutTypes;
using DogGrooming.Application.Interfaces.Repositories;
using DogGrooming.Application.Interfaces.Services;

namespace DogGrooming.Application.Services;

public class HaircutTypeService : IHaircutTypeService
{
    private readonly IHaircutTypeRepository _haircutTypes;

    public HaircutTypeService(IHaircutTypeRepository haircutTypes)
    {
        _haircutTypes = haircutTypes;
    }

    public async Task<IReadOnlyList<HaircutTypeDto>> GetAllAsync()
    {
        var types = await _haircutTypes.GetAllAsync();
        return types
            .Select(t => new HaircutTypeDto
            {
                Id = t.Id,
                Name = t.Name,
                DurationMinutes = t.DurationMinutes,
                Price = t.Price
            })
            .ToList();
    }
}
