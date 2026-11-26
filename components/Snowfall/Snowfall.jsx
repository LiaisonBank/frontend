"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import "./Snowfall.scss";

// TODO: Update these paths to match where you saved the images
import cornerLeftImg from "@/assets/images/corner_decoration-left.png";
import cornerRightImg from "@/assets/images/corner_decoration-right.png";

const CONFIG = {
  count: 140,
  scrollFactor: 0.35,
  scrollSmoothing: 0.12,
  minSpeed: 25,
  maxSpeed: 80,
  minSize: 1,
  maxSize: 3,
  maxDrift: 15,
  color: "#ffffff",
};

const Snowfall = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = null;
    let lastTime = 0;
    let particles = [];

    let smoothedScrollY = window.scrollY;
    let prevSmoothedScrollY = smoothedScrollY;

    const wrap = (v, min, span) => ((((v - min) % span) + span) % span) + min;

    const createParticle = (spread = false) => ({
      x: Math.random() * width,
      y: spread ? Math.random() * height : Math.random() * height - height,
      size: CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize),
      speed:
        CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed),
      drift: (Math.random() - 0.5) * CONFIG.maxDrift,
    });

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initializeParticles = () => {
      particles = Array.from({ length: CONFIG.count }, () =>
        createParticle(true),
      );
    };

    const update = (dt, scrollShift) => {
      for (const p of particles) {
        p.y += p.speed * dt;
        p.x += p.drift * dt;
        p.y -= scrollShift;

        const spanX = width + p.size * 2;
        const spanY = height + p.size * 2;
        p.x = wrap(p.x, -p.size, spanX);
        p.y = wrap(p.y, -p.size, spanY);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = CONFIG.color;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const scrollY = window.scrollY;
      smoothedScrollY += (scrollY - smoothedScrollY) * CONFIG.scrollSmoothing;

      const scrollShift =
        (smoothedScrollY - prevSmoothedScrollY) * CONFIG.scrollFactor;
      prevSmoothedScrollY = smoothedScrollY;

      update(dt, scrollShift);
      draw();
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initializeParticles();
    animationId = requestAnimationFrame(animate);

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Corner Decorations */}
      <div className="corner-decorations" aria-hidden="true">
        <Image
          src={cornerLeftImg}
          alt=""
          width={400}
          height={400}
          className="corner-img corner-left"
          priority
        />
        <Image
          src={cornerRightImg}
          alt=""
          width={400}
          height={400}
          className="corner-img corner-right"
          priority
        />
      </div>

      {/* Snowfall Canvas */}
      <canvas ref={canvasRef} className="snowfall-canvas" />
    </>
  );
};

export default Snowfall;
