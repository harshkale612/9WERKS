/**
 * WhatsApp hand-off — the booking and contact journeys of the official site.
 *
 * Nothing is submitted to a server: the visitor's details are composed into a
 * pre-filled WhatsApp message to the official business number, which the
 * visitor reviews and sends themselves. 9WERKS then confirms the booking.
 */
import { contact } from "@/content/site";

export interface MessageField {
  label: string;
  value: string | undefined | null;
}

/** Build `https://wa.me/<number>?text=…` with the official number. */
export function whatsappUrl(text: string): string {
  return `${contact.whatsapp.href}?text=${encodeURIComponent(text)}`;
}

/** Compose a clean message: greeting line, then "*Label:* value" lines for non-empty fields. */
export function composeMessage(greeting: string, fields: MessageField[], footer?: string): string {
  const lines = [greeting, ""];
  for (const { label, value } of fields) {
    const v = (value ?? "").toString().trim();
    if (v) lines.push(`*${label}:* ${v}`);
  }
  if (footer) lines.push("", footer);
  return lines.join("\n");
}

/** "2026-11-14" → "Sat, 14 Nov 2026" (no timezone drift: parsed as a local calendar date). */
export function formatDateForMessage(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/** mailto: fallback for visitors who don't use WhatsApp. */
export function mailtoUrl(subject: string, body: string): string {
  return `${contact.email.href}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\*/g, ""))}`;
}
