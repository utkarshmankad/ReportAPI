import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLAN_QUOTAS } from "@/lib/plan-quotas";
import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "starter";
  const quota = PLAN_QUOTAS[plan];

  const thisMonth = new Date().toISOString().slice(0, 8) + "01";

  const { data: usageCounter } = await supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", user.id)
    .eq("month", thisMonth)
    .single();

  const { data: recentReports } = await supabase
    .from("reports")
    .select("id, input_summary, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, created_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const usageCount = usageCounter?.count ?? 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-24 flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-text-tertiary">Signed in as {user.email}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Usage</h2>
        <div className="bg-surface border border-border rounded-[--radius-md] p-4">
          <p className="text-sm text-text-secondary">
            {usageCount} {quota !== null ? `/ ${quota}` : ""} reports this month
            <span className="ml-2 text-xs uppercase tracking-wide text-accent">{plan}</span>
          </p>
          {quota !== null && (
            <div className="mt-2 h-2 rounded-full bg-surface-raised overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${Math.min(100, (usageCount / quota) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">API keys</h2>
        <ApiKeyManager initialKeys={apiKeys ?? []} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Recent reports</h2>
        <ul className="flex flex-col gap-2">
          {(recentReports ?? []).map((report) => (
            <li
              key={report.id}
              className="bg-surface border border-border rounded-[--radius-md] p-4 text-sm"
            >
              <p className="text-text-secondary truncate">{report.input_summary}</p>
              <p className="text-xs text-text-tertiary mt-1">
                {report.status} · {new Date(report.created_at).toLocaleString()}
              </p>
            </li>
          ))}
          {(recentReports ?? []).length === 0 && (
            <li className="text-text-tertiary text-sm">No reports generated yet.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
