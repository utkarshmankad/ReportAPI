import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ChangelogEntry {
  version: string;
  date: string;
  badgeVariant: "success" | "default";
  badgeLabel: string;
  title: string;
  description: string;
  features?: string[];
}

const entries: ChangelogEntry[] = [
  {
    version: "v1.0.0",
    date: "May 20, 2026",
    badgeVariant: "success",
    badgeLabel: "Release",
    title: "General Availability",
    description:
      "ReportAPI is now publicly available. All four tiers live. Stripe billing active. RapidAPI listing published.",
    features: [
      "POST /v1/report/generate (sync + async)",
      "PDF export on Growth and Enterprise",
      "PII guard with DPDP audit log",
      "Scheduled delivery with cron",
      "GET /v1/usage with cost estimation",
      "Hindi and Tamil language output",
    ],
  },
  {
    version: "v0.9.0",
    date: "April 28, 2026",
    badgeVariant: "default",
    badgeLabel: "Beta",
    title: "Public Beta",
    description:
      "Opened to waitlist signups. 47 organisations onboarded. Latency improved from p95 18s to p95 8s after async queue optimisation.",
    features: [
      "Async job queue (Celery + Redis)",
      "Webhook delivery with retry logic",
      "Template system (POST /v1/template)",
      "Regenerate with correction_hint",
    ],
  },
  {
    version: "v0.5.0",
    date: "March 15, 2026",
    badgeVariant: "default",
    badgeLabel: "Alpha",
    title: "Private Alpha",
    description:
      "12 design partner companies onboarded. Core generate endpoint stable. Feedback: need PDF output and scheduling.",
    features: [
      "POST /v1/report/generate (sync only)",
      "API key auth",
      "Basic rate limiting",
    ],
  },
  {
    version: "v0.1.0",
    date: "February 1, 2026",
    badgeVariant: "default",
    badgeLabel: "Internal",
    title: "Internal scaffold",
    description:
      "Project initiated. FastAPI scaffold, Postgres schema, Anthropic API integration, Railway deployment.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  return (
    <main className="bg-bg min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-12 bg-bg text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
          <Badge variant="default">Changelog</Badge>
          <h1 className="text-4xl font-bold text-text-primary">
            What&apos;s new in ReportAPI
          </h1>
          <p className="text-text-secondary">
            Every release, every fix, every improvement — documented here.
          </p>

          {/* Subscribe */}
          <div className="flex gap-3 max-w-sm mx-auto mt-6 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-surface border border-border rounded-[--radius-md] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-[border-color,box-shadow] duration-150"
            />
            <Button variant="primary" size="md">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="flex flex-col">
          {entries.map((entry, i) => (
            <div key={entry.version} className="flex">
              {/* Date */}
              <time className="w-28 shrink-0 pt-1 text-text-tertiary text-sm font-mono">
                {entry.date}
              </time>

              {/* Centre track */}
              <div className="relative mx-6 flex flex-col items-center w-3 shrink-0">
                <div className="w-3 h-3 rounded-full bg-accent border-2 border-bg shrink-0 mt-1" />
                {i < entries.length - 1 && (
                  <div className="w-px bg-border flex-1 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-14">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={entry.badgeVariant}>{entry.badgeLabel}</Badge>
                    <span className="text-xs text-text-tertiary font-mono">
                      {entry.version}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    {entry.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {entry.description}
                  </p>
                  {entry.features && (
                    <ul className="flex flex-col gap-2 mt-1">
                      {entry.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <span className="text-accent shrink-0 mt-px font-medium">+</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-surface border-y border-border py-12 text-center px-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold text-text-primary">
            Want a feature on the roadmap?
          </p>
          <Button variant="primary" size="md">Submit feedback</Button>
        </div>
      </section>
    </main>
  );
}
