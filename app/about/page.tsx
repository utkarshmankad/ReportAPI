import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: "🎯",
    title: "Precision over polish",
    body: "A report that is accurate and delivered on time matters more than one that is beautifully formatted but arrived late. We optimise for correctness and reliability first.",
  },
  {
    icon: "🔒",
    title: "Privacy as default",
    body: "We designed PII detection before we designed the generate endpoint. DPDP compliance is not a feature you enable — it is the baseline.",
  },
  {
    icon: "⚡",
    title: "Developer experience is the product",
    body: "If integration takes more than 5 minutes, we failed. Our API is designed to be curl-testable in under 2 minutes with no account required.",
  },
];

const stats = [
  { value: "120+", label: "companies on the waitlist" },
  { value: "4s",   label: "median report generation time" },
  { value: "98%+", label: "gross margin target" },
  { value: "2",    label: "weeks to first paying customer" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="bg-bg min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 bg-bg">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <Badge variant="default">About</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            We&apos;re building the{" "}
            <span className="text-accent">reporting layer</span>
            {" "}for India
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            ReportAPI started from a single observation: finance and ops teams at
            India&apos;s fastest-growing companies spend most of their week producing
            the same reports, manually, every single time. We built an API to
            eliminate that.
          </p>
        </div>
      </section>

      {/* ── Mission statement ── */}
      <div className="max-w-3xl mx-auto px-6 my-12">
        <div className="bg-surface border border-border rounded-[--radius-xl] p-8 md:p-12 shadow-md text-center flex flex-col items-center gap-4">
          <span className="text-8xl text-accent/20 font-serif leading-none select-none" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="text-xl md:text-2xl font-medium text-text-primary italic leading-relaxed -mt-6">
            Every analyst hour spent on formatting is an analyst hour not spent
            on insight.
          </blockquote>
          <p className="text-text-tertiary text-sm">
            — The principle behind ReportAPI
          </p>
        </div>
      </div>

      {/* ── Three values ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-10">
          What we believe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-surface border border-border rounded-[--radius-lg] p-6 shadow-sm flex flex-col gap-4"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {value.icon}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-text-primary">{value.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats band ── */}
      <div className="bg-surface border-y border-border py-12 my-8">
        <div className="max-w-5xl mx-auto px-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-1">
                <dt className="text-3xl font-bold text-text-primary">{stat.value}</dt>
                <dd className="text-text-secondary text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Team ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-10">
          The team
        </h2>
        <div className="max-w-sm mx-auto">
          <div className="bg-surface border border-border rounded-[--radius-xl] p-8 shadow-sm text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-accent-subtle text-accent text-2xl font-bold flex items-center justify-center mx-auto mb-4">
              UM
            </div>
            <p className="text-text-primary font-semibold text-lg">Utkarsh Mankad</p>
            <p className="text-text-secondary text-sm">Founder &amp; Engineer</p>
            <p className="text-text-secondary text-sm leading-relaxed mt-3 text-left">
              Full-stack engineer with a focus on developer tools and API
              infrastructure. Built ReportAPI to solve the manual reporting
              problem he saw firsthand across multiple product roles at Indian
              startups.
            </p>
          </div>
        </div>
      </section>

      {/* ── Backed by ── */}
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-text-secondary text-sm">
          Bootstrapped. No outside funding. Built in Bengaluru.
        </p>
      </div>

      {/* ── CTA ── */}
      <section className="bg-bg py-16 text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
          <h2 className="text-3xl font-bold text-text-primary">
            Want to work together?
          </h2>
          <p className="text-text-secondary max-w-lg">
            ReportAPI is open to design partners, early enterprise customers,
            and feedback from operators building in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button variant="primary" size="lg">Get early access</Button>
            <Button variant="ghost" size="lg">Read the docs</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
