export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-surface border border-border rounded px-1.5 py-0.5 font-mono text-sm text-text-primary">
      {children}
    </code>
  );
}
