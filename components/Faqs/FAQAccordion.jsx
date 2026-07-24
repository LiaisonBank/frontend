"use client";

import { useState, useRef, useEffect } from "react";
// REMOVED: import { faqData } from "@/lib/data/faqData";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/faqs");
        const result = await response.json();
        
        if (result.success && result.data) {
          // Filter only active FAQs
          const activeFAQs = result.data.filter(item => item.status === "Active");
          setFaqData(activeFAQs);
        } else {
          setFaqData([]);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    // Detect if device supports touch
    const checkTouchDevice = () => {
      setIsTouchDevice(
        () => (
          !!window.matchMedia("(pointer:coarse)").matches ||
          !!window.matchMedia("(hover:none)").matches
        )
      );
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);

    return () => {
      window.removeEventListener("resize", checkTouchDevice);
    };
  }, []);

  const openAccordion = (index) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const toggleAccordion = (index) => {
    setOpenItems((prev) =>
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  /* Close all on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpenItems([]);
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

  // Show loading state while fetching
  if (loading) {
    return (
      <section className="max-w-full mx-auto px-4 py-10">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no FAQs
  if (faqData.length === 0) {
    return (
      <section className="max-w-full mx-auto px-4 py-10">
        <div className="text-center text-gray-600">
          <p>No FAQs available at the moment.</p>
        </div>
      </section>
    );
  }

  const leftColumn = faqData.filter((_, i) => i % 2 === 0);
  const rightColumn = faqData.filter((_, i) => i % 2 !== 0);

  const renderCard = (item, realIndex) => {
    const isOpen = openItems.includes(realIndex);

    return (
      <div
          key={realIndex}
          className="faq-items bg-white mb-1 overflow-hidden"
          // onMouseEnter={() => openAccordion(realIndex)}
        >
        <button
          onClick={() => toggleAccordion(realIndex)}
          className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-50"
        >
          <span>{item.question}</span>

          <span
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-4 py-2 text-gray-600">
            {item.answer}
          </div>
        </div>
      </div>
    );
  };

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