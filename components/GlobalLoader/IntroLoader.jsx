"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../../assets/images/company/logo.png";
import name from "../../assets/images/company/name.png";
import styles from "./IntroLoader.module.css";

export default function IntroLoader() {
  const [show, setShow] = useState(true);
  const [position, setPosition] = useState({
    x: "-38vw",
    y: "-44.5vh",
    scale: 0.68,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);

    const updatePosition = () => {
      const width = window.innerWidth;

      if (width >= 1280 && width <= 1440) {
        setPosition({
          x: "-42.8vw",
          y: "-46.4vh",
          scale: 0.68,
        });
      } else if (width >= 1025 && width < 1280) {
        setPosition({
          x: "-35vw",
          y: "-42vh",
          scale: 0.68,
        });
      } else if (width >= 992 && width <= 1024) {
        setPosition({
          x: "-43vw",
          y: "-45vh",
          scale: 0.68,
        });
      } else if (width >= 768 && width <= 991) {
        setPosition({
          x: "-40.6vw",
          y: "-46.3vh",
          scale: 0.68,
        });
      }  else if (width >= 697 && width <= 767) {
        setPosition({
          x: "-40vw",
          y: "-46.68vh",
          scale: 0.68,
        });
      } else if (width >= 375 && width <= 696) {
        setPosition({
          x: "-40vw",
          y: "-46.68vh",
          scale: 0.68,
        });
      } else {
        setPosition({
          x: "-38vw",
          y: "-44.5vh",
          scale: 0.68,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className={styles.wrapper}
            initial={{ opacity: 1 }}
            animate={{
              x: ["0%", "0%", position.x],
              y: ["0%", "0%", position.y],
              scale: [1, 1, position.scale],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.6, 1],
              ease: "easeInOut",
            }}
          >
            <motion.img
              src={logo.src}
              className={styles.logo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />

            <motion.img
              src={name.src}
              className={styles.name}
              initial={{ opacity: 0, x: 150 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}