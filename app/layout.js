import { Barlow } from "next/font/google";
import {
  GoogleTagManager,
  GoogleAnalytics,
} from "@next/third-parties/google";

import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import Cursor from "@/components/Cursor";
import DisableZoom from "@/components/DisableZoom";

import AOSProvider from "@/components/AOSProvider";
import ReduxProvider from "@/components/ReduxProvider";
import ChatBot from "@/components/ChatBot/page";
import LenisProvider from "@/components/LenisProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "@fontsource/josefin-sans";
import "@/styles/globals.scss";
import IntroLoader from "@/components/GlobalLoader/IntroLoader";


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

// ======================================================
// SEO METADATA
// ======================================================

export const metadata = {
  metadataBase: new URL("https://liaisonbank.com"),

  title: {
    default: "Liaison Bank",
    template: "%s | Liaison Bank",
  },

  description:
    "Liaison Bank provides expert licensing, liaisoning, compliance, approvals, and regulatory consulting services across India.",

  keywords: [
    "liaison services",
    "license consultant",
    "business licensing India",
    "government approvals",
    "regulatory compliance",
    "factory license",
    "pollution NOC",
    "trade license",
    "MPCB consultant",
    "liaisonbank",
  ],

  authors: [
    {
      name: "Liaison Bank",
      url: "https://liaisonbank.com",
    },
  ],

  creator: "Liaison Bank",
  publisher: "Liaison Bank",

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
    canonical: "/",
  },

  openGraph: {
    title: "Liaison Bank",
    description:
      "Professional liaisoning and licensing services across India.",
    url: "https://liaisonbank.com",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",

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
      "Professional liaisoning and licensing services across India.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
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
          <AOSProvider>
            
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

            <main className="flex-grow"  style={{ minHeight: "calc(100vh - 350px)" }}>
              {children}
            </main>

            {/* ========================================= */}
            {/* SITE FOOTER */}
            {/* ========================================= */}

            <Footer />
            <div className="d-none d-xl-block">
              {/* <ChatBot /> */}
            </div>
            
          </AOSProvider>
        </ReduxProvider>
        {/* <script defer src="https://india.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="114528775"></script> */}
      </body>
    </html>
  );
}