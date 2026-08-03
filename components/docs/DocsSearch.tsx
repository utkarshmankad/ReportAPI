"use client";

import { useMemo, useState } from "react";

interface SearchEntry {
  label: string;
  href: string;
  heading: string;
}

export function DocsSearch({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries.filter(
      (entry) =>
        entry.label.toLowerCase().includes(q) || entry.heading.toLowerCase().includes(q)
    );
  }, [query, entries]);

  return (
    <div className="relative w-full max-w-xl">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none select-none">
        🔍
      </span>
      <input
        type="search"
        placeholder="Search docs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className="w-full bg-surface border border-border rounded-[--radius-md] px-4 py-3 pl-11 text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-[border-color,box-shadow] duration-150"
      />

      {focused && query.trim() && (
        <div className="absolute z-10 mt-2 w-full bg-surface border border-border rounded-[--radius-md] shadow-lg max-h-80 overflow-y-auto text-left">
          {results.length === 0 && (
            <p className="px-4 py-3 text-sm text-text-tertiary">No results for &quot;{query}&quot;</p>
          )}
          {results.map((entry) => (
            <a
              key={entry.href}
              href={entry.href}
              className="block px-4 py-2.5 hover:bg-surface-raised transition-colors"
            >
              <p className="text-sm text-text-primary">{entry.label}</p>
              <p className="text-xs text-text-tertiary">{entry.heading}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
