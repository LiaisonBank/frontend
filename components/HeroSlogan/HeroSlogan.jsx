// HeroSlogan.jsx
"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import styles from "./HeroSlogan.module.scss";

// Constants
const WORDS = ["HAQ", "SE", "BHADHO,", "BHADHO", "HAQ", "SE"];
const PARTICLE_COLORS = [
  'rgba(255, 215, 0, 0.15)',
  'rgba(255, 107, 107, 0.1)',
  'rgba(78, 205, 196, 0.1)',
  'rgba(255, 159, 67, 0.1)',
  'rgba(162, 89, 255, 0.1)',
];

// Sound Effect System - plays 5-second sound from public folder
class SoundEffectSystem {
  constructor() {
    this.audio = null;
    this.initialized = false;
    this.soundEnabled = true;
    this.isPlaying = false;
  }

  init() {
    try {
      if (!this.audio) {
        // this.audio = new Audio('/viralaudio-descent-whoosh-long-cinematic-sound-effect-405921.mp3'); // Update filename as needed
        // this.audio = new Audio('/typing1.mp3');
        // this.audio = new Audio('/typing2.mp3');
        this.audio.loop = false;
        this.audio.preload = 'auto';
      }
      this.initialized = true;
      return true;
    } catch (e) {
      console.warn('Audio not supported');
      return false;
    }
  }

  playSound() {
    if (!this.soundEnabled || !this.audio) return;
    
    try {
      // Reset and play
      this.audio.currentTime = 0;
      this.audio.play().catch(e => {
        // Autoplay blocked - user interaction needed
        console.log('Audio playback requires user interaction');
      });
    } catch (e) {
      // Silently fail
    }
  }

  stopSound() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  setVolume(volume) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

const soundSystem = new SoundEffectSystem();

const HeroSlogan = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [particles, setParticles] = useState([]);
  const [videoAnimation, setVideoAnimation] = useState('videoZoomPan');
  const [isMounted, setIsMounted] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(100); // ms between chars
  
  const videoRef = useRef(null);
  const animationTimerRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const cursorTimerRef = useRef(null);
  const fullText = WORDS.join('');
  const audioUnlockedRef = useRef(false);

  // Unlock audio on user interaction
  const unlockAudio = useCallback(() => {
    if (!audioUnlockedRef.current) {
      const success = soundSystem.init();
      if (success) {
        audioUnlockedRef.current = true;
        soundSystem.soundEnabled = soundEnabled;
        soundSystem.setVolume(0.8);
      }
    }
  }, [soundEnabled]);

  // Play sound wrapper - plays the full 5-second sound
  const playSound = useCallback(() => {
    if (!soundEnabled || !audioUnlockedRef.current) return;
    soundSystem.playSound();
  }, [soundEnabled]);

  // Stop sound wrapper
  const stopSound = useCallback(() => {
    soundSystem.stopSound();
  }, []);

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
    setVideoAnimation(isMobile ? 'videoZoomPanMobile' : 'videoZoomPan');

    // Reset animation state on mount
    setCurrentCharIndex(-1);
    setShowCursor(true);
    setIsTypingComplete(false);

    // Cursor blinking animation
    cursorTimerRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Unlock audio on any user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio);
    });

    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (cursorTimerRef.current) {
        clearInterval(cursorTimerRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, [unlockAudio]);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  // Typing animation function - plays 5-second sound during typing
  const startTyping = useCallback(() => {
    const totalChars = fullText.length;
    let index = -1;
    
    // Clear any existing timer
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    // Reset state
    setCurrentCharIndex(-1);
    setIsTypingComplete(false);
    setShowCursor(true);
    
    // Play the 5-second sound effect when typing starts
    playSound();
    
    // Start typing effect
    animationTimerRef.current = setInterval(() => {
      if (index < totalChars - 1) {
        index++;
        setCurrentCharIndex(index);
      } else {
        // Typing complete
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
        setIsTypingComplete(true);
        
        // Stop sound after typing completes (or let it finish naturally)
        setTimeout(() => {
          stopSound();
        }, 5000); // 5 seconds duration
        
        // Wait and restart
        animationTimeoutRef.current = setTimeout(() => {
          setCurrentCharIndex(-1);
          setIsTypingComplete(false);
          setTimeout(() => {
            startTyping();
          }, 1500);
        }, 4000);
      }
    }, typingSpeed);
  }, [fullText, playSound, stopSound, typingSpeed]);

  // Start typing animation with initial delay
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      startTyping();
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
      stopSound();
    };
  }, [startTyping, stopSound]);

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
      };
    });
    return { 
      wordPositions: positions,
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.heroSlogan}>
      {/* Sound Toggle */}
      {/* <button 
        className={styles.soundToggle}
        onClick={(e) => {
          e.stopPropagation();
          const newState = !soundEnabled;
          setSoundEnabled(newState);
          soundSystem.soundEnabled = newState;
          unlockAudio();
          if (newState) {
            // Resume typing sound if typing is active
            if (currentCharIndex < fullText.length - 1) {
              playSound();
            }
          } else {
            stopSound();
          }
        }}
        aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        style={{
          background: soundEnabled ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 0, 0, 0.15)',
          borderColor: soundEnabled ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)',
        }}
      >
        {soundEnabled ? '⌨️' : '🔇'}
      </button> */}

      <div className={styles.animatedGradient} />
      
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={`${styles.backgroundVideo} ${styles[videoAnimation]}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoad}
          poster="/sloganBanner.png"
        >
          <source src="/bannerMain.mp4" type="video/mp4" />
          <source src="/sloganBanner.webm" type="video/webm" />
        </video>
        {!isVideoLoaded && <div className={styles.videoFallback} />}
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
                  className={styles.wordWrapper}
                >
                  {wordData.chars.map((char, charIdx) => {
                    const isComma = char === ',';
                    const globalCharIndex = wordData.startIndex + charIdx;
                    const isRevealed = currentCharIndex >= globalCharIndex;
                    
                    return (
                      <span
                        key={`char-${globalCharIndex}`}
                        className={`${styles.char} ${isRevealed ? styles.charReveal : ''} ${isComma ? styles.comma : ''}`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
              {!isTypingComplete && (
                <span 
                  className={`${styles.cursor} ${showCursor ? styles.cursorVisible : ''}`}
                  aria-hidden="true"
                >
                  
                </span>
              )}
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroSlogan;