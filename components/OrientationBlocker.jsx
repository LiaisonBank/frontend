"use client";

import { useEffect, useState } from "react";

export default function OrientationBlocker({ children }) {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const shouldBlock = window.matchMedia(
        "(max-width: 922px) and (orientation: landscape)"
      ).matches;

      setIsBlocked(shouldBlock);
    };

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