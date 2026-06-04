"use client";

import { useState, useRef, useEffect } from "react";
import {faqData } from "@/lib/data/faqData";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const wrapperRef = useRef(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  /* Outside Click Close */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const leftColumn = faqData.filter((_, i) => i % 2 === 0);
  const rightColumn = faqData.filter((_, i) => i % 2 !== 0);

  const renderCard = (item, realIndex) => (
    <div
      key={realIndex}
      className="faq-items bg-white mb-1 overflow-hidden"
      data-aos="fade-up"
      data-aos-delay={realIndex * 100}
      data-aos-duration="800"
    >
      <button
        onClick={() => toggleAccordion(realIndex)}
        className="w-full text-left p-3 flex justify-between items-center"
      >
        <span>{item.question}</span>

        <span
          className={`text-3xl transition duration-300 ${
            activeIndex === realIndex ? "rotate-45" : ""
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          activeIndex === realIndex ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 text-gray-600">
          {item.answer}
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={wrapperRef}
      className="max-w-full mx-auto px-4 py-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {leftColumn.map((item, i) =>
            renderCard(item, i * 2)
          )}
        </div>

        <div>
          {rightColumn.map((item, i) =>
            renderCard(item, i * 2 + 1)
          )}
        </div>
      </div>
    </section>
  );
}