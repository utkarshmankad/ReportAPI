import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site-url';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found.' }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${getSiteUrl()}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
