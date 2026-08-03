"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { plans, resolvePrice } from "@/lib/pricing-data";

// ─── Comparison table ────────────────────────────────────────────────────────

/** true = supported, false = not available, string = partial/future (e.g. "(v1.1)") */
type CellSupport = true | false | string;

interface ComparisonGroup {
  label: string;
  rows: { feature: string; starter: CellSupport; growth: CellSupport; enterprise: CellSupport }[];
}

const comparisonGroups: ComparisonGroup[] = [
  {
    label: "Reports",
    rows: [
      { feature: "Monthly report limit", starter: "50", growth: "500", enterprise: "Unlimited" },
      { feature: "JSON input", starter: true, growth: true, enterprise: true },
      { feature: "CSV / tabular input", starter: true, growth: true, enterprise: true },
      { feature: "Multi-dataset merge", starter: false, growth: true, enterprise: true },
    ],
  },
  {
    label: "Delivery",
    rows: [
      { feature: "Narrative text output", starter: true, growth: true, enterprise: true },
      { feature: "PDF export", starter: false, growth: true, enterprise: true },
      { feature: "PPTX export", starter: false, growth: true, enterprise: true },
      { feature: "Email delivery", starter: true, growth: true, enterprise: true },
      { feature: "Webhook callbacks", starter: false, growth: true, enterprise: true },
      { feature: "Scheduled delivery", starter: false, growth: true, enterprise: true },
    ],
  },
  {
    label: "Customisation",
    rows: [
      { feature: "Standard templates", starter: true, growth: true, enterprise: true },
      { feature: "Custom templates", starter: false, growth: true, enterprise: true },
      { feature: "White-label output", starter: false, growth: false, enterprise: true },
      { feature: "Custom LLM prompt", starter: false, growth: false, enterprise: true },
      { feature: "Hindi & Tamil output", starter: "(v1.1)", growth: "(v1.1)", enterprise: "(v1.1)" },
    ],
  },
  {
    label: "Compliance & Security",
    rows: [
      { feature: "PII guard", starter: true, growth: true, enterprise: true },
      { feature: "SOC 2 Type II", starter: false, growth: true, enterprise: true },
      { feature: "On-premises deployment", starter: false, growth: false, enterprise: true },
      { feature: "Audit log export", starter: false, growth: "(v3)", enterprise: true },
    ],
  },
  {
    label: "Support",
    rows: [
      { feature: "Community forums", starter: true, growth: true, enterprise: true },
      { feature: "Email support", starter: false, growth: true, enterprise: true },
      { feature: "Dedicated SLA", starter: false, growth: false, enterprise: true },
      { feature: "Onboarding call", starter: false, growth: false, enterprise: true },
    ],
  },
];

