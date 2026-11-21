"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
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
  isActive,
  isVisible,
  didDrag,
  onClick,
}) {
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

    // Horizontal distance to close between the cards.
    const horizontalInset = cardWidth * 0.7;

    const sinAngle = Math.max(Math.abs(Math.sin((a * Math.PI) / 180)), 0.35);

    const radialInset = Math.min(radius * 0.7, horizontalInset / sinAngle);

    return radius - radialInset * smooth;
  });

  const slotTransform = useTransform(
    sideRadius,
    (r) => `rotateY(${index * angleStep}deg) translateZ(${r}px)`,
  );

  // Keep the cards positioned on the circular barrel,
  // but turn their faces slightly towards the viewer.
  const faceRotation = useTransform(angle, (a) => -a * 0.42);

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
              <Image
                src={cert.src}
                alt={cert.caption}
                width={280}
                height={380}
                className="card-img"
                unoptimized
                loading="lazy"
              />
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
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(280);
  const [viewportWidth, setViewportWidth] = useState(1440);

  /* ===== Responsive card size ===== */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 576) setCardWidth(180);
      else if (w < 768) setCardWidth(210);
      else if (w < 1200) setCardWidth(245);
      else setCardWidth(280);
      setViewportWidth(w);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
  }, [certificates]);

  const n = certificates.length;
  const angleStep = n > 0 ? 360 / n : 0;
  const cardHeight = Math.round(cardWidth * 1.6);

  // Five on desktop when there are enough certificates.
  const visibleSideCards =
    viewportWidth >= 768 ? (n >= 8 ? 2 : n >= 4 ? 1 : 0) : n >= 4 ? 1 : 0;

  // Maximum angle of the outer visible certificate.
  const outerAngle = Math.min(visibleSideCards * angleStep, 89);

  const theta = (outerAngle * Math.PI) / 180;

  const perspective = 3600;

  const targetHalfWidth = Math.max(
    80,
    viewportWidth / 2 - cardWidth * 0.55 - 28,
  );

  // Calculate radius while accounting for perspective.
  const radius =
    n <= 1
      ? 0
      : n < 4
        ? cardWidth * 2
        : Math.round(
            (targetHalfWidth * perspective) /
              (perspective * Math.sin(theta) +
                targetHalfWidth * Math.cos(theta)),
          );

  /* ===== Rotation: ONE motion value drives everything ===== */
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, {
    stiffness: 95,
    damping: 24,
    mass: 1.1,
  });

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

  const active = certificates[activeIndex];

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
          {certificates.map((cert, i) => {
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
