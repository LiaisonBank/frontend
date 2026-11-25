// app/our-services/page.jsx
// Server Component — pre-fetches data and injects JSON-LD for SEO

import OurServicesClient from "./ServicesClient";
import { FAQS } from "./data";
import { getImageUrl } from "@/lib/utils/getImagehelper";

const API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;
const FALLBACK_IMAGE =
  "/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png";

// ---------- helpers (server-safe) ----------
function resolveImage(path) {
  if (!path || typeof path !== "string" || path.trim() === "") return FALLBACK_IMAGE;
  try {
    const url = getImageUrl(path);
    return typeof url === "string" && url.trim() !== "" ? url : FALLBACK_IMAGE;
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
    optionalImage: category.optional_img ? resolveImage(category.optional_img) : null,
    optionalImageAlt: category.optional_img_alt || "",
    metaTitle: category.meta_title || "",
    metaDescription: category.meta_description || "",
    metaKeywords: category.meta_keywords || "",
    faq: Array.isArray(category.faq)
      ? category.faq.filter((i) => i?.question && i?.answer)
      : [],
    priority: category.priority ?? 999,
  };
}

async function getServices() {
  try {
    if (!API_URL) return { services: [], error: { status: "CONFIG" } };

    const res = await fetch(`${API_URL}/api/categories`, {
      headers: { Accept: "application/json" },
      // FIX: Replaced `cache: "no-store"` with ISR revalidation.
      // Categories change infrequently; caching dramatically improves TTFB
      // and Core Web Vitals without hurting freshness.
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { services: [], error: { status: res.status } };

    const result = await res.json();
    if (!result.success || !Array.isArray(result.data)) {
      return { services: [], error: { status: 500 } };
    }

    const services = result.data
      .filter((c) => c.status === true)
      .map(transformCategory)
      .sort((a, b) => a.priority - b.priority);

    return { services, error: null };
  } catch {
    return { services: [], error: { status: "CONNECTION" } };
  }
}

// ---------- JSON-LD builders ----------

// FIX: FAQ schema now mirrors exactly what is rendered on the page.
// - If any service has API FAQs, those are the visible FAQs → schema uses them.
// - Otherwise the static FAQS are rendered → schema uses those.
// This guarantees "FAQ content must be visible on the page" is satisfied
// and eliminates duplicate/bloated FAQPage schema on the listing page.
function buildFaqSchema(services) {
  const apiFaqs = services.flatMap((s) =>
    (s.faq || []).map((f) => ({ q: f.question, a: f.answer }))
  );

  const visibleFaqs =
    apiFaqs.length > 0
      ? apiFaqs
      : FAQS.map((f) => ({ q: f.q, a: f.a }));

  if (!visibleFaqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visibleFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function buildServiceSchema(services) {
  if (!services.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Liaison Bank Services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: `${s.name} Services`,
        // FIX: prefer richer full description when available.
        description: s.fullDescription || s.description,
        url: `https://www.liaisonbank.com/our-services/${s.slug}`,
        provider: {
          "@type": "Organization",
          name: "Liaison Bank",
          url: "https://www.liaisonbank.com",
        },
        areaServed: {
          "@type": "City",
          name: "Mumbai",
        },
        image: s.image.startsWith("http")
          ? s.image
          : `https://www.liaisonbank.com${s.image}`,
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

// ---------- Page ----------
export default async function Page() {
  const { services, error } = await getServices();

  const schemas = [
    buildBreadcrumbSchema(),
    buildServiceSchema(services),
    buildFaqSchema(services),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <OurServicesClient initialServices={services} initialError={error} />
    </>
  );
}