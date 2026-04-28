"use client"; // If using App Router, make this a client component

import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ endValue, duration = 4000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    const start = 0;
    const end = endValue;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        ref.current = requestAnimationFrame(step);
      }
    };

    ref.current = requestAnimationFrame(step);

    return () => {
      if (ref.current) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, [endValue, duration]);

  return <span className="counter-value">{count}</span>;
};

export default AnimatedCounter;
