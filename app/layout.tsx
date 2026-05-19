import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ReportAPI — Raw data in. Board reports out.",
  description:
    "API-first automated reporting for mid-market enterprises. JSON or CSV in, executive narrative out. Sub-4s latency. DPDP compliant.",
  openGraph: {
    title: "ReportAPI — Raw data in. Board reports out.",
    description:
      "API-first automated reporting for mid-market enterprises. JSON or CSV in, executive narrative out. Sub-4s latency. DPDP compliant.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
          <Navbar />
          {children}
          <Footer />
        </body>
    </html>
  );
}
