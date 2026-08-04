import { isIP } from 'net';
import { lookup as dnsLookup } from 'dns';
import { Agent, type Dispatcher } from 'undici';

const BLOCKED_HOSTNAMES = new Set(['metadata.google.internal', 'metadata.goog']);

// Normalizes IPv4-mapped/compatible IPv6 forms (::ffff:127.0.0.1, ::127.0.0.1)
// down to the plain IPv4 address so the IPv4 blocklist can't be bypassed by
// wrapping a blocked address in its IPv6 representation.
function unwrapIpv4MappedIpv6(address: string): string {
  const lower = address.toLowerCase();
  const match = lower.match(/^::(?:ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  return match ? match[1] : address;
}

function isBlockedIp(rawAddress: string): boolean {
  const address = unwrapIpv4MappedIpv6(rawAddress);

  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number);
    if (a === 0) return true; // "this" network, 0.0.0.0/8
    if (a === 10) return true; // private
    if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT, 100.64.0.0/10
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 0) return true; // IETF protocol assignments, 192.0.0.0/24
    if (a === 192 && b === 168) return true; // private
    if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking, 198.18.0.0/15
    if (a === 224) return true; // multicast+ (224.0.0.0/4 and up, incl. 240/4 reserved & 255.255.255.255)
    if (a >= 224) return true;
    return false;
  }

  const lower = address.toLowerCase();
  if (lower === '::1') return true; // loopback
  if (lower === '::') return true; // unspecified
  if (lower.startsWith('fe80:')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  if (lower.startsWith('64:ff9b:')) return true; // NAT64 — can embed an IPv4-mapped private address
  return false;
}

interface SafeWebhookTarget {
  url: URL;
  dispatcher: Dispatcher;
}

// Validates a webhook destination is not loopback/private/link-local/cloud-metadata,
// and returns an undici Agent pinned to the exact address(es) we just validated.
// The caller MUST pass this dispatcher into fetch() rather than resolving the
// hostname again — a second, independent DNS lookup (e.g. inside fetch itself)
// re-opens a DNS-rebinding window between validation and the actual connection.
export async function assertSafeWebhookUrl(rawUrl: string): Promise<SafeWebhookTarget> {
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

  const addresses = await new Promise<{ address: string; family: number }[]>((resolve, reject) => {
    dnsLookup(url.hostname, { all: true, verbatim: true }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  }).catch(() => {
    throw new Error('Webhook URL host could not be resolved.');
  });

  if (addresses.length === 0 || addresses.some((a) => isBlockedIp(a.address))) {
    throw new Error('Webhook URL resolves to a disallowed address.');
  }

  // Pin the connection to exactly the addresses we validated above, so
  // undici's own DNS resolution can't diverge from what we just checked.
  const dispatcher = new Agent({
    connect: {
      lookup: (_hostname, _opts, callback) => {
        callback(null, addresses.map((a) => ({ address: a.address, family: a.family as 4 | 6 })));
      },
    },
  });

  return { url, dispatcher };
}
