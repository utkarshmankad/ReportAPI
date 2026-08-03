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

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
    const quota = PLAN_QUOTAS[profile?.plan ?? 'starter'];

    if (quota !== null) {
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('reports')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if ((count ?? 0) >= quota) {
        return NextResponse.json(
          { error: `Monthly quota of ${quota} reports reached. Upgrade your plan for more.` },
          { status: 429 }
        );
      }
    }
  } else {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex');
    const today = new Date().toISOString().slice(0, 10);

    const admin = createAdminClient();
    const { data: existing } = await admin
      .from('demo_usage')
      .select('count')
      .eq('ip_hash', ipHash)
      .eq('day', today)
      .single();

    if ((existing?.count ?? 0) >= ANON_DAILY_LIMIT) {
      return NextResponse.json(
        { error: 'Daily demo limit reached. Sign up for a free account to keep going.' },
        { status: 429 }
      );
    }

    await admin
      .from('demo_usage')
      .upsert(
        { ip_hash: ipHash, day: today, count: (existing?.count ?? 0) + 1 },
        { onConflict: 'ip_hash,day' }
      );
  }

  let result;
  try {
    result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `You are a data analyst. Given the following raw CSV or JSON data, write a concise narrative report: summarize key trends, notable outliers, and one actionable recommendation. Keep it under 200 words, plain prose, no markdown headers.\n\nData:\n${data}`,
    });
  } catch {
    return NextResponse.json({ error: 'Report generation failed. Please try again.' }, { status: 502 });
  }

  let reportId: string | undefined;
  if (user) {
    const { data: inserted } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        input_summary: data.slice(0, 500),
        output: result.text,
        status: 'completed',
      })
      .select('id')
      .single();
    reportId = inserted?.id;
  }

  return NextResponse.json({
    narrative: result.text,
    report_id: reportId,
    status: 'completed',
    tokens_used: result.usage?.totalTokens,
  });
}
