import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PLAN_QUOTAS } from '@/lib/plan-quotas';

const MAX_INPUT_LENGTH = 20_000;
const ANON_DAILY_LIMIT = 5;

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let reservedReportId: string | undefined;

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
    const quota = PLAN_QUOTAS[profile?.plan ?? 'starter'];

    const { data: reservedId } = await supabase.rpc('reserve_report_slot', {
      p_user_id: user.id,
      p_quota: quota,
      p_input_summary: data.slice(0, 500),
    });

    if (!reservedId) {
      return NextResponse.json(
        { error: `Monthly quota of ${quota} reports reached. Upgrade your plan for more.` },
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
      await supabase.from('reports').update({ status: 'failed' }).eq('id', reservedReportId);
    }
    return NextResponse.json({ error: 'Report generation failed. Please try again.' }, { status: 502 });
  }

  if (reservedReportId) {
    await supabase
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
