import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { InlineCode } from "@/components/ui/InlineCode";
import { DocsSearch } from "@/components/docs/DocsSearch";

// Search only indexes sections that actually exist on this page (plus the
// interactive API reference) — the sidebar nav below also lists roadmap
// sections that don't have a real destination yet, so those are excluded
// here to avoid search results that jump nowhere.
const searchEntries = [
  { label: "Introduction", href: "#introduction", heading: "Getting Started" },
  { label: "Authentication", href: "#authentication", heading: "Getting Started" },
  { label: "API keys", href: "#api-keys", heading: "Getting Started" },
  { label: "Your first report", href: "#your-first-report", heading: "Getting Started" },
  { label: "Error handling", href: "#error-handling", heading: "Getting Started" },
  { label: "Interactive API Reference", href: "/docs/api-reference", heading: "API Reference" },
];

export const metadata: Metadata = {
  title: "Documentation — ReportAPI",
  description:
    "ReportAPI developer documentation: authentication, your first report, error handling, and full API reference.",
};

// ─── Nav data ─────────────────────────────────────────────────────────────────

const navSections = [
  {
    heading: "Getting Started",
    links: [
      { label: "Introduction", href: "#introduction" },
      { label: "Authentication", href: "#authentication" },
      { label: "Your first report", href: "#your-first-report" },
      { label: "Error handling", href: "#error-handling" },
    ],
  },
  {
    heading: "API Reference",
    links: [
      { label: "POST /v1/report/generate", href: "#post-generate" },
      { label: "GET /v1/report/{id}", href: "#get-report" },
      { label: "POST /v1/report/{id}/regenerate", href: "#post-regenerate" },
      { label: "POST /v1/template", href: "#post-template" },
      { label: "POST /v1/report/schedule", href: "#post-schedule" },
      { label: "GET /v1/usage", href: "#get-usage" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { label: "Building a weekly MIS report", href: "#mis-report" },
      { label: "Using templates", href: "#templates" },
      { label: "Scheduled delivery setup", href: "#scheduled-delivery" },
      { label: "PDF export", href: "#pdf-export" },
      { label: "Multi-language reports", href: "#multi-language" },
    ],
  },
  {
    heading: "Compliance",
    links: [
      { label: "PII detection", href: "#pii-detection" },
      { label: "DPDP Act compliance", href: "#dpdp-compliance" },
      { label: "Data retention", href: "#data-retention" },
    ],
  },
];

// ─── Quick-start cards ────────────────────────────────────────────────────────

const quickStartCards = [
  {
    icon: "⚡",
    title: "Quickstart",
    description: "Make your first API call in under 5 minutes.",
    cta: "Read guide →",
    href: "#your-first-report",
  },
  {
    icon: "📋",
    title: "API Reference",
    description: "Interactive reference for the endpoints that are live today — try requests right from the browser.",
    cta: "View reference →",
    href: "/docs/api-reference",
  },
  {
    icon: "📦",
    title: "SDKs & Libraries",
    description: "Code snippets for calling the API directly — official SDKs are on the roadmap.",
    cta: "Browse snippets →",
    href: "#your-first-report",
  },
];

// ─── Error table data ─────────────────────────────────────────────────────────

const errorRows = [
  { status: "401", code: "missing_api_key",   meaning: "No Authorization header" },
  { status: "403", code: "api_key_revoked",   meaning: "Key has been revoked" },
  { status: "413", code: "payload_too_large", meaning: "Input exceeds 500 rows or 50 columns" },
  { status: "422", code: "empty_dataset",     meaning: "data array has 0 rows" },
  { status: "429", code: "quota_exceeded",    meaning: "Monthly report limit reached" },
  { status: "451", code: "pii_detected",      meaning: "Regulated identifier found in payload" },
  { status: "500", code: "internal_error",    meaning: "Contact support with error_id" },
];

// ─── Changelog data ───────────────────────────────────────────────────────────

const changelog = [
  {
    date: "2026-05-20",
    title: "v1.0 launch",
    description: "POST /generate, templates, PDF export, scheduled jobs.",
  },
  {
    date: "2026-04-10",
    title: "Beta",
    description: "Private beta with 12 design partners.",
  },
  {
    date: "2026-03-01",
    title: "Alpha",
    description: "Internal testing begins.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-surface border border-border rounded-[--radius-md] p-4 font-mono text-sm text-text-secondary overflow-x-auto leading-relaxed whitespace-pre">
      <code>{children}</code>
    </pre>
  );
}

function SectionHeading({
  id,
  level,
  children,
}: {
  id: string;
  level: 2 | 3;
  children: React.ReactNode;
}) {
  const className =
    level === 2
      ? "text-2xl font-bold text-text-primary scroll-mt-28"
      : "text-lg font-semibold text-text-primary scroll-mt-28";
  if (level === 2)
    return (
      <h2 id={id} className={className}>
        {children}
      </h2>
    );
  return (
    <h3 id={id} className={className}>
      {children}
    </h3>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <main className="bg-bg min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-12 bg-bg px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-5">
          <Badge variant="default">Documentation</Badge>
          <h1 className="text-4xl font-bold text-text-primary">
            ReportAPI Documentation
          </h1>
          <p className="text-text-secondary max-w-xl">
            Everything you need to integrate, deploy, and scale automated reporting.
          </p>

          {/* Search */}
          <DocsSearch entries={searchEntries} />
        </div>
      </section>

      {/* ── Quick-start cards ── */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStartCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-surface border border-border rounded-[--radius-lg] p-6 shadow-sm hover:border-accent/40 transition-colors duration-200 cursor-pointer flex flex-col gap-4"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-accent-subtle rounded-[--radius-sm] text-xl">
                {card.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-text-primary">{card.title}</span>
                <p className="text-sm text-text-secondary">{card.description}</p>
              </div>
              <span className="text-accent text-sm mt-auto">{card.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Two-column layout ── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto flex gap-12 items-start">
          {/* Sidebar */}
          <aside className="hidden md:block w-1/4 shrink-0 sticky top-24 self-start">
            <nav className="flex flex-col gap-6">
              {navSections.map((section) => (
                <div key={section.heading}>
                  <p className="text-text-tertiary text-xs uppercase tracking-widest font-medium mb-2">
                    {section.heading}
                  </p>
                  <ul className="flex flex-col">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-text-secondary text-sm hover:text-text-primary transition-colors py-1 block"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-14">
            {/* Introduction */}
            <article className="flex flex-col gap-4">
              <SectionHeading id="introduction" level={2}>
                Introduction
              </SectionHeading>
              <p className="text-text-secondary leading-relaxed">
                ReportAPI is a REST API that converts structured datasets into polished
                natural-language narratives. Send a JSON payload containing your tabular
                data, choose an output format, and receive a publication-ready report in
                under four seconds. The API is stateless, versioned, and designed to slot
                into any backend stack without friction.
              </p>
              <p className="text-text-secondary leading-relaxed">
                All endpoints live under{" "}
                <InlineCode>
                  https://api.reportapi.io/v1
                </InlineCode>
                . Every response is JSON. Errors follow a consistent shape with a
                top-level{" "}
                <InlineCode>
                  error
                </InlineCode>{" "}
                object containing a machine-readable{" "}
                <InlineCode>
                  code
                </InlineCode>{" "}
                and a human-readable{" "}
                <InlineCode>
                  message
                </InlineCode>
                . The API is covered by our SOC 2 Type II audit on Growth and Enterprise
                plans.
              </p>
            </article>

            {/* Authentication */}
            <article className="flex flex-col gap-4">
              <SectionHeading id="authentication" level={2}>
                Authentication
              </SectionHeading>
              <SectionHeading id="api-keys" level={3}>
                API Keys
              </SectionHeading>
              <p className="text-text-secondary leading-relaxed">
                All requests must include your API key in the{" "}
                <InlineCode>
                  Authorization
                </InlineCode>{" "}
                header.
              </p>
              <CodeBlock>{`Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
              <p className="text-text-secondary leading-relaxed">
                API keys are scoped to your organisation. All members share one key per
                tier. Rotate keys from your dashboard without downtime — the previous key
                remains valid for 60 seconds during the rotation window so in-flight
                requests are not interrupted.
              </p>
            </article>

            {/* Your first report */}
            <article className="flex flex-col gap-5">
              <SectionHeading id="your-first-report" level={2}>
                Your first report
              </SectionHeading>

              <ol className="flex flex-col gap-3 list-none">
                {[
                  "Sign up and copy your API key from the dashboard.",
                  "Send a POST request with your data.",
                  "Read the narrative from the response.",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-text-secondary text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>

              <p className="text-text-tertiary text-xs uppercase tracking-widest font-medium">
                Request
              </p>
              <CodeBlock>{`curl -X POST https://api.reportapi.io/v1/report/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": [
      {"month": "Jan", "revenue": 120000, "expenses": 85000},
      {"month": "Feb", "revenue": 134000, "expenses": 91000},
      {"month": "Mar", "revenue": 158000, "expenses": 94000}
    ],
    "output_format": "text"
  }'`}</CodeBlock>

              <p className="text-text-tertiary text-xs uppercase tracking-widest font-medium">
                Response
              </p>
              <CodeBlock>{`{
  "report_id": "rpt_01J2X...",
  "status": "complete",
  "narrative": "Revenue grew 31.7% over Q1, from ₹1.20L in January to
    ₹1.58L in March, while expense growth remained contained at 10.6%.
    The improving revenue-to-expense ratio signals strengthening
    operational leverage heading into Q2.",
  "tokens_used": 318
}`}</CodeBlock>
            </article>

            {/* Error Handling */}
            <article className="flex flex-col gap-4">
              <SectionHeading id="error-handling" level={2}>
                Error Handling
              </SectionHeading>
              <p className="text-text-secondary leading-relaxed">
                All errors return a JSON body with an{" "}
                <InlineCode>
                  error
                </InlineCode>{" "}
                object. Use the{" "}
                <InlineCode>
                  error.code
                </InlineCode>{" "}
                field for programmatic handling — the{" "}
                <InlineCode>
                  message
                </InlineCode>{" "}
                field may change between releases.
              </p>

              <div className="overflow-x-auto rounded-[--radius-md] border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-raised border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-text-primary">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-text-primary">
                        error.code
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-text-primary">
                        Meaning
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-bg divide-y divide-border">
                    {errorRows.map((row) => (
                      <tr
                        key={row.code}
                        className="hover:bg-surface transition-colors duration-100"
                      >
                        <td className="px-4 py-3 font-mono text-text-secondary">
                          {row.status}
                        </td>
                        <td className="px-4 py-3 font-mono text-accent text-xs">
                          {row.code}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{row.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Changelog strip ── */}
      <section className="py-16 bg-surface px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-text-primary">Recent updates</h2>
          <div className="flex flex-col divide-y divide-border">
            {changelog.map((entry) => (
              <div key={entry.date} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 py-4">
                <time className="text-text-tertiary text-sm font-mono shrink-0 w-28">
                  {entry.date}
                </time>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                  <span className="font-semibold text-text-primary">{entry.title}</span>
                  <span className="text-text-secondary text-sm">{entry.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
