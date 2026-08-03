import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('newsletter_subscribers')
    .upsert({ email: email.trim().toLowerCase() }, { onConflict: 'email', ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
