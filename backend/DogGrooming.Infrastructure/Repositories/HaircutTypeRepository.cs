using DogGrooming.Application.Interfaces.Repositories;
using DogGrooming.Domain.Entities;
using DogGrooming.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DogGrooming.Infrastructure.Repositories;

public class HaircutTypeRepository : IHaircutTypeRepository
{
    private readonly AppDbContext _db;

    public HaircutTypeRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<HaircutType>> GetAllAsync() =>
        await _db.HaircutTypes.AsNoTracking().OrderBy(h => h.Id).ToListAsync();

    public Task<HaircutType?> GetByIdAsync(int id) =>
        _db.HaircutTypes.AsNoTracking().FirstOrDefaultAsync(h => h.Id == id);
}
