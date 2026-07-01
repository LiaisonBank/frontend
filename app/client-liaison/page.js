import Clients from "./clients.jsx";

export const metadata = {
  title:
    "Our Clients | Trusted Business Licensing & Government Liaison Partners | Liaison Bank",

  description:
    "Explore Liaison Bank's portfolio of trusted clients across commercial, industrial, healthcare, hospitality, education, retail, and real estate sectors. Discover why businesses rely on our expertise for government liaisoning, statutory approvals, regulatory compliance, and business licensing services across Mumbai and India.",

  keywords: [
    "Liaison Bank clients",
    "Our Clients",
    "Liaison Bank Mumbai",
    "Mr. Mahadev Biradar Consulting",
    "DBRE India",
    "Trusted business consultants",
    "Business licensing clients",
    "Government liaison clients",
    "Corporate clients Mumbai",
    "Business licensing services",
    "Government liaison services",
    "Regulatory compliance services",
    "Corporate compliance consultants",
    "Business licensing India",
    "Government approval consultants",
    "Statutory approvals consultants",
    "Commercial licensing consultants",
    "Industrial licensing consultants",
    "Corporate licensing experts",
    "Business registration consultants",
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
    "Restaurant licensing consultants",
    "Retail licensing consultants",
    "Hotel licensing consultants",
    "Warehouse licensing consultants",
    "Office licensing consultants",
    "Manufacturing licensing consultants",
    "Real estate liaison consultants",
    "Asset management and regularization",
    "Building regularization consultants",
    "Structural compliance consultants",
    "BMC compliance consultants",
    "Brihanmumbai Municipal Corporation approvals",
    "Business consultants Mumbai",
    "Government liaisoning firm Mumbai",
    "Business license consultants Mumbai",
    "Industrial approvals Mumbai",
    "Commercial project approvals",
    "Regulatory compliance specialists",
    "Trusted compliance partner",
    "Leading liaison consultants India"
  ],

  alternates: {
    canonical: "https://www.liaisonbank.com/clients",
  },

  openGraph: {
    title:
      "Our Clients | Trusted Business Licensing & Government Liaison Partners",

    description:
      "See why leading businesses across Mumbai and India trust Liaison Bank for statutory approvals, regulatory compliance, business licensing, and government liaisoning services.",

    url: "https://www.liaisonbank.com/clients",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Our Clients | Trusted Business Licensing & Government Liaison Partners",

    description:
      "Explore Liaison Bank's trusted client portfolio across multiple industries and discover why businesses choose us for licensing and compliance solutions.",
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
  return <Clients />;
}