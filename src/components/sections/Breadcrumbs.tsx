/** Breadcrumb trail + matching BreadcrumbList structured data. */
import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/cn";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("label text-fg-muted", className)}>
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-3">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="inline-flex min-h-8 items-center transition-colors hover:text-fg">
                    {c.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-accent-text">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
