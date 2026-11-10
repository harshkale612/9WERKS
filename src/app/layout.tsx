import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { OG_IMAGE, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "9WERKS — Exotic, Supercar & Sports Car Specialists in Aundh, Pune",
    template: "%s | 9WERKS",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "luxury car servicing Pune",
    "supercar specialists Pune",
    "performance diagnostics Pune",
    "automotive detailing Pune",
    "exotic car maintenance Pune",
    "car service Aundh",
    "9WERKS",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: "9WERKS — Exotic, Supercar & Sports Car Specialists in Aundh, Pune",
    description: site.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "9WERKS — Exotic, Supercar & Sports Car Specialists in Aundh, Pune",
    description: site.description,
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  category: "automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090807",
  colorScheme: "dark",
};

/**
 * Runs before first paint: flags JS so scroll-reveal targets can start hidden,
 * and if the motion runtime hasn't initialised within 3.5 s, reveals everything
 * (content must never stay hidden because a script failed).
 */
const bootScript = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('motion-fallback')},3500)})(document.documentElement)`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body id="top">
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[100] -translate-y-24 bg-bronze px-5 py-3 text-ink-950 transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </MotionProvider>
        <div className="grain-overlay" aria-hidden="true" />
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
