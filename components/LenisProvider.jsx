"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Route change
  useEffect(() => {
    const scrollToTop = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const lenis = lenisRef.current;

          if (!lenis) return;

          lenis.scrollTo(0, {
            immediate: true,
            force: true,
          });
        });
      });
    };

    scrollToTop();

    window.addEventListener("pageshow", scrollToTop);

    return () => {
      window.removeEventListener("pageshow", scrollToTop);
    };
  }, [pathname]);

  const stopLenis = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const startLenis = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const getLenisScroll = useCallback(() => {
    return lenisRef.current?.scroll ?? window.scrollY;
  }, []);

  const restoreLenisScroll = useCallback((position) => {
    const lenis = lenisRef.current;

    if (!lenis) return;

    lenis.scrollTo(position, {
      immediate: true,
      force: true,
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      stopLenis,
      startLenis,
      getLenisScroll,
      restoreLenisScroll,
    }),
    [
      stopLenis,
      startLenis,
      getLenisScroll,
      restoreLenisScroll,
    ]
  );

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}