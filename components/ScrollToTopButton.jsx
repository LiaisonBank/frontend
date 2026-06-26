"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BsArrowUp } from "react-icons/bs";



export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const scrollTop = "/images/scroll_top.png";

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
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className="bi bi-arrow-up"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
        />
      </svg> */}
      {/* <BsArrowUp size={36} /> */}
      <i className="bi bi-arrow-up fs-2"></i>

      {/* <Image
        src={scrollTop}
        alt="Back to top"
        width={50}
        height={50}
        priority
      /> */}
    </button>
  );
}
