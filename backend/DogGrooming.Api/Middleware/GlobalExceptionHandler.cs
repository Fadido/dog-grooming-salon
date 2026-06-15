using DogGrooming.Application.Common;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DogGrooming.Api.Middleware;

/// <summary>
/// Translates application exceptions into consistent ProblemDetails responses
/// and prevents leaking stack traces to clients.
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "לא נמצא"),
            ForbiddenException => (StatusCodes.Status403Forbidden, "הפעולה אינה מורשית"),
            BusinessRuleException => (StatusCodes.Status400BadRequest, "בקשה לא תקינה"),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "נדרשת התחברות"),
            _ => (StatusCodes.Status500InternalServerError, "אירעה שגיאה בלתי צפויה. נסו שוב מאוחר יותר.")
        };

        if (status == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Unhandled exception");

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            // Only surface the message for expected, client-safe exceptions.
            Detail = status == StatusCodes.Status500InternalServerError ? null : exception.Message
        };

        httpContext.Response.StatusCode = status;
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
        return true;
    }
}
