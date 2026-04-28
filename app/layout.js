import { Barlow } from "next/font/google";
import LenisScroll from "@/components/LenisScroller/LenisScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DisableZoom from "@/components/DisableZoom";
import Cursor from "@/components/Cursor";
import AOSProvider from "@/components/AOSProvider";
import ReduxProvider from "@/components/ReduxProvider";
import Script from "next/script";   
import "bootstrap/dist/css/bootstrap.min.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "@fontsource/josefin-sans";

import "@/styles/globals.scss";   // updated path

// Google Font Configuration
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

// SEO Metadata
export const metadata = {
  title: "Liaisonbank",
  description:
    "Liaison Bank was founded in 2007 as Mr. Mahadev Biradar Consulting. Cut to 2024, we have evolved into a versatile and experienced entity as Liaison Bank. In the realm of licensing and liaison services, we stand out as a leading organization with an extensive workforce.",
};

// Root Layout
export default function RootLayout({ children }) {
  const schemaData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Liaison Bank",
  url: "https://liaisonbank.com",
  logo: "https://liaisonbank.com/logo.png",
  sameAs: [
    "https://www.facebook.com/liaisonbank",
    "https://www.linkedin.com/company/liaisonbank",
    "https://twitter.com/liaisonbank",
    "https://www.instagram.com/liaisonbank"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9769458515",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English","Hindi", "Marathi", "Kannada", "Telugu", "Tamil", "Bengali", "Gujarati", "Punjabi", "Malayalam", "Odia", "Assamese"]
  }
};
  return (
    <html lang="en">
      <body className={`${barlow.className} flex flex-col min-h-screen bg-gray-50`}>
        <ReduxProvider>
           <DisableZoom />
          <LenisScroll />   {/* Smooth Scroll */}
          <Cursor />
            <AOSProvider>
              <Header />
              <div className="menu-overlay"></div>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </AOSProvider>
        </ReduxProvider>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </body>
    </html>
  );
}