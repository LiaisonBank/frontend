// MumbaiMapClient.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
  useMemo,
  useDeferredValue,
} from "react";
import Image from "next/image";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SearchFilter from "./SearchFilter";
import FullscreenButton from "./FullscreenButton";
import "./MumbaiMap.scss";

// ============================================================
// CONFIGURATION
// ============================================================

const MAP_CONFIG = {
  center: { lat: 19.076, lng: 72.8777 },
  bounds: {
    north: 19.28,
    south: 18.89,
    east: 73.05,
    west: 72.75,
  },
  initialZoom: 11,
  resetZoom: 11,
  minZoom: 10,
  maxZoom: 18,
  projectZoom: 14,
  projectAnimationDuration: 0.65,
  resetAnimationDuration: 0.75,
  scrollOffset: 120,
  scrollDelay: 450,
  cardCloseDelay: 300,
  cardWidth: 320,
  cardHeight: 400,
  markerOffset: 52,
  projectLabelZoomThreshold: 13,
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// ============================================================
// FALLBACK COORDINATES
// ============================================================

const FALLBACK_COORDINATES = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  "South Mumbai": { lat: 18.95, lng: 72.83 },
  "Mumbai Central": { lat: 18.9699, lng: 72.8195 },
  Colaba: { lat: 18.9067, lng: 72.8144 },
  Churchgate: { lat: 18.933, lng: 72.826 },
  "Marine Lines": { lat: 18.945, lng: 72.823 },
  "Charni Road": { lat: 18.954, lng: 72.823 },
  "Grant Road": { lat: 18.96, lng: 72.823 },
  "Cumballa Hill": { lat: 18.968, lng: 72.81 },
  Walkeshwar: { lat: 18.95, lng: 72.802 },
  Mahalaxmi: { lat: 18.983, lng: 72.815 },
  Worli: { lat: 19.0169, lng: 72.815 },
  Prabhadevi: { lat: 19.0169, lng: 72.826 },
  "Lower Parel": { lat: 19.0, lng: 72.827 },
  Parel: { lat: 19.017, lng: 72.84 },
  Byculla: { lat: 18.984, lng: 72.834 },
  Dadar: { lat: 19.0181, lng: 72.8434 },
  Matunga: { lat: 19.0219, lng: 72.8429 },
  Sion: { lat: 19.0413, lng: 72.8603 },
  Mahim: { lat: 19.035, lng: 72.8434 },
  Bandra: { lat: 19.0544, lng: 72.8398 },
  "Bandra West": { lat: 19.0544, lng: 72.8398 },
  "Bandra East": { lat: 19.0544, lng: 72.8498 },
  Khar: { lat: 19.073, lng: 72.838 },
  "Khar West": { lat: 19.073, lng: 72.828 },
  "Khar East": { lat: 19.073, lng: 72.848 },
  Santacruz: { lat: 19.083, lng: 72.852 },
  "Santacruz West": { lat: 19.083, lng: 72.842 },
  "Santacruz East": { lat: 19.083, lng: 72.862 },
  "Vile Parle": { lat: 19.0992, lng: 72.8499 },
  Juhu: { lat: 19.1075, lng: 72.8282 },
  Versova: { lat: 19.122, lng: 72.817 },
  Andheri: { lat: 19.1136, lng: 72.8697 },
  "Andheri East": { lat: 19.1136, lng: 72.8697 },
  "Andheri West": { lat: 19.1196, lng: 72.8457 },
  Goregaon: { lat: 19.1547, lng: 72.851 },
  Malad: { lat: 19.186, lng: 72.848 },
  Kandivali: { lat: 19.212, lng: 72.85 },
  Borivali: { lat: 19.2306, lng: 72.8561 },
  Dahisar: { lat: 19.248, lng: 72.86 },
  Chembur: { lat: 19.054, lng: 72.901 },
  "Chembur East": { lat: 19.054, lng: 72.901 },
  "Chembur West": { lat: 19.054, lng: 72.891 },
  Ghatkopar: { lat: 19.086, lng: 72.912 },
  Vikhroli: { lat: 19.109, lng: 72.909 },
  Powai: { lat: 19.1176, lng: 72.906 },
  Bhandup: { lat: 19.14, lng: 72.93 },
  Mulund: { lat: 19.1726, lng: 72.9567 },
  Kurla: { lat: 19.064, lng: 72.888 },
  Kanjurmarg: { lat: 19.125, lng: 72.925 },
  Vasai: { lat: 19.3919, lng: 72.8398 },
  "Vasai West": { lat: 19.3919, lng: 72.8398 },
  "Vasai East": { lat: 19.3919, lng: 72.8498 },
  Virar: { lat: 19.4553, lng: 72.8154 },
  "Virar West": { lat: 19.4553, lng: 72.8154 },
  "Virar East": { lat: 19.4553, lng: 72.8254 },
  "Vasai-Virar": { lat: 19.4236, lng: 72.8276 },
  Nalasopara: { lat: 19.415, lng: 72.86 },
  "Mira Road": { lat: 19.282, lng: 72.854 },
  Bhayandar: { lat: 19.302, lng: 72.85 },
  Naigaon: { lat: 19.36, lng: 72.848 },
  Mhatwali: { lat: 19.33, lng: 72.85 },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const isValidCoordinate = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const isWithinMumbaiBounds = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  return (
    latitude >= MAP_CONFIG.bounds.south &&
    latitude <= MAP_CONFIG.bounds.north &&
    longitude >= MAP_CONFIG.bounds.west &&
    longitude <= MAP_CONFIG.bounds.east
  );
};

