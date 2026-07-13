"use client";

import { useEffect, useState } from "react";

export default function OrientationBlocker({ children }) {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
      const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      const isLandscape = window.innerWidth > window.innerHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      console.log("Mobile", isMobile);
      console.log("Landscape", isLandscape);
      console.log("Window Width", windowWidth);
      console.log("Window Height", windowHeight);

      setIsBlocked(isMobile && isLandscape);
    };
    // const checkOrientation = () => {
    //   const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    //   const isPhone = window.innerWidth <= 767;

    //   setIsBlocked(isLandscape && isPhone);
    // };
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isBlocked ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isBlocked]);

  if (isBlocked) {
    return (
      <div className="orientation-blocker">
        <div className="orientation-card">
          <h2>Please Rotate Your Device</h2>
          <p>
            This website is available only in portrait mode on mobile devices.
          </p>
        </div>
      </div>
    );
  }

  return children;
}