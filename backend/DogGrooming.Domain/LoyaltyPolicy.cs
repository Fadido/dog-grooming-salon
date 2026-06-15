namespace DogGrooming.Domain;

/// <summary>
/// Loyalty rule: once a customer has at least <see cref="PastAppointmentThreshold"/>
/// existing appointments, their next booking (the 4th onward) receives the discount.
/// </summary>
/// <remarks>
/// These values are the single source of truth for the rule. The <c>sp_CreateAppointment</c>
/// stored procedure mirrors them when it computes the price at creation time.
/// </remarks>
public static class LoyaltyPolicy
{
    /// <summary>Minimum count of existing appointments that makes the next booking discounted.</summary>
    public const int PastAppointmentThreshold = 3;
    public const decimal DiscountRate = 0.10m;

    /// <summary>Multiplier applied to the base price when the discount is in effect (0.90).</summary>
    public const decimal DiscountedMultiplier = 1m - DiscountRate;
}
