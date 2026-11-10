/**
 * Spec-sheet rows: technical label on the left, value on the right, hairlines
 * between — the "vehicle spec sheet" pattern used for hours, contact details
 * and service inclusions.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SpecRow {
  label: ReactNode;
  value: ReactNode;
}

export function SpecList({ rows, className }: { rows: SpecRow[]; className?: string }) {
  return (
    <dl className={cn("border-t border-line", className)}>
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[minmax(8rem,0.42fr)_1fr] sm:gap-6">
          <dt className="label pt-1 text-fg-muted">{row.label}</dt>
          <dd className="text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
