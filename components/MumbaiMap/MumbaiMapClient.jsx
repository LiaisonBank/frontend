"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  lazy,
  Suspense,
} from "react";

import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./MumbaiMap.scss";
import Link from "next/link";

// ============================================================
// CONFIGURATION
// ============================================================

const MAP_CONFIG = {
  center: [19.14, 72.93],
  bounds: [
    // [18.8, 72.7],
    // [19.5, 73.2],
    // [18.85, 72.77], // Southwest — South Mumbai / Colaba side
    // [19.55, 73.10], // Northeast — Vasai-Virar / Kharghar side
    [18.82, 72.78], // South-West
    [19.38, 73.15], // North-East
    // [19.10, 72.78], // North-West: Andheri
    // [19.00, 72.88], // South-East: Dadar
    // [19.105, 72.825], // North: Santacruz 
    // [19.025, 72.875], // South: Mahim
  ],
  initialZoom: 11.5,
  resetZoom: 11.5,
  minZoom: 10.5,
  maxZoom: 18,
  projectZoom: 16,
  projectAnimationDuration: 0.65,
  resetAnimationDuration: 0.75,
  projectCameraOffsetY: 145,
  markerPaneZIndex: 1300,
  scrollOffset: 120,
  scrollDelay: 450,
  animationEaseLinearity: 0.5,
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

// ============================================================
// FALLBACK COORDINATES
// ============================================================

const FALLBACK_COORDINATES = {
  Mumbai: { lat: 19.076, long: 72.8777 },
  "Mumbai Central": { lat: 18.9699, long: 72.8195 },
  Bandra: { lat: 19.0544, long: 72.8398 },
  Andheri: { lat: 19.1136, long: 72.8697 },
  Borivali: { lat: 19.2306, long: 72.8561 },
  Dadar: { lat: 19.0181, long: 72.8434 },
  Colaba: { lat: 18.9067, long: 72.8144 },
  Worli: { lat: 19.0169, long: 72.815 },
  Juhu: { lat: 19.1075, long: 72.8282 },
  Powai: { lat: 19.1176, long: 72.906 },
  Mulund: { lat: 19.1726, long: 72.9567 },
  "Navi Mumbai": { lat: 19.033, long: 73.029 },
  Thane: { lat: 19.2183, long: 72.9781 },
  Vasai: { lat: 19.3919, long: 72.8398 },
  Virar: { lat: 19.4553, long: 72.8154 },
  "Vasai-Virar": { lat: 19.4236, long: 72.8276 },
  Panvel: { lat: 18.9894, long: 73.1175 },
  Uran: { lat: 18.8788, long: 72.9392 },
  Alibag: { lat: 18.6414, long: 72.8722 },
};

// ============================================================
// LEAFLET DEFAULT ICON
// ============================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
  return { lat, long: lng, source: "api" };
};

