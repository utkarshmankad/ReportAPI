"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

type ContactType = "enterprise" | "partner" | "bug" | "partnership";

const contactTypes = [
  {
    id: "enterprise" as const,
    icon: "🏢",
    title: "Enterprise inquiry",
    description: "Procurement, custom contracts, volume pricing, or AWS Marketplace.",
    defaultSubject: "Enterprise inquiry — ReportAPI",
  },
  {
    id: "partner" as const,
    icon: "🤝",
    title: "Design partner",
    description: "Early access in exchange for weekly feedback. 5 spots remaining.",
    defaultSubject: "Design partner application",
  },
  {
    id: "bug" as const,
    icon: "🐛",
    title: "Bug report",
    description: "Something broken? Include your report_id and trace_id.",
    defaultSubject: "Bug report — ",
  },
  {
    id: "partnership" as const,
    icon: "💼",
    title: "Partnerships",
    description: "Integration partnerships, reseller agreements, or API distribution.",
    defaultSubject: "Partnership proposal",
  },
];

// ─── Field helpers ────────────────────────────────────────────────────────────

const inputClass =
  "w-full bg-surface border border-border rounded-[--radius-md] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-[border-color,box-shadow] duration-150";

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-text-secondary text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const found = contactTypes.find((t) => t.id === selectedType);
    if (found) setSubject(found.defaultSubject);
  }, [selectedType]);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    submitTimerRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  }

  function resetForm() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSelectedType(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setError("");
  }

  return (
    <main className="bg-bg min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-12 bg-bg">
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-4">
          <Badge variant="default">Contact</Badge>
          <h1 className="text-4xl font-bold text-text-primary">Get in touch</h1>
          <p className="text-text-secondary max-w-xl">
            For enterprise inquiries, partnership proposals, or support questions
            — we respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ── Left column ── */}
        <div className="flex flex-col">
          {/* Direct contact */}
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Direct contact
          </h3>
          <div className="bg-surface border border-border rounded-[--radius-lg] p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-subtle text-accent font-bold flex items-center justify-center shrink-0 text-sm">
                UM
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-text-primary font-semibold">Utkarsh Mankad</p>
                <p className="text-text-secondary text-sm">Founder</p>
                <a
                  href="mailto:hello@reportapi.io"
                  className="text-accent text-sm hover:text-accent-hover hover:underline transition-colors mt-1"
                >
                  hello@reportapi.io
                </a>
              </div>
            </div>
          </div>

          {/* Use case routing */}
          <h3 className="text-lg font-semibold text-text-primary mb-4 mt-8">
            What are you reaching out about?
          </h3>
          <div className="flex flex-col gap-3">
            {contactTypes.map((type) => (
              <div
                key={type.id}
                className="bg-surface border border-border rounded-[--radius-lg] p-4 flex gap-3 items-start hover:border-accent/40 transition-colors"
              >
                <span className="text-xl shrink-0" aria-hidden="true">
                  {type.icon}
                </span>
                <div>
                  <p className="text-text-primary text-sm font-medium">{type.title}</p>
                  <p className="text-text-secondary text-sm">{type.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Response SLA */}
          <div className="bg-success-subtle border border-success/20 rounded-[--radius-md] p-4 mt-8 flex flex-col gap-1">
            <p className="text-success font-medium text-sm flex items-center gap-2">
              <span>✓</span> We respond within 24 hours
            </p>
            <p className="text-text-secondary text-sm">
              For urgent production issues, include <strong className="text-text-primary font-medium">URGENT</strong> in your subject line.
            </p>
          </div>
        </div>

        {/* ── Right column — Form ── */}
        <div className="bg-surface border border-border rounded-[--radius-xl] p-8 shadow-md">
          {isSubmitted ? (
            /* Success state */
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <span className="text-5xl text-success" aria-hidden="true">✓</span>
              <h3 className="text-xl font-semibold text-text-primary">Message sent</h3>
              <p className="text-text-secondary text-sm">
                We&apos;ll get back to you at{" "}
                <span className="text-text-primary font-medium">{email}</span>{" "}
                within 24 hours.
              </p>
              <Button variant="ghost" size="md" onClick={resetForm}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {/* Type selector */}
              <div className="flex flex-col gap-2">
                <p className="text-text-secondary text-sm font-medium">Type</p>
                <div className="flex flex-col gap-2">
                  {contactTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setSelectedType(selectedType === type.id ? null : type.id)
                      }
                      className={cn(
                        "w-full text-left border rounded-[--radius-lg] p-4 flex gap-3 items-start transition-colors duration-150",
                        selectedType === type.id
                          ? "border-accent bg-accent-subtle"
                          : "border-border hover:border-accent/40"
                      )}
                    >
                      <span className="text-xl shrink-0" aria-hidden="true">
                        {type.icon}
                      </span>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            selectedType === type.id
                              ? "text-accent-text"
                              : "text-text-primary"
                          )}
                        >
                          {type.title}
                        </p>
                        <p className="text-text-secondary text-xs leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <Field label="Name" id="name">
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </Field>

              {/* Email */}
              <Field label="Email" id="email">
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </Field>

              {/* Subject */}
              <Field label="Subject" id="subject">
                <input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                />
              </Field>

              {/* Message */}
              <Field label="Message" id="message">
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us what you're working on and how we can help."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={cn(inputClass, "resize-none")}
                />
              </Field>

              {/* Error */}
              {error && (
                <p className="text-error text-sm" role="alert">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ── Office / Location strip ── */}
      <section className="bg-surface border-y border-border py-12">
        <div className="max-w-5xl mx-auto px-6 flex gap-8 flex-wrap">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">🇮🇳</span>
            <div>
              <p className="text-text-primary font-medium text-sm">
                Bengaluru, Karnataka
              </p>
              <p className="text-text-secondary text-sm">
                India Standard Time (IST, UTC+5:30)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">🕐</span>
            <div>
              <p className="text-text-primary font-medium text-sm">
                Mon–Fri, 10:00–19:00 IST
              </p>
              <p className="text-text-secondary text-sm">
                Responses outside hours the next morning
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
