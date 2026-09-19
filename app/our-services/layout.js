// app/our-services/layout.js

const SITE_URL = "https://www.liaisonbank.com";
const SECTION_URL = `${SITE_URL}/our-services`;

// ======================================================
// METADATA
// ======================================================

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Our Services | Liaisoning, Licensing & Compliance Solutions",  // no "– Liaison Bank"
    template: "%s | Our Services – Liaison Bank",
  },

  description:
    "Explore Liaison Bank's professional services — licensing, liaisoning, fire safety, MPCB, electrical approvals, PNG, AMC, real estate, and equipment solutions. End-to-end compliance and government approval support across Mumbai and India.",

  keywords: [
    "Liaison Bank services",
    "liaisoning services Mumbai",
    "licensing services Mumbai",
    "fire safety consultant Mumbai",
    "MPCB compliance services",
    "electrical approval consultant",
    "PNG consultancy services",
    "AMC services Mumbai",
    "real estate liaisoning",
    "government approval services",
    "regulatory compliance consultant",
    "equipment solution department",
    "business licensing consultant",
    "factory license services",
    "trade license consultant",
    "fire NOC approval services",
    "pollution control consultant",
    "industrial compliance services",
  ],

  applicationName: "Liaison Bank",

  authors: [
    { name: "Liaison Bank", url: `${SITE_URL}/about-us-liaison` },
  ],

  creator: "Liaison Bank",
  publisher: "Liaison Bank",
  category: "Business Services",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SECTION_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SECTION_URL,
    siteName: "Liaison Bank",
    title:
      "Our Services | Liaisoning, Licensing & Compliance Solutions – Liaison Bank",
    description:
      "End-to-end liaisoning, licensing, fire safety, MPCB, electrical, PNG, AMC and compliance services for businesses across Mumbai and India.",
    images: [
      {
        url: `${SITE_URL}/images/our-services-poster.png`,
        width: 1200,
        height: 630,
        alt: "Liaison Bank Services",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@liaisonbank",
    creator: "@liaisonbank",
    title:
      "Our Services | Liaisoning, Licensing & Compliance Solutions – Liaison Bank",
    description:
      "Professional liaisoning, licensing, fire safety, MPCB, electrical, PNG and compliance services.",
    images: [
      {
        url: `${SITE_URL}/images/our-services-poster.png`,
        alt: "Liaison Bank Services",
      },
    ],
  },

  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

// ======================================================
// VIEWPORT
// ======================================================

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// ======================================================
// JSON-LD SCHEMAS
// ======================================================

const breadcrumbSchema = {
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
      item: SECTION_URL,
    },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Our Services – Liaison Bank",
  description:
    "Explore the complete range of liaisoning, licensing, fire safety, MPCB, electrical, PNG, AMC and compliance services offered by Liaison Bank in Mumbai and across India.",
  url: SECTION_URL,
  isPartOf: {
    "@type": "WebSite",
    name: "Liaison Bank",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Liaison Bank",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
};

// ======================================================
// LAYOUT COMPONENT
// ======================================================

export default function OurServicesLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      {children}
    </>
  );
}