"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../../assets/images/company/logo.png";
import name from "../../assets/images/company/name.png";
import styles from "./IntroLoader.module.css";

export default function IntroLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* CENTER GROUP */}
          <motion.div
            className={styles.wrapper}
            initial={{ opacity: 1 }}
            animate={{
              x: ["0%", "0%", "-38vw"],
              y: ["0%", "0%", "-44.5vh"],
              scale: [1, 1, 0.68],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.6, 1],
              ease: "easeInOut",
            }}
          >
            {/* LOGO */}
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

            {/* TEXT */}
            {/* <motion.h1
              className={styles.title}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
             Liaison <br/> Bank
            </motion.h1> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}