import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashApiKey } from '@/lib/api-keys';
import { PLAN_QUOTAS } from '@/lib/plan-quotas';

const MAX_INPUT_LENGTH = 20_000;
const ANON_DAILY_LIMIT = 5;

async function resolveApiKeyUser(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return { checked: false } as const;

  const rawKey = authHeader.slice('Bearer '.length).trim();
  const admin = createAdminClient();
  const { data: key } = await admin
    .from('api_keys')
    .select('user_id, revoked_at')
    .eq('key_hash', hashApiKey(rawKey))
    .single();

  if (!key) return { checked: true, error: 'missing_api_key' as const };
  if (key.revoked_at) return { checked: true, error: 'api_key_revoked' as const };

  return { checked: true, userId: key.user_id as string };
}

export async function POST(request: Request) {
  const { data } = await request.json();

  if (typeof data !== 'string' || !data.trim()) {
    return NextResponse.json({ error: 'Field "data" (CSV or JSON string) is required.' }, { status: 400 });
  }

  if (data.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      { error: `Input too large. Max ${MAX_INPUT_LENGTH} characters.` },
      { status: 413 }
    );
  }

  const apiKeyResult = await resolveApiKeyUser(request.headers.get('authorization'));

  if (apiKeyResult.checked && apiKeyResult.error === 'missing_api_key') {
    return NextResponse.json({ error: 'Invalid API key.', code: 'missing_api_key' }, { status: 401 });
  }
  if (apiKeyResult.checked && apiKeyResult.error === 'api_key_revoked') {
    return NextResponse.json({ error: 'This API key has been revoked.', code: 'api_key_revoked' }, { status: 403 });
  }

  const supabase = await createClient();
  let userId: string | undefined;
  let dbClient: ReturnType<typeof createAdminClient> | Awaited<ReturnType<typeof createClient>>;

  if (apiKeyResult.checked && apiKeyResult.userId) {
    userId = apiKeyResult.userId;
    dbClient = createAdminClient();
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
    dbClient = supabase;
  }

  let reservedReportId: string | undefined;

  if (userId) {
    const { data: profile } = await dbClient.from('profiles').select('plan').eq('id', userId).single();
    const quota = PLAN_QUOTAS[profile?.plan ?? 'starter'];

    const { data: reservedId } = await dbClient.rpc('reserve_report_slot', {
      p_user_id: userId,
      p_quota: quota,
      p_input_summary: data.slice(0, 500),
    });

    if (!reservedId) {
      return NextResponse.json(
        { error: `Monthly quota of ${quota} reports reached. Upgrade your plan for more.`, code: 'quota_exceeded' },
        { status: 429 }
      );
    }
    reservedReportId = reservedId;
  } else {
    // Trusts the platform (Vercel) to set/overwrite x-forwarded-for rather than
    // passing through a client-supplied value. This is a soft abuse deterrent
    // for the anonymous demo, not a hard security boundary — acceptable given
    // that, but would need a stricter header source if that ever changes.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex');
    const today = new Date().toISOString().slice(0, 10);

    const admin = createAdminClient();
    const { data: allowed } = await admin.rpc('increment_demo_usage', {
      p_ip_hash: ipHash,
      p_day: today,
      p_limit: ANON_DAILY_LIMIT,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily demo limit reached. Sign up for a free account to keep going.' },
        { status: 429 }
      );
    }
  }

  let result;
  try {
    result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `You are a data analyst. Given the following raw CSV or JSON data, write a concise narrative report: summarize key trends, notable outliers, and one actionable recommendation. Keep it under 200 words, plain prose, no markdown headers.\n\nData:\n${data}`,
    });
  } catch {
    if (reservedReportId) {
      await dbClient.from('reports').update({ status: 'failed' }).eq('id', reservedReportId);
    }
    return NextResponse.json({ error: 'Report generation failed. Please try again.' }, { status: 502 });
  }

  if (reservedReportId) {
    await dbClient
      .from('reports')
      .update({ output: result.text, status: 'completed' })
      .eq('id', reservedReportId);
  }

  return NextResponse.json({
    narrative: result.text,
    report_id: reservedReportId,
    status: 'completed',
    tokens_used: result.usage?.totalTokens,
  });
}
