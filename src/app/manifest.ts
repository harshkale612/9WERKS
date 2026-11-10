import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.category}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#090807",
    theme_color: "#090807",
    icons: [
      { src: "/assets/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/assets/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
