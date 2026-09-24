// app/projects/layout.jsx

export const metadata = {
  // ─── Core ─────────────────────────────────────────────────
  // ⚠️ metadataBase should be in the ROOT layout, not here.
  // If you don't have it in root, add: metadataBase: new URL("https://www.liaisonbank.com")

    title: "Our Projects | Government Liaisoning Services in Mumbai | Liaison Bank",
    // title: "Our Projects | Liaisoning & Licensing Services in Mumbai",


  description:
    "Explore Liaison Bank's project portfolio across Mumbai. Discover projects handled through liaisoning, licensing, approvals and related services, with project locations displayed on an interactive map.",

  applicationName: "Liaison Bank",
  authors: [{ name: "Liaison Bank", url: "https://www.liaisonbank.com/about-us-liaison" }],
  creator: "Liaison Bank",
  publisher: "Liaison Bank",
  category: "Business",

  keywords: [
    "Liaison Bank projects",
    "Liaison Bank project portfolio",
    "liaisoning projects Mumbai",
    "licensing projects Mumbai",
    "liaisoning and licensing projects",
    "project portfolio Mumbai",
    "Mumbai liaisoning projects",
    "Mumbai licensing projects",
    "building approval projects Mumbai",
    "government approval projects Mumbai",
    "liaisoning company Mumbai",
    "licensing company Mumbai",
  ],

  // ─── Canonical & Alternates ──────────────────────────────
  alternates: {
    canonical: "https://www.liaisonbank.com/projects",
    // Add language alternates if you ever localize:
    // languages: {
    //   "en-IN": "https://www.liaisonbank.com/projects",
    //   "hi-IN": "https://www.liaisonbank.com/hi/projects",
    // },
  },

  // ─── Robots ──────────────────────────────────────────────
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

  // ─── Open Graph ──────────────────────────────────────────
  openGraph: {
    title:
      "Our Projects | Liaisoning & Licensing Services in Mumbai – Liaison Bank",
    description:
      "Explore Liaison Bank's project portfolio across Mumbai, including projects handled through liaisoning, licensing, approvals and related services.",
    url: "https://www.liaisonbank.com/projects",
    siteName: "Liaison Bank",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.liaisonbank.com/images/projects-poster.png",
        width: 1200,
        height: 630,
        alt: "Liaison Bank Projects across Mumbai",
        type: "image/png",
      },
    ],
  },

  // ─── Twitter / X ─────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@liaisonbank",       // add your handle if you have one
    creator: "@liaisonbank",    // add your handle if you have one
    title:
      "Our Projects | Liaisoning & Licensing Services in Mumbai – Liaison Bank",
    description:
      "Explore Liaison Bank's project portfolio across Mumbai through an interactive project map.",
    images: [
      {
        url: "https://www.liaisonbank.com/images/projects-poster.png",
        alt: "Liaison Bank Projects across Mumbai",
      },
    ],
  },

  // ─── Icons ───────────────────────────────────────────────
  // (Move these to ROOT layout so they apply site-wide — kept here for reference)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",

  // ─── Misc ────────────────────────────────────────────────
  formatDetection: {
    telephone: true,   // ✅ allow phone detection (was disabled)
    address: true,     // ✅ allow address detection
    email: true,       // ✅ allow email detection
  },
};

export default function ProjectsLayout({ children }) {
  return children;
}