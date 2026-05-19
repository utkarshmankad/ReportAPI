"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const trustBullets = [
  "No account required for the demo",
  "Data is not stored or logged",
  "Uses the same API your customers get",
];

export function Demo() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${baseUrl}/v1/report/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: inputText }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setOutputText(json.narrative);
    } catch (err) {
      setOutputText("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  }

  const { ref, isInView } = useInView();

  return (
    <section
      id="demo"
      ref={ref}
      className={cn(
        "py-24 transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — text */}
          <div className="flex flex-col gap-6">
            <Badge variant="default">Live demo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary]">
              See it work on your data
            </h2>
            <p className="text-[--color-text-secondary]">
              Paste any CSV or JSON below and hit Generate. We&apos;ll call the
              real API and return a live narrative.
            </p>
            <ul className="flex flex-col gap-3 mt-2">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-[--color-text-secondary]">
                  <span className="text-[--color-success] shrink-0 mt-px">✓</span>
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
              className="bg-[--color-surface] border border-[--color-border] rounded-[--radius-md] p-4 text-sm font-mono w-full text-[--color-text-primary] placeholder:text-[--color-text-secondary] resize-none outline-none focus:ring-2 focus:ring-[--color-accent]/50 transition-shadow"
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
              <div className="bg-[--color-surface] border border-[--color-border] rounded-[--radius-md] p-4">
                <p className="text-[--color-accent] text-xs font-mono mb-2">OUTPUT</p>
                <p className="text-sm text-[--color-text-secondary] whitespace-pre-wrap">{outputText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
