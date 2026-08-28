// MumbaiMapClient.tsx - Complete Single File

"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
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
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// CONFIGURATION - ZOOMED IN ON SANTACRUZ-MAHIM AREA
// ============================================================

const MAP_CONFIG = {
  center: [19.064, 72.848], // Centered between Santacruz and Mahim
  initialZoom: 14.5, // Zoomed in to show the Santacruz-Mahim area
  minZoom: 12, // Prevent zooming out too far - keeps focus on the area
  maxZoom: 18,
  projectZoom: 16,
  projectAnimationDuration: 0.65,
  resetAnimationDuration: 0.75,
  markerPaneZIndex: 1300,
  cardOffsetX: 40,
};

// Restrict map view to Santacruz-Mahim area
const MAP_BOUNDS = [
  [19.03, 72.80], // Southwest (Mahim / Bandra area)
  [19.10, 72.89], // Northeast (Santacruz / Vile Parle area)
];

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
  "Santacruz East": { lat: 19.0857, long: 72.8547 },
  "Santacruz West": { lat: 19.0815, long: 72.8475 },
  "Santacruz": { lat: 19.0835, long: 72.851 },
  "Mahim": { lat: 19.0432, long: 72.8393 },
  "Khar": { lat: 19.0705, long: 72.8398 },
  "Bandra East": { lat: 19.0544, long: 72.8434 },
  "Bandra West": { lat: 19.0584, long: 72.831 },
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
      bg: "rgba(255, 107, 0, 0.15)",
      text: "#FF6B00",
    },
    "In Progress": {
      statusColor: "#FFB700",
      gradientStart: active ? "#FFE066" : "#FFD600",
      gradientEnd: "#FFB700",
      shadowColor: "#FFF3CC",
      strokeColor: "#FFB700",
      bg: "rgba(255, 183, 0, 0.15)",
      text: "#FFB700",
    },
    Upcoming: {
      statusColor: "#FFB700",
      gradientStart: active ? "#FFE066" : "#FFD600",
      gradientEnd: "#FFB700",
      shadowColor: "#FFF3CC",
      strokeColor: "#FFB700",
      bg: "rgba(255, 183, 0, 0.15)",
      text: "#FFB700",
    },
  };
  return colors[status] || colors.Completed;
};

// ============================================================
// CUSTOM PIN ICON - MODERN MINIMALIST
// ============================================================

const createCustomPinIcon = (active = false, project = null, isHovered = false) => {
  const colors = getStatusColors(project?.project_status, active);
  const uniqueId = `pin_${String(project?.id || "project").replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  )}_${Math.random().toString(36).slice(2, 8)}`;

  const size = active ? 48 : isHovered ? 46 : 42;
  const iconSize = [size, size + 12];

  return L.divIcon({
    className: `liaison-pin-icon ${active ? "active" : ""} ${isHovered ? "hovered" : ""}`,
    html: `
      <div class="liaison-pin-wrapper">
        <div
          class="custom-pin ${active ? "is-active" : ""} ${isHovered ? "is-hovered" : ""}"
          data-project-id="${project?.id || ""}"
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
            width="${size}"
            height="${size + 12}"
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
                <stop offset="0%" stop-color="${colors.gradientStart}" />
                <stop offset="100%" stop-color="${colors.gradientEnd}" />
              </linearGradient>
              <filter id="shadow_${uniqueId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="${active ? 8 : 4}" 
                  flood-color="rgba(0,0,0,${active ? 0.4 : 0.2})"/>
              </filter>
            </defs>

            <g filter="url(#shadow_${uniqueId})">
              <path
                class="pin-outline"
                d="M256 0 C164.7 0 91 73.7 91 165 C91 226 130 282 170 340 L244 447 C249.8 455.3 262.2 455.3 268 447 L342 340 C382 282 421 226 421 165 C421 73.7 347.3 0 256 0 Z"
                fill="url(#${uniqueId})"
                stroke="${colors.strokeColor}"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <circle
                cx="256"
                cy="165"
                r="105"
                fill="rgba(255,253,235,0.95)"
                stroke="${colors.strokeColor}"
                stroke-width="2"
              />
              ${active ? `<circle cx="256" cy="165" r="35" fill="${colors.statusColor}" opacity="0.15"/>` : ''}
              <circle
                cx="256"
                cy="165"
                r="${active ? 18 : 12}"
                fill="${colors.statusColor}"
                opacity="${active ? 1 : 0.8}"
              />
              ${active ? `<circle cx="256" cy="165" r="6" fill="#fff" opacity="0.8"/>` : ''}
            </g>
          </svg>
          <span class="pin-status-dot" style="background:${colors.statusColor};"></span>
        </div>
      </div>
    `,
    iconSize: iconSize,
    iconAnchor: [size / 2, size + 12],
    popupAnchor: [0, -(size + 12)],
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

        map.stop();
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }

        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
        map.keyboard.disable();

        const targetPoint = map.project([lat, lng], MAP_CONFIG.projectZoom);
        targetPoint.y -= 120;

        const adjustedLatLng = map.unproject(targetPoint, MAP_CONFIG.projectZoom);

        map.flyTo(adjustedLatLng, MAP_CONFIG.projectZoom, {
          animate: true,
          duration: MAP_CONFIG.projectAnimationDuration,
          easeLinearity: 0.3,
          noMoveStart: true,
        });

        animationRef.current = setTimeout(() => {
          onZoomStateChange?.(true);
          animationRef.current = null;
        }, MAP_CONFIG.projectAnimationDuration * 1000 + 100);
      },

      reset() {
        map.stop();
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }

        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
        map.keyboard.enable();

        map.flyTo(MAP_CONFIG.center, MAP_CONFIG.initialZoom, {
          animate: true,
          duration: MAP_CONFIG.resetAnimationDuration,
          easeLinearity: 0.3,
          noMoveStart: true,
        });

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
        target?.closest?.(".project-info-card") ||
        target?.closest?.(".project-detail-panel")
      ) {
        return;
      }
      onMapClick();
    },
  });

  return null;
}

