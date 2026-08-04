"use client";

import { useState } from "react";

interface WebhookEndpoint {
  id: string;
  url: string;
  active: boolean;
  created_at: string;
}

export function WebhookManager({ initialEndpoints }: { initialEndpoints: WebhookEndpoint[] }) {
  const [endpoints, setEndpoints] = useState(initialEndpoints);
  const [url, setUrl] = useState("");
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!url.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (res.ok) {
        setEndpoints((prev) => [json.endpoint, ...prev]);
        setRevealedSecret(json.secret);
        setUrl("");
      } else {
        setError(json.error ?? "Failed to create webhook.");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEndpoints((prev) => prev.filter((e) => e.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {revealedSecret && (
        <div className="bg-surface-raised border border-accent/40 rounded-[--radius-md] p-4 text-sm">
          <p className="font-semibold mb-1">Copy this signing secret now — it won&apos;t be shown again:</p>
          <code className="break-all">{revealedSecret}</code>
          <p className="text-xs text-text-tertiary mt-2">
            We sign each delivery with header <code>X-ReportAPI-Signature</code> (HMAC-SHA256 of the raw body, hex-encoded).
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-app.com/webhooks/reportapi"
          className="flex-1 bg-surface border border-border rounded-[--radius-md] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !url.trim()}
          className="bg-accent text-white rounded-[--radius-md] px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {creating ? "Adding…" : "Add endpoint"}
        </button>
      </div>
      {error && <p className="text-error text-xs">{error}</p>}

      <ul className="flex flex-col gap-2">
        {endpoints.map((endpoint) => (
          <li
            key={endpoint.id}
            className="flex items-center justify-between bg-surface border border-border rounded-[--radius-md] px-4 py-3 text-sm"
          >
            <span className="font-mono text-text-secondary truncate">{endpoint.url}</span>
            <button
              onClick={() => handleDelete(endpoint.id)}
              className="text-error text-xs font-medium hover:underline shrink-0 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
        {endpoints.length === 0 && (
          <li className="text-text-tertiary text-sm">
            No webhook endpoints yet. We&apos;ll POST a <code>report.completed</code> event whenever a report finishes.
          </li>
        )}
      </ul>
    </div>
  );
}
