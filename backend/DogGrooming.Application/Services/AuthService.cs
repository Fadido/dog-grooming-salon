using DogGrooming.Application.Common;
using DogGrooming.Application.DTOs.Auth;
using DogGrooming.Application.Interfaces.Repositories;
using DogGrooming.Application.Interfaces.Security;
using DogGrooming.Application.Interfaces.Services;
using DogGrooming.Domain.Entities;

namespace DogGrooming.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwt;

    public AuthService(IUserRepository users, IPasswordHasher passwordHasher, IJwtTokenService jwt)
    {
        _users = users;
        _passwordHasher = passwordHasher;
        _jwt = jwt;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var username = request.Username.Trim();

        if (await _users.UsernameExistsAsync(username))
            throw new BusinessRuleException("Username is already taken.");

        var user = new User
        {
            Username = username,
            FirstName = request.FirstName.Trim(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        user = await _users.AddAsync(user);
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _users.GetByUsernameAsync(request.Username.Trim());

        // Same generic error whether the user is missing or the password is wrong,
        // to avoid leaking which usernames exist.
        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new BusinessRuleException("Invalid username or password.");

        return BuildAuthResponse(user);
    }

    public async Task<UserDto> GetCurrentUserAsync(int userId)
    {
        var user = await _users.GetByIdAsync(userId)
            ?? throw new NotFoundException("User not found.");

        return new UserDto { Id = user.Id, Username = user.Username, FirstName = user.FirstName };
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        var (token, expiresAt) = _jwt.CreateToken(user);
        return new AuthResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserDto { Id = user.Id, Username = user.Username, FirstName = user.FirstName }
        };
    }
}
