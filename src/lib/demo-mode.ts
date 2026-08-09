export function isDemoMode() {
  return !process.env.STRIPE_SECRET_KEY;
}