"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MumbaiMap.scss";

// Constants
const MAP_CENTER = [19.14, 72.93];
const MAP_BOUNDS = [
  [18.8, 72.7],
  [19.5, 73.2],
];
const INITIAL_ZOOM = 11.5;
const RESET_ZOOM = 11.5;
const MIN_ZOOM = 10.5;
const MAX_ZOOM = 18;
const PROJECT_ZOOM = 16;
const PROJECT_ANIMATION_DURATION = 0.65;
const RESET_ANIMATION_DURATION = 0.75;
const PROJECT_CAMERA_OFFSET_Y = 145;
const PROJECT_MARKER_PANE_Z_INDEX = 1300;
const SCROLL_OFFSET = 120;
const SCROLL_DELAY = 450;

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:8000';

// Fallback coordinates for common Mumbai locations
const FALLBACK_COORDINATES = {
  "Mumbai": { lat: 19.0760, long: 72.8777 },
  "Mumbai Central": { lat: 18.9699, long: 72.8195 },
  "Bandra": { lat: 19.0544, long: 72.8398 },
  "Andheri": { lat: 19.1136, long: 72.8697 },
  "Borivali": { lat: 19.2306, long: 72.8561 },
  "Dadar": { lat: 19.0181, long: 72.8434 },
  "Colaba": { lat: 18.9067, long: 72.8144 },
  "Worli": { lat: 19.0169, long: 72.8150 },
  "Juhu": { lat: 19.1075, long: 72.8282 },
  "Powai": { lat: 19.1176, long: 72.9060 },
  "Navi Mumbai": { lat: 19.0330, long: 73.0290 },
  "Thane": { lat: 19.2183, long: 72.9781 },
  "Vasai": { lat: 19.3919, long: 72.8398 },
  "Virar": { lat: 19.4553, long: 72.8154 },
  "Vasai-Virar": { lat: 19.4236, long: 72.8276 },
};

// FIX: Default icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/media/') || imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  return `${API_BASE_URL}/${imagePath}`;
};

