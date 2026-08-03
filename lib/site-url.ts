// Trusted app origin for security-sensitive redirect URLs (password reset,
// Stripe checkout/portal returns). Deliberately not derived from the request's
// Origin header, which is a client-supplied value an attacker can set freely.
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
