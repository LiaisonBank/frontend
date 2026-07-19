"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function LenisProvider() {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);
  const pathname = usePathname();

  // Initialize Lenis only once
  useEffect(() => {
    // Prevent browser from restoring previous scroll position
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

    // Always start from the top after initial load/refresh
    requestAnimationFrame(() => {
      lenis.scrollTo(0, {
        immediate: true,
        force: true,
      });
    });

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on every route change
  useEffect(() => {
    if (!lenisRef.current) return;

    requestAnimationFrame(() => {
      lenisRef.current.scrollTo(0, {
        immediate: true,
        force: true,
      });
    });
  }, [pathname]);

  return null;
}