"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Failed to subscribe.");
        return;
      }

      setDone(true);
    } catch {
      setError("Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-success mt-6">You&apos;re subscribed — we&apos;ll email you about new releases.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto mt-6 w-full">
      <div className="flex gap-3 w-full">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-surface border border-border rounded-[--radius-md] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-[border-color,box-shadow] duration-150"
        />
        <Button variant="primary" size="md" type="submit" disabled={loading}>
          {loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
