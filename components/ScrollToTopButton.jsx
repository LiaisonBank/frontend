"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import rocketImg from "@/assets/images/rocket.gif";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 200;
      setVisible(v => (v !== shouldShow ? shouldShow : v));
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
      <Image
        src={rocketImg}
        alt="Back to top"
        width={50}
        height={50}
        priority
      />
    </button>
  );
}