function Cell({ value }: { value: CellSupport }) {
  if (value === true)
    return <span className="text-success font-medium">✓</span>;
  if (value === false)
    return <span className="text-text-tertiary">—</span>;
  return <span className="text-text-tertiary text-xs italic">{value}</span>;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "What counts as one report?",
    a: "Each POST to /v1/report generates one report, regardless of payload size or output format. Retries on our side due to transient errors are not counted.",
  },
  {
    q: "Can I upgrade or downgrade at any time?",
    a: "Yes. Plan changes take effect at the start of the next billing cycle. Unused report quota does not roll over between months.",
  },
  {
    q: "What happens when I hit my monthly limit?",
    a: "The API returns a 429 with a clear message. We never silently bill overages — you decide whether to upgrade or wait for the next cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "The live demo on the home page lets you try the API without an account. For a full integration test, contact us for a 14-day trial key.",
  },
  {
    q: "How does the annual discount work?",
    a: "Annual plans are billed upfront for 12 months at 20% off the monthly rate. You can still cancel, and we'll refund unused months pro-rata.",
  },
  {
    q: "Is my data stored after a report is generated?",
    a: "No. Input payloads and output narratives are purged within 60 seconds of the response being returned. We store only anonymised request metadata for billing.",
  },
  {
    q: "Which LLM powers the narrative engine?",
    a: "We currently use a fine-tuned version of Claude Sonnet. Enterprise customers can bring their own prompt layer or request a different model via the dedicated SLA.",
  },
  {
    q: "Do you offer a reseller or white-label programme?",
    a: "Yes. Enterprise includes white-label output and a reseller agreement. Contact our team to discuss volume licensing.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="bg-bg min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 bg-bg text-center px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
          <Badge variant="default">Simple pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            One price. One API.{" "}
            <span className="text-accent">Nothing more.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl">
            Hard quota caps, no overage surprises. Upgrade, downgrade, or cancel
            anytime — no contracts, no lock-in.
          </p>

          {/* Billing toggle */}
          <div
            role="group"
            aria-label="Billing period"
            className="mt-2 flex items-center gap-1 bg-surface-raised border border-border rounded-[--radius-md] p-1"
          >
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 text-sm rounded-[--radius-sm] font-medium transition-colors",
                !annual
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2 text-sm rounded-[--radius-sm] font-medium transition-colors",
                annual
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Annual{" "}
              <span className={cn("text-xs", annual ? "text-white/80" : "text-success")}>
                (save 20%)
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "bg-bg border rounded-[--radius-xl] p-8 flex flex-col gap-6 shadow-sm",
                plan.featured
                  ? "border-2 border-accent shadow-lg ring-1 ring-accent/20"
                  : "border-border hover:border-accent/40 transition-colors duration-200"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary text-lg">{plan.name}</span>
                {plan.featured && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent-subtle text-accent-text">
                    Most popular
                  </span>
                )}
              </div>

              <p className="text-sm text-text-secondary -mt-2">{plan.description}</p>

              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-text-primary">
                  ${resolvePrice(plan.monthlyPrice, annual).toLocaleString()}
                </span>
                <span className="text-text-secondary text-sm mb-1">/mo</span>
                {annual && (
                  <span className="text-xs text-text-tertiary mb-1 ml-1">billed annually</span>
                )}
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-success shrink-0 mt-px">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "primary" : "ghost"}
                size="md"
                href="/contact"
                className="w-full mt-auto justify-center"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature comparison table ── */}
      <section className="py-20 bg-surface px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <Badge variant="default">Full comparison</Badge>
            <h2 className="text-3xl font-bold text-text-primary">Everything, side by side</h2>
          </div>

          <div className="overflow-x-auto rounded-[--radius-xl] border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-raised border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-text-primary w-2/5">
                    Feature
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-text-primary">Starter</th>
                  <th className="text-center px-4 py-4 font-semibold text-accent">Growth</th>
                  <th className="text-center px-4 py-4 font-semibold text-text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody className="bg-bg divide-y divide-border">
                {comparisonGroups.map((group) => (
                  <>
                    <tr key={`group-${group.label}`} className="bg-surface">
                      <td
                        colSpan={4}
                        className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary"
                      >
                        {group.label}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr
                        key={row.feature}
                        className="hover:bg-surface transition-colors duration-100"
                      >
                        <td className="px-6 py-3 text-text-secondary">{row.feature}</td>
                        <td className="px-4 py-3 text-center">
                          <Cell value={row.starter} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Cell value={row.growth} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Cell value={row.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-bg px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <Badge variant="default">FAQ</Badge>
            <h2 className="text-3xl font-bold text-text-primary">Common questions</h2>
          </div>

          <div className="flex flex-col divide-y divide-border border border-border rounded-[--radius-xl] overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-bg">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-text-primary font-medium hover:bg-surface transition-colors duration-150"
                  aria-expanded={openIndex === i}
                >
                  <span>{faq.q}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={cn(
                      "w-5 h-5 shrink-0 text-text-tertiary transition-transform duration-200",
                      openIndex === i && "rotate-180"
                    )}
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5 text-sm text-text-secondary leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise callout ── */}
      <section className="py-20 bg-surface px-6">
        <div className="max-w-5xl mx-auto rounded-[--radius-xl] border border-border bg-bg shadow-sm p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1 flex flex-col gap-3">
            <Badge variant="default">Enterprise</Badge>
            <h2 className="text-2xl font-bold text-text-primary">
              Need something custom?
            </h2>
            <p className="text-text-secondary max-w-lg">
              Volume licensing, on-premises deployment, custom SLAs, dedicated
              infrastructure, and white-label agreements. Our team will scope a
              plan around your requirements.
            </p>
            <ul className="mt-1 flex flex-col gap-1.5">
              {[
                "Unlimited reports",
                "Custom LLM prompts",
                "On-prem or private cloud",
                "Dedicated account manager",
                "SOC 2 Type II certification",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <Button variant="primary" size="md" href="/contact">
              Talk to us
            </Button>
            <Button variant="ghost" size="md" href="/docs">
              View docs
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
