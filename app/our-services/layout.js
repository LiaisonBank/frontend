// app/our-services/layout.jsx
// Server Component — holds all page metadata for App Router

export const metadata = {
  title: "Our Services | Government Liaisoning and Licensing in Mumbai",
  
  description:
    "Explore Liaison Bank's liaisoning, licensing, fire safety, electrical, PNG and annual maintenance contract (AMC) services for residential, commercial and industrial properties and businesses across Mumbai and India.",
  applicationName: "Liaison Bank",
  authors: [{ name: "Liaison Bank", url: "https://www.liaisonbank.com/about-us-liaison" }],
  creator: "Liaison Bank",
  publisher: "Liaison Bank",
  category: "Business Services",
  alternates: {
    canonical: "https://www.liaisonbank.com/our-services",
    languages: {
      "en-IN": "https://www.liaisonbank.com/our-services",
      "x-default": "https://www.liaisonbank.com/our-services",
    },
  },
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
  openGraph: {
    title: "Our Services | Liaisoning, Licensing, Fire Safety & AMC | Liaison Bank",
    description:
      "One service partner for government liaisoning, business licensing, fire safety, electrical, PNG and AMC solutions across residential, commercial and industrial sectors.",
    url: "https://www.liaisonbank.com/our-services",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.liaisonbank.com/images/liaison-bank-government-licensing-mumbai.png",
        width: 1200,
        height: 630,
        alt: "Liaison Bank – Liaisoning, Licensing, Fire Safety, Electrical, PNG and AMC Services",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@liaisonbank",
    creator: "@liaisonbank",
    title: "Our Services | Liaisoning, Licensing & Business Solutions",
    description:
      "Explore Liaison Bank's liaisoning, licensing, fire safety, electrical, PNG and AMC services for residential, commercial and industrial sectors.",
    images: ["https://www.liaisonbank.com/images/liaison-bank-government-licensing-mumbai.png"],
  },
  // FIX: Removed `other: { "format-detection": ... }` — this was duplicating
  // the meta tag already injected by the root layout. Set it once, globally.
};

export default function OurServicesLayout({ children }) {
  return children;
}