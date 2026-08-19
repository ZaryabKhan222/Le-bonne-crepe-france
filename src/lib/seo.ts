import { site } from "@/data/site";

/** LocalBusiness / Restaurant structured data for search engines. */
export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.legalName,
    alternateName: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: "+1-305-219-1917",
    servesCuisine: ["French", "Healthy"],
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Miami",
      containedInPlace: { "@type": "State", name: "Florida" },
    },
    founder: {
      "@type": "Person",
      name: "Romain Courcier",
      jobTitle: "Founder & Chef",
    },
    image: `${site.url}/og-image.webp`,
    logo: `${site.url}/assets/logos/logo-gold.webp`,
    sameAs: [site.socials.instagram, site.socials.facebook],
    potentialAction: {
      "@type": "ReserveAction",
      name: "Book Catering",
      target: `${site.url}/#contact`,
    },
  };
}
