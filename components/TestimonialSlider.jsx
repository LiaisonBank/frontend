"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { testimonials } from "@/lib/data/testimonialList";

export default function TestimonialSlider() {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [curSlide, setCurSlide] = useState(0);

  const intervalRef = useRef(null);

  /* ---------------- RESPONSIVE ---------------- */

  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth <= 1023) {
        setItemsPerView(1);
      } else {
        setItemsPerView(1);
      }

      setCurSlide(0);
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  /* ---------------- SLIDER CONTROLS ---------------- */

  const nextSlide = useCallback(() => {
    setCurSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  /* ---------------- AUTOPLAY ---------------- */

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    intervalRef.current = setInterval(nextSlide, 4000);
  }, [nextSlide]);

  useEffect(() => {
    startAutoplay();

    return () => stopAutoplay();
  }, [startAutoplay]);

  /* Pause autoplay when tab hidden */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [startAutoplay]);

  /* ---------------- RENDER ---------------- */

  return (
    <section
      className="testimonial-section"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-once="true"
    >
      <div
        className="slider"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {testimonials.map((item, i) => {
          const translate = 100 * (i - curSlide * itemsPerView);

          return (
            <div
              key={i}
              className="slide"
              style={{
                width: `${100 / itemsPerView}%`,
                transform: `translateX(${translate}%)`,
              }}
            >
              <div className="testimonial-card">
                <h5 className="testimonial-title">{item.title}</h5>

                <p className="testimonial-text">{item.text}</p>

                <div className="testimonial-author">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="author-img"
                  />

                  <div className="author-info">
                    <h6>{item.name}</h6>
                    <p>{item.location}</p>

                    <div className="rating">
                      {[...Array(5)].map((_, j) => (
                        <span
                          key={j}
                          className={`star ${
                            j + 1 <= Math.round(item.rating)
                              ? "filled"
                              : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrow Buttons */}

        <button
          className="slider-btn left"
          onClick={prevSlide}
          aria-label="Previous testimonial"
        >
          ←
        </button>

        <button
          className="slider-btn right"
          onClick={nextSlide}
          aria-label="Next testimonial"
        >
          →
        </button>

        {/* Navigation Dots */}

        <div className="slider-dots">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`dot ${curSlide === i ? "active" : ""}`}
              onClick={() => setCurSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}