import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Terms of Service — ReportAPI",
  description: "The terms that govern your use of ReportAPI.",
};

const lastUpdated = "August 4, 2026";

export default function TermsOfServicePage() {
  return (
    <main className="bg-bg min-h-screen">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Badge variant="default">Legal</Badge>
          <h1 className="text-4xl font-bold text-text-primary">Terms of Service</h1>
          <p className="text-text-tertiary text-sm">Last updated: {lastUpdated}</p>

          <div className="flex flex-col gap-8 text-text-secondary leading-relaxed">
            <p>
              These terms govern your use of ReportAPI&apos;s website, dashboard, and API. By creating
              an account or using the API, you agree to them.
            </p>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">The service</h2>
              <p>
                ReportAPI converts CSV or JSON data you submit into a narrative report using a
                third-party language model. The output is generated automatically and may contain
                errors — you&apos;re responsible for reviewing any report before relying on it for
                business decisions.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Accounts and API keys</h2>
              <p>
                You&apos;re responsible for keeping your account password and API keys confidential.
                Any activity under your account or API key is treated as authorized by you. If you
                believe a key has been compromised, revoke it immediately from your dashboard.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Submit data you don&apos;t have the right to process (e.g. data belonging to someone else without their consent).</li>
                <li>Attempt to circumvent plan quotas, rate limits, or other technical restrictions.</li>
                <li>Use the service to generate content that is unlawful, defamatory, or infringes on others&apos; rights.</li>
                <li>Reverse-engineer, resell, or white-label the API outside the terms of your plan.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Billing and plans</h2>
              <p>
                Paid plans are billed monthly or annually through Stripe, in advance. Plan quotas reset
                at the start of each billing cycle. You can cancel anytime from the billing portal in
                your dashboard; cancellation takes effect at the end of the current billing period, and
                we don&apos;t provide prorated refunds for partial periods.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Availability</h2>
              <p>
                We aim for high uptime but don&apos;t guarantee the service will be uninterrupted or
                error-free. We may suspend or modify the service for maintenance, and we&apos;ll try to
                give notice for anything that affects paid customers materially.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Limitation of liability</h2>
              <p>
                The service is provided &quot;as is&quot;. To the maximum extent permitted by law, we
                aren&apos;t liable for indirect, incidental, or consequential damages arising from your
                use of the service, including decisions made based on generated report content.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Termination</h2>
              <p>
                You can stop using the service and delete your account at any time. We may suspend or
                terminate accounts that violate these terms, with notice where practical.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Changes to these terms</h2>
              <p>
                We&apos;ll update the &quot;last updated&quot; date above if these terms change
                materially, and post the new version here.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Contact</h2>
              <p>
                Questions about these terms? Email{" "}
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
