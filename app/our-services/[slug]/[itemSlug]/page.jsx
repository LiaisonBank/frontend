// app/our-services/[slug]/[itemSlug]/page.jsx
import SubServiceDetail from "./SubServiceDetail";

const SITE_URL = "https://liaisonbank.com";
const BACKEND_URL = "https://backend.liaisonbank.com";
const BRAND = "Liaison Bank";
const CITY = "Mumbai";

/* ---------------- server-side fetch ---------------- */
async function getItemData(itemSlug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/${itemSlug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ---------------- helpers ---------------- */

// Normalize smart quotes and whitespace; do NOT strip inner quotes
function cleanText(str = "") {
  return String(str)
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Truncate at word boundary with ellipsis
function truncate(str, max = 160) {
  if (!str) return "";
  if (str.length <= max) return str;
  const cut = str.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

// Case-insensitive keyword dedupe; keep first occurrence casing
function dedupeKeywords(list) {
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    if (!raw) continue;
    const k = String(raw).trim();
    if (!k) continue;
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out;
}

/* ---------------- ✅ SEO metadata ---------------- */
export async function generateMetadata({ params }) {
  const { slug, itemSlug } = await params;
  const itemData = await getItemData(itemSlug);

  if (!itemData) {
    return {
      title: `Service Not Found | ${BRAND}`,
      description: "The requested service could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const name = cleanText(itemData.name) || "Service";
  const shortDescription = truncate(
    cleanText(itemData.description) ||
      `Get professional ${name} services in ${CITY}.`
  );

  // Primary keyword = "{name} in Mumbai"
  const primaryKeyword = `${name} in ${CITY}`;

  const apiKeywords = Array.isArray(itemData.seo_keywords)
    ? itemData.seo_keywords
    : [];

  const keywords = dedupeKeywords([
    primaryKeyword,
    name,
    `${name} service in ${CITY}`,
    `${name} consultant in ${CITY}`,
    ...apiKeywords,
  ]);

  const seoTitle = `${name} | Service in ${CITY} | ${BRAND}`;
  const canonical = `${SITE_URL}/our-services/${slug}/${itemSlug}`;

  // OG image from item
  const ogImage = itemData.image
    ? `${BACKEND_URL}${itemData.image}`
    : itemData.banner
    ? `${BACKEND_URL}${itemData.banner}`
    : `${SITE_URL}/og-default.jpg`;

  return {
    title: seoTitle,
    description: shortDescription,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: seoTitle,
      description: shortDescription,
      url: canonical,
      siteName: BRAND,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: shortDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "Business Services",
  };
}

/* ---------------- Page ---------------- */
export default async function Page({ params }) {
  const { slug, itemSlug } = await params;
  const itemData = await getItemData(itemSlug);

  const itemName = itemData ? cleanText(itemData.name) : "";

  return (
    <>
      {/* ✅ JSON-LD: Service schema */}
      {itemData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: itemName,
              description: cleanText(itemData.description),
              serviceType: itemName,
              areaServed: { "@type": "City", name: CITY },
              provider: {
                "@type": "Organization",
                name: BRAND,
                url: SITE_URL,
              },
              url: `${SITE_URL}/our-services/${slug}/${itemSlug}`,
              ...(itemData.image && {
                image: `${BACKEND_URL}${itemData.image}`,
              }),
            }),
          }}
        />
      )}

      {/* ✅ JSON-LD: BreadcrumbList schema */}
      {itemData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Our Services",
                  item: `${SITE_URL}/our-services`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: itemName,
                  item: `${SITE_URL}/our-services/${slug}/${itemSlug}`,
                },
              ],
            }),
          }}
        />
      )}

      <SubServiceDetail initialData={itemData} />
    </>
  );
}