const getFallbackCoordinates = (location) => {
  if (!location) return null;
  const normalizedLocation = normalizeLocation(location);
  for (const [key, coordinates] of Object.entries(FALLBACK_COORDINATES)) {
    const normalizedKey = normalizeLocation(key);
    if (normalizedLocation.includes(normalizedKey)) {
      return {
        lat: coordinates.lat,
        long: coordinates.long,
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
      statusColor: "#FFB700",
      gradientStart: active ? "#FFE066" : "#FFD600",
      gradientEnd: "#FFB700",
      shadowColor: "#FFF3CC",
      strokeColor: "#FFB700",
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
// CUSTOM PIN ICON
// ============================================================

const createCustomPinIcon = (active = false, project = null) => {
  const colors = getStatusColors(project?.project_status, active);
  const uniqueId = `pin_${String(project?.id || "project").replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  )}_${Math.random().toString(36).slice(2, 8)}`;

  return L.divIcon({
    className: `liaison-pin-icon ${active ? "active" : ""}`,
    html: `
      <div class="liaison-pin-wrapper">
        <div
          class="custom-pin ${active ? "is-active" : ""}"
          data-project-id="${project?.id || ""}"
          data-project-source="${project?.coordinate_source || ""}"
          style="
            --gradient-start: ${colors.gradientStart};
            --gradient-end: ${colors.gradientEnd};
            --status-color: ${colors.statusColor};
            --stroke-color: ${colors.strokeColor};
          "
        >
          <svg
            class="location-pin"
            viewBox="0 0 512 512"
            width="42"
            height="52"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="${uniqueId}"
                x1="256"
                y1="0"
                x2="256"
                y2="453"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0%"
                  stop-color="${colors.gradientStart}"
                />
                <stop
                  offset="100%"
                  stop-color="${colors.gradientEnd}"
                />
              </linearGradient>
            </defs>

            <path
              class="pin-outline"
              d="
                M256 0
                C164.7 0 91 73.7 91 165
                C91 226 130 282 170 340
                L244 447
                C249.8 455.3 262.2 455.3 268 447
                L342 340
                C382 282 421 226 421 165
                C421 73.7 347.3 0 256 0 Z
              "
              fill="url(#${uniqueId})"
              stroke="${colors.strokeColor}"
              stroke-width="5"
              stroke-linejoin="round"
            />

            <circle
              cx="256"
              cy="165"
              r="105"
              fill="#FFFDEB"
            />
          </svg>

          <span
            class="pin-status-dot"
            style="background:${colors.statusColor};"
          ></span>
        </div>
      </div>
    `,
    iconSize: [42, 52],
    iconAnchor: [21, 52],
    popupAnchor: [0, -52],
  });
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function ProjectMarkerPane() {
  const map = useMap();

  useEffect(() => {
    let pane = map.getPane("projectMarkerPane");
    if (!pane) {
      pane = map.createPane("projectMarkerPane", map.getPane("markerPane"));
    }
    if (pane) {
      pane.style.zIndex = String(MAP_CONFIG.markerPaneZIndex);
      pane.style.pointerEvents = "auto";
    }
  }, [map]);

  return null;
}

function MapResizeObserver() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    if (!container || typeof ResizeObserver === "undefined") return;

    let frameId = null;
    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(() => {
        try {
          map.invalidateSize({ pan: false, animate: false });
        } catch {
          // Ignore
        }
      });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [map]);

  return null;
}

function MapZoomController({ disabled }) {
  const map = useMap();

  useEffect(() => {
    if (disabled) {
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.keyboard.disable();
    } else {
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.keyboard.enable();
    }
  }, [map, disabled]);

  return null;
}

function MapController({ controllerRef, onZoomStateChange }) {
  const map = useMap();
  const animationRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const controller = {
      select(project) {
        if (!project) return;

        const lat = Number(project.lat);
        const lng = Number(project.long ?? project.lng);

        if (!isValidCoordinate(lat, lng)) return;

        // Stop any ongoing animations
        map.stop();
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }

        // Disable zoom controls
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
        map.keyboard.disable();

        const targetPoint = map.project([lat, lng], MAP_CONFIG.projectZoom);
        targetPoint.y -= MAP_CONFIG.projectCameraOffsetY;

        const adjustedLatLng = map.unproject(targetPoint, MAP_CONFIG.projectZoom);

        map.flyTo(adjustedLatLng, MAP_CONFIG.projectZoom, {
          animate: true,
          duration: MAP_CONFIG.projectAnimationDuration,
          easeLinearity: MAP_CONFIG.animationEaseLinearity,
          noMoveStart: true,
        });

        // Notify zoom state change after animation completes
        animationRef.current = setTimeout(() => {
          onZoomStateChange?.(true);
          animationRef.current = null;
        }, MAP_CONFIG.projectAnimationDuration * 1000 + 100);
      },

      reset() {
        // Stop any ongoing animations
        map.stop();
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }

        // Re-enable zoom controls before animation
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
        map.keyboard.enable();

        map.flyTo(MAP_CONFIG.center, MAP_CONFIG.resetZoom, {
          animate: true,
          duration: MAP_CONFIG.resetAnimationDuration,
          easeLinearity: MAP_CONFIG.animationEaseLinearity,
          noMoveStart: true,
        });

        // Notify zoom state change after animation completes
        animationRef.current = setTimeout(() => {
          onZoomStateChange?.(false);
          animationRef.current = null;
        }, MAP_CONFIG.resetAnimationDuration * 1000 + 100);
      },

      stop() {
        map.stop();
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }
      },
    };

    controllerRef.current = controller;

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      controllerRef.current = null;
    };
  }, [map, controllerRef, onZoomStateChange]);

  return null;
}

