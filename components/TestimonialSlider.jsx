"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { testimonials } from "@/lib/data/testimonialList";

export default function TestimonialSlider() {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [curSlide, setCurSlide] = useState(0);
  const [displayTestimonials, setDisplayTestimonials] = useState(testimonials);
  const [loading, setLoading] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef(null);

  /* ---------------- FETCH API DATA ---------------- */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/review`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.success && result.data && result.data.length > 0) {
          // Get a random static testimonial image for each API review
          const getRandomImage = () => {
            const staticImages = testimonials.map(t => t.image);
            return staticImages[Math.floor(Math.random() * staticImages.length)];
          };

          // Transform API data to match the testimonial format
          const apiTestimonials = result.data
            .filter(item => item.status === "Active")
            .map((item, index) => ({
              id: `api-${item.id}`,
              title: item.company || "Client Review", // Company name as title
              text: item.review || "", // Review text
              name: item.name || "Anonymous", // Client name
              location: item.address || "", // Address as location
              rating: item.rating || 5, // Rating
              // Use a random static image from existing testimonials
              image: testimonials[index % testimonials.length]?.image || "/images/avatar-placeholder.jpg",
            }));

          // Combine static testimonials with API testimonials
          if (apiTestimonials.length > 0) {
            setDisplayTestimonials(apiTestimonials);
          } else {
            setDisplayTestimonials(testimonials);
          }
        } else {
          // If no data from API, keep only static testimonials
          setDisplayTestimonials(testimonials);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        // Keep only static testimonials on error
        setDisplayTestimonials(testimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  /* ---------------- RESPONSIVE ---------------- */
  useEffect(() => {
  const updateLayout = () => {
    if (window.innerWidth <= 767) {
      // Mobile: 1 testimonial
      setItemsPerView(1);
    } else if (window.innerWidth <= 1023) {
      // Tablet: 2 testimonials
      setItemsPerView(2);
    } else {
      // Desktop: 3 testimonials
      setItemsPerView(3);
    }

    setCurSlide(0);
  };

  updateLayout();

  window.addEventListener("resize", updateLayout);

  return () => {
    window.removeEventListener("resize", updateLayout);
  };
}, []);

  const totalSlides = Math.ceil(displayTestimonials.length / itemsPerView);

  /* ---------------- SLIDER CONTROLS ---------------- */
  const nextSlide = useCallback(() => {
    if (displayTestimonials.length === 0) return;
    setCurSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides, displayTestimonials.length]);

  const prevSlide = () => {
    if (displayTestimonials.length === 0) return;
    setCurSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  /* ---------------- AUTOPLAY ---------------- */
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoplay = useCallback(() => {
    if (displayTestimonials.length === 0) return;
    stopAutoplay();
    intervalRef.current = setInterval(nextSlide, 4000);
  }, [nextSlide, displayTestimonials.length]);

  useEffect(() => {
    if (displayTestimonials.length > 0) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [startAutoplay, displayTestimonials.length]);

  /* Pause autoplay when tab hidden */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [startAutoplay]);

  /* ---------------- TOUCH EVENTS ---------------- */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(distance) < threshold) {
      startAutoplay();
      return;
    }

    if (distance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }

    startAutoplay();
  };

  // Loading state
  if (loading && displayTestimonials.length === 0) {
    return (
      <section className="testimonial-section">
        <div className="slider">
          <div className="testimonial-loading">
            <div className="loading-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayTestimonials.length === 0) {
    return (
      <section className="testimonial-section">
        <div className="slider">
          <div className="testimonial-empty">
            <p>No testimonials available</p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <section className="testimonial-section">
      <div
        className="slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {displayTestimonials.map((item, i) => {
          const translate = 100 * (i - curSlide * itemsPerView);

          return (
            <div
              key={item.id || i}
              className="slide"
              style={{
                width: `${100 / itemsPerView}%`,
                transform: `translateX(${translate}%)`,
              }}
            >
              <div className="testimonial-card">
                {/* Title: Company name for API, or existing title for static */}
                <h5 className="testimonial-title">{item.title}</h5>

                {/* Review Text */}
                <p className="testimonial-text">{item.text}</p>

                <div className="testimonial-author">
                  {/* Image from static testimonials only */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="author-img"
                    onError={(e) => {
                      e.target.src = "/images/avatar-placeholder.jpg";
                    }}
                  />

                  <div className="author-info">
                    <h6>{item.name}</h6>
                    <p>{item.location}</p>

                    <div className="rating">
                      {[...Array(5)].map((_, j) => (
                        <span
                          key={j}
                          className={`star ${j + 1 <= Math.round(item.rating)
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

        {/* Navigation Dots */}
        {totalSlides > 1 && (
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
        )}
      </div>

      {/* Arrow Buttons */}
      {displayTestimonials.length > itemsPerView && (
        <div className="testimonial-controls">
          <button
            className="slider-btn left"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <button
            className="slider-btn right"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
}