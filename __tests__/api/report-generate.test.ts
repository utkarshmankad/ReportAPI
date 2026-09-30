/** @jest-environment node */
import { POST } from '@/app/api/report/generate/route';
import { generateText } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { deliverReportWebhooks } from '@/lib/webhooks';

jest.mock('ai', () => ({ generateText: jest.fn() }));
jest.mock('@ai-sdk/groq', () => ({ groq: jest.fn(() => 'mock-model') }));
jest.mock('@/lib/supabase/server', () => ({ createClient: jest.fn() }));
jest.mock('@/lib/supabase/admin', () => ({ createAdminClient: jest.fn() }));
jest.mock('@/lib/webhooks', () => ({ deliverReportWebhooks: jest.fn() }));

const model = jest.mocked(generateText);
const sessionClient = jest.mocked(createClient);
const adminClient = jest.mocked(createAdminClient);
const webhooks = jest.mocked(deliverReportWebhooks);

function database(userId?: string) {
  const query = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { plan: 'starter' } }),
    update: jest.fn().mockReturnThis(),
  };
  return {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: userId ? { id: userId } : null } }) },
    from: jest.fn(() => query),
    rpc: jest.fn().mockResolvedValue({ data: true }),
    query,
  };
}

let session: ReturnType<typeof database>;
let admin: ReturnType<typeof database>;
const request = (body: string, authorization?: string) => new Request('http://localhost/api/report/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(authorization ? { authorization } : {}) },
  body,
});
const validBody = JSON.stringify({ data: 'month,revenue\nJan,100\nFeb,150' });

beforeEach(() => {
  jest.clearAllMocks();
  session = database();
  admin = database();
  sessionClient.mockResolvedValue(session as unknown as Awaited<ReturnType<typeof createClient>>);
  adminClient.mockReturnValue(admin as unknown as ReturnType<typeof createAdminClient>);
  model.mockResolvedValue({ text: 'Revenue increased.', usage: { totalTokens: 42 } } as unknown as Awaited<ReturnType<typeof generateText>>);
  webhooks.mockResolvedValue(undefined);
});

describe('report request validation', () => {
  it.each(['', '{', '{"data":'])('rejects malformed JSON %j without any downstream calls', async (body) => {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Request body must be valid JSON.' });
    expect(sessionClient).not.toHaveBeenCalled();
    expect(adminClient).not.toHaveBeenCalled();
    expect(model).not.toHaveBeenCalled();
    expect(webhooks).not.toHaveBeenCalled();
  });

  it.each([null, [], ['data'], true, 123, 'text', {}, { data: null }, { data: 1 }, { data: [] }, { data: {} }, { data: '' }, { data: ' \n\t' }])('rejects invalid body %j before auth, quota and model calls', async (body) => {
    const response = await POST(request(JSON.stringify(body), 'Bearer rpk_unused'));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Field "data" (CSV or JSON string) is required.' });
    expect(sessionClient).not.toHaveBeenCalled();
    expect(adminClient).not.toHaveBeenCalled();
    expect(model).not.toHaveBeenCalled();
    expect(webhooks).not.toHaveBeenCalled();
  });

  it('rejects over 20,000 characters before downstream calls', async () => {
    const response = await POST(request(JSON.stringify({ data: 'a'.repeat(20_001) })));
    expect(response.status).toBe(413);
    expect(sessionClient).not.toHaveBeenCalled();
    expect(adminClient).not.toHaveBeenCalled();
    expect(model).not.toHaveBeenCalled();
  });

  it('accepts exactly 20,000 characters', async () => {
    expect((await POST(request(JSON.stringify({ data: 'a'.repeat(20_000) })))).status).toBe(200);
    expect(model).toHaveBeenCalledTimes(1);
  });
});

describe('report generation regressions', () => {
  it('generates anonymous reports only after reserving daily usage', async () => {
    const response = await POST(request(validBody));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ narrative: 'Revenue increased.', status: 'completed', tokens_used: 42 });
    expect(admin.rpc).toHaveBeenCalledWith('increment_demo_usage', expect.objectContaining({ p_limit: 5, p_ip_hash: expect.any(String) }));
    expect(model).toHaveBeenCalledWith(expect.objectContaining({ prompt: expect.stringContaining('month,revenue') }));
    expect(webhooks).not.toHaveBeenCalled();
  });

  it('returns 429 without model calls when anonymous usage is exhausted', async () => {
    admin.rpc.mockResolvedValue({ data: false });
    expect((await POST(request(validBody))).status).toBe(429);
    expect(model).not.toHaveBeenCalled();
  });

  it.each([
    [null, 401, 'missing_api_key'],
    [{ user_id: 'user-1', revoked_at: '2026-01-01' }, 403, 'api_key_revoked'],
  ])('rejects invalid or revoked API keys', async (key, status, code) => {
    admin.query.single.mockResolvedValue({ data: key } as never);
    const response = await POST(request(validBody, 'Bearer rpk_test'));
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual(expect.objectContaining({ code }));
    expect(sessionClient).not.toHaveBeenCalled();
    expect(model).not.toHaveBeenCalled();
  });

  it('persists a session report and emits the completion webhook', async () => {
    session.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    session.rpc.mockResolvedValue({ data: 'report-1' } as never);
    const response = await POST(request(validBody));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ report_id: 'report-1' }));
    expect(session.rpc).toHaveBeenCalledWith('reserve_report_slot', { p_user_id: 'user-1', p_quota: 50, p_input_summary: JSON.parse(validBody).data });
    expect(session.query.update).toHaveBeenCalledWith({ output: 'Revenue increased.', status: 'completed' });
    expect(webhooks).toHaveBeenCalledWith('user-1', expect.objectContaining({ event: 'report.completed', report_id: 'report-1' }));
  });

  it('uses the API key owner and admin client for report reservation', async () => {
    admin.query.single.mockResolvedValueOnce({ data: { user_id: 'key-owner', revoked_at: null } } as never);
    admin.rpc.mockResolvedValue({ data: 'report-2' } as never);
    const response = await POST(request(validBody, 'Bearer rpk_test'));
    expect(response.status).toBe(200);
    expect(session.auth.getUser).not.toHaveBeenCalled();
    expect(admin.rpc).toHaveBeenCalledWith('reserve_report_slot', expect.objectContaining({ p_user_id: 'key-owner', p_quota: 50 }));
    expect(webhooks).toHaveBeenCalledWith('key-owner', expect.objectContaining({ report_id: 'report-2' }));
  });

  it('returns monthly quota exhaustion without generating a report', async () => {
    session.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    session.rpc.mockResolvedValue({ data: null } as never);
    const response = await POST(request(validBody));
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual(expect.objectContaining({ code: 'quota_exceeded' }));
    expect(model).not.toHaveBeenCalled();
  });

  it('returns 502 on anonymous model failure', async () => {
    model.mockRejectedValue(new Error('provider unavailable'));
    expect((await POST(request(validBody))).status).toBe(502);
    expect(webhooks).not.toHaveBeenCalled();
  });

  it('marks reserved reports failed and emits failure events when the model fails', async () => {
    session.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    session.rpc.mockResolvedValue({ data: 'report-1' } as never);
    model.mockRejectedValue(new Error('provider unavailable'));
    expect((await POST(request(validBody))).status).toBe(502);
    expect(session.query.update).toHaveBeenCalledWith({ status: 'failed' });
    expect(webhooks).toHaveBeenCalledWith('user-1', expect.objectContaining({ event: 'report.failed', report_id: 'report-1', status: 'failed' }));
  });
});
