"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./EmployeeActivityGallery.scss";

// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

const EMPLOYEE_ACTIVITY_ENDPOINT = `${API_BASE_URL.replace(
  /\/+$/,
  ""
)}/api/employee-activity/`;

// ============================================================
// HELPERS
// ============================================================

const getImageUrl = (src) => {
  if (!src) return "";
  const value = String(src).trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_BASE_URL.replace(/\/+$/, "")}${normalizedPath}`;
};

const normalizeActivities = (result) => {
  let data = [];
  if (Array.isArray(result)) data = result;
  else if (result && Array.isArray(result.data)) data = result.data;

  return data
    .filter((a) => a && typeof a === "object")
    .filter((a) => a.status !== false)
    .map((a, i) => {
      const title =
        typeof a.title === "string" && a.title.trim()
          ? a.title.trim()
          : `Employee Activity ${i + 1}`;
      const alt =
        typeof a.alt === "string" && a.alt.trim() ? a.alt.trim() : title;
      return {
        ...a,
        id: a.id ?? `employee-activity-${i}`,
        title,
        alt,
        src: getImageUrl(a.src),
        priority: Number.isFinite(Number(a.priority))
          ? Number(a.priority)
          : 9999,
      };
    })
    .filter((a) => a.src)
    .sort((a, b) => a.priority - b.priority);
};

const splitIntoRows = (items, rowCount = 3) => {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((item, i) => rows[i % rowCount].push(item));
  return rows;
};

const refreshScrollTrigger = () => {
  if (typeof window === "undefined") return;
  const st = window.ScrollTrigger;
  if (st && typeof st.refresh === "function") {
    window.requestAnimationFrame(() => st.refresh());
  }
};

// ============================================================
// MARQUEE ROW
// ============================================================

function MarqueeRow({ items, reverse = false, speed = 40, onImageLoad, onImageError }) {
  // 👇 Build a "base" set of unique items, plus mark how many are real
  const { loopItems, originalCount } = useMemo(() => {
    if (!items.length) return { loopItems: [], originalCount: 0 };

    // Ensure a minimum so each row fills the track nicely
    const minItems = 8;
    let base = items;
    if (base.length < minItems) {
      const repeats = Math.ceil(minItems / base.length);
      base = Array.from({ length: repeats }, () => items).flat();
    }

    // Deduplicate by activity.id so we don't register the same image
    // multiple times in the Fancybox group
    const seen = new Set();
    const uniqueBase = base.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });

    // Duplicate for seamless loop — the second half is visual-only clones
    return {
      loopItems: [...uniqueBase, ...uniqueBase],
      originalCount: uniqueBase.length,
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="employee-marquee-row">
      <div
        className={`employee-marquee-track ${reverse ? "is-reverse" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {loopItems.map((activity, index) => {
          // 🎯 Only the FIRST occurrence of each id gets data-fancybox.
          // Everything else is a visual clone — clickable but standalone.
          const isOriginal = index < originalCount;

          return (
            <div className="employee-marquee-item" key={`${activity.id}-${index}`}>
              <a
                href={activity.src}
                {...(isOriginal
                  ? {
                      "data-fancybox": "employee-gallery",
                      "data-caption": activity.title,
                    }
                  : {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                className="employee-image-wrapper"
                aria-label={`View ${activity.title}`}
              >
                <span className="employee-image-frame" aria-hidden="true" />
                <Image
                  src={activity.src}
                  alt={activity.alt}
                  width={480}
                  height={320}
                  className="employee-activity-image"
                  sizes="(max-width: 600px) 240px, 380px"
                  unoptimized
                  loading="lazy"
                  onError={onImageError}
                  onLoad={onImageLoad}
                />
                <div className="employee-image-overlay" aria-hidden="true">
                  {/* <span className="employee-image-title">{activity.title}</span> */}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function EmployeeActivityGallery() {
  const galleryRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // FETCH
  // ----------------------------------------------------------
  const fetchActivities = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(EMPLOYEE_ACTIVITY_ENDPOINT, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(
          `Unable to load employee activities. Server returned ${response.status}.`
        );
      }
      const result = await response.json();
      setActivities(normalizeActivities(result));
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("Error fetching employee activities:", err);
      setActivities([]);
      setError(
        err?.message ||
          "Unable to load employee activities. Please try again later."
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    return () => abortControllerRef.current?.abort();
  }, [fetchActivities]);

  // ----------------------------------------------------------
  // Refresh ScrollTrigger after layout changes
  // ----------------------------------------------------------
  useEffect(() => {
    if (loading) return;
    refreshScrollTrigger();
  }, [loading, activities.length]);

  // ----------------------------------------------------------
  // Fancybox
  // ----------------------------------------------------------
  useEffect(() => {
    const container = galleryRef.current;
    if (!container || activities.length === 0) return undefined;

    NativeFancybox.bind(container, "[data-fancybox='employee-gallery']", {
      groupAll: true,
      animated: true,
      closeButton: "auto",
      Thumbs: { type: "classic" },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["zoom", "slideshow", "thumbs", "close"],
        },
      },
      Images: { zoom: true },
    });

    return () => {
      NativeFancybox.unbind(container, "[data-fancybox='employee-gallery']");
    };
  }, [activities]);

  // ----------------------------------------------------------
  // IMAGE HANDLERS
  // ----------------------------------------------------------
  const handleImageError = useCallback((event) => {
    const image = event.currentTarget;
    image.onerror = null;
    image.style.visibility = "hidden";
  }, []);

  const handleImageLoad = useCallback(() => {
    refreshScrollTrigger();
  }, []);

  // ----------------------------------------------------------
  // SPLIT INTO 3 ROWS
  // ----------------------------------------------------------
  const [row1, row2, row3] = useMemo(
    () => splitIntoRows(activities, 3),
    [activities]
  );

  const skeletonRows = useMemo(() => [0, 1, 2], []);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <section
      className="employee-activity-section"
      aria-labelledby="employee-activity-title"
    >
      <div className="employee-activity-container">
        <div className="employee-activity-heading">
          <span className="employee-activity-label">Life at Liaison Bank</span>
          <h2 id="employee-activity-title">Employee Activities</h2>
          <p className="text-center">
            Explore moments from our team activities, celebrations, events and
            workplace experiences.
          </p>
        </div>

        {loading && (
          <div
            className="employee-marquee-skeleton"
            aria-busy="true"
            aria-live="polite"
          >
            {skeletonRows.map((rowIdx) => (
              <div className="employee-marquee-row" key={`sk-row-${rowIdx}`}>
                <div className="employee-marquee-track is-static">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      className="employee-marquee-item"
                      key={`sk-${rowIdx}-${i}`}
                    >
                      <div className="employee-skeleton-block" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <span className="employee-activity-sr-only">Loading activities…</span>
          </div>
        )}

        {!loading && error && (
          <div
            className="employee-activity-status employee-activity-error"
            role="alert"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchActivities}
              className="employee-activity-retry"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <p className="employee-activity-status">
            No activities available at the moment.
          </p>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="employee-marquee" ref={galleryRef}>
            <MarqueeRow
              items={row1}
              speed={45}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
            <MarqueeRow
              items={row2}
              reverse
              speed={55}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
            <MarqueeRow
              items={row3}
              speed={50}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
          </div>
        )}
      </div>
    </section>
  );
}