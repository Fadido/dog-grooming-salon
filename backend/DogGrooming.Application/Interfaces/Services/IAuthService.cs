using DogGrooming.Application.DTOs.Auth;

namespace DogGrooming.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserDto> GetCurrentUserAsync(int userId);
}
