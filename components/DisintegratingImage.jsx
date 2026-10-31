"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

// Keep the fine particle density but render with one canvas instead of
// thousands of DOM elements. This substantially reduces layout/compositing work.
const COLS = 30;
const ROWS = 30;
const TILE_COUNT = COLS * ROWS;
const TRACK_DURATION = 4.2;
const TILE_DURATION = 2;
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

// Each particle uses an outside endpoint selected from the nearest image edge.
// Incoming particles travel from that endpoint into the image; outgoing ones
// return to that same endpoint. The image itself stays in a fixed page position.
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
    const centerX = (col + 0.5) / COLS;
    const centerY = (row + 0.5) / ROWS;

    // Pick the nearest image edge. Each tile travels to/from a point outside
    // that edge, matching the annotated arrows around the image.
    const edges = [
      { side: "left", distance: centerX },
      { side: "right", distance: 1 - centerX },
      { side: "top", distance: centerY },
      { side: "bottom", distance: 1 - centerY },
    ];
    const side = edges.reduce((nearest, edge) =>
      edge.distance < nearest.distance ? edge : nearest
    ).side;

    // Distance to the arrow endpoint, in CSS pixels. Small deterministic
    // variation keeps fragments organic while staying within the bleed area.
    const travel = 85 + particleNoise(index, 41) * 75; // 85–160px
    const diagonal = (particleNoise(index, 42) - 0.5) * travel * 0.52;
    let sourceX = 0;
    let sourceY = 0;

    if (side === "left") {
      sourceX = -travel;
      sourceY = diagonal * 10;
    } else if (side === "right") {
      sourceX = travel;
      sourceY = diagonal * 0.45;
    } else if (side === "top") {
      // The annotated top arrows approach diagonally from above/right.
      sourceX = travel * (0.25 + particleNoise(index, 43) * 0.6);
      sourceY = -travel;
    } else {
      // The annotated bottom arrows approach diagonally from below/right.
      sourceX = travel * (0.25 + particleNoise(index, 44) * 0.6);
      sourceY = travel;
    }

    const sharedDelay = getParticleStagger(index, "outgoing");

    return {
      index,
      x: col * tileWidth,
      y: row * tileHeight,
      width: tileWidth,
      height: tileHeight,

      // Both directions use the same outside endpoint: the new image travels
      // from that endpoint into place, and the old image leaves back to it.
      outgoingDelay: sharedDelay,
      incomingDelay: sharedDelay,
      outgoingX: sourceX,
      outgoingY: sourceY,
      outgoingScale: 0.035 + particleNoise(index, 23) * 0.22,
      outgoingRotation: (particleNoise(index, 24) - 0.5) * 0.66,
      incomingX: sourceX,
      incomingY: sourceY,
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

        // Give the particle canvas transparent bleed on every side. The image
        // itself remains bounded to the viewport, but detached particles can
        // visibly travel over the page background instead of being clipped
        // at an invisible canvas/window edge.
        const bleedX = Math.max(280, width * 0.85);
        const bleedY = Math.max(220, height * 0.32);
        const canvasWidth = width + bleedX * 2;
        const canvasHeight = height + bleedY * 2;

        canvas.width = Math.round(canvasWidth * dpr);
        canvas.height = Math.round(canvasHeight * dpr);
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        canvas.style.left = `${-bleedX}px`;
        canvas.style.top = `${-bleedY}px`;
        canvas.style.right = "auto";
        canvas.style.bottom = "auto";

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

          // Preserve the original horizontal side-by-side slide while allowing
          // each particle to travel along its own edge-specific arrow path.
          const trackOffset = -panelWidth * progress;
          const outgoingX = panelLeft + trackOffset;
          const incomingX = panelLeft + panelWidth + trackOffset;

          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          // Translate the image coordinate system into the oversized transparent
          // canvas. The image stays fixed while its tiles travel to/from the
          // outside endpoints shown in the annotated direction guide.
          context.setTransform(
            dpr,
            0,
            0,
            dpr,
            bleedX * dpr,
            bleedY * dpr
          );

          // Clip the solid, sliding image panels and their tile masks to the
          // visible image viewport. The canvas itself has transparent bleed,
          // so detached particles can travel beyond this viewport.
          context.save();
          context.beginPath();
          context.rect(0, 0, width, height);
          context.clip();

          // Keep the original side-by-side slider: old image exits left while
          // the new image enters from the right over the same timeline.
          context.drawImage(oldPanel, outgoingX, 0, panelWidth, height);
          context.drawImage(newPanel, incomingX, 0, panelWidth, height);

          // PASS 1: punch holes in each panel as its matching tiles detach or
          // before incoming tiles assemble. This keeps particles from appearing
          // over a complete image underneath them.
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

            if (elapsed > particle.outgoingDelay && outLocal < 1) {
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
          context.restore();

          // PASS 2: draw detached particles without the image-viewport clip.
          // Their per-edge paths come from the annotated arrows, while the
          // whole image transition keeps its original horizontal slide.
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

            // OLD IMAGE: particles disperse outward toward their assigned outside endpoints.
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

            // NEW IMAGE: particles arrive from their matching outside endpoints and assemble.
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
