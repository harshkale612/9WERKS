/**
 * Every internal URL in one place. Use these constants instead of string
 * literals so a route can never silently break. All routes end with "/"
 * because the site is exported with `trailingSlash: true`.
 */
import type { ServiceSlug } from "@/content/services";

export const routes = {
  home: "/",
  about: "/about/",
  services: "/services/",
  service: (slug: ServiceSlug) => `/services/${slug}/`,
  contact: "/contact/",
  booking: "/booking/",
  /** Booking with a service pre-selected. */
  bookService: (slug: ServiceSlug) => `/booking/?service=${slug}`,
} as const;
