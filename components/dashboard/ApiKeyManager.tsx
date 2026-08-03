"use client";

import { useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  revoked_at: string | null;
}

export function ApiKeyManager({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [name, setName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (res.ok) {
        setKeys((prev) => [json.key, ...prev]);
        setRevealedKey(json.rawKey);
        setName("");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k))
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {revealedKey && (
        <div className="bg-surface-raised border border-accent/40 rounded-[--radius-md] p-4 text-sm">
          <p className="font-semibold mb-1">Copy this key now — it won&apos;t be shown again:</p>
          <code className="break-all">{revealedKey}</code>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name (e.g. production)"
          className="flex-1 bg-surface border border-border rounded-[--radius-md] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !name.trim()}
          className="bg-accent text-white rounded-[--radius-md] px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create key"}
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {keys.map((key) => (
          <li
            key={key.id}
            className="flex items-center justify-between bg-surface border border-border rounded-[--radius-md] px-4 py-3 text-sm"
          >
            <div>
              <span className="font-medium">{key.name}</span>{" "}
              <span className="text-text-tertiary font-mono">{key.key_prefix}…</span>
              {key.revoked_at && <span className="ml-2 text-error text-xs">revoked</span>}
            </div>
            {!key.revoked_at && (
              <button
                onClick={() => handleRevoke(key.id)}
                className="text-error text-xs font-medium hover:underline"
              >
                Revoke
              </button>
            )}
          </li>
        ))}
        {keys.length === 0 && (
          <li className="text-text-tertiary text-sm">No API keys yet.</li>
        )}
      </ul>
    </div>
  );
}
