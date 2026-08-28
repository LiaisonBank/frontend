"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import logo from "../../assets/images/company/logo.png";
import name from "../../assets/images/company/name.png";
import styles from "./IntroLoader.module.css";

export default function IntroLoader() {
  const { setIsLoading } = useLoading();

  const [show, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  const [position, setPosition] = useState({
    x: "-44.3vw",
    y: "-45vh",
    scale: 0.68,
  });

  useEffect(() => {
    const updatePosition = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobileDevice = width < 992;

      setIsMobile(isMobileDevice);

      let x = 0;
      let y = 0;
      let scale = 1;

      /*
       * ==========================================
       * MOBILE / TABLET BELOW 992px
       * ==========================================
       *
       * No X/Y coordinate animation.
       * The loader stays centered and later
       * slides completely upward.
       */
      if (width < 992) {
        x = 0;
        y = 0;
        scale = 1;
      }

      /*
       * ==========================================
       * PORTRAIT TABLET
       * Example: 1024 × 1366
       * ==========================================
       *
       * Keep this ABOVE the generic 1024 condition.
       */
      else if (width >= 992 && width < 1280 && height > width) {
        x = -0.40;
        y = -0.43;
        scale = 0.68;
      }

      /*
       * ==========================================
       * 1024px - 1279px
       * ==========================================
       */
      else if (width >= 1024 && width < 1280) {
        x = -0.418;
        y = -0.451;
        scale = 0.68;
      }

      /*
       * ==========================================
       * 1280px - 1439px
       * ==========================================
       */
      else if (width >= 1280 && width < 1440) {
        x = -0.439;
        y = -0.463;
        scale = 0.68;
      }

      /*
       * ==========================================
       * 1440px - 1919px
       * ==========================================
       */
      else if (width >= 1440 && width < 1540) {
        x = -0.443;
        y = -0.449;
        scale = 0.68;
      }

      /*
       * ==========================================
       * 1920px+
       * ==========================================
       */
      else {
        x = -0.443;
        y = -0.439;
        scale = 0.68;
      }

      setPosition({
        x: `${x * 100}vw`,
        y: `${y * 100}vh`,
        scale,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  useEffect(() => {
    /*
     * Mobile/tablet:
     * Start slide-up after the main animation.
     */
    const slideTimer = setTimeout(() => {
      if (window.innerWidth < 992) {
        setSlideUp(true);
      }
    }, 2400);

    /*
     * Give the 1.2s slide-up animation enough
     * time to finish before removing the loader.
     */
    const hideTimer = setTimeout(() => {
      setShow(false);
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(hideTimer);
    };
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          {/*
           * ==========================================
           * MOBILE SLIDE-UP WRAPPER
           * ==========================================
           *
           * This wrapper is responsible ONLY for
           * sliding the loader upward on <992px.
           *
           * It does NOT control X/Y coordinates.
           */}
          <motion.div
            className={styles.slideWrapper}
            animate={{
              y: isMobile && slideUp ? "-100vh" : "0vh",
            }}
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/*
             * ==========================================
             * MAIN LOADER POSITION
             * ==========================================
             */}
            <motion.div
              className={styles.wrapper}
              initial={{
                opacity: 1,
              }}
              animate={
                isMobile
                  ? {
                      /*
                       * BELOW 992px:
                       * NO X/Y COORDINATE ANIMATION
                       */
                      x: 0,
                      y: 0,
                      scale: 1,
                    }
                  : {
                      /*
                       * 992px+:
                       * Existing X/Y/scale animation
                       */
                      x: ["0%", "0%", position.x],
                      y: ["0%", "0%", position.y],
                      scale: [1, 1, position.scale],
                    }
              }
              transition={
                isMobile
                  ? {
                      duration: 0,
                    }
                  : {
                      duration: 2.4,
                      times: [0, 0.6, 1],
                      ease: "easeInOut",
                    }
              }
            >
              <motion.img
                src={logo.src}
                className={styles.logo}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />

              <motion.img
                src={name.src}
                className={styles.name}
                initial={{
                  opacity: 0,
                  x: 150,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}