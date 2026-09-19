// app/press-release-liaison-bank/layout.js

const SITE_URL = "https://www.liaisonbank.com";
const SECTION_URL = `${SITE_URL}/press-release-liaison-bank`;

// ======================================================
// METADATA
// ======================================================

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Press Releases | Liaisoning & Licensing News – Liaison Bank",
    template: "%s | Press Releases – Liaison Bank",
  },

  description:
    "Read the latest press releases, announcements, and media coverage from Liaison Bank. Stay updated on licensing, liaisoning, fire safety, MPCB compliance, and government approval news in Mumbai and across India.",

  keywords: [
    "Liaison Bank press releases",
    "Liaison Bank news",
    "Liaison Bank announcements",
    "liaisoning news Mumbai",
    "licensing news Mumbai",
    "fire NOC news Mumbai",
    "MPCB compliance news",
    "government approval news Mumbai",
    "business licensing press release",
    "regulatory compliance news India",
    "Liaison Bank media coverage",
    "liaisoning company news",
    "press release liaisoning Mumbai",
    "licensing consultant press release",
  ],

  applicationName: "Liaison Bank",
  authors: [
    { name: "Liaison Bank", url: `${SITE_URL}/about-us-liaison` },
  ],
  creator: "Liaison Bank",
  publisher: "Liaison Bank",
  category: "Business News",

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
      "Press Releases | Liaisoning & Licensing News – Liaison Bank",
    description:
      "Latest press releases, announcements, and media coverage from Liaison Bank on licensing, liaisoning, fire safety, and government approvals.",
    images: [
      {
        url: `${SITE_URL}/images/press-release-poster.png`,
        width: 1200,
        height: 630,
        alt: "Liaison Bank Press Releases",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@liaisonbank",
    creator: "@liaisonbank",
    title:
      "Press Releases | Liaisoning & Licensing News – Liaison Bank",
    description:
      "Latest announcements, media coverage and updates from Liaison Bank on licensing and liaisoning in Mumbai.",
    images: [
      {
        url: `${SITE_URL}/images/press-release-poster.png`,
        alt: "Liaison Bank Press Releases",
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
// SECTION-WIDE JSON-LD SCHEMAS
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
      name: "Press Releases",
      item: SECTION_URL,
    },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Liaison Bank Press Releases",
  description:
    "Archive of press releases, announcements, and media coverage from Liaison Bank on licensing, liaisoning, and government approvals in Mumbai.",
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

export default function PressReleaseLayout({ children }) {
  return (
    <>
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Collection page structured data */}
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