function MapInteraction({ onMapClick }) {
  useMapEvents({
    click(event) {
      const target = event.originalEvent?.target;
      if (
        target?.closest?.(".liaison-pin-icon") ||
        target?.closest?.(".custom-pin") ||
        target?.closest?.(".project-info-card")
      ) {
        return;
      }
      onMapClick();
    },
  });

  return null;
}

function MarkerLayer({ projects, selectedProject, onSelect }) {
  const map = useMap();
  const groupRef = useRef(null);
  const markersRef = useRef(new Map());

  // Create marker layer
  useEffect(() => {
    if (!map) return;

    const group = L.layerGroup().addTo(map);
    groupRef.current = group;

    return () => {
      try {
        group.clearLayers();
        if (map.hasLayer(group)) {
          map.removeLayer(group);
        }
      } catch {
        // Ignore cleanup errors
      }
      groupRef.current = null;
      markersRef.current.clear();
    };
  }, [map]);

  // Render markers
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.clearLayers();
    markersRef.current.clear();

    if (!Array.isArray(projects) || projects.length === 0) return;

    projects.forEach((project) => {
      if (!project) return;

      const lat = Number(project.lat);
      const lng = Number(project.long ?? project.lng);

      // Skip only if coordinates are invalid, but still keep the project in the list
      if (!isValidCoordinate(lat, lng)) {
        // Log but don't skip - we'll still show the project without a marker
        console.warn("Project has invalid coordinates:", {
          id: project.id,
          location: project.location,
          lat,
          lng
        });
        return;
      }

      const isSelected =
        selectedProject && String(selectedProject.id) === String(project.id);

      const marker = L.marker([lat, lng], {
        icon: createCustomPinIcon(isSelected, project),
        pane: "projectMarkerPane",
        zIndexOffset: isSelected ? 1000 : 0,
        keyboard: true,
        title: project.client_name || project.location || "Project",
        alt: project.client_name || project.location || "Project",
        interactive: true,
      });

      marker.projectData = project;

      marker.on("click", (event) => {
        if (event?.originalEvent) {
          L.DomEvent.stopPropagation(event.originalEvent);
          L.DomEvent.preventDefault(event.originalEvent);
        }
        onSelect?.(project);
      });

      group.addLayer(marker);
      markersRef.current.set(String(project.id), marker);
    });
  }, [projects, selectedProject, onSelect]);

  // Update marker icons when selection changes
  useEffect(() => {
    if (!groupRef.current) return;

    markersRef.current.forEach((marker, id) => {
      const project = marker.projectData;
      if (!project) return;

      const isSelected =
        selectedProject && String(selectedProject.id) === id;

      marker.setIcon(createCustomPinIcon(isSelected, project));
      marker.setZIndexOffset(isSelected ? 1000 : 0);
    });
  }, [selectedProject]);

  return null;
}

function SelectedProjectPosition({ project, onPositionChange }) {
  const map = useMap();
  const frameRef = useRef(null);
  const positionRef = useRef(null);

  useEffect(() => {
    if (!project) {
      onPositionChange(null);
      return;
    }

    const lat = Number(project.lat);
    const lng = Number(project.long ?? project.lng);

    if (!isValidCoordinate(lat, lng)) {
      onPositionChange(null);
      return;
    }

    const updatePosition = () => {
      if (!map) return;
      try {
        const point = map.latLngToContainerPoint([lat, lng]);
        if (!point) return;

        const newPosition = { x: point.x, y: point.y };
        const oldPosition = positionRef.current;

        // Only update if position changed significantly
        if (
          !oldPosition ||
          Math.abs(oldPosition.x - newPosition.x) > 1 ||
          Math.abs(oldPosition.y - newPosition.y) > 1
        ) {
          positionRef.current = newPosition;
          onPositionChange(newPosition);
        }
      } catch {
        // Ignore
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updatePosition();
      });
    };

    updatePosition();

    map.on("move", scheduleUpdate);
    map.on("zoom", scheduleUpdate);
    map.on("moveend", scheduleUpdate);
    map.on("zoomend", scheduleUpdate);

    return () => {
      map.off("move", scheduleUpdate);
      map.off("zoom", scheduleUpdate);
      map.off("moveend", scheduleUpdate);
      map.off("zoomend", scheduleUpdate);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      positionRef.current = null;
    };
  }, [map, project, onPositionChange]);

  return null;
}

