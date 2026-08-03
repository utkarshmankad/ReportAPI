import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Features — ReportAPI",
  description:
    "Every feature in ReportAPI: sub-4s generation, PII guard, templates, scheduling, PDF export, and full observability.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  category: string;
  h2: string;
  description: string;
  bullets: string[];
  cta: string;
  ctaHref: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    category: "Core API",
    h2: "One endpoint. Unlimited report types.",
    description:
      "POST /v1/report/generate accepts any JSON or CSV structure up to 500 rows. The API infers column types, detects anomalies, and produces a narrative calibrated to your saved template. No schema registration. No configuration steps.",
    bullets: [
      "Accepts JSON arrays or base64-encoded CSV",
      "Auto-detects numeric, date, and categorical columns",
      "Returns narrative + tokens_used + report_id in a single response",
    ],
    cta: "Read API docs",
    ctaHref: "/docs",
  },
  {
    category: "Templates",
    h2: "Write your prompt once. Use it forever.",
    description:
      "Templates let you define tone, format, language, and structure once. Every report generated with that template inherits it exactly. Finance teams use one template for board packs. Ops teams use another for MIS reports.",
    bullets: [
      "Separate prompt_prefix and prompt_suffix for maximum control",
      "Output format: text, markdown, or PDF",
      "Scoped to your org — shared across all API keys",
    ],
    cta: "Explore templates",
    ctaHref: "/docs#templates",
  },
  {
    category: "Scheduling",
    h2: "Set it once. Get reports forever.",
    description:
      "Register a cron expression, a webhook URL, and a template. ReportAPI fires the job, generates the report, and delivers a PDF to your endpoint — every week, without human involvement.",
    bullets: [
      "Standard cron syntax (e.g. 0 7 * * 1 for every Monday 7am)",
      "Webhook delivery with 3 retries and exponential backoff",
      "Empty result sets are skipped and logged — no blank reports sent",
    ],
    cta: "Schedule a report",
    ctaHref: "/docs#scheduled-delivery",
  },
  {
    category: "Compliance",
    h2: "PII never reaches the model.",
    description:
      "Every payload is scanned at the ingestion layer before any LLM call is made. Aadhaar, PAN, and credit card patterns are detected via regex and Luhn check. The request is blocked, the event is logged, and your data never leaves the edge.",
    bullets: [
      "Blocks Aadhaar (12-digit), PAN, Visa/MC/Amex patterns",
      "Returns HTTP 451 with column_hint — not a generic error",
      "Audit log entry created on every block — zero raw data stored",
    ],
    cta: "Read security docs",
    ctaHref: "/docs#pii-detection",
  },
  {
    category: "PDF Export",
    h2: "Board-ready PDFs. Your logo, your format.",
    description:
      "Growth and Enterprise plans generate a formatted PDF alongside the narrative. Upload your logo once. Every PDF carries it. White-label mode (Enterprise) removes all ReportAPI branding entirely.",
    bullets: [
      "Rendered via WeasyPrint — pixel-perfect HTML-to-PDF",
      "PDF stored on Cloudflare R2 with a 7-day presigned URL",
      "White-label mode available on Enterprise plan",
    ],
    cta: "See PDF samples",
    ctaHref: "/docs#pdf-export",
  },
  {
    category: "Observability",
    h2: "Full visibility into every report.",
    description:
      "Every request carries a trace_id propagated through the LLM call and storage layer. Support can pull any report by ID. Usage counters update in real time. Cost per report is logged at the token level.",
    bullets: [
      "GET /v1/usage returns calls, reports, tokens, and estimated cost",
      "GET /v1/report/{id} available for 7 days (90 days on Growth)",
      "OpenTelemetry traces exported to Grafana Cloud",
    ],
    cta: "View usage API",
    ctaHref: "/docs",
  },
];

const tableRows = [
  { feature: "Setup time",         reportapi: "5 minutes",      diy: "3–6 months",       analyst: "2 weeks"           },
  { feature: "Cost/month",         reportapi: "From $149",      diy: "$5,000+ eng cost",  analyst: "$3,000+ salary"   },
  { feature: "PII compliance",     reportapi: "✓ Built in",     diy: "You build it",     analyst: "Manual process"    },
  { feature: "Scheduled delivery", reportapi: "✓ Native cron",  diy: "You build it",     analyst: "Calendar reminder" },
  { feature: "PDF output",         reportapi: "✓ Growth+",      diy: "You build it",     analyst: "Manual formatting" },
  { feature: "Multi-language",     reportapi: "✓ hi, ta, en",   diy: "You build it",     analyst: "Hire translator"   },
  { feature: "API-first",          reportapi: "✓ REST",         diy: "✓",                analyst: "✗"                 },
];

// ─── Code block wrapper ───────────────────────────────────────────────────────

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-[--radius-xl] p-6 shadow-md overflow-x-auto">
      <pre className="text-sm font-mono leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ─── Visuals (one per section, in section order) ──────────────────────────────

