import { NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site-url';

export async function POST(request: Request) {
  const body = await request.json();
  const { plan, annual }: { plan: 'starter' | 'growth'; annual: boolean } = body;

  if (plan !== 'starter' && plan !== 'growth') {
    return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
  }

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

  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
  }

  const priceId = annual ? PRICE_IDS[plan].annual : PRICE_IDS[plan].monthly;
  const origin = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing`,
    metadata: { supabase_user_id: user.id, plan },
  });

  return NextResponse.json({ url: session.url });
}
