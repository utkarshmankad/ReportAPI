import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — ReportAPI",
  description:
    "Get in touch with the ReportAPI team for enterprise inquiries, partnership proposals, or support.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
