import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost" | "surface";

const base =
  "inline-flex items-center gap-[0.6ch] rounded-full px-[1.4rem] py-[0.85rem] font-semibold transition-[transform,box-shadow,background,border-color] duration-200 hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary:
    "accent-grad text-[color:var(--color-on-accent)] border border-transparent hover:shadow-[var(--glow)]",
  ghost:
    "border border-border-strong bg-surface-strong hover:border-accent hover:text-accent",
  surface: "border border-border-strong bg-surface-strong",
};

type AnchorProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  className?: string;
};

/** Botão-link (next/link para internos, <a> para externos). */
export function ButtonLink({
  variant = "surface",
  className = "",
  ...props
}: AnchorProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
