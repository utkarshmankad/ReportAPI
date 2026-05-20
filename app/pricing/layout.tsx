import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ReportAPI",
  description:
    "Simple, usage-based pricing for ReportAPI. Start free, scale to Enterprise. No seat fees.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
