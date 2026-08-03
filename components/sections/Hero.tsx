"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const avatars = [
  { initials: "AK", bg: "bg-avatar-a" },
  { initials: "SR", bg: "bg-avatar-b" },
  { initials: "PM", bg: "bg-avatar-c" },
];

const requestCode = `POST /v1/report/generate HTTP/1.1
Host: api.reportapi.io
Content-Type: application/json
Authorization: Bearer rapi_live_••••••••

{
  "title": "Q2 Sales Summary",
  "format": "executive",
  "data": [
    { "region": "North",  "revenue": 184200, "growth": 0.12 },
    { "region": "South",  "revenue": 97500,  "growth": 0.08 },
    { "region": "West",   "revenue": 213800, "growth": 0.21 }
  ]
}`;

const responseCode = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "report_id": "rpt_01hx9z3kw2f4a",
  "status": "completed",
  "narrative": "Q2 performance was strong across all regions.
The West region led growth at 21%, driven by
enterprise deal closures. North maintained
steady momentum at 12%. Aggregate revenue
reached ₹4.95L, up 14% quarter-on-quarter.",
  "tokens_used": 312
}`;

function CodePanel({
  label,
  code,
}: {
  label: string;
  code: string;
}) {
  const lines = code.split("\n");

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <span className="mb-2 text-accent text-xs font-mono tracking-widest uppercase">
        {label}
      </span>
      <div className="flex-1 bg-surface border border-border rounded-[--radius-lg] p-5 overflow-x-auto shadow-lg">
        <pre className="text-sm font-mono leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <CodeLine key={i} line={line} />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function CodeLine({ line }: { line: string }) {
  const keyPattern = /^(\s*)("[\w_]+")(:\s*)/;
  const valuePattern = /^(:\s*)(".*?"|[\d.]+|true|false|null)(,?)(\s*)$/;

  const keyMatch = line.match(keyPattern);
  if (keyMatch) {
    const afterKey = line.slice(keyMatch[0].length);
    const valMatch = afterKey.match(valuePattern);

    return (
      <span className="block">
        <span className="text-text-secondary">{keyMatch[1]}</span>
        <span className="text-accent">{keyMatch[2]}</span>
        <span className="text-text-secondary">{keyMatch[3]}</span>
        {valMatch ? (
          <>
            <span className={valMatch[2].startsWith('"') ? "text-success" : "text-warning"}>
              {valMatch[2]}
            </span>
            <span className="text-text-secondary">{valMatch[3]}</span>
          </>
        ) : (
          <span className="text-text-secondary">{afterKey}</span>
        )}
      </span>
    );
  }

  // HTTP verb line
  if (/^(POST|GET|PUT|DELETE|PATCH)/.test(line)) {
    const [verb, ...rest] = line.split(" ");
    return (
      <span className="block">
        <span className="text-accent">{verb}</span>
        <span className="text-text-primary">{" " + rest.join(" ")}</span>
      </span>
    );
  }

  // HTTP header lines (Key: value)
  const headerMatch = line.match(/^([\w-]+)(:\s*)(.*)$/);
  if (headerMatch && !line.startsWith("{") && !line.startsWith("}")) {
    return (
      <span className="block">
        <span className="text-text-secondary">{headerMatch[1]}</span>
        <span className="text-text-secondary">{headerMatch[2]}</span>
        <span className="text-success">{headerMatch[3]}</span>
      </span>
    );
  }

  return (
    <span className="block text-text-secondary">{line || " "}</span>
  );
}

export function Hero() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className={cn(
        "min-h-screen flex items-center pt-24 bg-bg transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 w-full py-16">
        {/* Top content */}
        <div className="flex flex-col items-center text-center gap-6">
          <Badge variant="success">Now in public beta</Badge>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary max-w-3xl">
            Turn raw data into{" "}
            <span className="text-accent">executive reports</span>
            {" "}in seconds
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-xl">
            Send a JSON or CSV payload. Get back board-ready narrative. No BI analyst required.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mt-2">
            <Button variant="primary" size="lg" href="/contact">Start for free</Button>
            <Button variant="ghost" size="lg" href="/docs">View docs</Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center">
              {avatars.map(({ initials, bg }, i) => (
                <div
                  key={initials}
                  className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center text-white text-xs font-medium border-2 border-bg ${i !== 0 ? "-ml-2" : ""}`}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-text-tertiary">
              Trusted by 120+ companies across India
            </span>
          </div>
        </div>

        {/* Code block preview */}
        <div className="mt-16 flex flex-col md:flex-row gap-4 w-full">
          <CodePanel label="REQUEST" code={requestCode} />
          <CodePanel label="RESPONSE" code={responseCode} />
        </div>
      </div>
    </section>
  );
}
