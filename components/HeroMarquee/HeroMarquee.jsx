"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import Image from "next/image";
import styles from "./HeroSlider.module.scss";
import slides from "./slides";

const TYPING_SPEED = 80;
const HOLD_AFTER_TYPING = 2000;

export default function HeroSlider() {
  const trackRef = useRef(null);
  const contentRefs = useRef([]);
  const autoplayRef = useRef(null);
  const typingRef = useRef(null);
  const isAnimating = useRef(false);

  const touchStartX = useRef(0);

  const totalSlides = slides.length;

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [typedTitles, setTypedTitles] =
    useState(() =>
      slides.map((slide) => slide.title)
    );

  const stopTimers = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }

    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
  }, []);

  const animateContent = useCallback(
    (index) => {
      const content =
        contentRefs.current[index];

      if (!content) return;

      gsap.killTweensOf(content);

      gsap.fromTo(
        content,
        {
          opacity: 0,
          x: -120,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "expo.out",
        }
      );
    },
    []
  );

  const startTyping = useCallback(
    (title, slideIndex) => {
      stopTimers();

      let charIndex = 0;

      setTypedTitles((prev) => {
        const next = [...prev];
        next[slideIndex] = "";
        return next;
      });

      const type = () => {
        charIndex++;

        setTypedTitles((prev) => {
          const next = [...prev];
          next[slideIndex] = title.slice(
            0,
            charIndex
          );
          return next;
        });

        if (charIndex < title.length) {
          typingRef.current =
            setTimeout(
              type,
              TYPING_SPEED
            );
        } else {
          typingRef.current = null;

          autoplayRef.current =
            setTimeout(() => {
              setCurrentSlide(
                (prev) =>
                  prev >=
                  totalSlides - 1
                    ? 0
                    : prev + 1
              );
            }, HOLD_AFTER_TYPING);
        }
      };

      typingRef.current = setTimeout(
        type,
        TYPING_SPEED
      );
    },
    [stopTimers, totalSlides]
  );

  const goToSlide = useCallback(
    (index) => {
      if (
        index === currentSlide ||
        isAnimating.current
      ) {
        return;
      }

      stopTimers();
      setCurrentSlide(index);
    },
    [currentSlide, stopTimers]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev >= totalSlides - 1
        ? 0
        : prev + 1
    );
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev <= 0
        ? totalSlides - 1
        : prev - 1
    );
  }, [totalSlides]);

  useEffect(() => {
    if (!trackRef.current) return;

    isAnimating.current = true;

    gsap.to(trackRef.current, {
      xPercent: -(currentSlide * 100),
      duration: 1.2,
      ease: "power3.inOut",

      onComplete: () => {
        isAnimating.current = false;

        animateContent(currentSlide);

        startTyping(
          slides[currentSlide].title,
          currentSlide
        );
      },
    });
  }, [
    currentSlide,
    animateContent,
    startTyping,
  ]);

  const handleTouchStart =
    useCallback((e) => {
      touchStartX.current =
        e.touches[0].clientX;
    }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const touchEnd =
        e.changedTouches[0].clientX;

      const distance =
        touchStartX.current -
        touchEnd;

      if (
        Math.abs(distance) < 50 ||
        isAnimating.current
      ) {
        return;
      }

      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating.current)
        return;

      if (e.key === "ArrowRight") {
        nextSlide();
      }

      if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    return () => {
      stopTimers();

      gsap.killTweensOf(
        trackRef.current
      );

      contentRefs.current.forEach(
        (el) => {
          if (el) {
            gsap.killTweensOf(el);
          }
        }
      );
    };
  }, [stopTimers]);

  return (
    <section className={styles.hero}>
      <div
        className={styles.viewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className={styles.track}
        >
          {slides.map(
            (slide, index) => (
              <div
                key={index}
                className={
                  styles.slide
                }
              >
                {slide.type ===
                "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={
                      styles.media
                    }
                  >
                    <source
                      src={
                        slide.media
                      }
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <Image
                    src={isMobile ? slide.mobileImage : slide.image}
                    alt={slide.title}
                    fill
                    priority={
                      index === 0
                    }
                    sizes="100vw"
                    className={
                      styles.media
                    }
                  />
                )}

                <div
                  className={
                    styles.overlay
                  }
                />

                <div
                  className={
                    styles.contentMask
                  }
                >
                  <div
                    className={
                      styles.content
                    }
                    ref={(el) => {
                      contentRefs.current[
                        index
                      ] = el;
                    }}
                  >
                    <h2>
                      {
                        typedTitles[
                          index
                        ]
                      }

                      {currentSlide ===
                        index && (
                        <span
                          className={
                            styles.cursor
                          }
                        >
                          |
                        </span>
                      )}
                    </h2>

                    <p>
                      {
                        slide.subtitle
                      }
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div
        className={
          styles.pagination
        }
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() =>
              goToSlide(index)
            }
            className={`${styles.dot} ${
              currentSlide === index
                ? styles.activeDot
                : ""
            }`}
            aria-label={`Go to slide ${
              index + 1
            }`}
          />
        ))}
      </div>
    </section>
  );
}