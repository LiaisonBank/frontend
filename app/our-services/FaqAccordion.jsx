// app/our-services/FaqAccordion.jsx
"use client";

import { useState } from "react";

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="ec-faq-list">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="ec-faq-item">
            <button
              type="button"
              className={`ec-faq-q${isOpen ? " is-open" : ""}`}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              <span>{faq.question}</span>
              <span className="ec-faq-icon" aria-hidden="true">
                ›
              </span>
            </button>
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              className={`ec-faq-answer${isOpen ? " is-open" : ""}`}
            >
              <div className="ec-faq-answer-inner">
                <p className="ec-faq-a">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}