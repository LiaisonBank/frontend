"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";

import styles from "./HeroSlider.module.scss";
import slides from "./slides";

const AUTOPLAY_TIME = 7000;

export default function HeroSlider() {
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const autoplayRef = useRef(null);
  const contentRefs = useRef([]);
  const isAnimating = useRef(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = slides.length;

  const animateContent = useCallback((index) => {
    const content = contentRefs.current[index];

    if (!content) return;

    gsap.killTweensOf(content);

    gsap.set(content, {
      opacity: 0,
      x: -120,
    });

    gsap.to(content, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "expo.out",
    });
  }, []);

  const animateProgress = useCallback(() => {
    if (!progressRef.current) return;

    gsap.killTweensOf(progressRef.current);

    gsap.set(progressRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    gsap.to(progressRef.current, {
      scaleX: 1,
      duration: AUTOPLAY_TIME / 1000,
      ease: "none",
    });
  }, []);

  const goToSlide = useCallback(
    (index) => {
      if (!trackRef.current || isAnimating.current) return;

      isAnimating.current = true;

      gsap.to(trackRef.current, {
        xPercent: -(index * 100),
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      setCurrentSlide(index);
      animateContent(index);
      animateProgress();
    },
    [animateContent, animateProgress]
  );

  const nextSlide = useCallback(() => {
    const next =
      currentSlide >= totalSlides - 1
        ? 0
        : currentSlide + 1;

    goToSlide(next);
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev =
      currentSlide <= 0
        ? totalSlides - 1
        : currentSlide - 1;

    goToSlide(prev);
  }, [currentSlide, totalSlides, goToSlide]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();

    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next =
          prev >= totalSlides - 1 ? 0 : prev + 1;

        goToSlide(next);
        return next;
      });
    }, AUTOPLAY_TIME);
  }, [goToSlide, stopAutoplay, totalSlides]);

  const handleTouchStart = (e) => {
    stopAutoplay();
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;

    const distance =
      touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    startAutoplay();
  };

  useEffect(() => {
    animateContent(0);
    animateProgress();
    startAutoplay();

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        stopAutoplay();
        nextSlide();
        startAutoplay();
      }

      if (e.key === "ArrowLeft") {
        stopAutoplay();
        prevSlide();
        startAutoplay();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      stopAutoplay();
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.progressBar}>
        <span ref={progressRef} />
      </div>

      <div
        className={styles.viewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.track}
          ref={trackRef}
        >
          {slides.map((slide, index) => (
            <div
              className={styles.slide}
              key={index}
            >
              {slide.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={styles.media}
                >
                  <source
                    src={slide.media}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className={styles.media}
                  sizes="100vw"
                />
              )}

              <div className={styles.overlay} />

              <div className={styles.contentMask}>
                <div
                  className={styles.content}
                  ref={(el) =>
                    (contentRefs.current[index] = el)
                  }
                >
                  <h2>{slide.title}</h2>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.pagination}>
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.dot} ${
              currentSlide === index
                ? styles.activeDot
                : ""
            }`}
            onClick={() => {
              stopAutoplay();
              goToSlide(index);
              startAutoplay();
            }}
            aria-label={`Go to slide ${
              index + 1
            }`}
          />
        ))}
      </div>
    </section>
  );
}