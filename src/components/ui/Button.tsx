/**
 * Buttons & button-styled links.
 *
 *  primary   — solid bronze, ink text. The one key action per view.
 *  secondary — hairline outline, theme text; fills subtly on hover.
 *  ghost     — text + arrow, underline draws on hover.
 *
 * Square corners by design (architectural, not "app-like").
 * External links automatically open in a new tab with an SR-only notice.
 */
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 font-sans font-[560] uppercase tracking-[0.12em] text-center whitespace-normal sm:whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-300 ease-out-quart disabled:opacity-50 select-none";

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 py-3 text-[0.75rem]",
  lg: "min-h-14 px-8 py-3.5 text-[0.8125rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-bronze text-ink-950 overflow-hidden isolate before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-champagne before:transition-transform before:duration-500 before:ease-out-expo hover:before:scale-x-100",
  secondary:
    "border border-line-strong text-fg hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]",
  ghost: "min-h-11 px-0 text-fg after:absolute after:left-0 after:bottom-2 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variant === "ghost" ? "" : sizes[size], variants[variant], className);
}

function Arrow({ external }: { external?: boolean }) {
  return external ? (
    <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Leading icon (e.g. phone, WhatsApp glyph). */
  icon?: ReactNode;
  /** Hide the trailing arrow. */
  noArrow?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function ButtonLink({ href, children, variant = "primary", size = "md", className, icon, noArrow, ...rest }: ButtonLinkProps) {
  const external = isExternal(href);
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {!noArrow && <Arrow external={external} />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  noArrow?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({ children, variant = "primary", size = "md", className, icon, noArrow = true, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {!noArrow && <Arrow />}
    </button>
  );
}
