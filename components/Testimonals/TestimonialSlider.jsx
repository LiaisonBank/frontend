
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { testimonials } from "@/lib/data/testimonialList";
import "./TestimonialSlider.scss";

const PLACEHOLDER_IMAGE = "/images/avatar-placeholder.jpg";

export default function TestimonialSlider() {
  const [displayTestimonials, setDisplayTestimonials] = useState(testimonials);
  const [loading, setLoading] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [curSlide, setCurSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch testimonials
  useEffect(() => {
    const controller = new AbortController();

    async function fetchReviews() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/review`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch reviews");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const apiReviews = result.data
            .filter(
              (item) =>
                item.status === "Active" &&
                typeof item.review === "string" &&
                item.review.trim()
            )
            .map((item, index) => {
              const rating = Number(item.rating);

              return {
                id: `api-${item.id || index}`,
                company: item.company || "Client Experience",
                text: item.review.trim(),
                name: item.name || "Valued Client",
                designation: item.designation || "",
                location: item.address || "",
                rating:
                  Number.isFinite(rating) && rating >= 1 && rating <= 5
                    ? rating
                    : null,
                image:
                  testimonials[index % Math.max(testimonials.length, 1)]
                    ?.image || PLACEHOLDER_IMAGE,
              };
            });

          setDisplayTestimonials(
            apiReviews.length ? apiReviews : testimonials
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Review API error:", error);
          setDisplayTestimonials(testimonials);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchReviews();

    return () => controller.abort();
  }, []);

  // Normalize reviews
  const reviews = useMemo(
    () =>
      displayTestimonials
        .map((item, index) => ({
          id: item.id || `review-${index}`,
          company: item.company || item.title || "Client Experience",
          text: item.text || item.review || "",
          name: item.name || "Valued Client",
          designation: item.designation || "",
          location: item.location || item.address || "",
          rating:
            Number.isFinite(Number(item.rating)) &&
            Number(item.rating) >= 1 &&
            Number(item.rating) <= 5
              ? Number(item.rating)
              : null,
          image: item.image || PLACEHOLDER_IMAGE,
        }))
        .filter((item) => item.text.trim()),
    [displayTestimonials]
  );

  // Responsive layout
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      setItemsPerView(width <= 767 ? 1 : width <= 1023 ? 2 : 3);
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Group reviews into pages
  const pages = useMemo(() => {
    const result = [];

    for (let i = 0; i < reviews.length; i += itemsPerView) {
      result.push(reviews.slice(i, i + itemsPerView));
    }

    return result;
  }, [reviews, itemsPerView]);

  const totalSlides = pages.length;

  useEffect(() => {
    setCurSlide((current) =>
      Math.min(current, Math.max(totalSlides - 1, 0))
    );
  }, [totalSlides]);

  // Navigation
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;

    setCurSlide((current) => (current + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;

    setCurSlide((current) =>
      current === 0 ? totalSlides - 1 : current - 1
    );
  }, [totalSlides]);

  // Autoplay
  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    stopAutoplay();

    if (
      paused ||
      document.hidden ||
      totalSlides <= 1 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurSlide((current) => (current + 1) % totalSlides);
    }, 5500);

    return stopAutoplay;
  }, [paused, totalSlides, stopAutoplay]);

  // Browser tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAutoplay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [stopAutoplay]);

  // Touch swipe
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = event.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      distance > 0 ? nextSlide() : prevSlide();
    }

    if (!paused) {
      setPaused(false);
    }
  };

  if (loading && !reviews.length) {
    return (
      <section className="lb-testimonials">
        <div className="lb-testimonial-loading">
          <span className="lb-loader" />
          <p>Loading client experiences...</p>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;

  return (
    <section className="lb-testimonials">
      <div className="lb-testimonial-container">

        {/* Section Heading */}
       

        {/* Testimonial Slider */}
        <div
          className="lb-testimonial-slider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="lb-testimonial-track"
            style={{
              transform: `translate3d(-${curSlide * 100}%, 0, 0)`,
            }}
          >
            {pages.map((page, pageIndex) => (
              <div className="lb-testimonial-page" key={pageIndex}>
                {page.map((item) => (
                  <article
                    className="lb-review-card"
                    key={item.id}
                  >
                    <div className="lb-review-top">
                      <span className="lb-review-company">
                        {item.company}
                      </span>

                      <span className="lb-review-quote">
                        “
                      </span>
                    </div>

                    <p className="lb-review-text">
                      {item.text}
                    </p>

                    {item.rating && (
                      <div
                        className="lb-review-rating"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        <div className="lb-review-stars">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <span
                              key={star}
                              className={
                                star < Math.round(item.rating)
                                  ? "active"
                                  : ""
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <span className="lb-rating-number">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    <div className="lb-review-divider" />

                    <div className="lb-review-author">
                      <div className="lb-avatar-ring">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={52}
                          height={52}
                          className="lb-avatar"
                          unoptimized
                        />
                      </div>

                      <div className="lb-author-info">
                        <h4>{item.name}</h4>

                        {item.designation && (
                          <span>{item.designation}</span>
                        )}

                        {item.location && (
                          <span className="lb-author-location">
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {totalSlides > 1 && (
          <div className="lb-testimonial-controls">
            <div className="lb-slide-count">
              <span>{String(curSlide + 1).padStart(2, "0")}</span>
              <span className="lb-count-divider">/</span>
              <span>{String(totalSlides).padStart(2, "0")}</span>
            </div>

            <div className="lb-slider-navigation">
              <button
                type="button"
                className="lb-nav-btn"
                onClick={prevSlide}
                aria-label="Previous testimonials"
              >
                &#8592;
              </button>

              <div className="lb-slider-dots">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`lb-dot ${
                      curSlide === index ? "active" : ""
                    }`}
                    onClick={() => setCurSlide(index)}
                    aria-label={`Go to testimonial page ${index + 1}`}
                    aria-current={curSlide === index ? "true" : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                className="lb-nav-btn"
                onClick={nextSlide}
                aria-label="Next testimonials"
              >
                &#8594;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
