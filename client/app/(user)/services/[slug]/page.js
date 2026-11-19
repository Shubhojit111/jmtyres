/* Service detail routes provide relevant local answers without live stock or booking claims. */
import { notFound } from "next/navigation";
import ServiceLanding from "@/components/sections/ServiceLanding";
import { servicePages } from "@/lib/data/servicePages";

// No static-path worker is needed in the database-backed application; the
// allowlisted service slugs are still enforced by the notFound() check below.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }) {
  const service = servicePages.find((item) => item.slug === params.slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function ServicePage({ params }) {
  const service = servicePages.find((item) => item.slug === params.slug);
  if (!service) notFound();
  return <ServiceLanding service={service} />;
}
