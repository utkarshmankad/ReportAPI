import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-500">Signed in as {user.email}</p>
    </main>
  );
}