// ============================================================
// PROJECT CARD
// ============================================================

const ProjectCard = React.forwardRef(function ProjectCard(
  { project, onClose, position },
  ref
) { // ✅ ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL RETURNS
  const [showTooltip, setShowTooltip] = useState(false);
  const closeTimeoutRef = useRef(null);
  const isClosingRef = useRef(false);

  // ✅ useEffect called BEFORE conditional return
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  // ✅ useCallback hooks called BEFORE conditional return
  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    isClosingRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(
    (e) => {
      if (isClosingRef.current) return;

      const relatedTarget = e.relatedTarget;
      
      if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        isClosingRef.current = true;

        closeTimeoutRef.current = setTimeout(() => {
          onClose();
          closeTimeoutRef.current = null;
          isClosingRef.current = false;
        }, MAP_CONFIG.cardCloseDelay || 300);
      }
    },
    [onClose]
  );
  if (!project) return null;

  const imageUrl = getImageUrl(project.featured_image);
  const statusColor =
    project.project_status === "Completed"
      ? "#FF6B00"
      : project.project_status === "In Progress"
      ? "#FFB700"
      : "#f59e0b";

  return (
    <article
      ref={ref}
      className="project-info-card is-visible"
      role="dialog"
      aria-modal="true"
      aria-label={
        project.client_name
          ? `${project.client_name} information`
          : "Project information"
      }
      style={
        position
          ? {
              "--card-x": `${position.x}px`,
              "--card-y": `${position.y}px`,
            }
          : {}
      }
    >
      <div className="project-card-arrow-down" />
      <div className="project-card-header">
        {imageUrl && (
          <div
            className="project-card-image"
            style={{ backgroundImage: `url("${imageUrl}")` }}
            role="img"
            aria-label={project.client_name || "Project"}
          />
        )}
        <button
          type="button"
          className="project-card-close"
          onClick={onClose}
          aria-label="Close project"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="project-card-content">
        {project.client_name && (
          <h2 className="project-client-name">{project.client_name}</h2>
        )}
        {project.project_status && (
          <div className="project-status">
            <span
              className="status-indicator"
              style={{ backgroundColor: statusColor }}
            />
            <span className="status-text">{project.project_status}</span>
          </div>
        )}
        {project.location && (
          <div className="project-location-wrapper">
            <span className="project-location">
              {project.location}
              {project.location !== "Navi Mumbai" && ", Mumbai"}
            </span>
            {project.category && (
              <span className="project-category">{project.category}</span>
            )}
          </div>
        )}
        {project.completion_date && (
          <div className="project-completion-date">
            {project.completion_date
              ? new Date(project.completion_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })
              : "-"}
          </div>
        )} 
        <div className="learnmore">
          <div className="tooltip-wrapper">
            <button
              type="button"
              onClick={() => setShowTooltip((prev) => !prev)}
              aria-label="Learn more about this project"
            >
              Learn more
            </button>

            {showTooltip && (
              <div className="custom-tooltip" role="tooltip">
                Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

// ============================================================
// LOADING SKELETON
// ============================================================

const LoadingSkeleton = () => (
  <section
    className="mumbai-map-section"
    aria-label="Loading project locations"
  >
    <div className="mumbai-map-loading">
      <div className="loading-spinner" aria-hidden="true" />
      <p>Loading project locations...</p>
    </div>
  </section>
);

// ============================================================
// ERROR STATE
// ============================================================

const ErrorState = ({ error, onRetry }) => (
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
);

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({ onRetry }) => (
  <section
    className="mumbai-map-section"
    aria-label="No projects found"
  >
    <div className="mumbai-map-error">
      <p>No projects found with valid coordinates.</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  </section>
);

// ============================================================
// CUSTOM HOOKS
// ============================================================

function useScrollToCard() {
  return useCallback((element, offset = MAP_CONFIG.scrollOffset) => {
    if (!element) return;

    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const isBelow = rect.bottom > window.innerHeight;
      const isAbove = rect.top < 0;

      if (isBelow || isAbove) {
        const scrollPosition = window.scrollY + rect.top - offset;
        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    });
  }, []);
}

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
  const [dataSource, setDataSource] = useState("Loading...");

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

      if (!isValidCoordinate(data?.lat, data?.long)) return null;

      return {
        lat: Number(data.lat),
        long: Number(data.long),
        source: "nominatim",
      };
    } catch (error) {
      console.warn("Nominatim failed:", location, error);
      return null;
    }
  }, []);

  const resolveApiProjectCoordinates = useCallback(
    async (project) => {
      // 1. API LATITUDE/LONGITUDE (primary)
      const apiCoordinates = getApiCoordinates(project);
      if (apiCoordinates) return apiCoordinates;

      // 2. NOMINATIM
      const nominatimCoordinates = await geocodeWithNominatim(project.location);
      if (nominatimCoordinates) return nominatimCoordinates;

      // 3. LOCAL FALLBACK
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

        // Process ALL projects without skipping any
        const resolvedApiProjects = [];
        const projectsWithCoords = [];
        const projectsWithoutCoords = [];

        for (const project of apiProjects) {
          if (cancelled) return;

          // Create base project object
          const baseProject = {
            ...project,
            // Normalize coordinate properties
            lat: project.latitude ?? project.lat ?? null,
            long: project.longitude ?? project.long ?? project.lng ?? null,
            lng: project.longitude ?? project.long ?? project.lng ?? null,
            coordinate_source: null,
            is_manual: false,
            is_geocoded: false,
            is_fallback: false,
          };

          // Check if project has valid API coordinates
          const hasApiCoords = isValidCoordinate(baseProject.lat, baseProject.long);

          if (hasApiCoords) {
            // Project has valid coordinates - mark as API source
            baseProject.coordinate_source = "api";
            projectsWithCoords.push(baseProject);
          } else {
            // Project doesn't have API coordinates - try to resolve
            const resolvedCoords = await resolveApiProjectCoordinates(project);
            
            if (resolvedCoords) {
              // Successfully resolved coordinates
              baseProject.lat = resolvedCoords.lat;
              baseProject.long = resolvedCoords.long;
              baseProject.lng = resolvedCoords.long;
              baseProject.coordinate_source = resolvedCoords.source;
              baseProject.is_geocoded = resolvedCoords.source === "nominatim";
              baseProject.is_fallback = resolvedCoords.source === "fallback";
              projectsWithCoords.push(baseProject);
            } else {
              // No coordinates found - still keep the project but without coordinates
              baseProject.coordinate_source = "none";
              projectsWithoutCoords.push(baseProject);
              console.warn("Project has no coordinates:", {
                id: project.id,
                location: project.location,
                client: project.client_name
              });
            }
          }
        }

        if (cancelled) return;

        // Combine ALL projects - projects with coordinates first, then without
        const allProjects = [...projectsWithCoords, ...projectsWithoutCoords];
        
        setProjects(allProjects);
        setDataSource(
          `Total: ${allProjects.length} projects ` +
          `(Coords: ${projectsWithCoords.length}, ` +
          `No Coords: ${projectsWithoutCoords.length})`
        );

        // Only show error if there are no projects at all
        if (allProjects.length === 0) {
          setError("No projects found.");
        } else if (allProjects.length > 0 && projectsWithCoords.length === 0) {
          setError("Projects found but none have valid coordinates.");
        } else {
          setError(null);
        }
      } catch (error) {
        console.error("Failed loading API projects:", error);
        if (!cancelled) {
          setProjects([]);
          setDataSource("API: 0 projects");
          setError(`Failed to load projects: ${error.message}`);
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
  }, [resolveApiProjectCoordinates]);

  return { projects, loading, error, dataSource, setError };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MumbaiMapClient() {
  const { projects, loading, error, dataSource, setError } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectPosition, setSelectedProjectPosition] = useState(null);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const controllerRef = useRef(null);
  const selectedProjectIdRef = useRef(null);
  const cardRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const playAudio = useAudio();
  const scrollToCard = useScrollToCard();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      if (controllerRef.current) {
        controllerRef.current.stop();
      }
      selectedProjectIdRef.current = null;
    };
  }, []);

  // ==========================================================
  // SELECT PROJECT
  // ==========================================================

  const selectProject = useCallback(
    (project) => {
      if (!project) return;

      const projectId = String(project.id);
      if (selectedProjectIdRef.current === projectId) return;

      // Clear any pending close operations
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      playAudio();
      setIsClosing(false);

      selectedProjectIdRef.current = projectId;
      setSelectedProject(project);
      setSelectedProjectPosition(null);
      setIsZoomDisabled(true);

      requestAnimationFrame(() => {
        controllerRef.current?.select(project);
      });

      setTimeout(() => {
        if (cardRef.current) {
          scrollToCard(cardRef.current);
        }
      }, MAP_CONFIG.scrollDelay);
    },
    [playAudio, scrollToCard]
  );

  // ==========================================================
  // CLOSE PROJECT
  // ==========================================================

  const closeProject = useCallback(() => {
    // Prevent multiple close operations
    if (isClosing) return;
    setIsClosing(true);

    playAudio();

    // Clear any pending timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Stop any ongoing animations
    controllerRef.current?.stop();

    // Reset state immediately
    selectedProjectIdRef.current = null;
    setSelectedProject(null);
    setSelectedProjectPosition(null);

    // Reset zoom after a small delay to ensure smooth transition
    closeTimeoutRef.current = setTimeout(() => {
      controllerRef.current?.reset();
      closeTimeoutRef.current = null;
      setIsClosing(false);
    }, 150);
  }, [playAudio, isClosing]);

  // ==========================================================
  // MAP CLICK
  // ==========================================================

  const handleMapClick = useCallback(() => {
    if (!selectedProject || isClosing) return;
    closeProject();
  }, [selectedProject, closeProject, isClosing]);

  // ==========================================================
  // ZOOM STATE CHANGE
  // ==========================================================

  const handleZoomStateChange = useCallback((disabled) => {
    setIsZoomDisabled(disabled);
  }, []);

  // ==========================================================
  // RETRY
  // ==========================================================

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // ==========================================================
  // RENDER STATES
  // ==========================================================

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error && projects.length === 0) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (!projects.length) {
    return <EmptyState onRetry={handleRetry} />;
  }

  // ==========================================================
  // MAIN RENDER
  // ==========================================================

  return (
    <section
      // className="mumbai-map-section"
      className="mumbai-map-fullscreen"
      aria-label="Mumbai project locations"
    >
      <div className="mumbai-map-container">
        <MapContainer
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.initialZoom}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
          maxBounds={MAP_CONFIG.bounds}
          maxBoundsViscosity={1}
          dragging
          inertia
          inertiaDeceleration={1400}
          inertiaMaxSpeed={1200}
          easeLinearity={MAP_CONFIG.animationEaseLinearity}
          scrollWheelZoom={!isZoomDisabled}
          doubleClickZoom={!isZoomDisabled}
          keyboard={!isZoomDisabled}
          wheelDebounceTime={40}
          wheelPxPerZoomLevel={100}
          zoomControl={false}
          attributionControl
          className="mumbai-leaflet-map"
        >
          <ProjectMarkerPane />
          <MapResizeObserver />

         <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={22}
            tileSize={256}
          />

          <MapController
            controllerRef={controllerRef}
            onZoomStateChange={handleZoomStateChange}
          />

          <MapZoomController disabled={isZoomDisabled} />

          <SelectedProjectPosition
            project={selectedProject}
            onPositionChange={setSelectedProjectPosition}
          />

          <MapInteraction onMapClick={handleMapClick} />

          <MarkerLayer
            projects={projects}
            selectedProject={selectedProject}
            onSelect={selectProject}
          />

          <div className="map-location-badge">
            <button
              type="button"
              className="mumbai-map-reset"
              onClick={closeProject}
              aria-label="Reset map view"
            >
              Reset Map
            </button>
          </div>
        </MapContainer>

        {selectedProject && (
          <ProjectCard
            ref={cardRef}
            project={selectedProject}
            onClose={closeProject}
            position={selectedProjectPosition}
          />
        )}
      </div>
    </section>
  );
}