// Create custom SVG pin icon
const createCustomPinIcon = (active = false, project = null) => {
  const getInitials = (name) => {
    if (!name) return "P";
    const words = name.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = project?.client_name ? getInitials(project.client_name) : "P";
  
  const statusColor = project?.project_status === "Completed" ? " #16a34a" : 
                      project?.project_status === "In Progress" ? "#f59e0b" : 
                      project?.project_status === "Upcoming" ? "#FFB700" : "#FF6B00";

  const gradientStart = active ? "#FFD600" : "#FFD600";
  const gradientEnd = active ? "#FF2D00" : "#FF4D00";

  return L.divIcon({
    className: "liaison-pin-icon",
    html: `
      <div class="liaison-pin-wrapper">
        <div
          class="custom-pin${active ? " is-active" : ""}"
          style="
            --gradient-start: ${gradientStart};
            --gradient-end: ${gradientEnd};
            --status-color: ${statusColor};
          "
        >
          <svg
            class="location-pin"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="pinGradient_${project?.id || "default"}"
                x1="256"
                y1="0"
                x2="256"
                y2="453"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="${gradientStart}" />
                <stop offset="100%" stop-color="${gradientEnd}" />
              </linearGradient>

              <radialGradient
                id="circleGradient_${project?.id || "default"}"
              >
                <stop offset="0%" stop-color="#FFFDEB" />
                <stop offset="100%" stop-color="#FFF4C4" />
              </radialGradient>
            </defs>

            <!-- Shadow -->
            <ellipse
              cx="256"
              cy="438"
              rx="136"
              ry="74"
              fill="#FFE6A0"
              opacity="0.6"
            />

            <!-- Location Pin -->
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
                C421 73.7 347.3 0 256 0
                Z
              "
              fill="url(#pinGradient_${project?.id || "default"})"
            />

            <!-- Inner Circle -->
            <circle
              cx="256"
              cy="165"
              r="105"
              fill="url(#circleGradient_${project?.id || "default"})"
            />

         
          </svg>

          ${
            project?.project_status
              ? `<span
                  class="pin-status-dot"
                  style="background: ${statusColor}"
                ></span>`
              : ""
          }
        </div>
      </div>
    `,
    iconSize: [42, 52],
    iconAnchor: [21, 52],
    popupAnchor: [0, -52],
  });
};

// Project Marker Pane Component
function ProjectMarkerPane() {
  const map = useMap();

  useEffect(() => {
    let pane = map.getPane("projectMarkerPane");
    if (!pane) {
      pane = map.createPane("projectMarkerPane", map.getPane("overlayPane"));
    }
    if (pane) {
      pane.style.zIndex = String(PROJECT_MARKER_PANE_Z_INDEX);
      pane.style.pointerEvents = "auto";
      pane.style.position = "absolute";
      pane.style.top = "0";
      pane.style.left = "0";
      pane.style.right = "0";
      pane.style.bottom = "0";
    }
  }, [map]);

  return null;
}

// Map Resize Observer
function MapResizeObserver() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    if (!container || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    let frameId = null;
    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(() => {
        map.invalidateSize({ pan: false, animate: false });
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

// Map Controller
function MapController({ controllerRef }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return undefined;

    const controller = {
      select: (project) => {
        if (!project) return;

        const lat = Number(project.lat);
        const lng = Number(project.long || project.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        map.stop();
        const targetPoint = map.project([lat, lng], PROJECT_ZOOM);
        targetPoint.y -= PROJECT_CAMERA_OFFSET_Y;
        const adjustedLatLng = map.unproject(targetPoint, PROJECT_ZOOM);

        map.flyTo(adjustedLatLng, PROJECT_ZOOM, {
          animate: true,
          duration: PROJECT_ANIMATION_DURATION,
          easeLinearity: 0.25,
          noMoveStart: true,
        });
      },
      reset: () => {
        map.stop();
        map.flyTo(MAP_CENTER, RESET_ZOOM, {
          animate: true,
          duration: RESET_ANIMATION_DURATION,
          easeLinearity: 0.25,
          noMoveStart: true,
        });
      },
      stop: () => {
        map.stop();
      },
    };

    controllerRef.current = controller;

    return () => {
      map.stop();
      controllerRef.current = null;
    };
  }, [map, controllerRef]);

  return null;
}

// Map Interaction
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

// Marker Layer - Removed tooltip
function MarkerLayer({ projects, selectedProject, onSelect }) {
   const validProjects = useMemo(() => {
    return projects.filter((project) => {
      const lat = Number(project.latitude);
      const lng = Number(project.longitude);

      return Number.isFinite(lat) && Number.isFinite(lng);
    });
  }, [projects]);
  const map = useMap();
  const markersRef = useRef(new Map());

  useEffect(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return undefined;
    }

    const markerMap = markersRef.current;

    markerMap.forEach((marker) => {
      marker.off();
      map.removeLayer(marker);
    });
    markerMap.clear();

    projects.forEach((project) => {
      if (!project) return;

      const lat = Number(project.lat);
      const lng = Number(project.long || project.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      try {
        const marker = L.marker([lat, lng], {
          icon: createCustomPinIcon(false, project),
          pane: "projectMarkerPane",
          keyboard: true,
          title: project.client_name || project.location || "Project",
          alt: project.client_name || project.location || "Project",
          riseOnHover: false,
          autoPan: false,
          zIndexOffset: 0,
          interactive: true,
        });

        marker.projectData = project;
        marker.addTo(map);

        marker.on("click", (event) => {
          const originalEvent = event?.originalEvent;
          if (originalEvent) {
            L.DomEvent.stopPropagation(originalEvent);
            L.DomEvent.preventDefault(originalEvent);
          }
          onSelect(project);
        });

        markerMap.set(String(project.id || markerMap.size), marker);
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });

    return () => {
      markerMap.forEach((marker) => {
        marker.off();
        map.removeLayer(marker);
      });
      markerMap.clear();
    };
  }, [map, projects, onSelect]);

  useEffect(() => {
    const markerMap = markersRef.current;
    const selectedId = selectedProject ? String(selectedProject.id) : null;

    markerMap.forEach((marker, projectId) => {
      const active = projectId === selectedId;
      const project = marker.projectData;
      marker.setIcon(createCustomPinIcon(active, project));
      marker.setZIndexOffset(active ? 1000 : 0);
    });
  }, [selectedProject]);

  return null;
}

// Selected Project Position Tracker - Fixed with proper cleanup
function SelectedProjectPosition({ project, onPositionChange }) {
  const map = useMap();
  const isMountedRef = useRef(true);
  const frameIdRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!project || !map || !isMountedRef.current) {
      onPositionChange(null);
      return undefined;
    }

    const lat = Number(project.lat);
    const lng = Number(project.long || project.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      onPositionChange(null);
      return undefined;
    }

    const updatePosition = () => {
      // Check if component is still mounted and map exists
      if (!isMountedRef.current || !map || !map.getContainer()) {
        return;
      }

      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }

      frameIdRef.current = requestAnimationFrame(() => {
        frameIdRef.current = null;
        
        try {
          // Check if map is still valid
          if (!map || !map.getContainer()) {
            return;
          }
          
          const point = map.latLngToContainerPoint([lat, lng]);
          if (point && isMountedRef.current) {
            onPositionChange({ x: point.x, y: point.y });
          }
        } catch (error) {
          // Silently handle errors (e.g., map container not found)
          console.debug('Position update error:', error);
        }
      });
    };

    // Initial update
    updatePosition();

    // Bind events
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);
    map.on("resize", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
      map.off("resize", updatePosition);

      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [map, project, onPositionChange]);

  return null;
}

