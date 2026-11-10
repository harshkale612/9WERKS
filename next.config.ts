import type { NextConfig } from "next";

/**
 * 9WERKS — Next.js configuration.
 *
 * The site is fully static (no server-side logic: booking and contact
 * journeys hand off to WhatsApp / phone / email), so it is exported as
 * plain HTML/CSS/JS. That keeps it deployable on the existing static
 * hosting (Hostinger) or any CDN. See PROJECT_ARCHITECTURE.md → Deployment.
 *
 * Images are pre-optimised at build time into AVIF + WebP responsive sets by
 * `scripts/images/build-images.mjs` and rendered by `<Photo>`, so Next's
 * runtime image optimiser is not needed.
 */
const nextConfig: NextConfig = {
  output: "export",
  // Dev-only preview routes (src/app/lab/**/page.dev.tsx) exist only under `next dev`;
  // production builds ignore them, so they can never be exported.
  pageExtensions: process.env.NODE_ENV === "production" ? ["tsx", "ts"] : ["dev.tsx", "tsx", "ts"],
  trailingSlash: true,
  // No dev-mode badge: it would otherwise be captured in the rendered hero stills.
  devIndicators: false,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
