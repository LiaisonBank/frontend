import { Barlow } from "next/font/google";
import {
  GoogleTagManager,
  GoogleAnalytics,
} from "@next/third-parties/google";

import Script from "next/script";
import IntroLoader from "@/components/GlobalLoader/IntroLoader";
import DisableZoom from "@/components/DisableZoom";
import OrientationBlocker from "@/components/OrientationBlocker";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import Cursor from "@/components/Cursor";

// import AOSProvider from "@/components/AOSProvider";
import ReduxProvider from "@/store/ReduxProvider";
import ChatBot from "@/components/ChatBot/page";
import LenisProvider from "@/components/LenisProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "@fontsource/josefin-sans";
import "@/styles/globals.scss";


// ======================================================
// FONT CONFIGURATION
// ======================================================

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
  preload: true,
});

const siteUrl = 
  process.env.NEXT_PUBLIC_SITE_URL || "https://liaisonbank.com";


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

  keywords: [
  "Liaison Bank",
  "Liaison Bank Mumbai",
  "Business Liaison Services",
  "Government Liaison Services",
  "Business Licensing Services",
  "Regulatory Compliance Services",
  "Industrial Licensing Consultant",
  "Commercial Licensing Consultant",
  "Corporate Compliance Consultant",
  "Government Approval Consultant",
  "Business Approval Services",
  "Factory License Consultant",
  "Factory License Services",
  "Trade License Consultant",
  "Trade License Services",
  "Fire NOC Consultant",
  "Fire NOC Approval",
  "Electrical Safety Consultant",
  "Electrical Inspector Approval",
  "Electrical Licensing Services",
  "MPCB Consultant",
  "Pollution Control Consultant",
  "Pollution NOC Services",
  "Consent to Establish",
  "Consent to Operate",
  "Industrial Compliance Services",
  "Environmental Clearance Consultant",
  "Industrial Approval Consultant",
  "Factory Compliance Services",
  "Industrial Project Approvals",
  "Government Licensing Consultant",
  "Statutory Approval Services",
  "Industrial Permit Consultant",
  "Commercial Permit Consultant",
  "Legal Compliance Services",
  "Business Registration Consultant",
  "Building Plan Approval",
  "Occupancy Certificate Consultant",
  "Fire Safety Compliance",
  "Electrical Compliance Services",
  "Manufacturing License Consultant",
  "Industrial Safety Consultant",
  "Factory Approval Services",
  "Single Window Clearance Consultant",
  "Business Expansion Approvals",
  "Liaison Consultant India",
  "Licensing Consultant India",
  "Compliance Consultant India",
  "Government Permit Consultant",
  "End-to-End Licensing Solutions"
],

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

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Liaison Bank",

    description:
    "Liaison Bank is India's trusted business licensing and liaisoning consultancy providing Factory License, Fire NOC, MPCB, Electrical Inspector approvals, Trade License, statutory compliance, industrial approvals and government liaison services across India.",
  
    images: [
      {
        url: "/og-image.jpg",
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

    images: ["/og-image.jpg"],
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

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

// ======================================================
// VIEWPORT
// ======================================================

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

// ======================================================
// ORGANIZATION SCHEMA
// ======================================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",

  name: "Liaison Bank",

  url: "https://liaisonbank.com",

  logo: "https://liaisonbank.com/logo.png",

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

// ======================================================
// ROOT LAYOUT
// ======================================================


export default function RootLayout({ children }) {
  const handleChatFormSubmit = () => {};
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ========================================= */}
      {/* GOOGLE TAG MANAGER */}
      {/* ========================================= */}
      <GoogleTagManager gtmId="GTM-TT54PJMP" />

      {/* ========================================= */}
      {/* GOOGLE ANALYTICS */}
      {/* Optional if GA4 already connected in GTM */}
      {/* ========================================= */}

      <GoogleAnalytics gaId="G-FNR4R1GZGS" />

      <body
        className={`${barlow.variable} ${barlow.className} antialiased flex min-h-screen flex-col bg-white text-gray-900`}
      >
        {/* ========================================= */}
        {/* ORGANIZATION STRUCTURED DATA */}
        {/* ========================================= */}
        <OrientationBlocker>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* ========================================= */}
        {/* PROVIDERS */}
        {/* ========================================= */}
        <LenisProvider />
        <ReduxProvider>
         <IntroLoader />
          {/* <AOSProvider> */}
            
            {/* ========================================= */}
            {/* GLOBAL UTILITIES */}
            {/* ========================================= */}

            <DisableZoom />
            {/* <Cursor /> */}

            {/* ========================================= */}
            {/* SITE HEADER */}
            {/* ========================================= */}

            <Header />

            {/* ========================================= */}
            {/* MENU OVERLAY */}
            {/* ========================================= */}

            <div className="menu-overlay" />

            {/* ========================================= */}
            {/* MAIN CONTENT */}
            {/* ========================================= */}

            <main className="page-wrapper flex-grow">
              {children}
            </main>

            {/* ========================================= */}
            {/* SITE FOOTER */}
            {/* ========================================= */}

            <Footer />
            {/* <div className="d-none d-xl-block">
              <ChatBot />
            </div> */}
            
          {/* </AOSProvider> */}
        </ReduxProvider>
        {/* <script defer src="https://india.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="114528775"></script> */}
        </OrientationBlocker>
      </body>
    </html>
  );
}