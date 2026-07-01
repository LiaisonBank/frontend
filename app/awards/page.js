import Awards from "./Awards.jsx";

export const metadata = {
  title:
    "Awards & Recognition | Liaison Bank | Business Licensing & Government Liaison Experts",

  description:
    "Explore the awards, achievements, certifications, and industry recognition earned by Liaison Bank. Our commitment to excellence in business licensing, government liaisoning, statutory approvals, and regulatory compliance has made us a trusted consultancy across Mumbai and India.",

  keywords: [
    "Liaison Bank awards",
    "Liaison Bank recognition",
    "Liaison Bank achievements",
    "Award winning business consultants",
    "Award winning liaison consultants",
    "Business excellence awards",
    "Government liaison experts",
    "Business licensing experts",
    "Regulatory compliance experts",
    "Trusted business consultants",
    "Business licensing consultants",
    "Government liaison services",
    "Business licensing services",
    "Corporate compliance consultants",
    "Business compliance consultants India",
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
    "Structural compliance consultants",
    "Building regularization consultants",
    "BMC compliance consultants",
    "Business consultants Mumbai",
    "Government liaisoning firm Mumbai",
    "Business license consultants Mumbai",
    "Industrial approvals Mumbai",
    "Commercial project approvals",
    "Regulatory compliance specialists",
    "Trusted compliance partner",
    "Leading liaison consultants India",
    "Award winning compliance consultancy"
  ],

  alternates: {
    canonical: "https://www.liaisonbank.com/awards",
  },

  openGraph: {
    title:
      "Awards & Recognition | Liaison Bank | Industry-Leading Business Licensing Experts",

    description:
      "Discover Liaison Bank's awards, achievements, and industry recognition for excellence in government liaisoning, statutory approvals, regulatory compliance, and business licensing services.",

    url: "https://www.liaisonbank.com/awards",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Awards & Recognition | Liaison Bank",

    description:
      "Explore the awards and achievements that reflect Liaison Bank's commitment to excellence in business licensing and government liaison services.",
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
  return <Awards />;
}