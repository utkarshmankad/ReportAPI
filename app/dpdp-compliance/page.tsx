import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "DPDP Compliance — ReportAPI",
  description: "How ReportAPI approaches India's Digital Personal Data Protection Act, 2023.",
};

const lastUpdated = "August 4, 2026";

export default function DpdpCompliancePage() {
  return (
    <main className="bg-bg min-h-screen">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Badge variant="default">Legal</Badge>
          <h1 className="text-4xl font-bold text-text-primary">DPDP Compliance</h1>
          <p className="text-text-tertiary text-sm">Last updated: {lastUpdated}</p>

          <div className="flex flex-col gap-8 text-text-secondary leading-relaxed">
            <p>
              ReportAPI acts as a Data Fiduciary under India&apos;s Digital Personal Data Protection
              Act, 2023 (DPDP Act) for the personal data of our users. This page explains how we apply
              its principles today. We&apos;re a small team and this is an evolving area of law — this
              page is a good-faith summary, not a substitute for your own legal advice.
            </p>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Consent and purpose limitation</h2>
              <p>
                We only collect personal data (your email, submitted report data, billing identifiers)
                for the specific purpose of running the service — see our{" "}
                <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>{" "}
                for the full list. Creating an account is how you provide consent for this processing.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Data storage location</h2>
              <p>
                Our primary database (Supabase) is hosted in the ap-south-1 region (Mumbai, India). Some
                processing — generating the report narrative (Groq), payments (Stripe), transactional
                email (Resend), and application hosting (Vercel) — happens on infrastructure outside
                India. We only send these providers the minimum data each needs to do its job.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Your rights as a Data Principal</h2>
              <p>Under the DPDP Act, you have the right to:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Access a summary of the personal data we hold about you.</li>
                <li>Correct or update inaccurate personal data.</li>
                <li>Request erasure of your personal data, subject to legal retention requirements.</li>
                <li>Withdraw consent at any time by deleting your account.</li>
                <li>Register a grievance if you believe we&apos;ve mishandled your data.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Grievance redressal</h2>
              <p>
                To exercise any of the rights above or raise a grievance, contact our grievance officer
                at{" "}
                <a href="mailto:utkarsh.mankad@gmail.com" className="text-accent hover:underline">
                  utkarsh.mankad@gmail.com
                </a>
                . We aim to acknowledge grievances within 7 days and resolve them within 30 days.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Current limitations</h2>
              <p>
                We don&apos;t yet run automated PII-detection on data submitted for report generation —
                if the data you submit contains personal information about third parties, that&apos;s
                processed the same way as any other input. Don&apos;t submit data you&apos;re not
                authorized to share. We&apos;re evaluating dedicated PII scanning as a future feature.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
