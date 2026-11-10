/** Opening hours (from content/site.ts) with the live open/closed badge. */
import { hours } from "@/content/site";
import { cn } from "@/lib/cn";
import { OpenStatus } from "./OpenStatus";

export function HoursList({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("space-y-3", className)}>
      <OpenStatus />
      <dl className="space-y-1.5">
        {hours.groups.map((g) => (
          <div key={g.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
            <dt className={cn("text-fg-muted", compact ? "text-sm" : "")}>
              <span className="sm:hidden">{g.short}</span>
              <span className="hidden sm:inline">{g.label}</span>
            </dt>
            <dd className={cn("tabular text-fg", compact ? "text-sm" : "")}>{g.display}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
