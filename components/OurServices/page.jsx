"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils/getImagehelper";
import styles from "./ServicesSlider.module.scss";

const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const AUTOPLAY_MS = 2000;

export default function ServicesSlider() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  
  const containerRef = useRef(null);
  
  // Drag state tracking
  const dragStartX = useRef(null);
  const isActuallyDragging = useRef(false);
  const [isDraggingVisual, setIsDraggingVisual] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/homelicensingandliaisoning/`
        );
        const result = await response.json();
        if (result.success) setServices(result.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const total = services.length;

  const goTo = useCallback(
    (index) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
      setProgressKey((k) => k + 1);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused || total === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
      setProgressKey((k) => k + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(total - 1);
    };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, goTo, total]);

  // Drag handlers
  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    isActuallyDragging.current = false;
    setIsPaused(true);
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    const delta = Math.abs(e.clientX - dragStartX.current);
    
    // Only trigger drag visual state if user moves more than 5px
    if (delta > 5 && !isActuallyDragging.current) {
      isActuallyDragging.current = true;
      setIsDraggingVisual(true);
    }
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    
    const delta = e.clientX - dragStartX.current;
    
    // If user actually dragged the mouse/touch enough, change slide
    if (isActuallyDragging.current) {
      if (delta < -50) goNext();
      else if (delta > 50) goPrev();
    }

    // Reset
    dragStartX.current = null;
    isActuallyDragging.current = false;
    setIsDraggingVisual(false);
    setIsPaused(false);
  };

  // Preload neighbor images
  useEffect(() => {
    if (total === 0) return;
    const neighbors = [(activeIndex + 1) % total, (activeIndex - 1 + total) % total];
    neighbors.forEach((i) => {
      const img = services[i]?.image;
      if (img && typeof window !== "undefined") {
        const el = new window.Image();
        el.src = getImageUrl(img);
      }
    });
  }, [activeIndex, services, total]);

  const getCardStyle = useCallback(
    (index) => {
      if (total === 0) return {};
      let offset = index - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const abs = Math.abs(offset);
      const sign = Math.sign(offset);

      const translateX = offset * 55;
      const translateZ = -abs * 130;
      const rotateY = -sign * 24;
      const scale = 1 - abs * 0.11;
      const opacity = abs > 3 ? 0 : 1 - abs * 0.15;
      const zIndex = 100 - abs;

      return {
        transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex,
        transition: isDraggingVisual
          ? "none"
          : "transform 0.65s cubic-bezier(0.22,0.61,0.36,1), opacity 0.5s ease, filter 0.5s ease",
        filter: abs === 0 ? "none" : `brightness(${1 - abs * 0.02})`,
        pointerEvents: abs > 2 ? "none" : "auto",
      };
    },
    [activeIndex, total, isDraggingVisual]
  );

  if (!loading && total === 0) {
    return (
      <div className={styles.emptyState}>
        No services available right now.
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <section
      className={styles.section}
      aria-roledescription="carousel"
      aria-label="Our services"
    >
      <div className={styles.glowWrap}>
        <div className={styles.glow} />
      </div>

      <div className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {total}: {services[activeIndex]?.name}
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        className={styles.container}
        style={{ perspective: "1500px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={`${styles.track} ${isDraggingVisual ? styles.grabbing : styles.grab}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {services.map((service, index) => {
            const slug = createSlug(service.name);
            const targetUrl = `/our-services/liaisoning?sub=${slug}`;
            const isActive = index === activeIndex;

            return (
              <div
                key={service.id}
                className={styles.cardSlide}
                style={getCardStyle(index)}
                onClick={() => !isActive && goTo(index)}
                aria-hidden={!isActive}
              >
                <Link
                  href={targetUrl}
                  className={`${styles.cardLink} group`}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`View ${service.name}`}
                  onClick={(e) => {
                    if (!isActive) e.preventDefault();
                  }}
                >
                  <div
                    className={`${styles.card} ${
                      isActive ? styles.cardActive : styles.cardInactive
                    }`}
                  >
                    {/* IMAGE */}
                    <div className={styles.imageWrap}>
                      {service.image && (
                        <Image
                          src={getImageUrl(service.image)}
                          alt={service.name}
                          fill
                          sizes="420px"
                          className={styles.image}
                          unoptimized
                          loading={isActive ? "eager" : "lazy"}
                        />
                      )}
                      <div className={styles.imageFade} />
                      {isActive && (
                        <div className={styles.shineWrap}>
                          <div className={styles.shine} />
                        </div>
                      )}
                    </div>

                    {/* TITLE */}
                    <div className={styles.titleWrap}>
                      <h5 className={styles.title}>{service.name}</h5>
                    </div>

                    {/* CONTENT */}
                    <div className={styles.content}>
                      <div
                        className={`${styles.descriptionWrap} ${
                          isActive ? styles.open : styles.closed
                        }`}
                      >
                        <p className={styles.description}>
                          {service.description}
                        </p>
                      </div>

                      <span
                        className={`${styles.learnMore} ${
                          isActive ? styles.learnMoreActive : styles.learnMoreHidden
                        }`}
                      >
                        Learn more
                        <svg
                          className={styles.arrowIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Desktop side arrows */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous slide"
          className={`${styles.desktopArrow} ${styles.desktopArrowLeft}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next slide"
          className={`${styles.desktopArrow} ${styles.desktopArrowRight}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous slide"
          className={styles.mobileArrow}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={styles.dotsGroup}>
          <div className={styles.dots}>
            {services.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? "true" : "false"}
                className={`${styles.dot} ${
                  i === activeIndex ? styles.dotActive : styles.dotInactive
                }`}
              >
                {i === activeIndex && (
                  <span
                    key={progressKey}
                    className={styles.dotProgress}
                    style={{ animationPlayState: isPaused ? "paused" : "running" }}
                  />
                )}
              </button>
            ))}
          </div>
          {/* <span className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span> */}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next slide"
          className={styles.mobileArrow}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}