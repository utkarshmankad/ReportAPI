interface LinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

const linkGroups: LinkGroup[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Docs", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "DPDP Compliance", href: "/dpdp-compliance" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Four-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2 w-fit">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="font-semibold text-text-primary">ReportAPI</span>
            </a>
            <p className="text-sm text-text-secondary">
              Raw data in. Board reports out.
            </p>
          </div>

          {/* Link group columns */}
          {linkGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-widest font-medium text-text-tertiary">
                {group.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © 2026 ReportAPI. All rights reserved.
          </p>
          <p className="text-sm text-text-tertiary">
            Built for India. Runs everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
