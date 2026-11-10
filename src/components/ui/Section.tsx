/**
 * <Section> — every page chapter. `theme` sets the semantic colour tokens
 * (fg, fg-muted, line, accent-text…) for everything inside it.
 *
 *  studio   — deepest black (hero, cinematic moments, footer)
 *  dark     — base obsidian
 *  graphite — raised dark (editorial chapters, location)
 * The site is dark throughout by client direction — there is no light theme.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionTheme = "studio" | "dark" | "graphite";

type SectionProps = {
  theme?: SectionTheme;
  spacing?: "default" | "tight" | "none";
  children: ReactNode;
  className?: string;
  /** Wrap children in the standard container. Default true. */
  contained?: boolean;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className">;

export function Section({ theme = "dark", spacing = "default", contained = true, children, className, ...rest }: SectionProps) {
  return (
    <section
      className={cn(
        `theme-${theme}`,
        "relative",
        spacing === "default" && "section-y",
        spacing === "tight" && "section-y-tight",
        className
      )}
      {...rest}
    >
      {contained ? <div className="container-x">{children}</div> : children}
    </section>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-x", className)}>{children}</div>;
}
