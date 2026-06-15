using DogGrooming.Domain.Entities;

namespace DogGrooming.Application.Interfaces.Security;

public interface IJwtTokenService
{
    /// <summary>Creates a signed JWT for the user and reports when it expires.</summary>
    (string Token, DateTime ExpiresAt) CreateToken(User user);
}
