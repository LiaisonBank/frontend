"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import "./RecruitmentModal.scss";

export default function RecruitemtnModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
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
          <Link href="mailto:hr@Liasionbank.com">hr@Liasionbank.com</Link>.
        </p>

        {/* <button
          className="career-popup-button"
          onClick={() => setIsOpen(false)}
        >
          Explore Careers
        </button> */}
      </div>
    </div>
  );
}
