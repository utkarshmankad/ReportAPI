"use client";

import { Badge } from "@/components/ui/Badge";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Send data",
    description: "POST your JSON or CSV to /v1/report/generate",
  },
  {
    number: "02",
    title: "Template applied",
    description: "Your saved template shapes tone, format, and language",
  },
  {
    number: "03",
    title: "Receive narrative",
    description: "Get executive prose back in under 4 seconds",
  },
];

const features: Feature[] = [
  {
    icon: "⚡",
    title: "Sub-4s latency",
    description:
      "p50 under 4 seconds. p95 under 10. SLA-backed for Growth tier and above.",
  },
  {
    icon: "🔒",
    title: "PII guard built in",
    description:
      "Aadhaar, PAN, and credit card patterns blocked at the edge. DPDP Act compliant.",
  },
  {
    icon: "📊",
    title: "Template system",
    description:
      "Save your prompt templates once. Consistent output every report, every week.",
  },
  {
    icon: "🌐",
    title: "Hindi & Tamil output",
    description:
      "Pass lang=hi or lang=ta. Native language board reports for regional ops teams.",
  },
  {
    icon: "🔄",
    title: "Scheduled delivery",
    description:
      "Register a cron. We pull, generate, and email the PDF. Zero manual steps.",
  },
  {
    icon: "💰",
    title: "Predictable pricing",
    description:
      "Per-report pricing with hard quota caps. No surprise bills at end of month.",
  },
];

export function Features() {
  const { ref, isInView } = useInView();

  return (
    <section
      id="features"
      ref={ref}
      className={cn(
        "py-24 transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <Badge variant="default">How it works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary]">
            One API call. Board-ready output.
          </h2>
          <p className="text-[--color-text-secondary]">
            Three steps from raw data to narrative report.
          </p>
        </div>

        {/* Three-step flow */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-20">
          {steps.map((step, i) => (
            <div key={step.number} className="flex-1 flex flex-col md:flex-row items-stretch gap-4">
              <div className="flex-1 bg-[--color-surface] border border-[--color-border] rounded-[--radius-lg] p-6 flex flex-col gap-3">
                <span className="text-5xl font-bold text-[--color-border] leading-none select-none">
                  {step.number}
                </span>
                <p className="font-semibold text-[--color-text-primary]">{step.title}</p>
                <p className="text-sm text-[--color-text-secondary]">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center text-[--color-accent] text-xl self-center shrink-0">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[--color-surface] border border-[--color-border] rounded-[--radius-lg] p-6 flex flex-col gap-4"
            >
              <div className="w-9 h-9 bg-[--color-accent]/10 rounded-[--radius-sm] flex items-center justify-center text-lg">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-[--color-text-primary]">{feature.title}</p>
                <p className="text-sm text-[--color-text-secondary]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
