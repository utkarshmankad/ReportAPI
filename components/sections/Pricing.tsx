"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { plans, resolvePrice } from "@/lib/pricing-data";

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { ref, isInView } = useInView();

  return (
    <section
      id="pricing"
      ref={ref}
      className={cn(
        "py-24 bg-surface transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <Badge variant="default">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Pay for what you use
          </h2>
          <p className="text-text-secondary">
            Hard quota caps. No overages. Cancel anytime.
          </p>

          {/* Toggle */}
          <div
            role="group"
            aria-label="Billing period"
            className="mt-2 flex items-center gap-1 bg-surface-raised border border-border rounded-[--radius-md] p-1"
          >
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-[--radius-sm] font-medium transition-colors",
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
                "px-4 py-1.5 text-sm rounded-[--radius-sm] font-medium transition-colors",
                annual
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Annual{" "}
              <span className={cn("text-xs", annual ? "text-white/80" : "text-text-secondary")}>
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
                "bg-bg border rounded-[--radius-xl] p-8 flex flex-col gap-6 shadow-sm",
                plan.featured
                  ? "border-2 border-accent shadow-lg ring-1 ring-accent/20"
                  : "border-border hover:border-accent/40 transition-colors"
              )}
            >
              {/* Card header */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">
                  {plan.name}
                </span>
                {plan.featured && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent-subtle text-accent-text">
                    Most popular
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-text-primary">
                  ${resolvePrice(plan.monthlyPrice, annual).toLocaleString()}
                </span>
                <span className="text-text-secondary text-sm mb-1">/mo</span>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-success shrink-0 mt-px">✓</span>
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
