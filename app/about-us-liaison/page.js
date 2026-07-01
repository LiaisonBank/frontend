import AboutClient from "./about.jsx";

export const metadata = {
  title:
    "About Liaison Bank | Business Licensing & Government Liaison Experts Mumbai",

  description:
    "Learn about Liaison Bank, a trusted government liaison and business licensing consultancy in Mumbai. We specialize in statutory approvals, regulatory compliance, BMC permissions, FSSAI registration, factory licensing, and end-to-end business licensing solutions across India.",

  keywords: [
    "About Liaison Bank",
    "Liaison Bank",
    "Liaison Bank Mumbai",
    "Mr. Mahadev Biradar Consulting",
    "DBRE India",
    "Government liaison consultants",
    "Business licensing consultants",
    "Business licensing services",
    "Business licensing India",
    "Government liaison services",
    "Regulatory compliance consultants",
    "Corporate compliance consultants",
    "Business compliance consultants India",
    "Government approval consultants",
    "Business permit consultants",
    "Statutory approvals",
    "Statutory approvals for business",
    "Commercial licensing consultants",
    "Industrial licensing consultants",
    "Corporate licensing experts",
    "Business registration consultants",
    "Commercial permits",
    "Government permits and licensing",
    "End-to-end licensing support",
    "FSSAI registration consultants",
    "Trade license consultants",
    "Factory license consultants",
    "Fire NOC consultants",
    "Environmental clearance consultants",
    "Import export license consultants",
    "Healthcare licensing consultants",
    "Educational institution licensing",
    "Real estate liaison consultants",
    "Asset management and regularization",
    "Building regularization consultants",
    "Structural compliance consultants",
    "Technical deviation rectification",
    "BMC compliance consultants",
    "Brihanmumbai Municipal Corporation approvals",
    "BMC factory license consultants",
    "Business consultants Mumbai",
    "Liaison services Mumbai",
    "Government liaisoning firm Mumbai",
    "Business license consultants Mumbai",
    "Khar West business consultants",
    "Industrial approvals Mumbai",
    "Commercial project approvals",
    "Regulatory compliance specialists",
    "Government policy consultants",
    "Trusted business consultants India"
  ],

  alternates: {
    canonical: "https://www.liaisonbank.com/about",
  },

  openGraph: {
    title:
      "About Liaison Bank | Business Licensing & Government Liaison Experts",

    description:
      "Discover Liaison Bank's expertise in government liaisoning, statutory approvals, business licensing, regulatory compliance, and corporate consulting services across Mumbai and India.",

    url: "https://www.liaisonbank.com/about",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "About Liaison Bank | Business Licensing & Government Liaison Experts",

    description:
      "Know more about Liaison Bank—Mumbai's trusted consultancy for business licensing, statutory approvals, BMC permissions, and regulatory compliance.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "Business Services",

  authors: [
    {
      name: "Liaison Bank",
      url: "https://www.liaisonbank.com",
    },
  ],

  creator: "Liaison Bank",

  publisher: "Liaison Bank",

  metadataBase: new URL("https://www.liaisonbank.com"),
};

export default function Home() {
  return <AboutClient />;
}