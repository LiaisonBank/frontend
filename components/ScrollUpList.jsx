"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollUpList({
  items = [],
  speed = 1200,   // animation duration
  pause = 2800,   // wait time
}) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const run = () => {
      setAnimate(true);

      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setAnimate(false);
      }, speed);
    };

    const interval = setInterval(run, speed + pause);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, [items.length, speed, pause]);

  return (
    <div className="scroll-wrapper">
      <div className={`scroll-item ${animate ? "out" : "in"}`}>
        {items[index]}
      </div>
    </div>
  );
}