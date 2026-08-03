import { randomBytes, createHash } from 'crypto';

export function generateApiKey(): { rawKey: string; prefix: string; hash: string } {
  const secret = randomBytes(24).toString('base64url');
  const rawKey = `rpk_${secret}`;
  const prefix = rawKey.slice(0, 12);
  const hash = createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, prefix, hash };
}

export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}
