import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "@fontsource/josefin-sans";
import "@/styles/globals.scss";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
// import { Barlow } from "next/font/google";
// import {
//   GoogleTagManager,
//   GoogleAnalytics,
// } from "@next/third-parties/google";
// import Script from "next/script";

// import OrientationBlocker from "@/components/OrientationBlocker";
// import AppProviders from "@/components/AppProviders";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "@flaticon/flaticon-uicons/css/all/all.css";
// import "@fontsource/josefin-sans";
// import "@/styles/globals.scss";

// const barlow = Barlow({
//   subsets: ["latin"],
//   weight: ["100", "400", "500", "600", "700", "800", "900"],
//   style: ["normal", "italic"],
//   variable: "--font-barlow",
//   display: "swap",
//   preload: true,
// });

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <GoogleTagManager gtmId="GTM-TT54PJMP" />

//       <GoogleAnalytics gaId="G-FNR4R1GZGS" />

//       <body
//         className={`${barlow.variable} ${barlow.className} antialiased flex min-h-screen flex-col bg-white text-gray-900`}
//       >
//         <OrientationBlocker>
//           <Script
//             id="organization-schema"
//             type="application/ld+json"
//             strategy="afterInteractive"
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify({
//                 "@context": "https://schema.org",
//                 "@type": "Organization",
//                 name: "Liaison Bank",
//                 url: "https://liaisonbank.com",
//               }),
//             }}
//           />

//           <AppProviders>
//             {children}
//           </AppProviders>
//         </OrientationBlocker>
//       </body>
//     </html>
//   );
// }