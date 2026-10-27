"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

// Keep the fine particle density but render with one canvas instead of
// thousands of DOM elements. This substantially reduces layout/compositing work.
const COLS = 48;
const ROWS = 48;
const TILE_COUNT = COLS * ROWS;
const TRACK_DURATION = 4.2;
const TILE_DURATION = 0.9;
const PARTICLE_STAGGER_DURATION = 2.55;
const PANEL_WIDTH_RATIO = 1;
const PANEL_SIDE_GAP = 0;
const MAX_DPR = 1.25;

function particleNoise(index, salt = 1) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;

    // Handle cached images that have already completed loading.
    if (image.complete && image.naturalWidth > 0) resolve(image);
  });
}

// Pre-render the image once using object-fit: cover. The animation then copies
// tiles from this small canvas instead of repeatedly decoding background URLs.
function createPanelCanvas(image, width, height) {
  const panelCanvas = document.createElement("canvas");
  panelCanvas.width = Math.max(1, Math.round(width));
  panelCanvas.height = Math.max(1, Math.round(height));

  const context = panelCanvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context is not available.");

  const scale = Math.max(
    panelCanvas.width / image.naturalWidth,
    panelCanvas.height / image.naturalHeight
  );
  const renderedWidth = image.naturalWidth * scale;
  const renderedHeight = image.naturalHeight * scale;
  const cropX = (renderedWidth - panelCanvas.width) / 2;
  const cropY = (renderedHeight - panelCanvas.height) / 2;

  context.fillStyle = "#111418";
  context.fillRect(0, 0, panelCanvas.width, panelCanvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    cropX / scale,
    cropY / scale,
    panelCanvas.width / scale,
    panelCanvas.height / scale,
    0,
    0,
    panelCanvas.width,
    panelCanvas.height
  );

  return panelCanvas;
}

// OUTGOING = starts at the LEFT and dissolves toward the RIGHT.
// INCOMING = starts at the RIGHT and assembles toward the LEFT.
function getParticleStagger(index, direction) {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  
  const columnProgress = direction === "outgoing"
  ? col / (COLS - 1)
  : col / (COLS - 1);

  const irregularWave =
    Math.sin(row * 0.61 + col * 0.19) * 0.13 +
    Math.sin(row * 0.27 - col * 0.23) * 0.09;
  const jitter = particleNoise(index, direction === "outgoing" ? 3 : 9) * 0.38;
  const rowJitter = particleNoise(index, direction === "outgoing" ? 11 : 17) * 0.12;

  return clamp(
    columnProgress * PARTICLE_STAGGER_DURATION + irregularWave + jitter + rowJitter,
    0,
    3.22
  );
}

function createParticles(panelWidth, panelHeight) {
  const tileWidth = panelWidth / COLS;
  const tileHeight = panelHeight / ROWS;

  return Array.from({ length: TILE_COUNT }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;

    return {
      index,
      x: col * tileWidth,
      y: row * tileHeight,
      width: tileWidth,
      height: tileHeight,
      outgoingDelay: getParticleStagger(index, "outgoing"),
      incomingDelay: getParticleStagger(index, "incoming"),
      outgoingX: -(72 + particleNoise(index, 21) * 150),
      outgoingY: (particleNoise(index, 22) - 0.5) * 84,
      outgoingScale: 0.035 + particleNoise(index, 23) * 0.22,
      outgoingRotation: (particleNoise(index, 24) - 0.5) * 0.66,
      incomingX: 72 + particleNoise(index, 31) * 118,
      incomingY: (particleNoise(index, 32) - 0.5) * 58,
      incomingScale: 0.12 + particleNoise(index, 33) * 0.38,
      incomingRotation: (particleNoise(index, 34) - 0.5) * 0.42,
    };
  });
}

