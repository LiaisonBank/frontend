"use client";

import { useEffect } from "react";

export default function ParticlesBackground() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("particles.js").then(() => {
        window.particlesJS("particles-js", {
          particles: {
            number: {
              value: 160,
              density: { enable: true, value_area: 800 },
            },
            color: { value: "#000" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
            },
            opacity: {
              value: 1,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: { enable: false },
            },
            move: {
              enable: true,
              speed: 1,
              random: true,
              out_mode: "out",
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "bubble" },
              onclick: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 250,
                size: 0,
                duration: 2,
                opacity: 0,
                speed: 3,
              },
              repulse: {
                distance: 400,
                duration: 0.4,
              },
            },
          },
          retina_detect: true,
        });
      });
    }
  }, []);

  return <div id="particles-js" />;
}
