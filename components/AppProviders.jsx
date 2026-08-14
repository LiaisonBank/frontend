"use client";

import { usePathname } from "next/navigation"; // Add this import
import { LoadingProvider } from "@/context/LoadingContext";
import { ModalProvider } from "@/context/ModalContext";
import ReduxProvider from "@/store/ReduxProvider";

import IntroLoader from "@/components/GlobalLoader/IntroLoader";
import LenisProvider from "@/components/LenisProvider";
import DisableZoom from "@/components/DisableZoom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesModal from "@/components/ServicesModal/page";
// import ExperiencePopup from "@/components/ExperiencePopup/page";

export default function AppProviders({ children }) {
    const pathname = usePathname(); // Get current path
  const isHomePage = pathname === "/"; // Check if on home page
  return (
    <ReduxProvider>
      <LoadingProvider>
        <ModalProvider>
          {/* Global Intro Loader - Only on Home Page */}
          {isHomePage && <IntroLoader />}

          <LenisProvider>
            <DisableZoom />

            <Header />

            <div className="menu-overlay" />

            <main className="page-wrapper flex-grow">
              {children}
            </main>

            <Footer />

            {/* Global Modals */}
            <ServicesModal />

            {/* Show once per browser session */}
            {/* <ExperiencePopup /> */}
          </LenisProvider>

        </ModalProvider>
      </LoadingProvider>
    </ReduxProvider>
  );
}