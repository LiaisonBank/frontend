// HeroSlogan.jsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./HeroSlogan.module.scss";
import Image from "next/image";

// Constants
const WORDS = ["HAQ", "SE", "BHADHO,", "BHADHO", "HAQ", "SE"];
const PARTICLE_COLORS = [
  'rgba(255, 215, 0, 0.15)',
  'rgba(255, 107, 107, 0.1)',
  'rgba(78, 205, 196, 0.1)',
  'rgba(255, 159, 67, 0.1)',
  'rgba(162, 89, 255, 0.1)',
];

const HeroSlogan = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [imageAnimation, setImageAnimation] = useState('imageZoomPan');
  const [isMounted, setIsMounted] = useState(false);
  const [charAnimations, setCharAnimations] = useState({});

  // Generate particles
  useEffect(() => {
    setIsMounted(true);
    
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = window.innerWidth < 768 ? 30 : 50;
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 25 + 15;
        const delay = Math.random() * 15;
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const wobble = Math.random() * 20 + 10;
        
        newParticles.push(
          <div
            key={i}
            className={styles.particle}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              '--wobble': `${wobble}px`,
            }}
          />
        );
      }
      setParticles(newParticles);
    };

    generateParticles();

    const isMobile = window.innerWidth < 768;
    setImageAnimation(isMobile ? 'imageZoomPanMobile' : 'imageZoomPan');

    return () => {
      // Cleanup
    };
  }, []);

  // Handle text visibility
  useEffect(() => {
    if (isImageLoaded) {
      const timer = setTimeout(() => {
        setIsTextVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded]);

  // Word-by-word animation sequence with jumping effect
  useEffect(() => {
    if (isTextVisible) {
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < WORDS.length) {
          setActiveWordIndex(currentIndex);
          // Trigger jump animation for each character in the word
          const wordChars = WORDS[currentIndex].split('');
          const animations = {};
          wordChars.forEach((_, charIdx) => {
            const globalIdx = charIdx; // simplified, you might want to track global index
            animations[`${currentIndex}-${charIdx}`] = {
              jump: true,
              delay: charIdx * 0.1
            };
          });
          setCharAnimations(prev => ({ ...prev, ...animations }));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setActiveWordIndex(-2);
          }, 300);
        }
      }, 800); // Increased delay for better visual impact

      return () => clearInterval(interval);
    }
  }, [isTextVisible]);

  // Memoize word data
  const { wordPositions } = useMemo(() => {
    let charIndex = 0;
    const positions = WORDS.map((word, wordIdx) => {
      const chars = word.split("");
      const startIndex = charIndex;
      charIndex += chars.length;
      return {
        word,
        chars,
        startIndex,
        wordIndex: wordIdx,
        isActive: activeWordIndex === wordIdx || activeWordIndex === -2,
        isJumping: activeWordIndex === wordIdx,
      };
    });
    return { wordPositions: positions };
  }, [activeWordIndex]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.heroSlogan}>
      <div className={styles.animatedGradient} />
      
      <div className={styles.imageWrapper}>
        <Image
          src="/sloganBanner.png"
          alt="Hero Slogan Banner"
          className={`${styles.backgroundImage} ${styles[imageAnimation]}`}
          fill
          priority
          sizes="100vw"
          quality={85}
          onLoad={handleImageLoad}
        />
        {!isImageLoaded && <div className={styles.imageFallback} />}
      </div>

      {particles.length > 0 && (
        <div className={styles.particles} aria-hidden="true">
          {particles}
        </div>
      )}

      <div className={styles.overlay} aria-hidden="true" />
      
      <div className={`${styles.sloganContainer} ${isTextVisible ? styles.visible : ''}`}>
        <div className={styles.sloganTextWrapper}>
          <h1 className={styles.sloganText}>
            <div className={styles.sloganLine}>
              {wordPositions.map((wordData) => (
                <span
                  key={`word-${wordData.wordIndex}`}
                  className={`${styles.wordWrapper} ${wordData.isActive ? styles.wordActive : ''} ${wordData.isJumping ? styles.wordJumping : ''}`}
                  style={{
                    '--word-delay': `${wordData.wordIndex * 0.3}s`,
                  }}
                >
                  {wordData.chars.map((char, charIdx) => {
                    const isComma = char === ',';
                    const charKey = `${wordData.wordIndex}-${charIdx}`;
                    const isJumping = charAnimations[charKey]?.jump;
                    
                    return (
                      <span
                        key={`char-${wordData.startIndex + charIdx}`}
                        className={`${styles.char} ${
                          wordData.isActive ? styles.charReveal : ''
                        } ${isComma ? styles.comma : ''} ${
                          isJumping ? styles.charJump : ''
                        } ${isJumping ? styles.charBounce : ''}`}
                        style={{
                          '--char-delay': `${charIdx * 0.1}s`,
                          '--char-index': charIdx,
                          '--word-index': wordData.wordIndex,
                          '--jump-delay': `${charIdx * 0.08}s`,
                          visibility: wordData.isActive ? 'visible' : 'hidden',
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroSlogan;