import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-label-md transition-all disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-label-sm",
  md: "px-5 py-2.5 text-label-md",
};

const variants: Record<Variant, string> = {
  primary: "bg-cmd-accent text-cmd-on-accent hover:bg-cmd-accent-strong",
  ghost:
    "border border-cmd-line text-cmd-text hover:border-cmd-accent hover:text-cmd-accent",
  subtle: "bg-cmd-surface2 text-cmd-text hover:bg-cmd-line",
  danger:
    "border border-cmd-line text-cmd-muted hover:border-cmd-danger hover:text-cmd-danger",
};

/** Class string for the Command button styles — use on links/anchors. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

/**
 * Styled button for the Command theme. No hooks/directives, so it renders inside
 * both server and client components (interactive callers pass onClick).
 */
export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button className={`${buttonClasses(variant, size)} ${className}`} {...props} />
  );
}
