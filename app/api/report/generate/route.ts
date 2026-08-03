import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { createClient } from '@/lib/supabase/server';

const MAX_INPUT_LENGTH = 20_000;

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

  let result;
  try {
    result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `You are a data analyst. Given the following raw CSV or JSON data, write a concise narrative report: summarize key trends, notable outliers, and one actionable recommendation. Keep it under 200 words, plain prose, no markdown headers.\n\nData:\n${data}`,
    });
  } catch {
    return NextResponse.json({ error: 'Report generation failed. Please try again.' }, { status: 502 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