function CoreAPIVisual() {
  return (
    <CodeBlock>
      <span className="block"><span className="text-accent">POST</span><span className="text-text-primary"> /v1/report/generate HTTP/1.1</span></span>
      <span className="block"><span className="text-text-secondary">Authorization</span><span className="text-text-secondary">: </span><span className="text-success">Bearer rapi_live_••••••••</span></span>
      <span className="block"><span className="text-text-secondary">Content-Type</span><span className="text-text-secondary">: </span><span className="text-success">application/json</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;template_id&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;tmpl_board_pack&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;data&quot;</span><span className="text-text-secondary">: [</span></span>
      <span className="block"><span className="text-text-secondary">{"    { "}</span><span className="text-accent">&quot;region&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;North&quot;</span><span className="text-text-secondary">, </span><span className="text-accent">&quot;revenue&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">184200</span><span className="text-text-secondary">, </span><span className="text-accent">&quot;growth&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">0.12</span><span className="text-text-secondary"> {"}"}</span></span>
      <span className="block"><span className="text-text-secondary">{"    { "}</span><span className="text-accent">&quot;region&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;South&quot;</span><span className="text-text-secondary">, </span><span className="text-accent">&quot;revenue&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">97500</span><span className="text-text-secondary">,  </span><span className="text-accent">&quot;growth&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">0.08</span><span className="text-text-secondary"> {"}"}</span></span>
      <span className="block"><span className="text-text-secondary">{"  ]"}</span></span>
      <span className="block text-text-secondary">{"}"}</span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block"><span className="text-text-secondary">HTTP/1.1 </span><span className="text-success">200 OK</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;report_id&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;rpt_01hx9z3kw2f4a&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;status&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;completed&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;narrative&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;Q2 performance was strong...&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;tokens_used&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">312</span></span>
      <span className="block text-text-secondary">{"}"}</span>
    </CodeBlock>
  );
}

function TemplatesVisual() {
  return (
    <CodeBlock>
      <span className="block"><span className="text-accent">POST</span><span className="text-text-primary"> /v1/template HTTP/1.1</span></span>
      <span className="block"><span className="text-text-secondary">Authorization</span><span className="text-text-secondary">: </span><span className="text-success">Bearer rapi_live_••••••••</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;name&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;board_pack&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;format&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;markdown&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;language&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;en&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;prompt_prefix&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;You are a CFO writing a board summary.&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;prompt_suffix&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;End with key risks and recommendations.&quot;</span></span>
      <span className="block text-text-secondary">{"}"}</span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block"><span className="text-text-secondary">HTTP/1.1 </span><span className="text-success">201 Created</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;template_id&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;tmpl_01hxabc123&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;name&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;board_pack&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;status&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;active&quot;</span></span>
      <span className="block text-text-secondary">{"}"}</span>
    </CodeBlock>
  );
}

function SchedulingVisual() {
  return (
    <CodeBlock>
      <span className="block"><span className="text-accent">POST</span><span className="text-text-primary"> /v1/report/schedule HTTP/1.1</span></span>
      <span className="block"><span className="text-text-secondary">Authorization</span><span className="text-text-secondary">: </span><span className="text-success">Bearer rapi_live_••••••••</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;cron&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;0 7 * * 1&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;webhook_url&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;https://app.example.com/reports/hook&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;template_id&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;tmpl_board_pack&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;description&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;Weekly MIS report&quot;</span></span>
      <span className="block text-text-secondary">{"}"}</span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block"><span className="text-text-secondary">HTTP/1.1 </span><span className="text-success">201 Created</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;schedule_id&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;sched_01hxdef456&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;next_run&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;2025-01-27T07:00:00Z&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;status&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;active&quot;</span></span>
      <span className="block text-text-secondary">{"}"}</span>
    </CodeBlock>
  );
}

function ComplianceVisual() {
  return (
    <CodeBlock>
      <span className="block"><span className="text-accent">POST</span><span className="text-text-primary"> /v1/report/generate HTTP/1.1</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;data&quot;</span><span className="text-text-secondary">: [{"{"}</span></span>
      <span className="block"><span className="text-text-secondary">{"    "}</span><span className="text-accent">&quot;aadhaar&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;9876 5432 1012&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"    "}</span><span className="text-accent">&quot;name&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;Priya Sharma&quot;</span></span>
      <span className="block text-text-secondary">{"  }]"}</span>
      <span className="block text-text-secondary">{"}"}</span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block"><span className="text-text-secondary">HTTP/1.1 </span><span className="text-error">451 Unavailable For Legal Reasons</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;error&quot;</span><span className="text-text-secondary">: {"{"}</span></span>
      <span className="block"><span className="text-text-secondary">{"    "}</span><span className="text-accent">&quot;code&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;pii_detected&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"    "}</span><span className="text-accent">&quot;column_hint&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;aadhaar&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"    "}</span><span className="text-accent">&quot;message&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;PII pattern detected in payload&quot;</span></span>
      <span className="block text-text-secondary">{"  }"}</span>
      <span className="block text-text-secondary">{"}"}</span>
    </CodeBlock>
  );
}

