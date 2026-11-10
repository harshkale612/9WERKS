"use client";

/**
 * Quick actions for phones: Call · WhatsApp · Book. Slides up after the first
 * screen so the booking journey is always one tap away. Hidden on large
 * screens (the header carries these actions there).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { contact } from "@/content/site";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

export function MobileActionBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.min(window.innerHeight * 0.7, 520));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onBooking = pathname.startsWith(routes.booking);
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[0.625rem] font-[560] uppercase tracking-[0.14em]";

  return (
    <nav
      aria-label="Quick actions"
      className={cn(
        "theme-studio fixed inset-x-0 bottom-0 z-40 border-t border-line !bg-ink-950/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-500 ease-out-expo lg:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <ul className="flex divide-x divide-line">
        <li className="flex flex-1">
          <a href={contact.phone.href} className={cn(item, "text-fg")}>
            <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={1.5} />
            Call
          </a>
        </li>
        <li className="flex flex-1">
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className={cn(item, "text-fg")}>
            <WhatsAppIcon className="size-4 text-accent" />
            WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        {!onBooking && (
          <li className="flex flex-1">
            <Link href={routes.booking} className={cn(item, "bg-bronze text-ink-950")}>
              <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.5} />
              Book
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
