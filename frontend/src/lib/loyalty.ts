// Mirrors the backend LoyaltyPolicy. The backend (sp_CreateAppointment) is the
// source of truth for the actual price; these values are only used for the
// live preview shown before saving.

/** A customer with more than this many appointments earns the discount. */
export const LOYALTY_THRESHOLD = 3;

/** 10% loyalty discount. */
export const LOYALTY_DISCOUNT_RATE = 0.1;

/** Multiplier applied to the base price when the discount is in effect (0.9). */
export const LOYALTY_MULTIPLIER = 1 - LOYALTY_DISCOUNT_RATE;
