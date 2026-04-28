import { useEffect } from "react";

export default function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent duplicate load
    if (window.SmoothScroll) {
      window.SmoothScroll(getOptions());
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://liaisoners.in/rorgimto/mousewheel-smooth-scroll/js/SmoothScroll.min.js?ver=1.4.10";
    script.async = true;

    script.onload = () => {
      if (window.SmoothScroll) {
        window.SmoothScroll(getOptions());
      }
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);
}

function getOptions() {
  return {
    // 🖱️ Mouse wheel only
    mouseWheel: true,
    keyboardSupport: false,

    // 📱 Keep native touch scroll
    touchpadSupport: true,
    touchScroll: false,

    // ⚙️ Smoothness
    animationTime: 700,
    stepSize: 80,

    // 🚀 Acceleration
    accelerationDelta: 30,
    accelerationMax: 2,

    // 🎯 Scroll direction
    arrowScroll: 50,
  };
}
