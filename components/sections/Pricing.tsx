"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

interface Plan {
  name: string;
  monthlyPrice: number;
  features: string[];
  cta: string;
  featured: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 149,
    features: [
      "50 reports/month",
      "JSON→narrative",
      "Email delivery",
      "Standard templates",
      "Community support",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Growth",
    monthlyPrice: 499,
    features: [
      "500 reports/month",
      "PDF + PPTX export",
      "Scheduled delivery",
      "Custom templates",
      "Webhook callbacks",
      "Email support",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 1500,
    features: [
      "Unlimited reports",
      "White-label output",
      "Custom LLM prompt",
      "Dedicated SLA",
      "On-prem option",
      "Dedicated support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

function resolvePrice(monthly: number, annual: boolean): number {
  return annual ? Math.round(monthly * 0.8) : monthly;
}

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { ref, isInView } = useInView();

  return (
    <section
      id="pricing"
      ref={ref}
      className={cn(
        "py-24 transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <Badge variant="default">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary]">
            Pay for what you use
          </h2>
          <p className="text-[--color-text-secondary]">
            Hard quota caps. No overages. Cancel anytime.
          </p>

          {/* Toggle */}
          <div role="group" aria-label="Billing period" className="mt-2 flex items-center gap-1 bg-[--color-surface] border border-[--color-border] rounded-[--radius-md] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-[--radius-sm] font-medium transition-colors",
                !annual
                  ? "bg-[--color-accent] text-white"
                  : "text-[--color-text-secondary] hover:text-[--color-text-primary]"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-[--radius-sm] font-medium transition-colors",
                annual
                  ? "bg-[--color-accent] text-white"
                  : "text-[--color-text-secondary] hover:text-[--color-text-primary]"
              )}
            >
              Annual{" "}
              <span className={cn("text-xs", annual ? "text-white/80" : "text-[--color-text-secondary]")}>
                (save 20%)
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-[--radius-lg] p-8 flex flex-col gap-6",
                plan.featured
                  ? "bg-[--color-surface] border-2 border-[--color-accent]"
                  : "bg-[--color-surface] border border-[--color-border]"
              )}
            >
              {/* Card header */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[--color-text-primary]">
                  {plan.name}
                </span>
                {plan.featured && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-[--radius-sm] bg-[--color-accent]/10 text-[--color-accent]">
                    Most popular
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-[--color-text-primary]">
                  ${resolvePrice(plan.monthlyPrice, annual).toLocaleString()}
                </span>
                <span className="text-[--color-text-secondary] text-sm mb-1">/mo</span>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[--color-text-secondary]">
                    <span className="text-[--color-success] shrink-0 mt-px">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.featured ? "primary" : "ghost"}
                size="md"
                className="w-full mt-auto justify-center"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
