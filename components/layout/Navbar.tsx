import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[--color-bg]/80 backdrop-blur-md border-b border-[--color-border]">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[--color-accent] shrink-0" />
          <span className="font-semibold text-[--color-text-primary]">ReportAPI</span>
        </a>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <Button variant="primary" size="sm">
          Get API key
        </Button>
      </div>
    </header>
  );
}
