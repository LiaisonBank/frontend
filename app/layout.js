import { Barlow } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import OrientationBlocker from "@/components/OrientationBlocker";
import AppProviders from "@/components/AppProviders";
import ClientChatbotWrapper from "@/components/ManualChatbot/ClientChatbotWrapper";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "@fontsource/josefin-sans";
import "@/styles/globals.scss";
import SuggestionBox from "@/components/SuggestionBox/SuggestionBox";

// ======================================================
// FONT CONFIGURATION
// ======================================================

const barlow = Barlow({
  subsets: ["latin"],
  // FIX: trimmed to weights actually used; preloading 14 files (7 weights ×
  // 2 styles) competes with LCP. Add back only if a specific weight is needed.
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-barlow",
  display: "swap",
  preload: true,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.liaisonbank.com";

// ======================================================
// SEO METADATA
// ======================================================

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Liaison Bank | Business Licensing, Fire NOC & Government Approval Consultants",
    template: "%s | Liaison Bank",
  },

  description:
    "Liaison Bank is India's trusted business licensing and liaisoning consultancy providing Factory License, Fire NOC, MPCB, Electrical Inspector approvals, Trade License, statutory compliance, industrial approvals and government liaison services across India.",

  applicationName: "Liaison Bank",

  // FIX: Removed the ~60-entry `keywords` array. Google ignores meta keywords
  // entirely; it only bloated every page's <head>. Keyword targeting is done
  // via title, H1, body copy and structured data instead.

  authors: [
    {
      name: "Liaison Bank",
      url: siteUrl,
    },
  ],

  creator: "Liaison Bank",
  publisher: "Liaison Bank",

  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // FIX: Removed `alternates.canonical: "/"` from the root layout.
  // A root-level canonical of "/" was inherited by any page that forgot to
  // override it, silently canonicalizing child pages to the homepage
  // (duplicate-content / deindexing bug). Each page must set its own canonical.

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Liaison Bank",
    description:
      "Liaison Bank is India's trusted business licensing and liaisoning consultancy providing Factory License, Fire NOC, MPCB, Electrical Inspector approvals, Trade License, statutory compliance, industrial approvals and government liaison services across India.",
    images: [
      {
        url: "/Open-Graph-image.webp",
        width: 1200,
        height: 630,
        alt: "Liaison Bank",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Liaison Bank",
    description:
      "Professional Liaisoning, Licensing, Fire Safety and Compliance Services.",
    images: ["/Open-Graph-image.webp"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  category: "Business",

  // FIX: Only emit google-site-verification when the env var is actually set,
  // instead of an empty content="" tag.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
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
// STRUCTURED DATA — Organization + ProfessionalService
// ======================================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Liaison Bank",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    // FIX: verify this file actually exists at /public/logo.png
    url: `${siteUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  // FIX: added description for entity understanding.
  description:
    "Liaison Bank provides end-to-end licensing, regulatory compliance and project liaisoning services for residential, commercial and industrial clients across Mumbai and India.",
  email: "ceo.desk@liaisonbank.com",
  foundingDate: "2017",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Plot 466, New Apollo CHSL, Beside Blue Tokai Cafe, 14th Road, Khar West",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400052",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Mumbai" },
    { "@type": "State", name: "Maharashtra" },
    { "@type": "Country", name: "India" },
  ],
  sameAs: [
    "https://www.facebook.com/liaisonbank",
    "https://www.linkedin.com/company/liaisonbank",
    "https://twitter.com/liaisonbank",
    "https://www.instagram.com/liaisonbank",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9769458515",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: [
      "English",
      "Hindi",
      "Marathi",
      "Kannada",
      "Telugu",
      "Tamil",
      "Gujarati",
      "Punjabi",
      "Malayalam",
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#localbusiness`,
  name: "Liaison Bank",
  image: `${siteUrl}/og-image.png`,
  url: siteUrl,
  telephone: "+91-9769458515",
  email: "ceo.desk@liaisonbank.com",
  priceRange: "$$",
  // FIX: link the local business to the parent org entity.
  parentOrganization: { "@id": `${siteUrl}/#organization` },
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Plot 466, New Apollo CHSL, Beside Blue Tokai Cafe, 14th Road, Khar West",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400052",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    // ⚠️ REPLACE with the real coordinates of the Khar West office.
    latitude: 19.0728,
    longitude: 72.8347,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Mumbai" },
    { "@type": "State", name: "Maharashtra" },
    { "@type": "Country", name: "India" },
  ],
};

// ======================================================
// ROOT LAYOUT
// ======================================================

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* FIX: preconnect to the image CDN to cut LCP latency. */}
        <link rel="preconnect" href="https://backend.liaisonbank.com" crossOrigin="" />
      </head>
      <body
        className={`${barlow.variable} ${barlow.className} antialiased flex min-h-screen flex-col bg-white text-gray-900`}
        suppressHydrationWarning
      >
        {/*
          FIX: Organization + LocalBusiness JSON-LD are now rendered
          SERVER-SIDE in the initial HTML (not via next/script
          strategy="afterInteractive"). Critical entity schema should be
          in the SSR payload so crawlers see it without executing JS.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        {/*
          FIX: GTM + GA4 both loading is a double-firing risk.
          Keep only ONE. If GA4 is configured inside the GTM container,
          delete the <GoogleAnalytics> line below. If you're not using GTM
          at all, delete the GTM line instead.
        */}
        <GoogleTagManager gtmId="GTM-TT54PJMP" />
        {/* <GoogleAnalytics gaId="G-FNR4R1GZGS" /> */}

        {/* ============================================
            SSR-CRITICAL TREE
        ============================================ */}
        <OrientationBlocker>
          <AppProviders>{children}</AppProviders>
        </OrientationBlocker>

        {/* ============================================
            CLIENT-ONLY WIDGETS
        ============================================ */}
        <ClientChatbotWrapper />
        <SuggestionBox />
      </body>
    </html>
  );
}