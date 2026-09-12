'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * CountUp - Reusable counting animation component
 *
 * @param {number}   end           - Target number to count to
 * @param {number}   start         - Starting number (default: 0)
 * @param {number}   duration      - Animation duration in ms (default: 2000)
 * @param {number}   delay         - Delay before animation starts in ms (default: 0)
 * @param {number}   decimals      - Decimal places (default: 0)
 * @param {string}   prefix        - Text before number (e.g. "$")
 * @param {string}   suffix        - Text after number (e.g. "+", "%")
 * @param {string}   separator     - Thousands separator (default: ",")
 * @param {string}   decimal       - Decimal separator (default: ".")
 * @param {string}   easing        - 'linear' | 'easeOut' | 'easeIn' | 'easeInOut' (default: 'easeOut')
 * @param {boolean}  triggerOnView - Only animate when scrolled into view (default: false)
 * @param {number}   viewThreshold - IntersectionObserver threshold (default: 0.3)
 * @param {boolean}  once          - Animate only once (default: true)
 * @param {function} onEnd         - Callback when animation completes
 * @param {string}   className     - Custom class
 * @param {string}   as            - HTML tag to render (default: 'span')
 */

// --- Easing functions (module-level, stable reference) ---
const EASINGS = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => t * t * t,
  easeInOut: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

export default function CountUp({
  end = 0,
  start = 0,
  duration = 2000,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  decimal = '.',
  easing = 'easeOut',
  triggerOnView = false,
  viewThreshold = 0.3,
  once = true,
  onEnd,
  className = '',
  as: Tag = 'span',
  ...rest
}) {
  const [value, setValue] = useState(start);
  const [shouldStart, setShouldStart] = useState(!triggerOnView);

  const elementRef = useRef(null);
  const frameRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  // Keep onEnd in a ref so it doesn't retrigger the animation effect
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  // --- Format number with separators & decimals ---
  const formatNumber = useCallback(
    (num) => {
      if (!Number.isFinite(num)) return String(num);

      const fixed = num.toFixed(decimals);
      const [intPart, decPart] = fixed.split('.');
      const withSeparator = intPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        separator
      );

      return decPart !== undefined
        ? `${withSeparator}${decimal}${decPart}`
        : withSeparator;
    },
    [decimals, separator, decimal]
  );

  // --- IntersectionObserver for triggerOnView ---
  useEffect(() => {
    if (!triggerOnView) {
      // If not using view trigger, ensure we start (once-per-mount)
      setShouldStart(true);
      return;
    }

    const el = elementRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // SSR or unsupported browser → just start
      setShouldStart(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldStart(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setShouldStart(false);
        }
      },
      { threshold: viewThreshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView, viewThreshold, once]);

  // --- Reset & replay when inputs change (only when NOT "once") ---
  useEffect(() => {
    if (once) return;
    setValue(start);
    // Re-trigger the view observer (or start immediately)
    setShouldStart(!triggerOnView);
  }, [end, start, duration, delay, once, triggerOnView]);

  // --- Animation loop ---
  useEffect(() => {
    if (!shouldStart) return;

    const easeFn = EASINGS[easing] || EASINGS.easeOut;

    const begin = () => {
      startTimeRef.current = null;

      const animate = (timestamp) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeFn(progress);

        const current = start + (end - start) * easedProgress;
        setValue(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setValue(end);
          onEndRef.current?.();
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    if (delay > 0) {
      timeoutRef.current = setTimeout(begin, delay);
    } else {
      begin();
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      frameRef.current = null;
      timeoutRef.current = null;
    };
  }, [shouldStart, start, end, duration, delay, easing]);

  return (
    <Tag ref={elementRef} className={className} {...rest}>
      {prefix}
      {formatNumber(value)}
      {suffix}
    </Tag>
  );
}