using DogGrooming.Domain.Entities;

namespace DogGrooming.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<bool> UsernameExistsAsync(string username);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByIdAsync(int id);

    /// <summary>Persists a new user and returns it with the generated Id.</summary>
    Task<User> AddAsync(User user);
}
