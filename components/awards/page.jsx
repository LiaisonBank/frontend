"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { Fancybox } from "@fancyapps/ui";
import { getImageUrl } from "@/lib/utils/getImagehelper";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./AwardP.scss";

const SENSITIVITY = 0.35; // degrees of rotation per pixel dragged
const INERTIA = 0.12; // how much velocity carries after release

/* ===== One card on the rim ===== */

function BarrelCard({
  cert,
  index,
  angleStep,
  rotation,
  cardWidth,
  cardHeight,
  radius,
  viewportWidth,
  isActive,
  isVisible,
  didDrag,
  onClick,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const angle = useTransform(rotation, (r) => {
    let a = r + index * angleStep;
    return (((a % 360) + 540) % 360) - 180;
  });

  // Move only the first left and right cards inward.
  const sideRadius = useTransform(angle, (a) => {
    const distance = Math.abs(a);

    // Identify the nearest card on either side.
    const bandWidth = Math.max(10, angleStep * 0.85);

    const proximity = Math.max(
      0,
      1 - Math.abs(distance - angleStep) / bandWidth,
    );

    // Smooth transition.
    const smooth = proximity * proximity * (3 - 2 * proximity);

    // Keep mobile and tablet positioning unchanged.
    // On desktop, almost remove the inward tuck so side cards spread
    // into the unused left and right space of the stage.
    const insetFactor =
      viewportWidth < 576
        ? 0.01
        : viewportWidth < 768
          ? 0.02
          : viewportWidth < 1200
            ? 0.16
            : 0.02;
    const horizontalInset = cardWidth * insetFactor;

    const sinAngle = Math.max(Math.abs(Math.sin((a * Math.PI) / 180)), 0.35);

    const radialInset = Math.min(
      radius * insetFactor,
      horizontalInset / sinAngle,
    );

    return radius - radialInset * smooth;
  });

  const slotTransform = useTransform(
    sideRadius,
    (r) => `rotateY(${index * angleStep}deg) translateZ(${r}px)`,
  );

  // Keep the cards positioned on the circular barrel,
  // but turn their faces slightly towards the viewer.
  const faceRotation = useTransform(
    angle,
    (a) => -a * (viewportWidth < 768 ? 0.3 : 0.42),
  );

  const visualAngle = useTransform(angle, (a) => a * 0.58);

  const facing = useTransform(visualAngle, (a) =>
    Math.cos((a * Math.PI) / 180),
  );

  const frontness = useTransform(facing, (c) => Math.max(0, c));

  const opacity = useTransform(frontness, (c) => 0.35 + 0.65 * c);

  const scale = useTransform(frontness, (c) => 0.88 + 0.12 * c);

  const y = useTransform(frontness, (c) => 12 * (1 - c));

  const z = useTransform(frontness, (c) => -200 + 200 * c);

  const zIndex = useTransform(frontness, (c) => Math.round(10 + 90 * c));

  return (
    <motion.div
      className="card-slot"
      initial={false}
      style={{
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,

        // Actual circular 3D positioning
        transform: slotTransform,

        zIndex,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <motion.div
        className={`cerificate-card ${isActive ? "is-active" : ""}`}
        initial={false}
        style={{
          opacity,
          scale,
          y,
          z,
          zIndex,
          rotateY: faceRotation,
        }}
      >
        <a
          href={cert.src}
          data-fancybox="certificates"
          data-caption={cert.caption}
          className="card-link"
          aria-label={`Open ${cert.caption}`}
          onClick={(e) => {
            if (didDrag.current) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            if (!isActive) {
              e.preventDefault();
              e.stopPropagation();
              onClick();
            }
          }}
        >
          <div className="card-frame">
            <div className="card-mat">
              {imageFailed ? (
                <div
                  className="card-image-fallback"
                  role="img"
                  aria-label={`${cert.caption} preview unavailable`}
                >
                  <span className="fallback-document" aria-hidden="true">
                    ▤
                  </span>
                  <span>Preview unavailable</span>
                </div>
              ) : (
                <img
                  src={cert.src}
                  alt={cert.caption}
                  className="card-img"
                  loading="lazy"
                  decoding="async"
                  onError={() => {
                    console.error("Award image failed to load:", cert.src);
                    setImageFailed(true);
                  }}
                />
              )}
            </div>

            <div className="card-frame__footer">
              {/* <span></span> */}
              <small>{cert.caption}</small>
              {/* <span></span> */}
            </div>

            <div className="card-glass" />
          </div>
        </a>

        {/* <div className="card-plaque">
          <span className="plaque-text">{cert.caption}</span>
        </div> */}
      </motion.div>
    </motion.div>
  );
}

export default function AwardP() {
  const galleryRef = useRef(null);
  const stageRef = useRef(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(280);
  const [viewportWidth, setViewportWidth] = useState(1440);

  /* ===== Responsive card size: measured from the actual stage ===== */
  useEffect(() => {
    if (loading) return;

    const stage = stageRef.current;
    if (!stage) return;

    const update = () => {
      const measuredWidth =
        stage.getBoundingClientRect().width ||
        stage.clientWidth ||
        window.innerWidth;

      const w = Math.round(measuredWidth);
      let width;

      // Maintain a large, readable front certificate while reserving
      // enough viewport width for the two neighbouring 3D cards.
      if (w < 360) {
        width = Math.max(150, w * 0.5);
      } else if (w < 480) {
        width = Math.min(210, Math.max(160, w * 0.45 + 20));
      } else if (w < 768) {
        width = Math.min(230, w * 0.36 + 40);
      } else if (w < 992) {
        width = Math.min(245, w * 0.3);
      } else if (w < 1200) {
        width = 245;
      } else {
        width = 280;
      }

      const nextWidth = Math.round(width);

      setCardWidth((current) => (current === nextWidth ? current : nextWidth));
      setViewportWidth((current) => (current === w ? current : w));
    };

    update();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;

    resizeObserver?.observe(stage);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [loading]);

  /* ===== Fetch awards ===== */
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/awards/limited`,
        );
        if (!response.ok) throw new Error("Failed to fetch awards");
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setCertificates(
            result.data.map((item) => ({
              id: item.id,
              src: getImageUrl(item.file),
              caption: item.title || "Award Certificate",
              description: item.description,
            })),
          );
        } else {
          setCertificates([]);
        }
      } catch (err) {
        console.error("Error fetching awards:", err);
        setError(err.message);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  /*
   * Desktop-only ring density:
   * 13 slots around a full circle create 7 cards across the forward-facing arc
   * (the active card plus 3 neighbours on either side).
   *
   * Reuse records already returned by the existing API. No extra API request
   * is made. Mobile and tablet continue to use the original API list.
   */
  const useDenseDesktopRing = viewportWidth >= 1200 && certificates.length >= 3;

  const desktopSlotCount = Math.max(13, certificates.length);

  const carouselCertificates = useDenseDesktopRing
    ? Array.from({ length: desktopSlotCount }, (_, slotIndex) => {
        let sourceIndex = slotIndex % certificates.length;

        // Avoid duplicating the first record at both ends of the circular seam.
        if (
          slotIndex === desktopSlotCount - 1 &&
          sourceIndex === 0 &&
          certificates.length > 1
        ) {
          sourceIndex = 1;
        }

        const source = certificates[sourceIndex];

        return {
          ...source,
          id: `${source.id}-desktop-slot-${slotIndex}`,
        };
      })
    : certificates;

  /* ===== Fancybox ===== */
  useEffect(() => {
    const container = galleryRef.current;
    if (!container || certificates.length === 0) return;
    Fancybox.bind(container, '[data-fancybox="certificates"]', {
      animated: true,
      Carousel: { infinite: true },
      Thumbs: { autoStart: false },
    });
    return () => {
      Fancybox.unbind(container);
      Fancybox.close();
    };
  }, [certificates, viewportWidth]);

  const n = carouselCertificates.length;
  const angleStep = n > 0 ? 360 / n : 0;
  const cardHeight = Math.round(cardWidth * 1.6);

  // Desktop: active card + three neighbours on each side.
  // Tablet/mobile: preserve the original one-neighbour-per-side layout.
  const visibleSideCards =
    n >= 3
      ? viewportWidth >= 1200
        ? Math.min(3, Math.floor((n - 1) / 2))
        : 1
      : 0;

  const outerAngle = visibleSideCards * angleStep;
  const theta = (outerAngle * Math.PI) / 180;

  // Match these values with the perspective breakpoints in AwardP.scss.
  const isMobile = viewportWidth < 768;
  const perspective =
    viewportWidth < 768 ? 900 : viewportWidth < 1200 ? 1400 : 3600;

  /*
   * Responsive spacing:
   * - cardGap controls the larger distance between neighbouring card centres.
   * - circleSpace increases the barrel radius to open up the centre of the ring.
   */
  // Mobile: increase both the space between neighbouring cards and
  // the radius/open area in the middle of the barrel.
  // Desktop: keep the centre radius unchanged and reduce only card spacing.
  const cardGap =
    viewportWidth < 576
      ? Math.max(26, Math.min(34, viewportWidth * 0.078))
      : viewportWidth < 768
        ? Math.max(34, Math.min(44, viewportWidth * 0.06))
        : viewportWidth < 1200
          ? 22
          : 12;

  const circleSpace =
    viewportWidth < 576
      ? Math.max(42, Math.min(56, viewportWidth * 0.13))
      : viewportWidth < 768
        ? 60
        : viewportWidth < 1200
          ? 44
          : 54;

  // Chord geometry: adjacent card centres are at least cardWidth + cardGap apart.
  const halfStepSine = n > 2 ? Math.sin(Math.PI / n) : 0;
  const spacingRadius =
    n > 2 && halfStepSine > 0 ? (cardWidth + cardGap) / (2 * halfStepSine) : 0;

  // Keep the previous viewport-based spread as a minimum on larger screens.
  const targetHalfWidth =
    viewportWidth < 768
      ? Math.min(cardWidth * 0.72, viewportWidth / 2 - 8)
      : Math.max(80, viewportWidth / 2 - cardWidth * 0.55 - 28);

  const projectionDenominator =
    perspective * Math.sin(theta) + targetHalfWidth * Math.cos(theta);

  const viewportRadius =
    n <= 2 || visibleSideCards === 0
      ? 0
      : Math.max(
          0,
          (targetHalfWidth * perspective) / Math.max(projectionDenominator, 1),
        );

  // Larger radius creates a wider centre opening and more separation around the rim.
  const radius =
    n <= 2 || visibleSideCards === 0
      ? 0
      : Math.round(Math.max(spacingRadius, viewportRadius) + circleSpace);

  /* ===== Rotation: ONE motion value drives everything ===== */
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, {
    stiffness: 95,
    damping: 24,
    mass: 1.1,
  });

  // Reset the rotation only when switching between the mobile and desktop
  // ring sizes. Normal dragging and automatic rotation are unaffected.
  const previousCarouselCount = useRef(n);

  useEffect(() => {
    if (previousCarouselCount.current === n || n === 0) return;

    setActiveIndex(0);
    rotation.set(0);
    previousCarouselCount.current = n;
  }, [n, rotation]);

  // keep activeIndex in sync with the live rotation
  useEffect(() => {
    if (n === 0) return;
    const unsubscribe = smoothRotation.on("change", (latest) => {
      const raw = Math.round(-latest / angleStep);
      setActiveIndex(((raw % n) + n) % n);
    });
    return () => unsubscribe();
  }, [smoothRotation, angleStep, n]);

  /* ===== DRAG TO ROTATE (onPan — element stays centered) ===== */
  const dragBase = useRef(0);
  const didDrag = useRef(false);

  const onPanStart = () => {
    dragBase.current = rotation.get();
    didDrag.current = false;
    setIsDragging(true);
    setIsExpanded(false);
  };

  const onPan = (e, info) => {
    // 1:1 tracking — dragging right spins the barrel right
    rotation.set(dragBase.current + info.offset.x * SENSITIVITY);
    if (Math.abs(info.offset.x) > 6) didDrag.current = true;
  };

  const onPanEnd = (e, info) => {
    setIsDragging(false);

    // inertia: project velocity forward, then snap to nearest card
    const projected = rotation.get() + info.velocity.x * SENSITIVITY * INERTIA;
    const targetStep = Math.round(-projected / angleStep);
    const target = -targetStep * angleStep;

    animate(rotation, target, {
      type: "spring",
      stiffness: 120,
      damping: 22,
    });

    // reset the flag on the next tick so the click that follows a drag is ignored
    setTimeout(() => {
      didDrag.current = false;
    }, 0);
  };

  /* ===== Controls / click-to-front ===== */
  const rotateToStep = (step) => {
    animate(rotation, -step * angleStep, {
      type: "spring",
      stiffness: 90,
      damping: 24,
      mass: 1.1,
    });
  };

  const currentStep = () => Math.round(-rotation.get() / angleStep);

  const next = () => rotateToStep(currentStep() + 1);
  const prev = () => rotateToStep(currentStep() - 1);

  const handleCardClick = (i, isActive) => {
    if (didDrag.current) return; // suppress click after a drag
    if (isActive) {
      setIsExpanded((e) => !e);
    } else {
      // shortest path to card i
      const cur = currentStep();
      const remainder = ((cur % n) + n) % n;
      let diff = i - remainder;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      rotateToStep(cur + diff);
    }
  };

  /* ===== Auto-rotate (pauses on hover / drag / expanded) ===== */
  useEffect(() => {
    if (n <= 2 || isHovered || isDragging || isExpanded) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const id = setInterval(() => {
      rotateToStep(currentStep() + 1);
    }, 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, isHovered, isDragging, isExpanded, angleStep]);

  /* ===== Loading / empty ===== */
  if (loading) {
    return (
      <section className="awards-barrel-section">
        <div className="awards-status">
          <div className="loading-spinner"></div>
          <p>Loading awards...</p>
        </div>
      </section>
    );
  }
  if (error || n === 0) {
    return (
      <section className="awards-barrel-section">
        <div className="awards-status">
          <p>No awards available at the moment.</p>
        </div>
      </section>
    );
  }

  const active = carouselCertificates[activeIndex];

  return (
    // ✅ ref moved here so Fancybox binds to the cards inside the 3D barrel
    <section className="awards-barrel-section" ref={galleryRef}>
      {/* Header */}
      {/* <div className="section-header">
        <h2 className="section-title">AWARDS & CERTIFICATIONS</h2>
        <div className="section-divider">
          <span className="divider-line"></span>
          <span className="divider-dot"></span>
          <span className="divider-line"></span>
        </div>
      </div> */}

      {/* 3D Barrel — drag left/right to spin */}
      <div
        ref={stageRef}
        className="barrel-stage"
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="barrel"
          style={{ rotateY: smoothRotation }}
          onPanStart={onPanStart}
          onPan={onPan}
          onPanEnd={onPanEnd}
        >
          {carouselCertificates.map((cert, i) => {
            let off = (((i - activeIndex) % n) + n) % n;

            if (off > n / 2) off -= n;

            const facing = Math.cos((off * angleStep * Math.PI) / 180);

            const isActive = off === 0;
            const isVisible = Math.abs(off) <= visibleSideCards;

            return (
              <BarrelCard
                key={cert.id}
                cert={cert}
                index={i}
                angleStep={angleStep}
                rotation={smoothRotation}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                radius={radius}
                viewportWidth={viewportWidth}
                isActive={isActive}
                isVisible={isVisible}
                didDrag={didDrag}
                onClick={() => handleCardClick(i, isActive)}
              />
            );
          })}
        </motion.div>

        <div className="barrel-shadow" aria-hidden="true"></div>

        {/* Drag hint */}
        <div className={`drag-hint ${isDragging ? "is-hidden" : ""}`}>
          {/* <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="8 12 4 8 8 4"></polyline>
            <polyline points="16 12 20 8 16 4"></polyline>
            <line x1="4" y1="8" x2="20" y2="8"></line>
          </svg> */}
          {/* <span>Drag to rotate</span> */}
        </div>
      </div>

      {/* Info panel */}
      {/* <div className="barrel-info">
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              key={active.id}
              className="info-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <p className="info-desc">
                {active.description ||
                  "An achievement recognized for excellence, trust and dedication."}
              </p>
              <a
                href={active.src}
                data-fancybox="certificates"
                data-caption={active.caption}
                className="info-view-btn"
              >
                View Full Certificate
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}

      {/* Controls */}
      <div className="gallery-controls">
        <button className="control-btn" onClick={prev} aria-label="Previous">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="control-btn" onClick={next} aria-label="Next">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* View All */}
      <div className="awards-cta">
        <Link href="/awards" className="themeht-btn btn btn-lg primary-btn">
          View More
        </Link>
      </div>
    </section>
  );
}
