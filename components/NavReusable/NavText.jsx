"use client";

import { useRef } from "react";
import gsap from "gsap";

export default function NavText({ text }) {
    const ref = useRef(null);
  // gsap.to(".nav-letter", {
  //   yPercent: -100,
  //   stagger: 0.03,
  //   duration: 0.7,
  //   ease: "power4.out"
  // });
   const handleEnter = () => {
    if (!ref.current) return;

    gsap.to(ref.current.querySelectorAll(".nav-letter"), {
      yPercent: -100,
      stagger: 0.03,
      duration: 0.7,
      ease: "power4.out",
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;

    gsap.to(ref.current.querySelectorAll(".nav-letter"), {
      yPercent: 0,
      stagger: 0.02,
      duration: 0.6,
      ease: "power4.out",
    });
  };
  return (
    <span className="nav-word">
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="nav-letter"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={{
            "--delay": `${index * 40}ms`,
          }}
        >
          <span className="letter-top">
            {char === " " ? "\u00A0" : char}
          </span>

          <span className="letter-bottom">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}