import { isIP } from 'net';
import { lookup } from 'dns/promises';

const BLOCKED_HOSTNAMES = new Set(['metadata.google.internal', 'metadata.goog']);

function isBlockedIp(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 169 && b === 254) return true; // link-local / metadata
    if (address === '0.0.0.0') return true;
    return false;
  }

  const lower = address.toLowerCase();
  if (lower === '::1') return true; // loopback
  if (lower.startsWith('fe80:')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  if (lower === '::') return true;
  return false;
}

// Validates a webhook destination is not loopback/private/link-local/cloud-metadata.
// Must be called both when a URL is registered AND immediately before each
// delivery — DNS can be re-pointed between the two (rebinding).
export async function assertSafeWebhookUrl(rawUrl: string): Promise<URL> {
  const url = new URL(rawUrl);

  if (url.protocol !== 'https:') {
    throw new Error('Webhook URL must use https.');
  }
  if (url.username || url.password) {
    throw new Error('Webhook URL must not contain credentials.');
  }
  if (BLOCKED_HOSTNAMES.has(url.hostname.toLowerCase())) {
    throw new Error('Webhook URL host is not allowed.');
  }

  let addresses;
  try {
    addresses = await lookup(url.hostname, { all: true });
  } catch {
    throw new Error('Webhook URL host could not be resolved.');
  }

  if (addresses.length === 0 || addresses.some((a) => isBlockedIp(a.address))) {
    throw new Error('Webhook URL resolves to a disallowed address.');
  }

  return url;
}