function MarkerLayer({ projects, selectedProject, onSelect, onHover }) {
  const map = useMap();
  const groupRef = useRef(null);
  const markersRef = useRef(new Map());
  const hoveredIdRef = useRef(null);

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
        // Ignore
      }
      groupRef.current = null;
      markersRef.current.clear();
    };
  }, [map]);

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

      if (!isValidCoordinate(lat, lng)) {
        return;
      }

      const isSelected = selectedProject && String(selectedProject.id) === String(project.id);
      const isHovered = hoveredIdRef.current === String(project.id);

      const marker = L.marker([lat, lng], {
        icon: createCustomPinIcon(isSelected, project, isHovered),
        pane: "projectMarkerPane",
        zIndexOffset: isSelected ? 1000 : isHovered ? 500 : 0,
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

      marker.on("mouseover", () => {
        hoveredIdRef.current = String(project.id);
        onHover?.(project);
      });

      marker.on("mouseout", () => {
        hoveredIdRef.current = null;
        onHover?.(null);
      });

      group.addLayer(marker);
      markersRef.current.set(String(project.id), marker);
    });
  }, [projects, selectedProject, onSelect, onHover]);

  useEffect(() => {
    if (!groupRef.current) return;

    markersRef.current.forEach((marker, id) => {
      const project = marker.projectData;
      if (!project) return;

      const isSelected = selectedProject && String(selectedProject.id) === id;
      const isHovered = hoveredIdRef.current === id;

      marker.setIcon(createCustomPinIcon(isSelected, project, isHovered));
      marker.setZIndexOffset(isSelected ? 1000 : isHovered ? 500 : 0);
    });
  }, [selectedProject]);

  return null;
}

// ============================================================
// PROJECT DETAIL PANEL - LEFT SIDE
// ============================================================