function drawTile(context, panelCanvas, particle, x, y, alpha, scale, rotation) {
  if (alpha <= 0.001 || scale <= 0.001) return;

  const width = particle.width;
  const height = particle.height;
  context.save();
  context.globalAlpha = clamp(alpha, 0, 1);
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.scale(scale, scale);

  // Tiny overlap prevents hairline seams between adjacent image fragments.
  const overlap = 0.45;
  context.drawImage(
    panelCanvas,
    particle.x,
    particle.y,
    width,
    height,
    -width / 2 - overlap,
    -height / 2 - overlap,
    width + overlap * 2,
    height + overlap * 2
  );
  context.restore();
}

export default function DisintegratingImage({ src, alt, className }) {
  const [settledSrc, setSettledSrc] = useState(src);
  const [transition, setTransition] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const latestSrcRef = useRef(src);
  const transitionIdRef = useRef(0);
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const tweenRef = useRef(null);

  // Record a source change, retaining the previous source until the animation ends.
  useLayoutEffect(() => {
    if (src === latestSrcRef.current) return;

    const oldSrc = latestSrcRef.current;
    latestSrcRef.current = src;
    setCanvasReady(false);
    setTransition({
      id: ++transitionIdRef.current,
      oldSrc,
      newSrc: src,
    });
  }, [src]);

  useLayoutEffect(() => {
    if (!transition || !viewportRef.current || !canvasRef.current) return undefined;

    let cancelled = false;
    let animationTween = null;
    const { id, oldSrc, newSrc } = transition;
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;

    setCanvasReady(false);
    tweenRef.current?.kill();
    tweenRef.current = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettledSrc(newSrc);
      setCanvasReady(false);
      setTransition((current) => (current?.id === id ? null : current));
      return undefined;
    }

    const prepareAndAnimate = async () => {
      try {
        const [oldImage, newImage] = await Promise.all([
          loadImage(oldSrc),
          loadImage(newSrc),
        ]);
        if (cancelled || !viewportRef.current || !canvasRef.current) return;

        const width = Math.max(1, viewport.clientWidth);
        const height = Math.max(1, viewport.clientHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const panelWidth = width * PANEL_WIDTH_RATIO;
        const panelLeft = width * PANEL_SIDE_GAP;
        const particleTravel = Math.max(72, Math.min(132, width * 0.22));

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const context = canvas.getContext("2d", {
          alpha: true,
          desynchronized: true,
        });
        if (!context) throw new Error("Canvas 2D context is not available.");

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const oldPanel = createPanelCanvas(oldImage, panelWidth, height);
        const newPanel = createPanelCanvas(newImage, panelWidth, height);
        const particles = createParticles(panelWidth, height);
        const tileWidth = panelWidth / COLS;
        const tileHeight = height / ROWS;

        const drawFrame = (progress) => {
          if (cancelled) return;

          const elapsed = progress * TRACK_DURATION;
          const trackOffset = -panelWidth * progress;
          const outgoingX = panelLeft + trackOffset;
          const incomingX = panelLeft + panelWidth + trackOffset;

          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.setTransform(dpr, 0, 0, dpr, 0, 0);

          // Draw each panel once, then punch tile-sized holes only where a
          // particle has detached / is not assembled. This cuts thousands of
          // repeated full-image draws and avoids hundreds of DOM layers.
          context.drawImage(oldPanel, outgoingX, 0, panelWidth, height);
          context.drawImage(newPanel, incomingX, 0, panelWidth, height);

          // PASS 1: clear every cell that is currently detached or not yet
          // assembled. Clear all masks before drawing moving particles so a
          // later cell can never erase a particle that has already moved over it.
          for (const particle of particles) {
            const outLocal = clamp(
              (elapsed - particle.outgoingDelay) / TILE_DURATION,
              0,
              1
            );
            const inLocal = clamp(
              (elapsed - particle.incomingDelay) / TILE_DURATION,
              0,
              1
            );
            const outTileX = outgoingX + particle.x;
            const inTileX = incomingX + particle.x;

            if (elapsed > particle.outgoingDelay) {
              context.clearRect(
                outTileX - 0.25,
                particle.y - 0.25,
                particle.width + 0.5,
                particle.height + 0.5
              );
            }

            if (inLocal < 1) {
              context.clearRect(
                inTileX - 0.25,
                particle.y - 0.25,
                particle.width + 0.5,
                particle.height + 0.5
              );
            }
          }

          // PASS 2: draw moving particles over the fully masked base panels.
          for (const particle of particles) {
            const outLocal = clamp(
              (elapsed - particle.outgoingDelay) / TILE_DURATION,
              0,
              1
            );
            const inLocal = clamp(
              (elapsed - particle.incomingDelay) / TILE_DURATION,
              0,
              1
            );
            const outTileX = outgoingX + particle.x;
            const inTileX = incomingX + particle.x;

            // OLD IMAGE: left edge starts first; particles fly left.
            if (elapsed > particle.outgoingDelay && outLocal < 1) {
              const easedOut = outLocal * outLocal;
              drawTile(
                context,
                oldPanel,
                particle,
                outTileX + particle.outgoingX * easedOut,
                particle.y + particle.outgoingY * easedOut,
                1 - easedOut,
                1 + (particle.outgoingScale - 1) * easedOut,
                particle.outgoingRotation * easedOut
              );
            }

            // NEW IMAGE: right edge starts first; particles attach.
            if (elapsed > particle.incomingDelay && inLocal < 1) {
              const easedIn = 1 - Math.pow(1 - inLocal, 3);
              drawTile(
                context,
                newPanel,
                particle,
                inTileX + particle.incomingX * (1 - easedIn),
                particle.y + particle.incomingY * (1 - easedIn),
                easedIn,
                particle.incomingScale + (1 - particle.incomingScale) * easedIn,
                particle.incomingRotation * (1 - easedIn)
              );
            }
          }
        };

        drawFrame(0);
        setCanvasReady(true);

        const playhead = { progress: 0 };
        animationTween = gsap.to(playhead, {
          progress: 1,
          duration: TRACK_DURATION,
          ease: "none",
          onUpdate: () => drawFrame(playhead.progress),
          onComplete: () => {
            if (cancelled || tweenRef.current !== animationTween) return;

            tweenRef.current = null;
            // Swap to a normal full-resolution image after the canvas transition.
            // This guarantees the completed image remains visible and still.
            setSettledSrc(newSrc);
            setCanvasReady(false);
            setTransition((current) => (current?.id === id ? null : current));
          },
        });
        tweenRef.current = animationTween;
      } catch (error) {
        if (cancelled) return;
        console.error("Disintegrating image transition failed:", error);
        // Fail safely: always leave the selected image visible if canvas loading fails.
        setSettledSrc(newSrc);
        setCanvasReady(false);
        setTransition((current) => (current?.id === id ? null : current));
      }
    };

    prepareAndAnimate();

    return () => {
      cancelled = true;
      animationTween?.kill();
      if (tweenRef.current === animationTween) tweenRef.current = null;
    };
  }, [transition]);

  useLayoutEffect(() => {
    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, []);

  const visibleSrc = transition ? transition.oldSrc : settledSrc;

  return (
    <div
      ref={viewportRef}
      className={`disintegrating-image-container ${className || ""}`}
    >
      {/* This image is always present; it becomes visible immediately after the transition. */}
      <div className="disintegrate-panel disintegrate-panel--settled">
        <Image
          src={visibleSrc}
          alt={alt}
          fill
          sizes="(max-width: 720px) 86vw, 45vw"
          className={`base-image ${transition && canvasReady ? "base-image--transitioning" : ""}`}
          unoptimized
          priority
        />
      </div>

      {transition && (
        <canvas
          ref={canvasRef}
          className={`disintegrate-canvas ${canvasReady ? "is-active" : ""}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
