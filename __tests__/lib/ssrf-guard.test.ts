/**
 * @jest-environment node
 */
import { lookup } from 'dns';
import { assertSafeWebhookUrl } from '@/lib/ssrf-guard';

jest.mock('dns', () => ({ lookup: jest.fn() }));

const mockLookup = lookup as unknown as jest.Mock;

function mockAddresses(addresses: { address: string; family: number }[]) {
  mockLookup.mockImplementation((_hostname, _opts, callback) => {
    callback(null, addresses);
  });
}

function mockLookupFailure() {
  mockLookup.mockImplementation((_hostname, _opts, callback) => {
    callback(new Error('ENOTFOUND'));
  });
}

describe('assertSafeWebhookUrl', () => {
  afterEach(() => jest.resetAllMocks());

  it('rejects non-https URLs', async () => {
    await expect(assertSafeWebhookUrl('http://example.com')).rejects.toThrow(/https/);
  });

  it('rejects URLs with embedded credentials', async () => {
    await expect(assertSafeWebhookUrl('https://user:pass@example.com')).rejects.toThrow(/credentials/);
  });

  it('rejects cloud metadata hostnames', async () => {
    await expect(assertSafeWebhookUrl('https://metadata.google.internal/x')).rejects.toThrow(/not allowed/);
  });

  it('rejects a hostname that resolves to a private IPv4 address (10/8)', async () => {
    mockAddresses([{ address: '10.0.0.5', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://internal.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to loopback', async () => {
    mockAddresses([{ address: '127.0.0.1', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to link-local / cloud metadata (169.254/16)', async () => {
    mockAddresses([{ address: '169.254.169.254', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to a 172.16/12 private address', async () => {
    mockAddresses([{ address: '172.20.0.5', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to a 192.168/16 private address', async () => {
    mockAddresses([{ address: '192.168.1.1', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to carrier-grade NAT (100.64/10)', async () => {
    mockAddresses([{ address: '100.64.0.1', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to benchmarking range (198.18/15)', async () => {
    mockAddresses([{ address: '198.18.0.1', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to 0.0.0.0/8', async () => {
    mockAddresses([{ address: '0.0.0.0', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to multicast/reserved (>= 224.0.0.0)', async () => {
    mockAddresses([{ address: '255.255.255.255', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects an IPv4-mapped IPv6 address wrapping a blocked IPv4 (::ffff:127.0.0.1)', async () => {
    mockAddresses([{ address: '::ffff:127.0.0.1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects an IPv4-compatible IPv6 address wrapping a blocked IPv4 (::10.0.0.5)', async () => {
    mockAddresses([{ address: '::10.0.0.5', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to IPv6 loopback', async () => {
    mockAddresses([{ address: '::1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to IPv6 unspecified (::)', async () => {
    mockAddresses([{ address: '::', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to IPv6 unique-local', async () => {
    mockAddresses([{ address: 'fd00::1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to IPv6 link-local', async () => {
    mockAddresses([{ address: 'fe80::1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to a NAT64 address (64:ff9b::/96)', async () => {
    mockAddresses([{ address: '64:ff9b::a00:5', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects if any one of several resolved addresses is blocked', async () => {
    mockAddresses([
      { address: '93.184.216.34', family: 4 },
      { address: '10.0.0.1', family: 4 },
    ]);
    await expect(assertSafeWebhookUrl('https://multi.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects if DNS resolves to no addresses', async () => {
    mockAddresses([]);
    await expect(assertSafeWebhookUrl('https://empty.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects if DNS resolution fails', async () => {
    mockLookupFailure();
    await expect(assertSafeWebhookUrl('https://nowhere.example.com')).rejects.toThrow(/could not be resolved/);
  });

  it('allows a hostname that resolves to a public IPv6 address and returns a pinned dispatcher', async () => {
    mockAddresses([{ address: '2606:4700:4700::1111', family: 6 }]);
    const target = await assertSafeWebhookUrl('https://example.com/hook');
    expect(target.url.toString()).toBe('https://example.com/hook');
    expect(target.dispatcher).toBeDefined();
    target.dispatcher.close();
  });

  it('allows a hostname that resolves to a public IPv4 address', async () => {
    mockAddresses([{ address: '93.184.216.34', family: 4 }]);
    const target = await assertSafeWebhookUrl('https://example.com/hook');
    expect(target.url.toString()).toBe('https://example.com/hook');
    target.dispatcher.close();
  });
});