// Custom hook for scrolling to card
function useScrollToCard() {
  const scrollToCard = useCallback((cardElement, offset = SCROLL_OFFSET) => {
    if (!cardElement) return;

    requestAnimationFrame(() => {
      const rect = cardElement.getBoundingClientRect();
      const isBelowViewport = rect.bottom > window.innerHeight;
      const isAboveViewport = rect.top < 0;
      
      const isVisible = !isBelowViewport && !isAboveViewport;

      if (!isVisible) {
        const scrollPosition = window.scrollY + rect.top - offset;
        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    });
  }, []);

  return scrollToCard;
}

// Project Card Component with Arrow pointing down and ref forwarding
const ProjectCard = React.forwardRef(function ProjectCard({ 
  project, 
  isVisible, 
  onClose, 
  position 
}, ref) {
  if (!project) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return ' #16a34a';
      case 'In Progress': return '#f59e0b';
      case 'Upcoming': return '#FFB700';
      default: return '#FF6B00';
    }
  };

  const imageUrl = getImageUrl(project.featured_image);

  return (
    <article
      ref={ref}
      className={`project-info-card ${isVisible ? "is-visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={project.client_name ? `${project.client_name} information` : "Project information"}
      style={position ? { 
        '--card-x': `${position.x}px`,
        '--card-y': `${position.y}px`
      } : {}}
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
          aria-label="Close project information"
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
              style={{ backgroundColor: getStatusColor(project.project_status) }}
            />
            <span className="status-text">{project.project_status}</span>
          </div>
        )}
         {project.date && (
          <div>
          <span className="project-date">{project.completion_date}</span>
          </div>
        )}
       
        {project.location && (
          <div>
          <span className="project-location">{project.location}</span>
          <span className="project-category">{project.category}</span>
          </div>
        )}
         {project.completion_date && (
          <div className="project-completion-date">
            <span>{project.completion_date}</span>
          </div>
        )}

        {project.zone && (
          <span className="project-card-zone">{project.zone}</span>
        )}

        {Number.isFinite(Number(project.lat)) &&
          Number.isFinite(Number(project.long || project.lng)) && (
            <div className="project-card-coordinates">
              📍 {Number(project.lat).toFixed(4)}, {Number(project.long || project.lng).toFixed(4)}
            </div>
          )}
      </div>
    </article>
  );
});

// Main Component
export default function MumbaiMapClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectPosition, setSelectedProjectPosition] = useState(null);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [geocodingStatus, setGeocodingStatus] = useState("");

  const controllerRef = useRef(null);
  const selectedProjectIdRef = useRef(null);
  const pointerAudioRef = useRef(null);
  const cardRef = useRef(null);
  const scrollToCard = useScrollToCard();

  const getFallbackCoordinates = useCallback((location) => {
    if (!location) return null;
    
    for (const [key, coords] of Object.entries(FALLBACK_COORDINATES)) {
      if (location.toLowerCase().includes(key.toLowerCase())) {
        return coords;
      }
    }
    
    return { lat: 19.0760, long: 72.8777 };
  }, []);

  const getLocationCoordinates = useCallback(async (location) => {
    if (!location?.trim()) {
      return null;
    }

    const searchLocation = location.trim();

    try {
      const response = await fetch(
        `/api/geocode?location=${encodeURIComponent(searchLocation)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Geocoding API error (${response.status}):`, errorText);
        
        const fallback = getFallbackCoordinates(searchLocation);
        if (fallback) {
          return {
            location: searchLocation,
            country: "India",
            state: "Maharashtra",
            lat: fallback.lat,
            long: fallback.long,
            isFallback: true,
          };
        }
        return null;
      }

      const data = await response.json();

      console.log("Location:", searchLocation);
      console.log("Coordinates:", data);

      if (
        data?.lat === undefined ||
        data?.long === undefined
      ) {
        const fallback = getFallbackCoordinates(searchLocation);
        if (fallback) {
          return {
            location: searchLocation,
            country: "India",
            state: "Maharashtra",
            lat: fallback.lat,
            long: fallback.long,
            isFallback: true,
          };
        }
        return null;
      }

      return {
        location: searchLocation,
        country: "India",
        state: "Maharashtra",
        lat: Number(data.lat),
        long: Number(data.long),
        isFallback: false,
      };
    } catch (error) {
      console.error(
        "MumbaiMapClient.useCallback[getLocationCoordinates]",
        error
      );
      
      const fallback = getFallbackCoordinates(searchLocation);
      if (fallback) {
        return {
          location: searchLocation,
          country: "India",
          state: "Maharashtra",
          lat: fallback.lat,
          long: fallback.long,
          isFallback: true,
        };
      }
      
      return null;
    }
  }, [getFallbackCoordinates]);

  useEffect(() => {
    const fetchAndGeocodeProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setGeocodingProgress(0);
        setGeocodingStatus("Fetching projects...");

        const apiUrl = `${API_BASE_URL}/api/projects/`;
        console.log("Fetching from:", apiUrl);
        
        const response = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API Response:", data);

        let projectsArray = Array.isArray(data) ? data : data.data || data.projects || [];
        
        if (!Array.isArray(projectsArray)) {
          console.error("Projects data is not an array:", projectsArray);
          setProjects([]);
          setLoading(false);
          return;
        }

        console.log(`Processing ${projectsArray.length} projects...`);
        setGeocodingStatus(`Processing ${projectsArray.length} projects...`);

        const processedProjects = [];
        let completed = 0;
        let geocodedCount = 0;
        let fallbackCount = 0;

        for (const project of projectsArray) {
          const hasCoordinates = (project.lat && project.long) || (project.lat && project.lng);
          
          let coordinates = null;

          if (!hasCoordinates && project.location) {
            setGeocodingStatus(`Geocoding: ${project.client_name || project.location}...`);
            
            coordinates = await getLocationCoordinates(project.location);
            
            if (coordinates) {
              if (coordinates.isFallback) {
                fallbackCount++;
                console.log(`⚠️ Fallback coordinates for ${project.location}:`, coordinates);
              } else {
                geocodedCount++;
                console.log(`✅ Coordinates found for ${project.location}:`, coordinates);
              }
            } else {
              console.warn(`❌ No coordinates found for ${project.location}`);
            }
          }

          const enhancedProject = {
            ...project,
            lat: coordinates?.lat || project.lat || getFallbackCoordinates(project.location || "Mumbai")?.lat || null,
            long: coordinates?.long || coordinates?.lng || project.long || project.lng || getFallbackCoordinates(project.location || "Mumbai")?.long || null,
            lng: coordinates?.long || coordinates?.lng || project.long || project.lng || getFallbackCoordinates(project.location || "Mumbai")?.long || null,
            state: coordinates?.state || project.state || "Maharashtra",
            country: coordinates?.country || project.country || "India",
            isGeocoded: !!coordinates && !coordinates.isFallback,
            isFallback: !coordinates || coordinates.isFallback,
          };

          if (enhancedProject.lat && enhancedProject.long) {
            processedProjects.push(enhancedProject);
            const status = enhancedProject.isGeocoded ? '✅' : '⚠️';
            console.log(`${status} Processed: ${enhancedProject.client_name || enhancedProject.location} -> Lat: ${enhancedProject.lat}, Long: ${enhancedProject.long}`);
          } else {
            console.warn(`❌ No coordinates for: ${enhancedProject.client_name || enhancedProject.location || project.id}`);
          }

          completed++;
          const progress = Math.round((completed / projectsArray.length) * 100);
          setGeocodingProgress(progress);
        }

        console.log(`✅ Processing complete!`);
        console.log(`📊 Summary: ${processedProjects.length} projects with coordinates (${geocodedCount} geocoded, ${fallbackCount} fallback)`);
        console.log("Sample processed project:", processedProjects[0]);
        
        setProjects(processedProjects);
        setGeocodingStatus(`Ready: ${processedProjects.length} projects loaded`);
        setLoading(false);

      } catch (err) {
        console.error("Failed to fetch and geocode projects:", err);
        setError(err.message || "Failed to load projects");
        setProjects([]);
        setLoading(false);
      }
    };

    fetchAndGeocodeProjects();
  }, [getLocationCoordinates, getFallbackCoordinates]);

  useEffect(() => {
    const audio = new Audio("/audio/map-pointer1.mp3");
    audio.preload = "auto";
    pointerAudioRef.current = audio;

    return () => {
      if (pointerAudioRef.current) {
        pointerAudioRef.current.pause();
        pointerAudioRef.current.currentTime = 0;
        pointerAudioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback(() => {
    return new Promise((resolve) => {
      const audio = pointerAudioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        
        audio.play()
          .then(() => {
            setTimeout(() => {
              resolve();
            }, 300);
          })
          .catch(() => {
            resolve();
          });
      } else {
        resolve();
      }
    });
  }, []);

  const selectProject = useCallback(async (project) => {
    if (!project) return;

    const projectId = String(project.id);
    if (selectedProjectIdRef.current === projectId) return;

    await playAudio();
    
    selectedProjectIdRef.current = projectId;
    setSelectedProject(project);
    setSelectedProjectPosition(null);

    requestAnimationFrame(() => {
      controllerRef.current?.select(project);
    });

    setTimeout(() => {
      if (cardRef.current) {
        scrollToCard(cardRef.current);
      }
    }, SCROLL_DELAY);
  }, [playAudio, scrollToCard]);

  const closeProject = useCallback(async () => {
    await playAudio();
    
    selectedProjectIdRef.current = null;
    controllerRef.current?.stop();
    setSelectedProjectPosition(null);
    setSelectedProject(null);

    requestAnimationFrame(() => {
      controllerRef.current?.reset();
    });
  }, [playAudio]);

  const handleMapClick = useCallback(async () => {
    // Only handle map click if a project is selected
    if (!selectedProject) return;
    
    await playAudio();
    selectedProjectIdRef.current = null;
    controllerRef.current?.stop();
    setSelectedProjectPosition(null);
    setSelectedProject(null);

    // Zoom out to original map position
    requestAnimationFrame(() => {
      controllerRef.current?.reset();
    });
  }, [playAudio, selectedProject]);

  const resetMap = useCallback(async () => {
    await playAudio();
    selectedProjectIdRef.current = null;
    controllerRef.current?.stop();
    setSelectedProjectPosition(null);
    setSelectedProject(null);

    requestAnimationFrame(() => {
      controllerRef.current?.reset();
    });
  }, [playAudio]);

  const updateSelectedProjectPosition = useCallback((position) => {
    setSelectedProjectPosition(position);
  }, []);

  if (loading) {
    return (
      <section className="mumbai-map-section" aria-label="Loading Mumbai project locations">
        <div className="mumbai-map-loading">
          <div className="loading-spinner" aria-hidden="true" />
          <p>{geocodingStatus || "Loading project locations..."}</p>
          {geocodingProgress > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${geocodingProgress}%` }}
              />
              <span className="progress-text">{geocodingProgress}%</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mumbai-map-section" aria-label="Error loading Mumbai project locations">
        <div className="mumbai-map-error">
          <p>Failed to load project locations: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="mumbai-map-section" aria-label="No projects found">
        <div className="mumbai-map-error">
          <p>No projects found with valid coordinates</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <section className="mumbai-map-section" aria-label="Mumbai project locations">
      <div className="mumbai-map-container">
        <MapContainer
          center={MAP_CENTER}
          zoom={INITIAL_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          maxBounds={MAP_BOUNDS}
          maxBoundsViscosity={1}
          dragging
          inertia
          inertiaDeceleration={1400}
          inertiaMaxSpeed={1200}
          easeLinearity={0.12}
          scrollWheelZoom
          wheelDebounceTime={40}
          wheelPxPerZoomLevel={100}
          doubleClickZoom
          zoomControl
          keyboard
          attributionControl
          className="mumbai-leaflet-map"
        >
          <ProjectMarkerPane />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            tileSize={256}
            subdomains={["a", "b", "c", "d"]}
          />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            tileSize={256}
            subdomains={["a", "b", "c", "d"]}
            pane="overlayPane"
          />

          <MapResizeObserver />
          <MapController controllerRef={controllerRef} />
          
          <SelectedProjectPosition
            project={selectedProject}
            onPositionChange={updateSelectedProjectPosition}
          />

          <MapInteraction onMapClick={handleMapClick} />

          <MarkerLayer
            projects={projects}
            selectedProject={selectedProject}
            onSelect={selectProject}
          />

          <div className="map-location-badge" aria-label="Map controls">
            <button
              type="button"
              className="mumbai-map-reset"
              onClick={resetMap}
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
            isVisible={true}
            onClose={closeProject}
            position={selectedProjectPosition}
          />
        )}
      </div>
    </section>
  );
}