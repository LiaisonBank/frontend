import LRPage from "./LRPage";

export const metadata = {
  title:
    "License Renewal Services in India | Compliance Renewal - Liaisonbank",

  description:
    "Professional license renewal services for businesses, factories, and commercial establishments. Get expert compliance and renewal support with Liaisonbank.",
  
  alternates: {
    canonical: "https://liaisonbank.com/license-renewal",
  },

  keywords: [
    "License Renewal",
    "Compliance Renewal",
    "Business License Renewal",
    "Mumbai Compliance Services",
    "Regulatory Compliance",
    "Liaisonbank"
  ],

  // Optional: SEO enhancements
  openGraph: {
    title: "License Renewal Services in Mumbai | Liaisonbank",
    description:
      "Professional license renewal and compliance services for businesses in Mumbai.",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <LRPage />;
}