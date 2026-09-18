"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import { useLoading } from "@/context/LoadingContext";
import logo from "../../assets/images/company/logo.png";
import name from "../../assets/images/company/name.png";
import tagline from "../../assets/images/company/tagline.png";
import styles from "./IntroLoader.module.css";

/* ==========================================
 * SHARED EASING / TIMING
 * ========================================== */
const EASE_SMOOTH = [0.22, 0.61, 0.36, 1];
const EASE_SLIDE = [0.76, 0, 0.24, 1];

const SLIDE_UP_START = 2600; // when mobile slide-up begins (ms)
const SLIDE_DURATION = 1.1; // mobile slide-up duration (s)
const SLIDE_DURATION_MS = SLIDE_DURATION * 1000;

export default function IntroLoader() {
  const { setIsLoading } = useLoading();

  const [show, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  const [position, setPosition] = useState({
    x: "-42.5vw",
    y: "-45.2vh",
    scale: 0.22,
  });

  // Refs to avoid stale closures inside rAF loop
  const isMobileRef = useRef(isMobile);
  const startTimeRef = useRef(null);
  const rafIdRef = useRef(null);
  const slideTriggeredRef = useRef(false);
  const hideTriggeredRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  /* ==========================================
   * RESPONSIVE DOCK POSITION
   * ========================================== */
  useEffect(() => {
    const updatePosition = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobileDevice = width < 992;
      setIsMobile(isMobileDevice);

      let x = 0;
      let y = 0;
      let scale = 1;

      if (width < 992) {
        x = 0;
        y = 0;
        scale = 1;
      } else if (width >= 992 && width < 1280 && height > width) {
        x = -0.4;
        y = -0.43;
        scale = 0.22;
      } else if (width >= 1024 && width < 1280) {
        x = -0.418;
        y = -0.451;
        scale = 0.22;
      } else if (width >= 1280 && width < 1440) {
        x = -0.416;
        y = -0.451;
        scale = 0.22;
      } else if (width >= 1440 && width < 1540) {
        x = -0.425;
        y = -0.452;
        scale = 0.22;
      } else {
        x = -0.443;
        y = -0.439;
        scale = 0.22;
      }

      setPosition({
        x: `${x * 100}vw`,
        y: `${y * 100}vh`,
        scale,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  /* ==========================================
   * TIMING — single rAF loop drives both timers
   * ========================================== */
  useEffect(() => {
    const tick = (now) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;

      // Trigger mobile slide-up at SLIDE_UP_START
      if (
        !slideTriggeredRef.current &&
        elapsed >= SLIDE_UP_START &&
        window.innerWidth < 992
      ) {
        slideTriggeredRef.current = true;
        setSlideUp(true);
      }

      // Trigger hide after slide completes (mobile) or immediately at SLIDE_UP_START (desktop)
      const hideAt =
        SLIDE_UP_START + (isMobileRef.current ? SLIDE_DURATION_MS : 0);

      if (!hideTriggeredRef.current && elapsed >= hideAt) {
        hideTriggeredRef.current = true;
        setShow(false);
        setIsLoading(false);
        return; // stop the loop
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [setIsLoading]);

  /* ==========================================
   * STATIC OFFSETS (memoized)
   * ========================================== */
  const ovalTransform = useMemo(() => ({ x: "0vw", y: "3vh" }), []);
  const taglineTransform = useMemo(() => ({ x: "0.5vw", y: "5.5vh" }), []);

  /* ==========================================
   * DESKTOP DOCK ANIMATION
   * ========================================== */
  const lockupAnimate = isMobile
    ? { x: 0, y: 0, scale: 1 }
    : {
        x: ["0vw", "0vw", position.x],
        y: ["0vh", "0vh", position.y],
        scale: [1, 1, position.scale],
      };

  const lockupTransition = isMobile
    ? { duration: 0 }
    : {
        duration: 2.4,
        times: [0, 0.55, 1],
        ease: EASE_SMOOTH,
      };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_SMOOTH }}
        >
          {/* MOBILE SLIDE-UP WRAPPER */}
          <motion.div
            className={styles.slideWrapper}
            initial={false}
            animate={{ y: isMobile && slideUp ? "-100vh" : "0vh" }}
            transition={{ duration: SLIDE_DURATION, ease: EASE_SLIDE }}
          >
            {/* MAIN LOCKUP POSITIONER */}
            <motion.div
              className={styles.lockup}
              initial={{ opacity: 1 }}
              animate={lockupAnimate}
              transition={lockupTransition}
            >
              {/* ROW: logo + name */}
              <div className={styles.logoNameRow}>
                <motion.img
                  src={logo.src}
                  alt="LB"
                  className={styles.logo}
                  initial={{ opacity: 0, x: -180 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: EASE_SMOOTH,
                    delay: 0.35,
                  }}
                />

                <motion.img
                  src={name.src}
                  alt="Liaison Bank"
                  className={styles.name}
                  initial={{ opacity: 0, x: 180 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: EASE_SMOOTH,
                    delay: 0.5,
                  }}
                />
              </div>

              {/* OVAL LINE */}
              <div
                className={styles.ovalWrapper}
                style={{
                  transform: `translate(${ovalTransform.x}, ${ovalTransform.y})`,
                }}
              >
                <motion.svg
                  className={styles.oval}
                  viewBox="0 0 250 8"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    duration: 0.9,
                    ease: EASE_SMOOTH,
                    delay: 0.85,
                  }}
                  style={{ transformOrigin: "center center" }}
                >
                  <defs>
                    <linearGradient
                      id="ovalGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#FF8A00" />
                      <stop offset="20%" stopColor="#FFB000" />
                      <stop offset="50%" stopColor="#FFD21A" />
                      <stop offset="80%" stopColor="#FFB000" />
                      <stop offset="100%" stopColor="#FF7A00" />
                    </linearGradient>
                  </defs>

                  <path
                    d="
                      M 0 6
                      C 45 4.8, 80 3.2, 110 2.2
                      C 130 1.5, 145 1.5, 150 1.5
                      C 175 1.7, 205 3.8, 250 6
                      C 205 8.2, 175 10.3, 150 10.5
                      C 145 10.5, 130 10.5, 110 9.8
                      C 80 8.8, 45 7.2, 0 6
                      Z
                    "
                    fill="url(#ovalGrad)"
                  />
                </motion.svg>
              </div>

              {/* TAGLINE */}
              <div
                className={styles.taglineWrapper}
                style={{
                  transform: `translate(${taglineTransform.x}, ${taglineTransform.y})`,
                }}
              >
                <motion.img
                  src={tagline.src}
                  alt="haq se bhado, bhado haq se"
                  className={styles.tagline}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.85,
                    ease: EASE_SMOOTH,
                    delay: 1.2,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}