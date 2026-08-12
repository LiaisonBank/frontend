"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import "./RecruitmentModal.scss";

export default function RecruitemtnModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Don't render anything if not mounted or not open
  if (!mounted || !isOpen) return null;

  // Use portal to render at document body level
  return createPortal(
    <div className="recruitment-popup-overlay">
      <div className="recruitment-popup">
        <button
          className="career-popup-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close popup"
        >
          ×
        </button>

        <h2>Recruitment Fraud Disclaimer</h2>

        <p>
          Liaison Bank follows a fair, transparent, and merit-based recruitment
          process. We never charge candidates any fees for applications,
          interviews, selection, or employment offers. Candidates should remain
          cautious of fraudulent communications and must not share confidential
          information, including passwords, PINs, OTPs, or banking details.
          Liaison Bank is not responsible for losses arising from unauthorized
          individuals or fraudulent job offers. Please verify suspicious
          recruitment communications through our official channels at &nbsp;
          <Link href="mailto:hr@liasionbank.com">hr@liasionbank.com</Link>.
        </p>
      </div>
    </div>,
    document.body
  );
}