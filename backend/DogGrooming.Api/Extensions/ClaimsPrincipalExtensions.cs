using System.Security.Claims;

namespace DogGrooming.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>Reads the authenticated user's id from the JWT (NameIdentifier / sub claim).</summary>
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? user.FindFirstValue("sub");

        if (int.TryParse(value, out var id))
            return id;

        throw new UnauthorizedAccessException("The token does not contain a valid user id.");
    }
}
