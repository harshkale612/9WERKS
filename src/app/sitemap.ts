import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page(routes.home, 1, "weekly"),
    page(routes.services, 0.9),
    ...services.map((s) => page(routes.service(s.slug), 0.8)),
    page(routes.booking, 0.8),
    page(routes.about, 0.7),
    page(routes.contact, 0.7),
  ];
}
