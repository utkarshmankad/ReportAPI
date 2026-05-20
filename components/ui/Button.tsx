import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonBaseProps {
  variant: "primary" | "ghost";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

type ButtonProps =
  | (ButtonBaseProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">)
  | (ButtonBaseProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">);

const sizeClasses: Record<ButtonBaseProps["size"], string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const baseClass = (variant: ButtonBaseProps["variant"], size: ButtonBaseProps["size"], className?: string) =>
  cn(
    "inline-flex items-center justify-center font-medium rounded-[--radius-md] transition-all duration-150 cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:pointer-events-none disabled:opacity-50",
    sizeClasses[size],
    variant === "primary" && ["bg-accent text-white", "hover:bg-accent-hover"],
    variant === "ghost" && [
      "bg-transparent border border-border text-text-secondary",
      "hover:text-text-primary hover:bg-surface-raised hover:border-border",
    ],
    className
  );

export function Button(props: ButtonProps) {
  const { variant, size, children, className } = props;
  const classes = baseClass(variant, size, className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, children: _c, className: _cl, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { href: _h, variant: _v, size: _s, children: _c, className: _cl, ...rest } = props as ButtonBaseProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
