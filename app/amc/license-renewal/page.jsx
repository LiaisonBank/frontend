import LRPage from "./LRPage";

export const metadata = {
  title:
    "License Renewal Services in Mumbai | Compliance Renewal - Liaisonbank",

  description:
    "Professional license renewal and compliance services for businesses in Mumbai.",

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