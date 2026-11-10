/**
 * 9WERKS — verified business information (single source of truth).
 *
 * Every value here comes from the official website (9werksofficial.com, audited
 * Nov 2026) or the client brief. Nothing is invented. Items that could not be
 * independently verified are marked `verify` and listed in BUSINESS_CONTENT.md.
 */

export const site = {
  name: "9WERKS",
  legalName: "9WERKS",
  tagline: "A crew for your luxe ride",
  category: "Exotic, supercar & sports car specialists",
  url: "https://www.9werksofficial.com",
  locale: "en_IN",
  description:
    "9WERKS is an exotic, supercar and sports car workshop in Aundh, Pune — specialist servicing, performance diagnostics, brakes, collision repair and paint, wraps and detailing, and alloy wheels and tyres.",
  /** Marques named on the official site's own description (text only, no manufacturer logos). */
  marques: ["BMW", "MINI", "Porsche", "Mercedes-Benz", "Land Rover"],
} as const;

export const contact = {
  phone: {
    display: "+91 70831 99986",
    e164: "+917083199986",
    href: "tel:+917083199986",
  },
  whatsapp: {
    /** wa.me requires the number without "+" */
    number: "917083199986",
    href: "https://wa.me/917083199986",
  },
  email: {
    address: "9werks9@gmail.com",
    href: "mailto:9werks9@gmail.com",
  },
} as const;

export const address = {
  lines: [
    "S No 259/3, Shatik Park, behind Seasons Road,",
    "Shambhu Vihar Society, Sanewadi, Aundh,",
    "Pune, Maharashtra 411007",
  ],
  streetAddress: "S No 259/3, Shatik Park, behind Seasons Road, Shambhu Vihar Society, Sanewadi, Aundh",
  locality: "Pune",
  region: "Maharashtra",
  postalCode: "411007",
  country: "IN",
  countryName: "India",
  short: "Sanewadi, Aundh, Pune",
  /** From the official site's structured data and Google Maps embed. */
  geo: { latitude: 18.5544, longitude: 73.8019 },
  coordinatesLabel: "18.5544° N · 73.8019° E",
} as const;

export const maps = {
  /** Google Maps listing (CID from the official site). */
  listing: "https://www.google.com/maps?cid=1339525493130839216",
  /** Turn-by-turn directions to the workshop's map pin (coordinates from the official embed). */
  directions: "https://www.google.com/maps/dir/?api=1&destination=18.554412%2C73.801920",
  embed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.435109758477!2d73.80191987382847!3d18.554412382545728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf6053cca02d%3A0x1296f356c1a4c4b0!2s9WERKS!5e0!3m2!1sen!2sin!4v1737709743892!5m2!1sen!2sin",
} as const;

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

/** Opening hours, Asia/Kolkata. 24h "HH:MM". */
export const hours = {
  timeZone: "Asia/Kolkata",
  groups: [
    { label: "Monday – Friday", short: "Mon – Fri", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] as DayKey[], opens: "09:00", closes: "21:00", display: "9:00 AM – 9:00 PM" },
    { label: "Saturday – Sunday", short: "Sat – Sun", days: ["Sat", "Sun"] as DayKey[], opens: "09:00", closes: "12:00", display: "9:00 AM – 12:00 PM" },
  ],
} as const;

export const social = {
  instagram: {
    handle: "@9werksofficial",
    href: "https://www.instagram.com/9werksofficial/",
  },
  detailing: {
    handle: "@9werksdetailzstudio",
    href: "https://www.instagram.com/9werksdetailzstudio/",
  },
} as const;

/**
 * Published figures — preserved exactly as stated on the official site.
 * Do not add or alter numbers without written confirmation from 9WERKS.
 */
export const stats = [
  { id: "years", value: 35, suffix: "", label: "Years of experience" },
  { id: "technicians", value: 19, suffix: "", label: "Expert technicians" },
  { id: "clients", value: 1500, suffix: "+", label: "Satisfied clients" },
  { id: "projects", value: 1500, suffix: "+", label: "Completed projects" },
] as const;

/**
 * Google rating, read from the official Google Maps listing (CID above) on
 * 4 Nov 2026: 4.9 ★ from 196 reviews. (The legacy site still says 191.)
 * It is a dated snapshot, never presented as a live-updating figure — always
 * shown with its "as of" date and a link to the live listing.
 */
export const reviews = {
  rating: 4.9,
  outOf: 5,
  count: 196,
  source: "Google",
  asOf: "November 2026",
  sourceNote: "Rating and review count from our Google Maps listing, November 2026. See the live figures on Google.",
  href: "https://www.google.com/maps?cid=1339525493130839216",
} as const;

/** Third-party asset attribution required by licence (CC BY 4.0). */
export const credits = {
  model: {
    title: "Car Concept",
    author: "Eric Chadwick / Darmstadt Graphics Group GmbH",
    basedOn: "a CC0 model by Unity Fan",
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: "https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept",
    changes: "Modified: trademarks removed, materials and finishes changed, geometry and textures compressed.",
  },
} as const;
