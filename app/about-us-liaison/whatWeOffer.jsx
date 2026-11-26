"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import "./aboutUs.scss";
import boxImg from "../../assets/images/box.png";
import lidImg from "../../assets/images/lid.png";

// ── Animation timing (milliseconds) ──────────────────
const TIMING = {
  open: 700,
  fan: 1400,
  fanDuration: 1000,
  fanStagger: 110,
  gridDuration: 550,
  gridStagger: 100,
  settleGap: 100,
  exitGap: 150,
};

const EASE_OUT = [0.16, 1, 0.3, 1];

export default function WhatWeOffer({ services }) {
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const gridContentRef = useRef(null);
  const cardRefs = useRef([]);
  const timersRef = useRef([]);
  const startedRef = useRef(false);

  const inView = useInView(sectionRef, {
    once: true,
    margin: "-20%",
  });

  const reduced = useReducedMotion();

  const [phase, setPhase] = useState("closed");
  const [geo, setGeo] = useState(null);

  const n = services.length;

  // Reduced motion: immediately show the final grid.
  const active = reduced ? "gone" : phase;

  // The grid only starts occupying real page space
  // when its reveal animation begins.
  const gridExpanded = reduced || active === "grid" || active === "gone";

  const gridVisible = reduced || active === "fan" || gridExpanded;

  /* ── Measure gift-box mouth + card destinations ── */
  const measure = useCallback(() => {
    // Never overwrite animation coordinates once the
    // timeline has started.
    if (startedRef.current) return;

    const body = bodyRef.current?.getBoundingClientRect();
    const grid = gridContentRef.current?.getBoundingClientRect();

    if (!body || body.width === 0 || body.height === 0) {
      return;
    }

    if (!grid) return;

    const mouth = {
      x: body.left + body.width / 2,
      y: body.top + body.height * 0.2,
    };

    const cards = cardRefs.current.slice(0, services.length).map((el) => {
      if (!el) return null;

      const r = el.getBoundingClientRect();

      return {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    });

    if (cards.some((card) => !card)) return;

    // The row still has its natural content dimensions,
    // even though its outer wrapper has height: 0.
    const gridHeight = grid.height;

    setGeo({
      mouth,
      cards,
      gridHeight,
    });
  }, [services.length]);

  /* ── Initial measurement and resize handling ── */
  useEffect(() => {
    measure();

    const t = setTimeout(measure, 300);

    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /* ── Drive the animation timeline ── */
  useEffect(() => {
    if (!inView || reduced || !geo || startedRef.current) {
      return;
    }

    startedRef.current = true;

    const lastCard = Math.max(0, n - 1);

    // Wait until the last card has completed its fan movement.
    const fanComplete =
      TIMING.fan + TIMING.fanDuration + lastCard * TIMING.fanStagger;

    const gridStart = fanComplete + TIMING.settleGap;

    // Wait until all cards have reached their grid positions.
    const gridComplete =
      gridStart + TIMING.gridDuration + lastCard * TIMING.gridStagger;

    const goneAt = gridComplete + TIMING.exitGap;

    const timeline = [
      ["open", TIMING.open],
      ["fan", TIMING.fan],
      ["grid", gridStart],
      ["gone", goneAt],
    ];

    timersRef.current = timeline.map(([name, ms]) =>
      setTimeout(() => setPhase(name), ms),
    );
  }, [inView, reduced, geo, n]);

  /* ── Clear timers on unmount ── */
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  /* ── Fan arrangement ── */
  const fan = (i) => {
    const spread = i - (n - 1) / 2;

    return {
      x: spread * 52,
      y: -10 + Math.abs(spread) * 12,
      rot: spread * 7,
    };
  };

  /* ── Card animation ── */
  const cardAnim = (i) => {
    // Final state for reduced motion and completed animation.
    if (active === "gone") {
      return {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        zIndex: 1,
        transition: {
          duration: reduced ? 0 : 0.45,
          delay: reduced ? 0 : i * 0.025,
        },
      };
    }

    if (!geo || !geo.cards[i]) {
      return { opacity: 0 };
    }

    const c = geo.cards[i];
    const f = fan(i);

    const mouth = {
      x: geo.mouth.x - c.x,
      y: geo.mouth.y - c.y,
    };

    const fanPt = {
      x: geo.mouth.x + f.x - c.x,
      y: geo.mouth.y - 170 + f.y - c.y,
    };

    // Cards emerge from the box and spread into a fan.
    if (active === "fan") {
      return {
        opacity: 1,
        x: [mouth.x, fanPt.x],
        y: [mouth.y, fanPt.y],
        scale: [0.25, 0.5],
        rotate: [f.rot, f.rot],
        zIndex: 5,
        transition: {
          duration: TIMING.fanDuration / 1000,
          delay: (i * TIMING.fanStagger) / 1000,
          ease: EASE_OUT,
        },
      };
    }

    // Cards settle into their actual grid positions.
    if (active === "grid") {
      return {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        zIndex: 1,
        transition: {
          duration: TIMING.gridDuration / 1000,
          delay: (i * TIMING.gridStagger) / 500,
          ease: EASE_OUT,
        },
      };
    }

    // Waiting for the gift to open.
    return {
      opacity: 0,
      scale: 0.2,
      transition: { duration: 0.3 },
    };
  };

  /* ── Gift lid animation ── */
  const lidAnim = {
    closed: {
      y: 0,
      rotate: 0,
      opacity: 1,
    },

    open: {
      y: -250,
      rotate: -10,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.4, 0.64, 1],
      },
    },

    fan: {
      y: -250,
      rotate: -10,
      opacity: 1,
    },

    grid: {
      y: -250,
      rotate: -10,
      opacity: 1,
    },

    gone: {
      y: -280,
      opacity: 0,
      scale: 0.7,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  }[active];

  /* ── Gift body animation ── */
  const bodyAnim = {
    closed: {
      opacity: 1,
      scale: 1,
    },

    open: {
      opacity: 1,
      scale: 1,
    },

    fan: {
      opacity: 1,
      scale: 1,
    },

    grid: {
      opacity: 1,
      scale: 1,
    },

    gone: {
      opacity: 0,
      scale: 0.7,
      y: 20,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  }[active];

  // During reduced motion, allow natural grid height immediately.
  // Otherwise, animate from zero to the measured grid height.
  const gridHeight = reduced
    ? "auto"
    : gridExpanded
      ? `${geo?.gridHeight ?? 0}px`
      : "0px";

  return (
    <section className="services-section gift-reveal-section" ref={sectionRef}>
      <div className="container">
        {/* ── GIFT ANIMATION STAGE ── */}
        <div className={`gift-stage${active === "gone" ? " is-gone" : ""}`}>
          <div
            className={`gift-glow ${
              active === "open" || active === "fan" || active === "grid"
                ? "is-active"
                : ""
            }`}
            style={{
              opacity:
                active === "open" || active === "fan" || active === "grid"
                  ? 1
                  : 0,
            }}
          />

          {/* Gift box body */}
          <div className="gift-body-slot">
            <motion.img
              ref={bodyRef}
              src={boxImg.src}
              alt=""
              className="gift-body"
              animate={bodyAnim}
              onLoad={measure}
            />
          </div>

          {/* Gift box lid */}
          <div className="gift-lid-slot">
            <motion.img
              src={lidImg.src}
              alt=""
              className="gift-lid"
              animate={lidAnim}
            />
          </div>
        </div>

        {/* ── COLLAPSIBLE SERVICES GRID ── */}
        <div
          className={`service-grid-shell${gridVisible ? " is-visible" : ""}${
            gridExpanded ? " is-expanded" : ""
          }`}
          style={{ height: gridHeight }}
          aria-hidden={!gridExpanded}
        >
          <div className="row service-grid-row" ref={gridContentRef}>
            {services.map((service, i) => {
              const Icon = service.icon;
              const isProperty = service.id === 7;

              return (
                <motion.div
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="col-lg-4 col-md-6 p-3 service-card-wrapper"
                  initial={{ opacity: 0 }}
                  animate={cardAnim(i)}
                  style={{ position: "relative" }}
                >
                  {isProperty ? (
                    <div className="service-card property-service-card w-100">
                      <div className="service-card-header">
                        <div className="service-card-icon">
                          <Icon size={27} strokeWidth={1.8} />
                        </div>

                        <div className="service-card-title-group">
                          <h3 className="service-card-title">
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      <p className="service-card-description">
                        {service.description}
                      </p>

                      <div className="property-portfolio-content">
                        <h4>Property Opportunities We Handle</h4>

                        <ul>
                          {service.propertyPortfolio.map((item, idx) => (
                            <li key={idx}>
                              <span className="property-check">✓</span>

                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link href={service.href} className="service-card-link">
                      <div className="service-card">
                        <div className="service-card-header">
                          <div className="service-card-icon">
                            <Icon size={27} strokeWidth={1.8} />
                          </div>

                          <div className="service-card-title-group">
                            <h3 className="service-card-title">
                              {service.title}
                            </h3>
                          </div>
                        </div>

                        <p className="service-card-description">
                          {service.description}
                        </p>

                        <div className="service-card-cta">
                          <span>View Details</span>
                          <ArrowRight size={17} />
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
