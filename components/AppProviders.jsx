"use client";

import { LoadingProvider } from "@/context/LoadingContext";
import { ModalProvider } from "@/context/ModalContext";
import ReduxProvider from "@/store/ReduxProvider";

import IntroLoader from "@/components/GlobalLoader/IntroLoader";
import LenisProvider from "@/components/LenisProvider";
import DisableZoom from "@/components/DisableZoom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesModal from "@/components/ServicesModal/page";

export default function AppProviders({ children }) {
  return (
    <LoadingProvider>
      <ReduxProvider>
        <ModalProvider>

          {/* Global Intro Loader */}
          <IntroLoader />

          <LenisProvider>
            <DisableZoom />

            <Header />

            <div className="menu-overlay" />

            <main className="page-wrapper flex-grow">
              {children}
            </main>

            <Footer />

            <ServicesModal />
          </LenisProvider>

        </ModalProvider>
      </ReduxProvider>
    </LoadingProvider>
  );
}