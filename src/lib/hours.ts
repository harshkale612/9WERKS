/**
 * Opening-hours logic, always evaluated in the workshop's time zone
 * (Asia/Kolkata) regardless of where the visitor is.
 */
import { hours, type DayKey } from "@/content/site";

const DAY_ORDER: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface OpenStatus {
  isOpen: boolean;
  /** e.g. "Open now" / "Closed now" */
  label: string;
  /** e.g. "Closes 9:00 PM" / "Opens 9:00 AM tomorrow" */
  detail: string;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function format12h(hhmm: string): string {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
}

function scheduleFor(day: DayKey) {
  return hours.groups.find((g) => (g.days as readonly DayKey[]).includes(day));
}

/** Current day/minutes in Asia/Kolkata. */
export function workshopNow(now: Date = new Date()): { day: DayKey; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: hours.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("weekday") as DayKey, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const { day, minutes } = workshopNow(now);
  const today = scheduleFor(day);
  if (today) {
    const open = toMinutes(today.opens);
    const close = toMinutes(today.closes);
    if (minutes >= open && minutes < close) {
      return { isOpen: true, label: "Open now", detail: `Closes ${format12h(today.closes)}` };
    }
    if (minutes < open) {
      return { isOpen: false, label: "Closed now", detail: `Opens ${format12h(today.opens)} today` };
    }
  }
  // Find the next opening day.
  const idx = DAY_ORDER.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const next = DAY_ORDER[(idx + i) % 7]!;
    const s = scheduleFor(next);
    if (s) {
      const when = i === 1 ? "tomorrow" : next;
      return { isOpen: false, label: "Closed now", detail: `Opens ${format12h(s.opens)} ${when}` };
    }
  }
  return { isOpen: false, label: "Closed now", detail: "" };
}

/** Is a given calendar date (YYYY-MM-DD) a weekend (short hours)? */
export function isWeekendDate(isoDate: string): boolean {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return false;
  const dow = new Date(y, m - 1, d).getDay();
  return dow === 0 || dow === 6;
}

/** Today's date in Asia/Kolkata as YYYY-MM-DD (for the booking date `min`). */
export function workshopToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: hours.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
