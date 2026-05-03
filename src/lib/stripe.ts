import { loadStripe } from '@stripe/stripe-js';

// The publishable key provided by the user
const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn("VITE_STRIPE_PUBLISHABLE_KEY is not defined. Stripe elements may not load correctly.");
}

export const getStripe = () => stripePublishableKey ? loadStripe(stripePublishableKey) : null;
