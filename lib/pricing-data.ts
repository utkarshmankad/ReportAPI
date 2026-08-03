export interface Plan {
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export function resolvePrice(monthly: number, annual: boolean): number {
  return annual ? Math.round(monthly * 0.8) : monthly;
}

export const plans: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 149,
    description: "Perfect for small teams exploring automated reporting.",
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
    description: "For growing teams that need scale and customisation.",
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
    description: "Unlimited scale, white-label output, and dedicated SLAs.",
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
