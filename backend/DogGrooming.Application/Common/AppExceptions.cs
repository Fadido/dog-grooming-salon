namespace DogGrooming.Application.Common;

/// <summary>Thrown when a requested resource does not exist (maps to HTTP 404).</summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

/// <summary>Thrown when the caller is authenticated but not allowed to perform the action (HTTP 403).</summary>
public class ForbiddenException : Exception
{
    public ForbiddenException(string message) : base(message) { }
}

/// <summary>Thrown for business-rule violations such as bad input or conflicts (HTTP 400).</summary>
public class BusinessRuleException : Exception
{
    public BusinessRuleException(string message) : base(message) { }
}
