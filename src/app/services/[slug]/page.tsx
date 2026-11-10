import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { OtherServices, ServiceOverview } from "@/components/services/ServiceDetail";
import { getService, services } from "@/content/services";
import { contact } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seo.title, description: s.seo.description, path: routes.service(s.slug) });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Services", path: routes.services },
          { name: s.title, path: routes.service(s.slug) },
        ]}
        label={`Service ${s.index} · ${s.component}`}
        title={[s.displayTitle]}
        lead={s.summary}
        actions={
          <>
            <ButtonLink href={routes.bookService(s.slug)}>Book this service</ButtonLink>
            <ButtonLink href={contact.phone.href} variant="secondary" icon={<Phone aria-hidden="true" className="size-4" strokeWidth={1.5} />} noArrow>
              <span className="tabular">{contact.phone.display}</span>
            </ButtonLink>
          </>
        }
        photo={{ id: s.image.primary }}
      />
      <ServiceOverview service={s} />
      <ProcessSteps index="03" title="How it *works*" showCta={false} theme="dark" />
      <OtherServices service={s} />
      <FinalCta index="05" label={`Book ${s.shortTitle}`} title={`Book *${s.shortTitle.toLowerCase()}.*`} ctaLabel="Book this service" ctaHref={routes.bookService(s.slug)} photo="porsche" />
      <JsonLd data={serviceJsonLd(s, routes.service(s.slug))} />
    </>
  );
}
