import Ongoing from "./Ongoing.jsx";

export const metadata = {
  title:
    "Ongoing Projects | Active Business Licensing & Government Liaison Projects | Liaison Bank",

  description:
    "Explore Liaison Bank's ongoing projects across commercial, industrial, healthcare, hospitality, education, retail, and real estate sectors. Discover our active business licensing, statutory approvals, government liaisoning, BMC approvals, regulatory compliance, and end-to-end project management services across Mumbai and India.",

  keywords: [
    "Liaison Bank ongoing projects",
    "Liaison Bank active projects",
    "Current business licensing projects",
    "Ongoing government liaison projects",
    "Business licensing project portfolio",
    "Active statutory approval projects",
    "Government approval projects",
    "Business licensing consultants",
    "Government liaison services",
    "Business licensing services",
    "Business licensing India",
    "Corporate compliance consultants",
    "Regulatory compliance consultants",
    "Business compliance consultants India",
    "Government approval consultants",
    "Business permit consultants",
    "Commercial licensing consultants",
    "Industrial licensing consultants",
    "Corporate licensing experts",
    "Business registration consultants",
    "Government permits and licensing",
    "End-to-end licensing support",
    "Project management consultants",
    "Business project consultants",
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
    "Building regularization consultants",
    "Structural compliance consultants",
    "Technical deviation rectification",
    "BMC compliance consultants",
    "Brihanmumbai Municipal Corporation approvals",
    "Business consultants Mumbai",
    "Government liaisoning firm Mumbai",
    "Business license consultants Mumbai",
    "Industrial approvals Mumbai",
    "Commercial project approvals",
    "Ongoing business licensing projects"
  ],

  alternates: {
    canonical: "https://www.liaisonbank.com/ongoing-projects",
  },

  openGraph: {
    title:
      "Ongoing Projects | Active Business Licensing & Government Liaison Portfolio | Liaison Bank",

    description:
      "Explore Liaison Bank's active portfolio of ongoing business licensing, statutory approvals, government liaisoning, regulatory compliance, and commercial project management services across Mumbai and India.",

    url: "https://www.liaisonbank.com/ongoing-projects",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Ongoing Projects | Liaison Bank",

    description:
      "Browse Liaison Bank's ongoing projects showcasing expertise in business licensing, government liaisoning, statutory approvals, and regulatory compliance.",
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
  return <Ongoing />;
}