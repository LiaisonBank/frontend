"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./EmployeeActivityGallery.scss";

// ============================================================
// CONFIGURATION
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

/**
 * Convert an API image path into a usable absolute URL.
 */
const getImageUrl = (src) => {
  if (!src) return "";

  const value = String(src).trim();
  if (!value) return "";

  // Already an absolute URL
  if (/^https?:\/\//i.test(value)) return value;

  // Protocol-relative URL
  if (value.startsWith("//")) return `https:${value}`;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_BASE_URL.replace(/\/+$/, "")}${normalizedPath}`;
};

/**
 * Normalize different possible backend response formats.
 *
 * Supported:
 * 1. Direct array: [{...}, {...}]
 * 2. Wrapped response: { success: true, data: [...] }
 * 3. Wrapped response: { data: [...] }
 */
const normalizeActivities = (result) => {
  let data = [];

  if (Array.isArray(result)) {
    data = result;
  } else if (result && Array.isArray(result.data)) {
    data = result.data;
  }

  return data
    .filter((activity) => activity && typeof activity === "object")
    .filter((activity) => activity.status !== false)
    .map((activity, index) => {
      const title =
        typeof activity.title === "string" && activity.title.trim()
          ? activity.title.trim()
          : `Employee Activity ${index + 1}`;

      const alt =
        typeof activity.alt === "string" && activity.alt.trim()
          ? activity.alt.trim()
          : title;

      return {
        ...activity,
        id: activity.id ?? `employee-activity-${index}`,
        title,
        alt,
        src: getImageUrl(activity.src),
        priority: Number.isFinite(Number(activity.priority))
          ? Number(activity.priority)
          : 9999, // default high number so items without priority go last
      };
    })
    .filter((activity) => activity.src)
    .sort((a, b) => {
      // Lower priority number = higher display order
      return a.priority - b.priority;
    });
};

// ============================================================
// COMPONENT
// ============================================================

export default function EmployeeActivityGallery() {
  const galleryRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH EMPLOYEE ACTIVITIES
  // ==========================================================

  const fetchActivities = useCallback(async () => {
    // Cancel previous request if necessary
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(EMPLOYEE_ACTIVITY_ENDPOINT, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load employee activities. Server returned ${response.status}.`
        );
      }

      const result = await response.json();
      console.log("Employee activity API response:", result);

      const normalizedActivities = normalizeActivities(result);
      console.log("Normalized employee activities:", normalizedActivities);

      setActivities(normalizedActivities);
    } catch (err) {
      // Ignore aborted requests
      if (err?.name === "AbortError") return;

      console.error("Error fetching employee activities:", err);
      setActivities([]);
      setError(
        err?.message ||
          "Unable to load employee activities. Please try again later."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchActivities();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchActivities]);

  // ==========================================================
  // FANCYBOX
  // ==========================================================

  useEffect(() => {
    const container = galleryRef.current;

    if (!container || activities.length === 0) return undefined;

    NativeFancybox.bind(container, "[data-fancybox='employee-gallery']", {
      groupAll: true,
      animated: true,
      closeButton: "auto",
      Thumbs: {
        type: "classic",
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["zoom", "slideshow", "thumbs", "close"],
        },
      },
      Images: {
        zoom: true,
      },
    });

    return () => {
      // Only remove bindings created by this gallery.
      // Do NOT call NativeFancybox.destroy(), because that can
      // affect other Fancybox instances on the website.
      NativeFancybox.unbind(container, "[data-fancybox='employee-gallery']");
    };
  }, [activities]);

  // ==========================================================
  // IMAGE ERROR HANDLER
  // ==========================================================

  const handleImageError = (event) => {
    const image = event.currentTarget;
    // Prevent repeated error events
    image.onerror = null;
    image.style.visibility = "hidden";
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      className="employee-activity-section"
      aria-labelledby="employee-activity-title"
    >
      <div className="employee-activity-container">
        {/* ====================================================
            HEADING
        ==================================================== */}
        <div className="employee-activity-heading">
          <span className="employee-activity-label">
            Life at Liaison Bank
          </span>

          <h2 id="employee-activity-title">Employee Activities</h2>

          <p className="text-center">
            Explore moments from our team activities, celebrations, events and
            workplace experiences.
          </p>
        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}
        {loading && (
          <div
            className="employee-activity-status"
            role="status"
            aria-live="polite"
          >
            Loading activities…
          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}
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

        {/* ====================================================
            EMPTY
        ==================================================== */}
        {!loading && !error && activities.length === 0 && (
          <p className="employee-activity-status">
            No activities available at the moment.
          </p>
        )}

        {/* ====================================================
            GALLERY
        ==================================================== */}
        {!loading && !error && activities.length > 0 && (
          <div className="employee-masonry" ref={galleryRef}>
            {activities.map((activity) => {
              // Single source of truth for the image URL.
              // Both <a href> and <Image src> use this value,
              // so they can never drift out of sync.
              const imageSrc = activity.src;

              return (
                <div className="employee-masonry-item" key={activity.id}>
                  <a
                    href={imageSrc}
                    data-fancybox="employee-gallery"
                    data-caption={activity.title}
                    className="employee-image-wrapper"
                    aria-label={`View ${activity.title}`}
                  >
                    <Image
                      src={imageSrc}
                      alt={activity.alt}
                      width={800}
                      height={1000}
                      className="employee-activity-image"
                      sizes="
                        (max-width: 600px) 100vw,
                        (max-width: 900px) 50vw,
                        33vw
                      "
                      unoptimized
                      loading="lazy"
                      onError={handleImageError}
                    />

                    <div
                      className="employee-image-overlay"
                      aria-hidden="true"
                    >
                      <span>{activity.title}</span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}