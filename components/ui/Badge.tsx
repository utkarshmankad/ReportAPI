import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant: "default" | "success";
}

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-[--radius-sm] text-xs font-medium uppercase tracking-wider",
        variant === "default" && "bg-surface-raised border border-border text-text-secondary",
        variant === "success" && "bg-success-subtle border border-success/20 text-success"
      )}
    >
      {children}
    </span>
  );
}
