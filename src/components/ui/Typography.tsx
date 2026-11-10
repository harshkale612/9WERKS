/**
 * Typographic primitives.
 *
 *  <SectionLabel index="02">Services</SectionLabel>  → "02 ── SERVICES" in the technical (mono) voice
 *  <Accent text="More than a *workshop*." />          → words in *asterisks* set in Bodoni italic
 *  <Display as="h2" size="xl">…</Display>              → expanded uppercase display type
 */
import { Fragment, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Render "*accent*" segments in the editorial serif italic. */
export function Accent({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className={cn("font-accent", className)}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

export type DisplaySize = "2xl" | "xl" | "lg" | "md" | "sm";

const displaySize: Record<DisplaySize, string> = {
  "2xl": "text-display-2xl",
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
};

/** Class string for display type — use with RevealText or plain elements. */
export function displayClasses(size: DisplaySize = "lg", className?: string) {
  return cn("font-display text-balance", displaySize[size], className);
}

type DisplayProps<T extends ElementType> = {
  as?: T;
  size?: DisplaySize;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Display<T extends ElementType = "h2">({ as, size = "lg", children, className, ...rest }: DisplayProps<T>) {
  const Tag = (as ?? "h2") as ElementType;
  return (
    <Tag className={displayClasses(size, className)} {...rest}>
      {children}
    </Tag>
  );
}

/** "02 ── SERVICES" — technical eyebrow used to open sections. */
export function SectionLabel({ index, children, className, as: Tag = "p" }: { index?: string; children: ReactNode; className?: string; as?: ElementType }) {
  return (
    <Tag className={cn("label flex items-center gap-3 text-fg-muted", className)}>
      {index && <span className="tabular text-accent-text">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />}
      <span>{children}</span>
    </Tag>
  );
}

/** Lead paragraph. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("measure text-lead text-fg-muted text-pretty", className)}>{children}</p>;
}
