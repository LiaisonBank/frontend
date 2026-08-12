import HomePage from "./home/page";

export const metadata = {
  title: "Liaison Bank | Business Licensing & Government Liaison Services Mumbai",
  description:
    "Liaison Bank is a leading business licensing and government liaison consultancy in Mumbai offering statutory approvals, regulatory compliance, FSSAI, factory licensing, commercial permits, BMC approvals, and end-to-end licensing support.",

  keywords: [
    "Liaison Bank",
    "Liaison Bank Mumbai",
    "Mr. Mahadev Biradar Consulting",
    "DBRE India",
    "Liaison Bank Khar West",
    "Business licensing services",
    "Government liaison services",
    "Regulatory compliance management",
    "Business licensing in India",
    "Statutory approvals for business",
    "Government permits and licensing",
    "Commercial space licensing",
    "Industrial licensing India",
    "Corporate compliance consultants",
    "End-to-end licensing support",
    "FSSAI registration consultants",
    "Food and beverage licensing",
    "Restaurant license consultancy",
    "Trade license procurement",
    "Factory license consultants",
    "Environmental clearance services",
    "Import-export license assistance",
    "Healthcare facility licensing",
    "Educational institution compliance",
    "Real estate liaisoning services",
    "Asset management and regularization",
    "Regularization of unauthorized structures",
    "Rectification of technical deviations",
    "Liaison services in Mumbai",
    "Business license consultants Mumbai",
    "Government liaisoning firm Mumbai",
    "BMC compliance consultants Mumbai",
    "Brihanmumbai Municipal Corporation licensing",
    "BMC factory license consultants",
    "Top liaisoning agents in Mumbai",
    "Khar West business consultants",
    "How to get faster government approvals for business",
    "Smooth business licensing process India",
    "Reduce government approval delays for business",
    "Corporate regulatory compliance solutions",
    "Streamline business compliance requirements",
    "Professional liaison consultancy services",
    "Hassle-free business registration Mumbai",
    "Legal and compliance services for startups",
    "Expert corporate compliance firm",
    "Regulatory compliance specialists",
    "Experienced business liaison partners",
    "Industrial licensing experts",
    "Structural compliance and documentation",
    "Government policy tracking consultants",
    "License Renewal Services Mumbai",
    "Business license renewal assistance",
    "Government liaisoning for industrial approvals",
    "Statutory compliance for manufacturing units",
    "Industrial project approvals and permits",
    // "Environmental compliance for industries",
  ],

  alternates: {
    canonical: "https://www.liaisonbank.com",
  },

  openGraph: {
    title:
      "Liaison Bank | Business Licensing & Government Liaison Services",
    description:
      "Trusted experts in business licensing, statutory approvals, government liaisoning, regulatory compliance, and corporate licensing services across Mumbai and India.",
    url: "https://www.liaisonbank.com",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Liaison Bank | Business Licensing & Government Liaison Services",
    description:
      "Simplifying business licensing, statutory approvals, and government liaisoning for businesses across India.",
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
};

export default function Home() {
  return <HomePage />;
}