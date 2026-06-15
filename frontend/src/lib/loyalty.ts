// Mirrors the backend LoyaltyPolicy. The backend (sp_CreateAppointment) is the
// source of truth for the actual price; these values are only used for the
// live preview shown before saving.

/**
 * Once a customer has at least this many existing appointments, their next
 * booking (the 4th onward) gets the loyalty discount.
 */
export const LOYALTY_THRESHOLD = 3;

/** 10% loyalty discount. */
export const LOYALTY_DISCOUNT_RATE = 0.1;

/** Multiplier applied to the base price when the discount is in effect (0.9). */
export const LOYALTY_MULTIPLIER = 1 - LOYALTY_DISCOUNT_RATE;