const ProjectDetailPanel = ({ project, onClose, onHover }) => {
  if (!project) return null;

  const imageUrl = getImageUrl(project.featured_image);
  const statusColors = getStatusColors(project.project_status);

  return (
    <motion.div
      className="project-detail-panel"
      initial={{ x: -420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -420, opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <button className="panel-close-btn" onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="panel-content">
        {imageUrl && (
          <div className="panel-image-wrapper">
            <div
              className="panel-image"
              style={{ backgroundImage: `url("${imageUrl}")` }}
            />
            <div className="panel-image-overlay">
              <span className="panel-status-badge" style={{ background: statusColors.statusColor }}>
                {project.project_status || "Status"}
              </span>
            </div>
          </div>
        )}

        <div className="panel-body">
          <h2 className="panel-client-name">{project.client_name || "Project"}</h2>
          
          <div className="panel-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{project.location || "Location"}</span>
          </div>

          {project.category && (
            <div className="panel-category">
              <span className="category-tag">{project.category}</span>
            </div>
          )}

          {project.completion_date && (
            <div className="panel-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>
                {new Date(project.completion_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          <div className="panel-description">
            <p>{project.description || "No description available."}</p>
          </div>

          <button className="panel-learn-more">
            Learn More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// HOVER TOOLTIP
// ============================================================

const HoverTooltip = ({ project, position }) => {
  if (!project || !position) return null;

  return (
    <motion.div
      className="hover-tooltip"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        left: position.x + 16,
        top: position.y - 40,
      }}
    >
      <div className="tooltip-content">
        <span className="tooltip-name">{project.client_name || project.location}</span>
        {project.category && (
          <span className="tooltip-category">{project.category}</span>
        )}
        {project.project_status && (
          <span className="tooltip-status" style={{ 
            background: getStatusColors(project.project_status).statusColor 
          }}>
            {project.project_status}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// LOADING & ERROR STATES
// ============================================================

const LoadingSkeleton = () => (
  <section className="mumbai-map-section" aria-label="Loading project locations">
    <div className="mumbai-map-loading">
      <div className="loading-spinner" />
      <p>Loading project locations...</p>
    </div>
  </section>
);

const ErrorState = ({ error, onRetry }) => (
  <section className="mumbai-map-section" aria-label="Error loading project locations">
    <div className="mumbai-map-error">
      <p>{error}</p>
      <button type="button" onClick={onRetry}>Retry</button>
    </div>
  </section>
);

const EmptyState = ({ onRetry }) => (
  <section className="mumbai-map-section" aria-label="No projects found">
    <div className="mumbai-map-error">
      <p>No projects found with valid coordinates.</p>
      <button type="button" onClick={onRetry}>Retry</button>
    </div>
  </section>
);

// ============================================================
// CUSTOM HOOKS
// ============================================================

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const geocodeWithNominatim = useCallback(async (location) => {
    if (!location?.trim()) return null;

    try {
      const response = await fetch(
        `/api/geocode?location=${encodeURIComponent(location)}`,
        { method: "GET", cache: "no-store" }
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
      const apiCoordinates = getApiCoordinates(project);
      if (apiCoordinates) return apiCoordinates;

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
          headers: { "Content-Type": "application/json" },
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

        const resolvedProjects = [];

        for (const project of apiProjects) {
          if (cancelled) return;

          const baseProject = {
            ...project,
            lat: project.latitude ?? project.lat ?? null,
            long: project.longitude ?? project.long ?? project.lng ?? null,
            lng: project.longitude ?? project.long ?? project.lng ?? null,
            coordinate_source: null,
          };

          const hasApiCoords = isValidCoordinate(baseProject.lat, baseProject.long);

          if (hasApiCoords) {
            baseProject.coordinate_source = "api";
            resolvedProjects.push(baseProject);
          } else {
            const resolvedCoords = await resolveApiProjectCoordinates(project);
            if (resolvedCoords) {
              baseProject.lat = resolvedCoords.lat;
              baseProject.long = resolvedCoords.long;
              baseProject.lng = resolvedCoords.long;
              baseProject.coordinate_source = resolvedCoords.source;
              resolvedProjects.push(baseProject);
            }
          }
        }

        if (cancelled) return;

        setProjects(resolvedProjects);

        if (resolvedProjects.length === 0) {
          setError("No projects found.");
        } else {
          setError(null);
        }
      } catch (error) {
        console.error("Failed loading API projects:", error);
        if (!cancelled) {
          setProjects([]);
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

  return { projects, loading, error, setError };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MumbaiMapClient() {
  const { projects, loading, error, setError } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);
  const [isPanelHovered, setIsPanelHovered] = useState(false);

  const controllerRef = useRef(null);
  const mapRef = useRef(null);

  const selectProject = useCallback(
    (project) => {
      if (!project) return;
      if (selectedProject?.id === project.id) return;

      setSelectedProject(project);
      setIsZoomDisabled(true);

      setTimeout(() => {
        controllerRef.current?.select(project);
      }, 100);
    },
    [selectedProject]
  );

  const closeProject = useCallback(() => {
    if (!selectedProject) return;

    setSelectedProject(null);
    controllerRef.current?.reset();
    setIsZoomDisabled(false);
  }, [selectedProject]);

  const handleHover = useCallback((project) => {
    if (selectedProject) return;
    setHoveredProject(project);
  }, [selectedProject]);

  const handleMapClick = useCallback(() => {
    if (selectedProject && !isPanelHovered) {
      closeProject();
    }
  }, [selectedProject, closeProject, isPanelHovered]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error && projects.length === 0) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (!projects.length) {
    return <EmptyState onRetry={handleRetry} />;
  }

  return (
    <section className="mumbai-map-fullscreen" aria-label="Mumbai project locations">
      <div className="mumbai-map-container">
        <MapContainer
          key="mumbai-map"
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.initialZoom}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
          maxBounds={MAP_BOUNDS}
          maxBoundsViscosity={1}
          dragging
          inertia
          inertiaDeceleration={1400}
          inertiaMaxSpeed={1200}
          scrollWheelZoom={!isZoomDisabled}
          doubleClickZoom={!isZoomDisabled}
          keyboard={!isZoomDisabled}
          zoomControl={false}
          attributionControl={false}
          className="mumbai-leaflet-map"
          ref={mapRef}
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
            onZoomStateChange={setIsZoomDisabled}
          />

          <MapZoomController disabled={isZoomDisabled} />

          <MapInteraction onMapClick={handleMapClick} />

          <MarkerLayer
            projects={projects}
            selectedProject={selectedProject}
            onSelect={selectProject}
            onHover={handleHover}
          />

          <div className="map-controls">
            <button
              type="button"
              className="map-reset-btn"
              onClick={closeProject}
              aria-label="Reset map view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6" />
              </svg>
              Reset View
            </button>
          </div>
        </MapContainer>

        <AnimatePresence>
          {selectedProject && (
            <ProjectDetailPanel
              project={selectedProject}
              onClose={closeProject}
              onHover={setIsPanelHovered}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hoveredProject && !selectedProject && (
            <HoverTooltip
              project={hoveredProject}
              position={hoverPosition}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}