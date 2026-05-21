import PplPage from "./PplPage";

export const metadata = {
  title: "Phonographic Performance Licenses - Liaisonbank",

  description:
    "Professional license renewal services for businesses, factories, and commercial establishments. Get expert compliance and renewal support with Liaisonbank.",

  alternates: {
    canonical:
      "https://liaisonbank.com/phonographic-performance-licenses",
  },

  keywords: [
    "Phonographic Performance Licenses",
    "License Renewal Services",
    "Business License Compliance",
  ],

  openGraph: {
    title:
      "Phonographic Performance Licenses - Liaisonbank",

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
  return <PplPage />;
}