function PDFExportVisual() {
  return (
    <CodeBlock>
      <span className="block"><span className="text-text-secondary">HTTP/1.1 </span><span className="text-success">200 OK</span></span>
      <span className="block"><span className="text-text-secondary">Content-Type</span><span className="text-text-secondary">: </span><span className="text-success">application/json</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;report_id&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;rpt_01hx9z3kw2f4a&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;status&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;completed&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;narrative&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;Q2 performance was strong...&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;pdf_url&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;https://r2.reportapi.io/rpt_01hx...&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;pdf_expires_at&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;2025-01-28T12:00:00Z&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;tokens_used&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">312</span></span>
      <span className="block text-text-secondary">{"}"}</span>
    </CodeBlock>
  );
}

function ObservabilityVisual() {
  return (
    <CodeBlock>
      <span className="block"><span className="text-accent">GET</span><span className="text-text-primary"> /v1/usage HTTP/1.1</span></span>
      <span className="block"><span className="text-text-secondary">Authorization</span><span className="text-text-secondary">: </span><span className="text-success">Bearer rapi_live_••••••••</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block"><span className="text-text-secondary">HTTP/1.1 </span><span className="text-success">200 OK</span></span>
      <span className="block text-text-secondary">{" "}</span>
      <span className="block text-text-secondary">{"{"}</span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;period&quot;</span><span className="text-text-secondary">: </span><span className="text-success">&quot;2025-01&quot;</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;calls_used&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">847</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;reports_generated&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">823</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;tokens_used&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">264511</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;quota_limit&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">1000</span><span className="text-text-secondary">,</span></span>
      <span className="block"><span className="text-text-secondary">{"  "}</span><span className="text-accent">&quot;estimated_cost_usd&quot;</span><span className="text-text-secondary">: </span><span className="text-warning">41.19</span></span>
      <span className="block text-text-secondary">{"}"}</span>
    </CodeBlock>
  );
}

const visuals = [
  <CoreAPIVisual key="core" />,
  <TemplatesVisual key="templates" />,
  <SchedulingVisual key="scheduling" />,
  <ComplianceVisual key="compliance" />,
  <PDFExportVisual key="pdf" />,
  <ObservabilityVisual key="observability" />,
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-bg pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-6">
            <Badge variant="default">Everything you need</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary max-w-2xl">
              Features built for{" "}
              <span className="text-accent">enterprise reporting</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Every feature was designed around one constraint: an analyst should
              never touch a spreadsheet to produce a board report again.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURE DEEP-DIVE ────────────────────────────────────────────── */}
      {sections.map((section, i) => (
        <section key={section.category} className="py-16 border-b border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div
              className={[
                "flex flex-col gap-12 items-center",
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row",
              ].join(" ")}
            >
              {/* Text block — always first in DOM so it appears on top on mobile */}
              <div className="flex-1 flex flex-col gap-5">
                <Badge variant="default">{section.category}</Badge>
                <h2 className="text-2xl font-bold text-text-primary">{section.h2}</h2>
                <p className="text-text-secondary leading-relaxed">{section.description}</p>
                <ul className="flex flex-col gap-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="text-success shrink-0 mt-px">✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div>
                  <Button variant="ghost" size="sm" href={section.ctaHref}>{section.cta}</Button>
                </div>
              </div>

              {/* Visual block — always second in DOM so it appears below on mobile */}
              <div className="flex-1 w-full">{visuals[i]}</div>
            </div>
          </div>
        </section>
      ))}

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl font-bold text-text-primary mb-8">
            ReportAPI vs the alternatives
          </h2>
          <div className="bg-surface border border-border rounded-[--radius-xl] overflow-x-auto shadow-md">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-surface-raised">
                  {["Feature", "ReportAPI", "Build it yourself", "Hire an analyst"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="text-left px-6 py-4 text-text-tertiary text-xs uppercase tracking-widest font-medium"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tableRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-6 py-4 text-text-secondary font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-success font-medium">{row.reportapi}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.diy}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.analyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-16 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Ready to eliminate manual reporting?
          </h2>
          <p className="text-text-secondary">Start for free. No credit card required.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/contact">Get API key</Button>
            {/*
              "View pricing" navigates to #pricing on the landing page.
              Using a styled <a> here preserves semantic link behaviour while
              matching the ghost-button appearance without duplicating component logic.
            */}
            <a
              href="/#pricing"
              className="inline-flex items-center justify-center font-medium rounded-[--radius-md] transition-all duration-150 cursor-pointer px-6 py-3 text-base bg-transparent border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              View pricing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
