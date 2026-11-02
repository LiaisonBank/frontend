"use client";

import { usePathname } from "next/navigation";
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
    const pathname = usePathname();

    const isHomePage = pathname === "/";

    // Hide navbar only on the introductory video page
    const hideHeader =
        pathname === "/careers-liaison-bank/introductory-video";

    return (
        <ReduxProvider>
            <LoadingProvider>
                <ModalProvider>

                    {/* Global Intro Loader - Only on Home Page */}
                    {isHomePage && <IntroLoader />}

                    <LenisProvider>
                        <DisableZoom />

                        {/* Global Navbar */}
                        {!hideHeader && (
                            <>
                                <Header />
                                <div className="menu-overlay" />
                            </>
                        )}

                        <main className="page-wrapper flex-grow">
                            {children}
                        </main>

                        <Footer />

                        {/* Global Modals */}
                        <ServicesModal />

                    </LenisProvider>

                </ModalProvider>
            </LoadingProvider>
        </ReduxProvider>
    );
}