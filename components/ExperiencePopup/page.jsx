"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "liaisonbank-experience-popup-shown";

const SHOW_DELAY = 800;
const DISPLAY_DURATION = 4000;
const EXIT_DURATION = 1000;

export default function ExperiencePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem(STORAGE_KEY);

    if (hasShown === "true") {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, SHOW_DELAY);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const hideTimer = window.setTimeout(() => {
      setIsExiting(true);

      window.setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, EXIT_DURATION);
    }, DISPLAY_DURATION);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsExiting(true);

    window.setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, EXIT_DURATION);
  };

  return (
    <div className="experience-popup">
      <div
        className={`experience-popup__panel ${
          isExiting ? "experience-popup__panel--exit" : ""
        }`}
      >
        <button
          type="button"
          className="experience-popup__close"
          onClick={handleClose}
          aria-label="Close"
        >
          <span />
          <span />
        </button>

        <div className="experience-popup__content">
          <div className="experience-popup__line">
            <span>A New Experience</span>
          </div>

          <div className="experience-popup__line">
            <span>Is Taking Shape</span>
          </div>

          <div className="experience-popup__contact">
            <span>
              <Link href="tel:+919769458515">📞 +91 97694 58515</Link>
              <span className="contact-separator">|</span>
              <Link href="tel:+919136066910">📞 +91 91360 66910</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}