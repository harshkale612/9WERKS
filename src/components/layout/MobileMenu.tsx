"use client";

/**
 * Full-screen navigation for small screens. A modal dialog: focus moves in,
 * Tab is trapped, Esc / link click closes, focus returns to the toggle.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { Phone } from "lucide-react";
import { primaryNav, bookingNav } from "@/content/navigation";
import { address, contact, social } from "@/content/site";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { HoursList } from "@/components/ui/Hours";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    focusables()[0]?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items = [...primaryNav, bookingNav];

  return (
    <m.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="theme-studio fixed inset-0 z-40 flex flex-col overflow-y-auto pt-[4.5rem] lg:hidden"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.7, ease: EASE } }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } }}
      data-lenis-prevent=""
    >
      <nav aria-label="Mobile" className="container-x flex-1 pt-8">
        <ul className="border-t border-line">
          {items.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="overflow-hidden border-b border-line">
                <m.div initial={{ y: "100%" }} animate={{ y: "0%", transition: { duration: 0.8, delay: 0.12 + i * 0.06, ease: EASE } }}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group flex min-h-16 items-baseline gap-4 py-4"
                  >
                    <span className="label tabular text-accent-text">{item.index}</span>
                    <span className={cn("font-display text-[clamp(1.75rem,8vw,2.75rem)] leading-none", active ? "text-accent-text" : "text-fg")}>{item.label}</span>
                  </Link>
                </m.div>
              </li>
            );
          })}
        </ul>
      </nav>

      <m.div
        className="container-x grid gap-8 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-10 sm:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.45 } }}
      >
        <div className="space-y-3">
          <p className="label text-fg-muted">Talk to the crew</p>
          <a href={contact.phone.href} className="flex min-h-11 items-center gap-3 text-lg text-fg">
            <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={1.5} />
            <span className="tabular">{contact.phone.display}</span>
          </a>
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-lg text-fg">
            <WhatsAppIcon className="size-4 text-accent" />
            WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={social.instagram.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-lg text-fg">
            <InstagramIcon className="size-4 text-accent" />
            {social.instagram.handle}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="space-y-3">
          <p className="label text-fg-muted">{address.short}</p>
          <HoursList compact />
        </div>
      </m.div>
    </m.div>
  );
}
