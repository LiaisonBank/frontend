// HeroSlogan.jsx
"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import styles from "./HeroSlogan.module.scss";

/* -------------------------------------------------------------------------- */
/*                                Constants                                   */
/* -------------------------------------------------------------------------- */

const WORDS = ["HAQ", "SE", "BHADHO,", "BHADHO", "HAQ", "SE"];

const PARTICLE_COLORS = [
  "rgba(255, 215, 0, 0.15)",
  "rgba(255, 107, 107, 0.1)",
  "rgba(78, 205, 196, 0.1)",
  "rgba(255, 159, 67, 0.1)",
  "rgba(162, 89, 255, 0.1)",
];

const MOBILE_BREAKPOINT = 768;
const SSR_DEFAULT_WIDTH = 1024;
const TYPING_SPEED_MS = 100;
const INITIAL_TYPING_DELAY_MS = 2000;
const RESTART_DELAY_MS = 4000;
const RESTART_GAP_MS = 1500;
const SOUND_STOP_DELAY_MS = 5000;
const CURSOR_BLINK_MS = 500;
const AUDIO_VOLUME = 0.8;

/* -------------------------------------------------------------------------- */
/*                        External store subscriptions                        */
/* -------------------------------------------------------------------------- */

const subscribeNoop = () => () => {};
const getIsClientSnapshot = () => true;
const getIsServerSnapshot = () => false;

const subscribeToResize = (callback) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const getWidthSnapshot = () =>
  typeof window === "undefined" ? SSR_DEFAULT_WIDTH : window.innerWidth;
const getWidthServerSnapshot = () => SSR_DEFAULT_WIDTH;

/* -------------------------------------------------------------------------- */
/*                            Sound Effect System                             */
/* -------------------------------------------------------------------------- */

class SoundEffectSystem {
  constructor() {
    this.audio = null;
    this.initialized = false;
    this.soundEnabled = true;
  }