const normalizeLocation = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/${imagePath}`;
};

const getApiCoordinates = (project) => {
  if (!project) return null;
  const lat = Number(project.latitude ?? project.lat);
  const lng = Number(project.longitude ?? project.long ?? project.lng);
  if (!isValidCoordinate(lat, lng)) return null;
  if (!isWithinMumbaiBounds(lat, lng)) return null;
  return { lat, lng, source: "api" };
};

const getFallbackCoordinates = (location) => {
  if (!location) return null;
  const normalizedLocation = normalizeLocation(location);

  const excludedAreas = [
    "navi mumbai",
    "thane",
    "panvel",
    "uran",
    "alibag",
    "khopoli",
    "karjat",
    "badlapur",
    "ambarnath",
    "ulhasnagar",
    "dombivli",
    "kalyan",
    "bhiwandi",
  ];

  for (const excluded of excludedAreas) {
    if (normalizedLocation.includes(excluded)) {
      return null;
    }
  }

  for (const [key, coordinates] of Object.entries(FALLBACK_COORDINATES)) {
    const normalizedKey = normalizeLocation(key);
    if (
      normalizedLocation.includes(normalizedKey) ||
      normalizedKey.includes(normalizedLocation)
    ) {
      return {
        lat: coordinates.lat,
        lng: coordinates.lng,
        source: "fallback",
      };
    }
  }
  return null;
};

const getStatusColors = (status, active = false) => {
  const colors = {
    Completed: {
      statusColor: "#FF6B00",
      gradientStart: active ? "#FFA366" : "#FFD600",
      gradientEnd: "#FF2D00",
      shadowColor: "#FFE6A0",
      strokeColor: "#FF6B00",
    },
    "In Progress": {
      statusColor: "#f59e0b",
      gradientStart: active ? "#FFE066" : "#FFD600",
      gradientEnd: "#FFB700",
      shadowColor: "#FFF3CC",
      strokeColor: "##f59e0b",
    },
    Upcoming: {
      statusColor: "#FFB700",
      gradientStart: active ? "#FFE066" : "#FFD600",
      gradientEnd: "#FFB700",
      shadowColor: "#FFF3CC",
      strokeColor: "#FFB700",
    },
  };
  return colors[status] || colors.Completed;
};

// ============================================================
// CUSTOM GOOGLE MAPS MARKER ICON GENERATOR
// ============================================================

const createGoogleMarkerIcon = (active = false, project = null) => {
  const colors = getStatusColors(project?.project_status, active);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="42" height="52">
      <defs>
        <linearGradient id="pinGrad" x1="256" y1="0" x2="256" y2="453" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${colors.gradientStart}"/>
          <stop offset="100%" stop-color="${colors.gradientEnd}"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="${active ? "url(#shadow)" : ""}">
        <path 
          d="M256 0 C164.7 0 91 73.7 91 165 C91 226 130 282 170 340 L244 447 C249.8 455.3 262.2 455.3 268 447 L342 340 C382 282 421 226 421 165 C421 73.7 347.3 0 256 0 Z" 
          fill="url(#pinGrad)" 
          stroke="${colors.strokeColor}" 
          stroke-width="${active ? "6" : "5"}"
          stroke-linejoin="round"
        />
        <circle cx="256" cy="165" r="105" fill="#FFFDEB"/>
        <circle cx="256" cy="165" r="${active ? "70" : "60"}" fill="${colors.statusColor}" opacity="${active ? "0.15" : "0"}" />
        <circle cx="256" cy="165" r="12" fill="${colors.statusColor}" />
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(42, 52),
    anchor: new window.google.maps.Point(21, 52),
    labelOrigin: new window.google.maps.Point(21, 20),
  };
};

// ============================================================
// PROJECT SLIDE PANEL COMPONENT
// ============================================================

const ProjectSlidePanel = React.memo(({ project, isOpen, onClose }) => {
  const panelRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [imageError, setImageError] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      requestAnimationFrame(() => {
        startTransition(() => {
          setIsVisible(true);
          setIsAnimatingOut(false);
          setImageError(false);
        });
      });

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }

    return () => {
      if (!isOpen) {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && isVisible) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      setIsAnimatingOut(true);

      closeTimerRef.current = setTimeout(() => {
        startTransition(() => {
          setIsVisible(false);
          setIsAnimatingOut(false);
        });
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        closeTimerRef.current = null;
      }, 400);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen, isVisible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  useEffect(() => {
    if (isVisible && panelRef.current) {
      panelRef.current.style.overflow = "auto";
      panelRef.current.style.height = "100%";
    }
  }, [isVisible]);

  if (!project || !isVisible) return null;

  const imageUrl = getImageUrl(project.featured_image);
  const hasValidImage = imageUrl && !imageError;

  const statusColor =
    project.project_status === "Completed"
      ? "#FF6B00"
      : project.project_status === "In Progress"
        ? "#FFB700"
        : "#f59e0b";

  const formatCategory = (value) => {
    if (!value) return "";
    return String(value)
      .replace(/[\[\]"\\]/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  };

  return (
    <>
      <div
        className={`panel-backdrop ${isOpen ? "open" : ""} ${isAnimatingOut ? "closing" : ""}`}
        onClick={onClose}
        role="presentation"
      />

      <div
        className={`project-slide-panel ${isOpen ? "open" : ""} ${isAnimatingOut ? "closing" : ""}`}
        onWheel={(e) => {
          e.stopPropagation();
          const element = e.currentTarget;
          if (e.deltaY !== 0) {
            element.scrollTop += e.deltaY;
          }
        }}
        role="dialog"
        aria-label="Project details"
      >
        <div className="panel-header">
          <button
            className="panel-close-btn"
            onClick={onClose}
            aria-label="Close project details"
          >
            <ChevronLeftIcon />
          </button>
          <span className="panel-title">Project Details</span>
        </div>

        <div className="panel-content" ref={panelRef}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "300px",
              backgroundColor: "#f3f4f6",
            }}
          >
            {hasValidImage ? (
              <Image
                src={imageUrl}
                alt={project.client_name || "Project"}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  backgroundPosition: "top center",
                }}
                onError={() => setImageError(true)}
                priority={isOpen}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e5e7eb",
                  color: "#6b7280",
                  fontSize: "1rem",
                  fontWeight: "500",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "3rem" }}>🏗️</span>
                <span>{project.client_name || "Project"}</span>
                <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                  No image available
                </span>
              </div>
            )}
          </div>

          <div className="panel-body">
            <div className="title">
              <div>
                {project.client_name && (
                  <h2 className="panel-project-name">{project.client_name}</h2>
                )}
              </div>
              <div>
                {project.project_status && (
                  <p className="panel-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColor }}
                    />
                    <span className="status-text">{project.project_status}</span>
                  </p>
                )}
              </div>
            </div>

            {project.projectsCategory && (
              <div className="panel-category">
                <span className="category-label">Category :</span>
                <span className="category-value">
                  {formatCategory(project.projectsCategory)}
                </span>
              </div>
            )}

            {project.category && (
              <div className="panel-category">
                <span className="category-label">Services :</span>
                <span className="category-value">
                  {formatCategory(project.category)}
                </span>
              </div>
            )}

            {project.completion_date && (
              <div className="panel-completion">
                <span className="completion-label">Completion Date:</span>
                <span className="completion-value">
                  {new Date(project.completion_date).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            )}

            {project.description && (
              <div className="panel-description">
                <p>{project.description}</p>
              </div>
            )}

            {project.quick_links && project.quick_links.length > 0 && (
              <div className="panel-links">
                <h4>Quick Links</h4>
                <ul>
                  {project.quick_links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="py-4 d-flex align-itemem-center justify-end">
              {project.location && (
                <p className="panel-location">
                  📍 {project.location}
                  {!project.location.includes("Vasai") &&
                    !project.location.includes("Virar") &&
                    !project.location.includes("Mumbai") &&
                    ", Mumbai"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ProjectSlidePanel.displayName = "ProjectSlidePanel";

// ============================================================
// LOADING SKELETON
// ============================================================

const LoadingSkeleton = React.memo(() => (
  <section
    className="mumbai-map-section"
    aria-label="Loading project locations"
  >
    <div className="mumbai-map-loading">
      <div className="loading-spinner" aria-hidden="true" />
      <p>Loading project locations...</p>
    </div>
  </section>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// ============================================================
// ERROR STATE
// ============================================================

const ErrorState = React.memo(({ error, onRetry }) => (
  <section
    className="mumbai-map-section"
    aria-label="Error loading project locations"
  >
    <div className="mumbai-map-error">
      <p>{error}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  </section>
));

ErrorState.displayName = "ErrorState";

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = React.memo(({ onRetry }) => (
  <section className="mumbai-map-section" aria-label="No projects found">
    <div className="mumbai-map-error">
      <p>No projects found with valid coordinates.</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  </section>
));

EmptyState.displayName = "EmptyState";

// ============================================================
// CUSTOM HOOKS
// ============================================================

function useAudio() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/audio/computer-mouse-click-2.mp3");
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  return playAudio;
}

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const geocodeWithNominatim = useCallback(async (location) => {
    if (!location?.trim()) return null;
    try {
      const response = await fetch(
        `/api/geocode?location=${encodeURIComponent(location)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      if (!isValidCoordinate(data?.lat, data?.lng)) return null;
      if (!isWithinMumbaiBounds(data.lat, data.lng)) return null;
      return {
        lat: Number(data.lat),
        lng: Number(data.lng),
        source: "nominatim",
      };
    } catch (error) {
      console.warn("Nominatim failed:", location, error);
      return null;
    }
  }, []);

  const resolveApiProjectCoordinates = useCallback(
    async (project) => {
      const apiCoordinates = getApiCoordinates(project);
      if (apiCoordinates) return apiCoordinates;

      if (project.location) {
        const loc = normalizeLocation(project.location);
        const excludedAreas = [
          "navi mumbai",
          "thane",
          "panvel",
          "uran",
          "alibag",
          "khopoli",
          "karjat",
          "badlapur",
          "ambarnath",
          "ulhasnagar",
          "dombivli",
          "kalyan",
          "bhiwandi",
        ];
        for (const excluded of excludedAreas) {
          if (loc.includes(excluded)) {
            return null;
          }
        }
      }

      const nominatimCoordinates = await geocodeWithNominatim(project.location);
      if (nominatimCoordinates) return nominatimCoordinates;

      const fallbackCoordinates = getFallbackCoordinates(project.location);
      if (fallbackCoordinates) return fallbackCoordinates;

      return null;
    },
    [geocodeWithNominatim]
  );

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/projects/`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API error ${response.status}`);
        }

        const result = await response.json();
        const apiProjects = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.projects)
              ? result.projects
              : [];

        const featuredProjects = apiProjects.filter(
          (project) => project.is_featured === true
        );

        const projectsWithCoords = [];

        for (const project of featuredProjects) {
          if (cancelled) return;

          const baseProject = {
            ...project,
            lat: project.latitude ?? project.lat ?? null,
            lng: project.longitude ?? project.long ?? project.lng ?? null,
            long: project.longitude ?? project.long ?? project.lng ?? null,
            coordinate_source: null,
            is_manual: false,
            is_geocoded: false,
            is_fallback: false,
            quick_links: project.quick_links || [],
            description: project.description || "",
          };

          const hasApiCoords =
            isValidCoordinate(baseProject.lat, baseProject.lng) &&
            isWithinMumbaiBounds(baseProject.lat, baseProject.lng);

          if (hasApiCoords) {
            baseProject.coordinate_source = "api";
            projectsWithCoords.push(baseProject);
          } else {
            const resolvedCoords = await resolveApiProjectCoordinates(project);
            if (resolvedCoords) {
              baseProject.lat = resolvedCoords.lat;
              baseProject.lng = resolvedCoords.lng;
              baseProject.long = resolvedCoords.lng;
              baseProject.coordinate_source = resolvedCoords.source;
              baseProject.is_geocoded = resolvedCoords.source === "nominatim";
              baseProject.is_fallback = resolvedCoords.source === "fallback";
              projectsWithCoords.push(baseProject);
            } else {
              console.warn("Featured project has no coordinates:", {
                id: project.id,
                location: project.location,
                client: project.client_name,
              });
            }
          }
        }

        if (cancelled) return;

        setProjects(projectsWithCoords);

        if (projectsWithCoords.length === 0) {
          setError("No featured projects found in Mumbai area.");
        } else {
          setError(null);
        }
      } catch (error) {
        console.error("Failed loading API projects:", error);
        if (!cancelled) {
          setProjects([]);
          setError(`Failed to load featured projects: ${error.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [resolveApiProjectCoordinates, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { projects, loading, error, setError, retry };
}

// ============================================================
// GOOGLE MAPS MARKER COMPONENT
// ============================================================

const GoogleProjectMarker = React.memo(({ project, isSelected, onSelect }) => {
  const handleClick = useCallback(
    (e) => {
      if (e && e.domEvent) {
        if (typeof e.domEvent.stopPropagation === "function") {
          e.domEvent.stopPropagation();
        }
        if (typeof e.domEvent.preventDefault === "function") {
          e.domEvent.preventDefault();
        }
      } else if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }

      onSelect(project, e);
    },
    [project, onSelect]
  );

  if (!project || !isValidCoordinate(project.lat, project.lng)) return null;
  if (!isWithinMumbaiBounds(project.lat, project.lng)) return null;

  const icon = createGoogleMarkerIcon(isSelected, project);
  const position = {
    lat: Number(project.lat),
    lng: Number(project.lng),
  };

  return (
    <Marker
      position={position}
      icon={icon}
      onClick={handleClick}
      zIndex={isSelected ? 1000 : 0}
      cursor="pointer"
      clickable={true}
      title={project.client_name}
      options={{
        clickable: true,
        draggable: false,
        optimized: true,
        animation: undefined,
      }}
    />
  );
});

GoogleProjectMarker.displayName = "GoogleProjectMarker";

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MumbaiMapClient() {
  const { projects, loading, error, retry } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const isFilterInitialized = useRef(false);
  const selectedProjectIdRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const initialFocusDone = useRef(false);

  const playAudio = useAudio();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    retries: 3,
  });

  // Initialize filtered projects when projects load
  useEffect(() => {
    if (projects.length > 0 && !isFilterInitialized.current) {
      setFilteredProjects(projects);
      isFilterInitialized.current = true;
    }
  }, [projects]);

  // Handle filter changes from SearchFilter
  const handleFilterChange = useCallback((filtered) => {
    setFilteredProjects(filtered);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      selectedProjectIdRef.current = null;
    };
  }, []);

  // Map load handler
  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  // Initial map focus
  useEffect(() => {
    if (!mapInstance || initialFocusDone.current) return;

    const timeoutId = setTimeout(() => {
      mapInstance.panTo(MAP_CONFIG.center);
      mapInstance.setZoom(MAP_CONFIG.initialZoom);
      initialFocusDone.current = true;
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mapInstance]);

  // Center map on selected project
  const centerOnProject = useCallback(
    (project) => {
      if (
        !mapInstance ||
        !project ||
        !isValidCoordinate(project.lat, project.lng)
      )
        return;

      setIsAnimating(true);
      setIsZoomDisabled(true);

      const lat = Number(project.lat);
      const lng = Number(project.lng);
      const offsetLat = lat - 0.003;

      mapInstance.panTo({ lat: offsetLat, lng: lng });
      mapInstance.setZoom(MAP_CONFIG.projectZoom);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(
        () => {
          setIsZoomDisabled(false);
          setIsAnimating(false);
          animationTimeoutRef.current = null;
        },
        MAP_CONFIG.projectAnimationDuration * 1000 + 100
      );
    },
    [mapInstance]
  );

  // Reset map view
  const resetMapView = useCallback(() => {
    if (!mapInstance) return;

    setIsAnimating(true);
    setIsZoomDisabled(true);

    mapInstance.panTo(MAP_CONFIG.center);
    mapInstance.setZoom(MAP_CONFIG.resetZoom);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(
      () => {
        setIsZoomDisabled(false);
        setIsAnimating(false);
        setIsClosing(false);
        selectedProjectIdRef.current = null;
        setSelectedProject(null);
        setIsPanelOpen(false);
        animationTimeoutRef.current = null;
      },
      MAP_CONFIG.resetAnimationDuration * 1000 + 100
    );
  }, [mapInstance]);

  // Select project handler
  const selectProject = useCallback(
    (project, event) => {
      if (!project) return;

      const projectId = String(project.id);
      if (selectedProjectIdRef.current === projectId) return;

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      playAudio();
      setIsClosing(false);

      selectedProjectIdRef.current = projectId;
      setSelectedProject(project);
      setIsPanelOpen(true);

      centerOnProject(project);
    },
    [playAudio, centerOnProject]
  );

  // Handle project selection from search
  const handleSelectProjectFromSearch = useCallback(
    (project) => {
      if (project) {
        selectProject(project, null);
      }
    },
    [selectProject]
  );

  // Close project panel
  const closeProject = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    playAudio();

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsPanelOpen(false);
    resetMapView();
  }, [playAudio, isClosing, resetMapView]);

  // Handle map click to close project
  const handleMapClick = useCallback(
    (e) => {
      if (selectedProject && !isAnimating && !isClosing) {
        const target = e.domEvent?.target;
        if (target?.closest?.(".gm-style-marker")) return;
        closeProject();
      }
    },
    [selectedProject, isAnimating, isClosing, closeProject]
  );

  // Memoize map options to prevent unnecessary re-renders
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    fullscreenControlOptions: {
      position: 12,
    },
    minZoom: MAP_CONFIG.minZoom,
    maxZoom: MAP_CONFIG.maxZoom,
    gestureHandling: "greedy",
    restriction: {
      latLngBounds: {
        north: MAP_CONFIG.bounds.north,
        south: MAP_CONFIG.bounds.south,
        east: MAP_CONFIG.bounds.east,
        west: MAP_CONFIG.bounds.west,
      },
      strictBounds: true,
    },
    styles: [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffcba9" }, { visibility: "on" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#FF9A5C" }, { visibility: "on" }],
      },
      {
        featureType: "road",
        elementType: "labels.text",
        stylers: [
          { color: "#c5c5c5" },
          { weight: 2 },
          { visibility: "simplified" },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#333" }, { weight: 2 }],
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }, { weight: 2.5 }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text",
        stylers: [
          { color: "#FFFFFF" },
          { weight: 1.2 },
          { visibility: "simplified" },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#FFFFFF" }, { weight: 1.2 }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }, { weight: 2.5 }],
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit.line",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative.neighborhood",
        elementType: "labels.text",
        stylers: [
          { color: "#FFFFFF" },
          { weight: 1.2 },
          { visibility: "simplified" },
        ],
      },
      {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.fill",
        stylers: [{ color: "#FFFFFF" }, { weight: 1.2 }],
      },
      {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }, { weight: 2.5 }],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "landscape",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#D4E8F0" }],
      },
      {
        featureType: "water",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  }), []);

  // Loading and error states
  if (loadError) {
    return (
      <ErrorState
        error={`Failed to load Google Maps: ${loadError.message}`}
        onRetry={retry}
      />
    );
  }

  if (!isLoaded || loading) {
    return <LoadingSkeleton />;
  }

  if (error && projects.length === 0) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  if (!projects.length) {
    return <EmptyState onRetry={retry} />;
  }

  return (
    <section className="mumbai-map-fullscreen" aria-label="Mumbai project locations">
      <SearchFilter 
        projects={projects}
        onFilterChange={handleFilterChange}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProjectFromSearch}
        isLoading={loading}
        placeholder="Search projects by name, location, category..."
      />

      <div className="mumbai-map-container" data-map-container>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100dvh",
            borderRadius: "0",
          }}
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.initialZoom}
          options={mapOptions}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {filteredProjects.map((project) => {
            if (!isValidCoordinate(project.lat, project.lng)) return null;
            if (!isWithinMumbaiBounds(project.lat, project.lng)) return null;

            return (
              <GoogleProjectMarker
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onSelect={selectProject}
              />
            );
          })}
        </GoogleMap>

        <div className="map-controls-top-right">
          <FullscreenButton />
          <button
            type="button"
            className="mumbai-map-reset"
            onClick={(e) => {
              e.stopPropagation();
              closeProject();
            }}
            aria-label="Reset map view"
            disabled={isAnimating}
          >
            Reset Map
          </button>
        </div>

        <ProjectSlidePanel 
          project={selectedProject}
          isOpen={isPanelOpen}
          onClose={closeProject}
        />
      </div>
    </section>
  );
}