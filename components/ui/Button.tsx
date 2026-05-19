import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "ghost";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonProps["size"], string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant,
  size,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-[--radius-md] transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]",
        "disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variant === "primary" && [
          "bg-[--color-accent] text-white",
          "hover:bg-[--color-accent-hover]",
        ],
        variant === "ghost" && [
          "bg-transparent border border-[--color-border] text-[--color-text-secondary]",
          "hover:text-[--color-text-primary] hover:border-[--color-text-secondary]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
