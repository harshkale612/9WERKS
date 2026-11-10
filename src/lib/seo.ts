/**
 * Metadata + structured data helpers. Structured data only states verifiable
 * facts (no aggregateRating: Google treats self-published ratings for a
 * LocalBusiness as ineligible, and the figure is not independently verified).
 */
import type { Metadata } from "next";
import { address, contact, hours, site, social } from "@/content/site";
import type { Service } from "@/content/services";

export const OG_IMAGE = { url: "/assets/brand/og-9werks.jpg", width: 1200, height: 630, alt: "9WERKS — A crew for your luxe ride" };

interface PageMetaInput {
  title: string;
  description: string;
  /** Path beginning with "/" and ending with "/" (trailing-slash export). */
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
}

export function pageMetadata({ title, description, path, image = OG_IMAGE }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title: `${title} | ${site.name}`,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image.url],
    },
  };
}

const BUSINESS_ID = `${site.url}/#business`;

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": BUSINESS_ID,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: `${site.url}/`,
    image: `${site.url}${OG_IMAGE.url}`,
    logo: `${site.url}/assets/brand/9werks-logo-960.png`,
    telephone: contact.phone.e164,
    email: contact.email.address,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: address.geo.latitude, longitude: address.geo.longitude },
    areaServed: { "@type": "City", name: "Pune" },
    openingHoursSpecification: hours.groups.map((g) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: g.days.map((d) => ({ Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" })[d]),
      opens: g.opens,
      closes: g.closes,
    })),
    sameAs: [social.instagram.href, social.detailing.href],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-IN",
  };
}

export function serviceJsonLd(service: Service, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name: service.title,
    serviceType: service.title,
    description: `${service.summary} ${service.detail}`,
    url: `${site.url}${path}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: "Pune" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} — what's included`,
      itemListElement: service.inclusions.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
