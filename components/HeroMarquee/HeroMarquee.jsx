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
const MIN_SWIPE_DISTANCE = 50;

export default function HeroSlider() {
  const totalSlides = slides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [typedTitles, setTypedTitles] = useState(() =>
    slides.map(() => "")
  );

  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const contentRefs = useRef([]);

  const autoplayRef = useRef(null);
  const typingRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isAnimating = useRef(false);

  /* -----------------------------
      Helpers
  ------------------------------ */

  const stopTimers = useCallback(() => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }

    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  
  /* -----------------------------
      Navigation
  ------------------------------ */

  const changeSlide = useCallback(
    (index) => {
      if (isAnimating.current) return;

      stopTimers();

      const next =
        (index + totalSlides) % totalSlides;

      setCurrentSlide(next);
    },
    [stopTimers, totalSlides]
  );

  const nextSlide = useCallback(() => {
    changeSlide(currentSlide + 1);
  }, [changeSlide, currentSlide]);

  const prevSlide = useCallback(() => {
    changeSlide(currentSlide - 1);
  }, [changeSlide, currentSlide]);

  const goToSlide = useCallback(
    (index) => {
      if (index === currentSlide) return;
      changeSlide(index);
    },
    [changeSlide, currentSlide]
  );

  /* -----------------------------
      Content Animation
  ------------------------------ */

  const animateContent = useCallback((index) => {
    const element = contentRefs.current[index];

    if (!element) return;

    gsap.killTweensOf(element);

    gsap.fromTo(
      element,
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
  }, []);

  /* -----------------------------
      Typing Animation
  ------------------------------ */

  const startTyping = useCallback(
    (title, index) => {
      stopTimers();

      let charIndex = 0;

      setTypedTitles((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });

      const type = () => {
        charIndex++;

        setTypedTitles((prev) => {
          const next = [...prev];
          next[index] = title.slice(0, charIndex);
          return next;
        });

        if (charIndex < title.length) {
          typingRef.current = setTimeout(
            type,
            TYPING_SPEED
          );
        } else {
          autoplayRef.current = setTimeout(() => {
            changeSlide(currentSlide + 1);
          }, HOLD_AFTER_TYPING);
        }
      };

      typingRef.current = setTimeout(
        type,
        TYPING_SPEED
      );
    },
    [currentSlide, stopTimers]
  );

  /* -----------------------------
      Track Animation
  ------------------------------ */

  useEffect(() => {
    if (!trackRef.current) return;

    isAnimating.current = true;

    gsap.killTweensOf(trackRef.current);

    gsap.to(trackRef.current, {
      xPercent: -(currentSlide * 100),
      duration: 1,
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

  /* -----------------------------
      Touch Events
  ------------------------------ */

  const handleTouchStart = useCallback((e) => {
    touchStartX.current =
      e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current =
      e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isAnimating.current) return;

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (
      Math.abs(distance) <
      MIN_SWIPE_DISTANCE
    )
      return;

    if (distance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  /* -----------------------------
      Keyboard
  ------------------------------ */

  useEffect(() => {
    const onKeyDown = (e) => {
      if (isAnimating.current) return;

      if (e.key === "ArrowRight")
        nextSlide();

      if (e.key === "ArrowLeft")
        prevSlide();
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
  }, [nextSlide, prevSlide]);

  /* -----------------------------
      Mouse Wheel
  ------------------------------ */

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    let locked = false;

    const onWheel = (e) => {
      if (window.innerWidth <= 991) return;

      e.preventDefault();

      if (locked) return;

      locked = true;

      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }

      setTimeout(() => {
        locked = false;
      }, 1000);
    };

    slider.addEventListener(
      "wheel",
      onWheel,
      {
        passive: false,
      }
    );

    return () =>
      slider.removeEventListener(
        "wheel",
        onWheel
      );
  }, [nextSlide, prevSlide]);

  /* -----------------------------
      Responsive Images
  ------------------------------ */

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();

    window.addEventListener(
      "resize",
      checkScreen
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkScreen
      );
  }, []);

  /* -----------------------------
      Cleanup
  ------------------------------ */

  useEffect(() => {
    return () => {
      stopTimers();

      gsap.killTweensOf(trackRef.current);

      contentRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [stopTimers]);
return (
  <section
    ref={sliderRef}
    className={styles.hero}
  >
    <div
      className={styles.viewport}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={trackRef}
        className={styles.track}
      >
        {slides.map((slide, index) => {
          const isActive =
            currentSlide === index;

          return (
            <div
              key={index}
              className={styles.slide}
            >
              {slide.type === "video" ? (
                <video
                  className={styles.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source
                    src={slide.media}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <Image
                  src={
                    isMobile
                      ? slide.mobileImage
                      : slide.image
                  }
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={styles.media}
                />
              )}

              <div className={styles.overlay} />

              <div className={styles.contentMask}>
                <div
                  className={styles.content}
                  ref={(el) => {
                    contentRefs.current[index] =
                      el;
                  }}
                >
                  <h2>
                    {typedTitles[index]}
                    {isActive && (
                      <span
                        className={styles.cursor}
                      >
                        |
                      </span>
                    )}
                  </h2>

                  <p>{slide.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className={styles.pagination}>
      {slides.map((_, index) => {
        const isActive =
          currentSlide === index;

        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${
              index + 1
            }`}
            onClick={() =>
              goToSlide(index)
            }
            className={`${styles.dot} ${
              isActive
                ? styles.activeDot
                : ""
            }`}
          />
        );
      })}
    </div>
  </section>
);
}