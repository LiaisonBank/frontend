// app/our-services/page.jsx
// Server Component — fetches all active service categories and provides
// fixed SEO metadata for the Our Services listing page.

import OurServicesClient from "./ServicesClient";
import { getImageUrl } from "@/lib/utils/getImagehelper";
import { FAQS } from "./data";

const API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

const FALLBACK_IMAGE =
  "/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png";


export const metadata = {
  metadataBase: new URL("https://www.liaisonbank.com"),

  title:
    "Our Services | Liaisoning, Licensing, Fire Safety & AMC",

  description:
    "Explore Liaison Bank's government liaisoning, business licensing, fire safety, electrical audit, PNG and AMC services for residential, commercial and industrial properties across Mumbai.",

  keywords: [
    "Liaison Bank services",
    "liaisoning services",
    "licensing services",
    "government liaisoning services",
    "government approval services",
    "municipal approval services",
    "BMC liaisoning services",
    "building approval services",
    "property permission services",
    "government NOC assistance",
    "business licensing services",
    "business licence renewal",
    "trade licence assistance",
    "commercial licensing services",
    "industrial licensing services",
    "shop licence services",
    "licence documentation services",
    "fire safety services",
    "fire safety consultant Mumbai",
    "fire safety audit services",
    "fire NOC assistance",
    "fire extinguisher refilling",
    "fire safety inspection",
    "fire safety maintenance",
    "electrical audit services",
    "electrical safety audit Mumbai",
    "electrical inspection services",
    "electrical audit certificate",
    "electrical maintenance services",
    "CEIG approval assistance",
    "PNG services",
    "piped natural gas services",
    "PNG pipeline inspection",
    "PNG infrastructure services",
    "commercial PNG services",
    "industrial PNG services",
    "annual maintenance contract services",
    "AMC services",
    "AMC services Mumbai",
    "commercial AMC services",
    "industrial AMC services",
    "residential AMC services",
    "preventive maintenance services",
    "water tank cleaning services",
    "pest control AMC services",
    "fire audit certificate AMC",
    "electrical audit certificate AMC",
    "licence renewal AMC",
    "residential property services",
    "commercial property services",
    "industrial facility services",
    "housing society services",
    "restaurant licensing services",
    "hotel fire safety services",
    "factory safety services",
    "warehouse maintenance services",
    "liaisoning services in Mumbai",
    "licensing services in Mumbai",
    "fire safety services in Mumbai",
    "business services in Maharashtra",
  ],

  alternates: {
    canonical: "/our-services",
  },


  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title:
      "Our Services | Liaisoning, Licensing, Fire Safety & AMC | Liaison Bank",
    description:
      "Discover Liaison Bank's liaisoning, licensing, fire safety, electrical, PNG and AMC solutions for residential, commercial and industrial sectors.",
    url: "/our-services",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/liaisoning_img.jpg",
        width: 1200,
        height: 630,
        alt: "Liaison Bank professional services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@liaisonbank",
    creator: "@liaisonbank",
    title:
      "Our Services | Liaisoning, Licensing, Fire Safety & AMC | Liaison Bank",
    description:
      "Explore Liaison Bank's professional liaisoning, licensing, fire safety, electrical, PNG and AMC services.",
    images: [
      "/images/liaisoning_img.jpg",
    ],
  },
};

function resolveImage(path) {
  if (!path || typeof path !== "string" || !path.trim()) {
    return FALLBACK_IMAGE;
  }

  try {
    const url = getImageUrl(path);
    return typeof url === "string" && url.trim() ? url : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

function transformCategory(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    fullDescription: category.full_description || "",
    image: resolveImage(category.image),
    imageAlt: category.image_alt || `${category.name} services`,
    banner: resolveImage(category.banner),
    bannerAlt: category.banner_alt || `${category.name} banner`,
    optionalImage: category.optional_img
      ? resolveImage(category.optional_img)
      : null,
    optionalImageAlt: category.optional_img_alt || "",
    metaTitle: category.meta_title || "",
    metaDescription: category.meta_description || "",
    metaKeywords: category.meta_keywords || "",
    priority: category.priority ?? 999,
  };
}

async function getServices() {
  try {
    if (!API_URL) {
      return { services: [], error: { status: "CONFIG" } };
    }

    const res = await fetch(`${API_URL}/api/categories`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { services: [], error: { status: res.status } };
    }

    const result = await res.json();

    if (!result.success || !Array.isArray(result.data)) {
      return { services: [], error: { status: 500 } };
    }

    const services = result.data
      .filter((category) => category.status === true)
      .map(transformCategory)
      .sort((a, b) => a.priority - b.priority);

    return { services, error: null };
  } catch {
    return { services: [], error: { status: "CONNECTION" } };
  }
}

function buildServiceSchema(services) {
  if (!services.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Liaison Bank Service Categories",
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      url: `https://www.liaisonbank.com/our-services/${service.slug}`,
    })),
  };
}
function buildFaqSchema() {
  if (!Array.isArray(FAQS) || FAQS.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function buildBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.liaisonbank.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Services",
        item: "https://www.liaisonbank.com/our-services",
      },
    ],
  };
}

export default async function Page() {
  const { services, error } = await getServices();

  const schemas = [
    buildBreadcrumbSchema(),
    buildServiceSchema(services),
    buildFaqSchema(),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <OurServicesClient initialServices={services} initialError={error} />
    </>
  );
}