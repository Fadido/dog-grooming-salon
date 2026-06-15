using System.Security.Claims;

namespace DogGrooming.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>Reads the authenticated user's id from the JWT "sub" claim.</summary>
    public static int GetUserId(this ClaimsPrincipal user)
    {
        // "sub" is what JwtTokenService issues; NameIdentifier kept as a defensive fallback.
        var value = user.FindFirstValue("sub")
                    ?? user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (int.TryParse(value, out var id))
            return id;

        throw new UnauthorizedAccessException("האסימון אינו מכיל מזהה משתמש תקין.");
    }
}
