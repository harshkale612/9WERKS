/** Quick-jump index of the six services, used as the /services/ hero aside. */
import { services } from "@/content/services";

export function ServiceIndexAside() {
  return (
    <nav aria-label="Jump to a service" className="animate-fade lg:pb-3" style={{ animationDelay: "300ms" }}>
      <p className="label mb-5 text-accent-text">Six services</p>
      <ol className="border-t border-line">
        {services.map((s) => (
          <li key={s.slug} className="border-b border-line">
            <a href={`#${s.legacyId}`} className="group flex min-h-14 items-center justify-between gap-6 py-3 transition-colors hover:text-accent-text">
              <span className="flex items-baseline gap-4">
                <span className="label tabular text-fg-subtle group-hover:text-accent-text">{s.index}</span>
                <span className="text-lg">{s.title}</span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 12 24" className="h-5 w-2.5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M6 0v22M1 17l5 5 5-5" />
              </svg>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
