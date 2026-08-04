import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWebhookSecret } from '@/lib/webhooks';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const { data: endpoints } = await supabase
    .from('webhook_endpoints')
    .select('id, url, active, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ endpoints: endpoints ?? [] });
}

export async function POST(request: Request) {
  const { url } = await request.json();

  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'Field "url" is required.' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 });
  }
  if (parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Webhook URL must use https.' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const secret = generateWebhookSecret();

  const { data: inserted, error } = await supabase
    .from('webhook_endpoints')
    .insert({ user_id: user.id, url: parsed.toString(), secret })
    .select('id, url, active, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create webhook.' }, { status: 500 });
  }

  return NextResponse.json({ endpoint: inserted, secret });
}
