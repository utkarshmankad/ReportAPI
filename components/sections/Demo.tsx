"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface GenerateResponse {
  narrative: string;
  report_id?: string;
  status?: string;
  tokens_used?: number;
}

const trustBullets = [
  "No account required for the demo",
  "Data is not stored or logged",
  "Uses the same API your customers get",
];

export function Demo() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [outputError, setOutputError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function handleGenerate() {
    if (!inputText.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    setIsLoading(true);
    setOutputText("");
    setOutputError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${baseUrl}/v1/report/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: inputText }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }

      const json = await res.json() as GenerateResponse;
      setOutputText(json.narrative ?? "");
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        setOutputError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  const { ref, isInView } = useInView();

  return (
    <section
      id="demo"
      ref={ref}
      className={cn(
        "py-24 bg-bg transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — text */}
          <div className="flex flex-col gap-6">
            <Badge variant="default">Live demo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              See it work on your data
            </h2>
            <p className="text-text-secondary">
              Paste any CSV or JSON below and hit Generate. We&apos;ll call the
              real API and return a live narrative.
            </p>
            <ul className="flex flex-col gap-3 mt-2">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-success shrink-0 mt-px">✓</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — widget */}
          <div className="flex flex-col gap-4">
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Paste your data here"
              placeholder="Paste CSV or JSON here..."
              className="bg-surface border border-border rounded-[--radius-md] p-4 text-sm font-mono w-full text-text-primary placeholder:text-text-tertiary resize-none outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-150"
            />

            <Button
              variant="primary"
              size="md"
              disabled={isLoading || !inputText.trim()}
              onClick={handleGenerate}
              className="w-full justify-center"
            >
              {isLoading ? "Generating..." : "Generate report ↗"}
            </Button>

            {outputText && (
              <div className="bg-surface border border-border rounded-[--radius-md] p-4">
                <p className="text-accent text-xs font-mono tracking-widest uppercase mb-2">OUTPUT</p>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{outputText}</p>
              </div>
            )}

            {outputError && (
              <div className="bg-surface border border-error/20 rounded-[--radius-md] p-4">
                <p className="text-error text-xs font-mono tracking-widest uppercase mb-2">ERROR</p>
                <p className="text-sm text-error leading-relaxed">{outputError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
