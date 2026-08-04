import { lookup } from 'dns/promises';
import { assertSafeWebhookUrl } from '@/lib/ssrf-guard';

jest.mock('dns/promises', () => ({ lookup: jest.fn() }));

const mockLookup = lookup as jest.Mock;

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

  it('rejects a hostname that resolves to a private IPv4 address', async () => {
    mockLookup.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://internal.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to loopback', async () => {
    mockLookup.mockResolvedValue([{ address: '127.0.0.1', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to link-local (metadata) address', async () => {
    mockLookup.mockResolvedValue([{ address: '169.254.169.254', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to a 172.16/12 private address', async () => {
    mockLookup.mockResolvedValue([{ address: '172.20.0.5', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to 0.0.0.0', async () => {
    mockLookup.mockResolvedValue([{ address: '0.0.0.0', family: 4 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects if DNS resolves to no addresses', async () => {
    mockLookup.mockResolvedValue([]);
    await expect(assertSafeWebhookUrl('https://empty.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects if DNS resolution fails', async () => {
    mockLookup.mockRejectedValue(new Error('ENOTFOUND'));
    await expect(assertSafeWebhookUrl('https://nowhere.example.com')).rejects.toThrow(/could not be resolved/);
  });

  it('rejects a hostname that resolves to IPv6 loopback', async () => {
    mockLookup.mockResolvedValue([{ address: '::1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to IPv6 unique-local', async () => {
    mockLookup.mockResolvedValue([{ address: 'fd00::1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('rejects a hostname that resolves to IPv6 link-local', async () => {
    mockLookup.mockResolvedValue([{ address: 'fe80::1', family: 6 }]);
    await expect(assertSafeWebhookUrl('https://sneaky.example.com')).rejects.toThrow(/disallowed/);
  });

  it('allows a hostname that resolves to a public IPv6 address', async () => {
    mockLookup.mockResolvedValue([{ address: '2606:4700:4700::1111', family: 6 }]);
    const url = await assertSafeWebhookUrl('https://example.com/hook');
    expect(url.toString()).toBe('https://example.com/hook');
  });

  it('allows a hostname that resolves to a public IP', async () => {
    mockLookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
    const url = await assertSafeWebhookUrl('https://example.com/hook');
    expect(url.toString()).toBe('https://example.com/hook');
  });
});
