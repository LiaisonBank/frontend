"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent browser restoring previous scroll
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Delay AOS init to avoid hydration jump
    const timer = setTimeout(() => {
      AOS.init({
        duration: 1000,
        easing: "ease-out-cubic",
        debounceDelay: 50,
        once: false,
        mirror: true,
        offset: 50,
        delay: 0,
      });

      // Refresh animations after route change
      AOS.refresh();
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}