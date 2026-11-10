/**
 * Every direct route to the crew as full-width ruled rows (≥56px targets):
 * call, WhatsApp, email, Instagram (both accounts), directions.
 */
import type { ReactNode } from "react";
import { Mail, Navigation, Phone } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { address, contact, maps, social } from "@/content/site";

interface Line {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
}

const lines: Line[] = [
  { label: "Call", value: contact.phone.display, href: contact.phone.href, icon: <Phone aria-hidden="true" className="size-4" strokeWidth={1.5} /> },
  { label: "WhatsApp", value: "Chat with the crew", href: contact.whatsapp.href, icon: <WhatsAppIcon className="size-4" />, external: true },
  { label: "Email", value: contact.email.address, href: contact.email.href, icon: <Mail aria-hidden="true" className="size-4" strokeWidth={1.5} /> },
  { label: "Instagram", value: social.instagram.handle, href: social.instagram.href, icon: <InstagramIcon className="size-4" />, external: true },
  { label: "Detailing", value: social.detailing.handle, href: social.detailing.href, icon: <InstagramIcon className="size-4" />, external: true },
  { label: "Directions", value: address.short, href: maps.directions, icon: <Navigation aria-hidden="true" className="size-4" strokeWidth={1.5} />, external: true },
];

export function DirectLines() {
  return (
    <ul className="animate-fade border-t border-line" style={{ animationDelay: "300ms" }} aria-label="Contact 9WERKS directly">
      {lines.map((l) => (
        <li key={l.label} className="border-b border-line">
          <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group grid min-h-16 grid-cols-[1.25rem_6.5rem_1fr_auto] items-center gap-x-4 py-3 transition-colors hover:text-accent-text"
          >
            <span className="text-accent">{l.icon}</span>
            <span className="label text-fg-muted">{l.label}</span>
            <span className="truncate text-lg text-fg transition-colors group-hover:text-accent-text">{l.value}</span>
            <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M0 6h22M17 1l5 5-5 5" />
            </svg>
            {l.external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
