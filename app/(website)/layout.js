import AppProviders from "@/components/AppProviders";

export default function WebsiteLayout({ children }) {
  return <AppProviders>{children}</AppProviders>;
}
// "use client";

// import { LoadingProvider } from "@/context/LoadingContext";
// import { ModalProvider } from "@/context/ModalContext";

// import IntroLoader from "@/components/GlobalLoader/IntroLoader";
// import LenisProvider from "@/components/LenisProvider";
// import DisableZoom from "@/components/DisableZoom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import ServicesModal from "@/components/ServicesModal/page";

// export default function WebsiteLayout({ children }) {
//   return (
//     <LoadingProvider>
//       <ModalProvider>

//         {/* Normal Website Loader */}
//         <IntroLoader />

//         <LenisProvider>
//           <DisableZoom>

//             {/* Normal Website Header */}
//             <Header />

//             <div className="menu-overlay" />

//             <main className="page-wrapper flex-grow">
//               {children}
//             </main>

//             {/* Normal Website Footer */}
//             <Footer />

//             {/* Normal Website Modal */}
//             <ServicesModal />

//           </DisableZoom>
//         </LenisProvider>

//       </ModalProvider>
//     </LoadingProvider>
//   );
// }