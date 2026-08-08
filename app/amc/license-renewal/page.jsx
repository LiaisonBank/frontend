import LRPage from "./LRPage";

export const metadata = {
  metadataBase: new URL("https://liaisonbank.com"),

  title: "License Renewal Services in India | Business Compliance | Liaison Bank",

  description:
    "Liaison Bank provides professional license renewal services for factories, commercial establishments, industries, offices, hospitals, hotels, restaurants, schools, and residential societies. Ensure timely compliance, renewals, inspections, and regulatory approvals across India.",

  keywords: [
    "License Renewal Services",
    "Business License Renewal",
    "Factory License Renewal",
    "Trade License Renewal",
    "Shop and Establishment License Renewal",
    "Industrial License Renewal",
    "Commercial License Renewal",
    "Fire NOC Renewal",
    "Fire License Renewal",
    "Electrical License Renewal",
    "Electrical Safety Certificate",
    "Piped Natural Gas Certification",
    "PNG Audit",
    "PNG License Renewal",
    "Building Compliance",
    "Compliance Consultant",
    "Regulatory Compliance",
    "Government Liaison Services",
    "Industrial Compliance",
    "Corporate Compliance Services",
    "License Renewal Consultant",
    "Mumbai License Renewal",
    "Maharashtra License Renewal",
    "Business Compliance India",
    "Liaison Bank"
  ],

  alternates: {
    canonical: "https://liaisonbank.com/license-renewal",
  },

  openGraph: {
    title: "License Renewal Services in India | Liaison Bank",
    description:
      "Expert license renewal and compliance services for commercial, industrial, residential, healthcare, hospitality, and corporate sectors across India.",
    url: "https://liaisonbank.com/license-renewal",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/license-renewal-banner.webp",
        width: 1200,
        height: 630,
        alt: "License Renewal Services - Liaison Bank",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "License Renewal Services | Liaison Bank",
    description:
      "Professional business license renewal and regulatory compliance services across India.",
    images: ["/images/license-renewal-banner.webp"],
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

  category: "Business Services",

  applicationName: "Liaison Bank",

  authors: [
    {
      name: "Liaison Bank",
      url: "https://liaisonbank.com",
    },
  ],

  creator: "Liaison Bank",

  publisher: "Liaison Bank",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function Page() {
  return <LRPage />;
}