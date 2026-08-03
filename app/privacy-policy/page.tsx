import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Privacy Policy — ReportAPI",
  description: "How ReportAPI collects, uses, and protects your data.",
};

const lastUpdated = "August 4, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-bg min-h-screen">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Badge variant="default">Legal</Badge>
          <h1 className="text-4xl font-bold text-text-primary">Privacy Policy</h1>
          <p className="text-text-tertiary text-sm">Last updated: {lastUpdated}</p>

          <div className="flex flex-col gap-8 text-text-secondary leading-relaxed">
            <p>
              This policy describes what ReportAPI (&quot;we&quot;, &quot;us&quot;) collects when you use our
              website, dashboard, or API, and why. We are a small team based in Bengaluru, India, and we
              try to collect the minimum data needed to run the service.
            </p>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">What we collect</h2>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>
                  <strong className="text-text-primary">Account data</strong> — email address and
                  password (stored by our authentication provider, Supabase, using standard password
                  hashing — we never see or store your password in plain text).
                </li>
                <li>
                  <strong className="text-text-primary">Billing data</strong> — if you subscribe to a
                  paid plan, Stripe processes your payment details directly. We store your Stripe
                  customer and subscription IDs, but never your card number.
                </li>
                <li>
                  <strong className="text-text-primary">Report data</strong> — the CSV/JSON data you
                  submit to generate a report, and the narrative we return. For signed-in users, we
                  store the first 500 characters of your input and the generated output so you can see
                  your report history in the dashboard.
                </li>
                <li>
                  <strong className="text-text-primary">API keys</strong> — we store a one-way hash of
                  each API key you create, never the key itself. The raw key is shown to you once, at
                  creation time, and cannot be recovered afterward.
                </li>
                <li>
                  <strong className="text-text-primary">Anonymous demo usage</strong> — if you use the
                  demo widget without an account, we store a one-way hash of your IP address (never the
                  raw IP) to enforce a daily usage limit. This hash cannot be reversed back to your IP.
                </li>
                <li>
                  <strong className="text-text-primary">Contact form and newsletter</strong> — if you
                  message us or subscribe to release updates, we store your name/email and message
                  content to respond to you or send release notes.
                </li>
                <li>
                  <strong className="text-text-primary">Analytics</strong> — we use Vercel Web Analytics
                  and Speed Insights, which are cookie-free and report aggregated page-view and
                  performance data, not individual user tracking.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Third parties who process your data</h2>
              <p>
                We use a small number of subprocessors to run the service. Each only receives the data
                needed for its function:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li><strong className="text-text-primary">Supabase</strong> — authentication and database hosting.</li>
                <li><strong className="text-text-primary">Groq</strong> — processes the data you submit to generate a report. We do not control Groq&apos;s own data retention; see their privacy policy for details.</li>
                <li><strong className="text-text-primary">Stripe</strong> — payment processing for paid plans.</li>
                <li><strong className="text-text-primary">Resend</strong> — delivers contact-form messages to our inbox.</li>
                <li><strong className="text-text-primary">Vercel</strong> — application hosting, deployment, and analytics.</li>
              </ul>
              <p>
                We do not sell your data, and we do not share it with anyone beyond the subprocessors
                listed above.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Your rights</h2>
              <p>
                Depending on where you live, you may have rights under GDPR (EU/UK), CCPA (California),
                or India&apos;s DPDP Act to access, correct, export, or delete your personal data. To
                exercise any of these rights, email us at{" "}
                <a href="mailto:utkarsh.mankad@gmail.com" className="text-accent hover:underline">
                  utkarsh.mankad@gmail.com
                </a>{" "}
                and we will respond within 30 days. Deleting your account removes your profile, API
                keys, and report history; we may retain billing records as required by law.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Data retention</h2>
              <p>
                We keep account and report data for as long as your account is active. If you delete
                your account, we remove your data within 30 days, except where we&apos;re legally
                required to retain billing records for longer.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Changes to this policy</h2>
              <p>
                We&apos;ll update the &quot;last updated&quot; date above if this policy changes
                materially, and post the new version here.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Contact</h2>
              <p>
                Questions about this policy? Email{" "}
                <a href="mailto:utkarsh.mankad@gmail.com" className="text-accent hover:underline">
                  utkarsh.mankad@gmail.com
                </a>{" "}
                or use our{" "}
                <a href="/contact" className="text-accent hover:underline">contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
