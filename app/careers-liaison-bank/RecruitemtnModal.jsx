"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import "./RecruitmentModal.scss";

export default function RecruitmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 9000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="recruitment-popup-overlay" onClick={() => setIsOpen(false)}>
      <div className="recruitment-popup" onClick={(e) => e.stopPropagation()}>
        <button
          className="career-popup-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close popup"
        >
          ×
        </button>

        <h2>Recruitment Fraud Disclaimer</h2>

        <div className="popup-content">
          <p>
            Liaison Bank follows a fair, transparent, and merit-based recruitment process.
          </p>
          <p>
            We never charge candidates any fees for applications, interviews, selection, or employment offers.
          </p>
          <p>
            Candidates should remain cautious of fraudulent communications and must not share confidential information, including passwords, PINs, OTPs, or banking details.
          </p>
          <p>
            Liaison Bank is not responsible for losses arising from unauthorized individuals or fraudulent job offers.
          </p>
          <p>
            Please verify suspicious recruitment communications through our official channels at{" "}
            <Link href="mailto:hr@liaisonbank.com">hr@liaisonbank.com</Link>.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}