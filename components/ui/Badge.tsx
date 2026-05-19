import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant: "default" | "success";
}

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[--radius-sm] text-xs font-medium uppercase tracking-wide",
        variant === "default" && "bg-[--color-border] text-[--color-text-secondary]",
        variant === "success" && "bg-green-900/30 text-[--color-success]"
      )}
    >
      {children}
    </span>
  );
}
