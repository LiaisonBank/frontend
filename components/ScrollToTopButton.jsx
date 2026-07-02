"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 200;
      setVisible((v) => (v !== shouldShow ? shouldShow : v));
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="scroll-top scroll-visible"
      type="button"
    >
      {/* <i className="bi bi-arrow-up fs-2"></i> */}

      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width={50}
        height={50}
      >
        <path
          d="M11.7,6.3l-3-3C8.5,3.1,8.3,3,8,3c0,0,0,0,0,0C7.7,3,7.5,3.1,7.3,3.3l-3,3c-0.4,0.4-0.4,1,0,1.4c0.4,0.4,1,0.4,1.4,0L7,6.4V12c0,0.6,0.4,1,1,1s1-0.4,1-1V6.4l1.3,1.3c0.4,0.4,1,0.4,1.4,0C11.9,7.5,12,7.3,12,7S11.9,6.5,11.7,6.3z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}