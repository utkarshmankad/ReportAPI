import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateApiKey } from '@/lib/api-keys';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const { data: keys } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, created_at, revoked_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ keys: keys ?? [] });
}

export async function POST(request: Request) {
  const { name } = await request.json();

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Field "name" is required.' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const { rawKey, prefix, hash } = generateApiKey();

  const { data: inserted, error } = await supabase
    .from('api_keys')
    .insert({ user_id: user.id, name: name.trim(), key_prefix: prefix, key_hash: hash })
    .select('id, name, key_prefix, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create key.' }, { status: 500 });
  }

  return NextResponse.json({ key: inserted, rawKey });
}
