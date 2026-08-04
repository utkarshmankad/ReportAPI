import { createHmac, randomBytes } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(24).toString('base64url')}`;
}

export function signWebhookPayload(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

interface WebhookEvent {
  event: string;
  report_id: string;
  status: string;
  created_at: string;
}

// Best-effort, single-attempt delivery (no retry queue). Intended to run via
// `unstable_after` so it never adds latency to the report-generation response.
export async function deliverReportWebhooks(userId: string, event: WebhookEvent): Promise<void> {
  const admin = createAdminClient();
  const { data: endpoints } = await admin
    .from('webhook_endpoints')
    .select('id, url, secret')
    .eq('user_id', userId)
    .eq('active', true);

  if (!endpoints?.length) return;

  const payload = JSON.stringify(event);

  await Promise.all(
    endpoints.map(async (endpoint) => {
      const signature = signWebhookPayload(endpoint.secret, payload);
      let statusCode: number | null = null;
      let success = false;

      try {
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ReportAPI-Signature': signature,
          },
          body: payload,
          signal: AbortSignal.timeout(10_000),
        });
        statusCode = res.status;
        success = res.ok;
      } catch {
        // network error / timeout — leave success false, statusCode null
      }

      await admin.from('webhook_deliveries').insert({
        endpoint_id: endpoint.id,
        event: event.event,
        status_code: statusCode,
        success,
      });
    })
  );
}