  init(src) {
    try {
      if (this.audio) {
        this.initialized = true;
        return true;
      }
      if (!src) {
        this.initialized = true;
        return true;
      }
      this.audio = new Audio(src);
      this.audio.loop = false;
      this.audio.preload = "auto";
      this.audio.volume = AUDIO_VOLUME;
      this.initialized = true;
      return true;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HeroSlogan] Audio not supported:", err);
      }
      return false;
    }
  }

  play() {
    if (!this.soundEnabled || !this.audio) return;
    try {
      this.audio.currentTime = 0;
      const promise = this.audio.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          // Autoplay blocked — expected until user interacts.
        });
      }
    } catch {
      // Ignore — playback is a progressive enhancement.
    }
  }

  stop() {
    if (!this.audio) return;
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } catch {
      // Ignore.
    }
  }

  setVolume(volume) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled) {
    this.soundEnabled = !!enabled;
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const HeroSlogan = ({
  videoSrcMp4 = "/bannerMain.mp4",
  videoSrcWebm = "/sloganBanner.webm",
  posterSrc = "/sloganBanner.png",
  soundSrc = null,
  className = "",
}) => {
  /* --------------------------- Client + viewport -------------------------- */

  const isClient = useSyncExternalStore(
    subscribeNoop,
    getIsClientSnapshot,
    getIsServerSnapshot
  );

  const viewportWidth = useSyncExternalStore(
    subscribeToResize,
    getWidthSnapshot,
    getWidthServerSnapshot
  );

  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const videoAnimation = isMobile ? "videoZoomPanMobile" : "videoZoomPan";
  const particleCount = isMobile ? 30 : 50;

  /* --------------------------------- State -------------------------------- */

  // const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  /* --------------------------------- Refs --------------------------------- */

  const typingTimerRef = useRef(null);
  const restartTimerRef = useRef(null);
  const stopSoundTimerRef = useRef(null);
  const cursorTimerRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const soundSystemRef = useRef(null);
  const startTypingRef = useRef(null); // ← holds the latest startTyping

  if (soundSystemRef.current === null) {
    soundSystemRef.current = new SoundEffectSystem();
  }

  /* ------------------------------ Static data ----------------------------- */

  const fullText = useMemo(() => WORDS.join(""), []);

  // Pure prefix-sum — no mutation.
  const wordPositions = useMemo(() => {
    const lengths = WORDS.map((word) => word.length);
    return WORDS.map((word, wordIndex) => {
      const startIndex = lengths
        .slice(0, wordIndex)
        .reduce((sum, len) => sum + len, 0);
      return {
        word,
        chars: word.split(""),
        startIndex,
        wordIndex,
      };
    });
  }, []);

  /* ------------------------------- Callbacks ------------------------------ */

  const unlockAudio = useCallback(() => {
    const system = soundSystemRef.current;
    if (!system || audioUnlockedRef.current) return;
    const ok = system.init(soundSrc);
    if (ok) {
      audioUnlockedRef.current = true;
      system.setEnabled(soundEnabled);
      system.setVolume(AUDIO_VOLUME);
    }
  }, [soundSrc, soundEnabled]);

  const playSound = useCallback(() => {
    const system = soundSystemRef.current;
    if (!system || !soundEnabled || !audioUnlockedRef.current) return;
    system.play();
  }, [soundEnabled]);

  const stopSound = useCallback(() => {
    soundSystemRef.current?.stop();
  }, []);

  // const handleVideoLoad = useCallback(() => {
  //   setIsVideoLoaded(true);
  // }, []);

  /* -------------------------- Particles + cursor -------------------------- */

  useEffect(() => {
    if (!isClient) return;

    const generateParticles = () => {
      const next = new Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 25 + 15;
        const delay = Math.random() * 15;
        const color =
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const wobble = Math.random() * 20 + 10;

        next[i] = (
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
              "--wobble": `${wobble}px`,
            }}
          />
        );
      }
      setParticles(next);
    };

    const rafId =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(generateParticles)
        : setTimeout(generateParticles, 0);

    cursorTimerRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, CURSOR_BLINK_MS);

    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) =>
      document.addEventListener(event, unlockAudio, { passive: true })
    );

    return () => {
      if (
        typeof cancelAnimationFrame === "function" &&
        typeof rafId === "number"
      ) {
        cancelAnimationFrame(rafId);
      } else {
        clearTimeout(rafId);
      }
      if (cursorTimerRef.current) {
        clearInterval(cursorTimerRef.current);
        cursorTimerRef.current = null;
      }
      events.forEach((event) =>
        document.removeEventListener(event, unlockAudio)
      );
    };
  }, [isClient, particleCount, unlockAudio]);

  /* ----------------------------- Typing loop ------------------------------ */

  const startTyping = useCallback(() => {
    const totalChars = fullText.length;
    let index = -1;

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setCurrentCharIndex(-1);
    setIsTypingComplete(false);
    setShowCursor(true);

    playSound();

    typingTimerRef.current = setInterval(() => {
      if (index < totalChars - 1) {
        index += 1;
        setCurrentCharIndex(index);
        return;
      }

      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
      setIsTypingComplete(true);

      stopSoundTimerRef.current = setTimeout(() => {
        stopSound();
        stopSoundTimerRef.current = null;
      }, SOUND_STOP_DELAY_MS);

      restartTimerRef.current = setTimeout(() => {
        setCurrentCharIndex(-1);
        setIsTypingComplete(false);
        restartTimerRef.current = setTimeout(() => {
          // ✅ Recursion goes through the ref, not the closure binding.
          startTypingRef.current?.();
        }, RESTART_GAP_MS);
      }, RESTART_DELAY_MS);
    }, TYPING_SPEED_MS);
  }, [fullText, playSound, stopSound]);

  // Keep the ref in sync with the latest startTyping.
  useEffect(() => {
    startTypingRef.current = startTyping;
    return () => {
      startTypingRef.current = null;
    };
  }, [startTyping]);

  useEffect(() => {
    if (!isClient) return;

    const initialDelay = setTimeout(() => {
      startTypingRef.current?.();
    }, INITIAL_TYPING_DELAY_MS);

    return () => {
      clearTimeout(initialDelay);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (stopSoundTimerRef.current) clearTimeout(stopSoundTimerRef.current);
      stopSound();
    };
  }, [isClient, stopSound]);

  /* --------------------------- Sound toggle UI ---------------------------- */

  const handleSoundToggle = useCallback(
    (event) => {
      event.stopPropagation();
      const next = !soundEnabled;
      setSoundEnabled(next);
      soundSystemRef.current?.setEnabled(next);
      unlockAudio();

      if (next) {
        if (currentCharIndex < fullText.length - 1) playSound();
      } else {
        stopSound();
      }
    },
    [
      soundEnabled,
      unlockAudio,
      currentCharIndex,
      fullText.length,
      playSound,
      stopSound,
    ]
  );

  /* -------------------------------- Render -------------------------------- */

  if (!isClient) {
    return (
      <div
        className={`${styles.heroSlogan} ${className}`}
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  return (
    <div className={`${styles.heroSlogan} ${className}`}>
      {soundSrc && (
        <button
          type="button"
          className={styles.soundToggle}
          onClick={handleSoundToggle}
          aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
          aria-pressed={soundEnabled}
          data-enabled={soundEnabled}
        >
          <span aria-hidden="true">{soundEnabled ? "⌨️" : "🔇"}</span>
        </button>
      )}

      <div className={styles.animatedGradient} aria-hidden="true" />

      

      {particles.length > 0 && (
        <div className={styles.particles} aria-hidden="true">
          {particles}
        </div>
      )}

      <div className={styles.overlay} aria-hidden="true" />

      <div className={`${styles.sloganContainer} ${styles.visible}`}>
        <div className={styles.sloganTextWrapper}>
          <h1 className={styles.sloganText}>
            <span className={styles.sloganLine}>
              {wordPositions.map((wordData) => (
                <span
                  key={`word-${wordData.wordIndex}`}
                  className={styles.wordWrapper}
                >
                  {wordData.chars.map((char, charIdx) => {
                    const isComma = char === ",";
                    const globalCharIndex = wordData.startIndex + charIdx;
                    const isRevealed = currentCharIndex >= globalCharIndex;

                    return (
                      <span
                        key={`char-${globalCharIndex}`}
                        className={`${styles.char} ${
                          isRevealed ? styles.charReveal : ""
                        } ${isComma ? styles.comma : ""}`}
                        aria-hidden={!isRevealed}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
              {!isTypingComplete && (
                <span
                  className={`${styles.cursor} ${
                    showCursor ? styles.cursorVisible : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </span>
               <span className={styles.seoText}>
                Business Licensing, Government Liaison and Compliance Services for
                Businesses in Mumbai.
              </span>
          </h1>
        </div>
      </div>
      
      <div className={styles.videoWrapper}>
        <video
          className={`${styles.backgroundVideo} ${styles[videoAnimation]}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          // onLoadedData={handleVideoLoad}
          poster={posterSrc}
          aria-hidden="true"
        >
          <source src={videoSrcMp4} type="video/mp4" />
          {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
        </video>

        {/* {!isVideoLoaded && (
          <div className={styles.videoFallback} aria-hidden="true" />
        )} */}
      </div>

    </div>
  );
};

export default HeroSlogan;