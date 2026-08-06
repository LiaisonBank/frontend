"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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

import PROJECTS from "@/lib/data/projectImage";

/* =========================================================
   MAP CONFIGURATION
========================================================= */

const MAP_CENTER = [19.14, 72.93];

const MAP_BOUNDS = [
  [18.8, 72.7],
  [19.5, 73.2],
];

const INITIAL_ZOOM = 10.4999;
const RESET_ZOOM = 10.4999;

const MIN_ZOOM = 10;
const MAX_ZOOM = 18;

const PROJECT_ZOOM = 15.5;

const PROJECT_ANIMATION_DURATION = 0.65;
const RESET_ANIMATION_DURATION = 0.75;

/*
 * Extra vertical room above selected marker.
 */
const PROJECT_CAMERA_OFFSET_Y = 145;

const PROJECT_MARKER_PANE_Z_INDEX = 1300;

/* =========================================================
   BLUE MARKER ICON
========================================================= */

const createBluePinIcon = (active = false) =>
  L.divIcon({
    className: "liaison-pin-icon",

    html: `
      <div
        class="liaison-blue-pin${active ? " is-active" : ""}"
        aria-hidden="true"
      >
        <span class="liaison-blue-pin-inner"></span>
      </div>
    `,

    iconSize: [38, 48],
    iconAnchor: [19, 48],
  });

/* =========================================================
   MARKER PANE
========================================================= */

function ProjectMarkerPane() {
  const map = useMap();

  useEffect(() => {
    let pane = map.getPane("projectMarkerPane");

    if (!pane) {
      pane = map.createPane("projectMarkerPane");
    }

    pane.style.zIndex =
      String(PROJECT_MARKER_PANE_Z_INDEX);

    pane.style.pointerEvents = "auto";
  }, [map]);

  return null;
}

/* =========================================================
   MAP RESIZE OBSERVER
========================================================= */

function MapResizeObserver() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    if (
      !container ||
      typeof ResizeObserver === "undefined"
    ) {
      return undefined;
    }

    let frameId = null;

    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        map.invalidateSize({
          pan: false,
          animate: false,
        });
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

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({
  controllerRef,
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return undefined;
    }

    const select = (project) => {
      if (!project) {
        return;
      }

      const lat = Number(project.lat);
      const lng = Number(project.lng);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      map.stop();

      /*
       * Calculate marker position at destination zoom.
       */
      const targetPoint = map.project(
        [lat, lng],
        PROJECT_ZOOM
      );

      /*
       * Move map center upward so the card has
       * enough room above the marker.
       */
      targetPoint.y -=
        PROJECT_CAMERA_OFFSET_Y;

      const adjustedLatLng =
        map.unproject(
          targetPoint,
          PROJECT_ZOOM
        );

      map.flyTo(
        adjustedLatLng,
        PROJECT_ZOOM,
        {
          animate: true,
          duration:
            PROJECT_ANIMATION_DURATION,
          easeLinearity: 0.25,
          noMoveStart: true,
        }
      );
    };

    const reset = () => {
      map.stop();

      map.flyTo(
        MAP_CENTER,
        RESET_ZOOM,
        {
          animate: true,
          duration:
            RESET_ANIMATION_DURATION,
          easeLinearity: 0.25,
          noMoveStart: true,
        }
      );
    };

    const stop = () => {
      map.stop();
    };

    controllerRef.current = {
      select,
      reset,
      stop,
    };

    return () => {
      map.stop();
      controllerRef.current = null;
    };
  }, [map, controllerRef]);

  return null;
}

/* =========================================================
   MAP BACKGROUND CLICK
========================================================= */

function MapInteraction({
  onMapClick,
}) {
  useMapEvents({
    click(event) {
      const target =
        event.originalEvent?.target;

      if (
        target?.closest?.(
          ".liaison-pin-icon"
        ) ||
        target?.closest?.(
          ".liaison-blue-pin"
        )
      ) {
        return;
      }

      if (
        target?.closest?.(
          ".project-info-card"
        )
      ) {
        return;
      }

      onMapClick();
    },
  });

  return null;
}

/* =========================================================
   PROJECT MARKERS
========================================================= */

function MarkerLayer({
  projects,
  selectedProject,
  onSelect,
}) {
  const map = useMap();

  const markersRef = useRef(
    new Map()
  );

  useEffect(() => {
    if (!Array.isArray(projects)) {
      return undefined;
    }

    const markerMap =
      markersRef.current;

    /*
     * Remove previous markers.
     */
    markerMap.forEach((marker) => {
      marker.off();
      map.removeLayer(marker);
    });

    markerMap.clear();

    projects.forEach((project) => {
      if (!project) {
        return;
      }

      const lat = Number(project.lat);
      const lng = Number(project.lng);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      const marker = L.marker(
        [lat, lng],
        {
          icon:
            createBluePinIcon(false),

          pane:
            "projectMarkerPane",

          keyboard: true,

          title:
            project.title ||
            project.location ||
            "Project",

          alt:
            project.title ||
            project.location ||
            "Project",

          riseOnHover: true,

          autoPan: false,

          zIndexOffset: 0,
        }
      );

      marker.addTo(map);

      marker.on(
        "click",
        (event) => {
          const originalEvent =
            event?.originalEvent;

          if (originalEvent) {
            L.DomEvent.stopPropagation(
              originalEvent
            );

            L.DomEvent.preventDefault(
              originalEvent
            );
          }

          onSelect(project);
        }
      );

      markerMap.set(
        String(project.id),
        marker
      );
    });

    return () => {
      markerMap.forEach((marker) => {
        marker.off();
        map.removeLayer(marker);
      });

      markerMap.clear();
    };
  }, [
    map,
    projects,
    onSelect,
  ]);

  /* =======================================================
     ACTIVE MARKER
  ======================================================= */

  useEffect(() => {
    const markerMap =
      markersRef.current;

    markerMap.forEach(
      (marker, projectId) => {
        const active =
          String(
            selectedProject?.id
          ) === String(projectId);

        marker.setIcon(
          createBluePinIcon(active)
        );

        marker.setZIndexOffset(
          active ? 1000 : 0
        );
      }
    );
  }, [selectedProject]);

  return null;
}

/* =========================================================
   SELECTED PROJECT POSITION
========================================================= */

function SelectedProjectPosition({
  project,
  onPositionChange,
}) {
  const map = useMap();

  useEffect(() => {
    if (!project) {
      onPositionChange(null);
      return undefined;
    }

    const lat = Number(project.lat);
    const lng = Number(project.lng);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      onPositionChange(null);
      return undefined;
    }

    let frameId = null;

    const updatePosition = () => {
      if (frameId !== null) {
        return;
      }

      frameId = requestAnimationFrame(() => {
        frameId = null;

        const point =
          map.latLngToContainerPoint([
            lat,
            lng,
          ]);

        onPositionChange({
          x: point.x,
          y: point.y,
        });
      });
    };

    updatePosition();

    map.on("move", updatePosition);
    map.on("zoom", updatePosition);
    map.on("resize", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
      map.off("resize", updatePosition);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [
    map,
    project,
    onPositionChange,
  ]);

  return null;
}

/* =========================================================
   PROJECT CARD
========================================================= */
function ProjectCard({
   project,
  isVisible,
  onClose,
}) {
  if (!project) {
    return null;
  }

  return (
    <article
      className={`project-info-card ${
        isVisible ? "is-visible" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={
        project.title
          ? `${project.title} information`
          : "Project information"
      }
    >
      {/* IMAGE */}
      {project.projectImg && (
        <div
          className="project-card-image"
          style={{
            backgroundImage: `url("${project.projectImg}")`,
          }}
          role="img"
          aria-label={project.title || "Project"}
        />
      )}

      {/* CLOSE */}
      <button
        type="button"
        className="project-card-close"
        onClick={onClose}
        aria-label="Close project information"
      >
        <span aria-hidden="true">×</span>
      </button>

      {/* CONTENT */}
      <div className="project-card-content">
        {project.zone && (
          <span className="project-card-zone">
            {project.zone}
          </span>
        )}

        {project.title && (
          <h2>{project.title}</h2>
        )}

        {project.location && (
          <p>{project.location}</p>
        )}

        {Number.isFinite(Number(project.lat)) &&
          Number.isFinite(Number(project.lng)) && (
            <div className="project-card-coordinates">
              {Number(project.lat).toFixed(4)},{" "}
              {Number(project.lng).toFixed(4)}
            </div>
          )}
      </div>
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MumbaiMapClient() {
  //  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//  useEffect(() => {
//   const fetchProjects = async () => {
//     try {
//       const response = await fetch(
//         "/api/projects/completedProjects",
//         {
//           cache: "no-store",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch projects: ${response.status}`
//         );
//       }

//       const data = await response.json();

//       console.log("Completed Projects:", data);

//       setProjects(data);
//     } catch (error) {
//       console.error("Failed to fetch completed projects:", error);
//     }
//   };

//   fetchProjects();
// }, []);
  /* =======================================================
     REFS
  ======================================================= */

  const controllerRef =
    useRef(null);

  const selectedProjectIdRef =
    useRef(null);

    // Map pointer click audio
const pointerAudioRef = useRef(null);

  /* =======================================================
     STATE
  ======================================================= */

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    selectedProjectPosition,
    setSelectedProjectPosition,
  ] = useState(null);

  /* =======================================================
     PROJECT DATA
  ======================================================= */

  const projects = useMemo(
    () =>
      Array.isArray(PROJECTS)
        ? PROJECTS
        : [],
    []
  );

  /* =======================================================
     POSITION CALLBACK
  ======================================================= */

  const updateSelectedProjectPosition =
    useCallback(
      (position) => {
        setSelectedProjectPosition(
          position
        );
      },
      []
    );

  /* =======================================================
     SELECT PROJECT
  ======================================================= */

const selectProject = useCallback(
  (project) => {
    if (!project) {
      return;
    }

    /*
     * 🔊 Start audio immediately on pointer click
     */
    const audio = pointerAudioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;

      // Don't await this — let audio and card start together
      audio.play().catch((error) => {
        console.warn(
          "Map pointer audio could not play:",
          error
        );
      });
    }

    const projectId = project.id;

    /*
     * Prevent duplicate project selection
     */
    if (
      String(selectedProjectIdRef.current) ===
      String(projectId)
    ) {
      return;
    }

    /*
     * Lock selected project
     */
    selectedProjectIdRef.current = projectId;

    /*
     * 🔥 Open card immediately
     */
    setSelectedProject(project);

    /*
     * Clear previous card position
     */
    setSelectedProjectPosition(null);

    /*
     * Move map after card state has started
     */
    requestAnimationFrame(() => {
      controllerRef.current?.select(project);
    });
  },
  []
);

  /* =======================================================
     CLOSE PROJECT
  ======================================================= */

  const closeProject = useCallback(() => {
  selectedProjectIdRef.current = null;

  // Stop current map animation
  controllerRef.current?.stop();

  // Clear selected project/card
  setSelectedProjectPosition(null);
  setSelectedProject(null);

    // Return map to original position
    requestAnimationFrame(() => {
      controllerRef.current?.reset();
    });
  }, []);

  /* =======================================================
     MAP CLICK
  ======================================================= */

  const handleMapClick =
    useCallback(() => {
      selectedProjectIdRef.current =
        null;

      controllerRef.current?.stop();

      setSelectedProjectPosition(
        null
      );

      setSelectedProject(null);
    }, []);

  /* =======================================================
     RESET MAP
  ======================================================= */

  const resetMap =
    useCallback(() => {
      selectedProjectIdRef.current =
        null;

      controllerRef.current?.stop();

      setSelectedProjectPosition(
        null
      );

      setSelectedProject(null);

      requestAnimationFrame(() => {
        controllerRef.current?.reset();
      });
    }, []);

  /* =======================================================
     RENDER
  ======================================================= */
    useEffect(() => {
  const audio = new Audio("/audio/map-pointer1.mp3");

    audio.preload = "auto";

    pointerAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      pointerAudioRef.current = null;
    };
  }, []);
  return (
    <section
      className="mumbai-map-section"
      aria-label="Mumbai project locations"
    >
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
          {/* =================================================
              MARKER PANE
          ================================================= */}

          <ProjectMarkerPane />

          {/* =================================================
              BASE MAP
          ================================================= */}

          <TileLayer
            attribution="
              &copy; OpenStreetMap contributors
              &copy; CARTO
            "
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            tileSize={256}
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
          />

          {/* =================================================
              LABELS
          ================================================= */}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            tileSize={256}
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            pane="overlayPane"
          />

          {/* =================================================
              RESIZE
          ================================================= */}

          <MapResizeObserver />

          {/* =================================================
              CONTROLLER
          ================================================= */}

          <MapController
            controllerRef={
              controllerRef
            }
          />

          {/* =================================================
              SELECTED MARKER POSITION
          ================================================= */}

          <SelectedProjectPosition
            project={
              selectedProject
            }
            onPositionChange={
              updateSelectedProjectPosition
            }
          />

          {/* =================================================
              MAP CLICK
          ================================================= */}

          <MapInteraction
            onMapClick={
              handleMapClick
            }
          />

          {/* =================================================
              PROJECT MARKERS
          ================================================= */}

          <MarkerLayer
            projects={projects}
            selectedProject={
              selectedProject
            }
            onSelect={
              selectProject
            }
          />

          {/* =================================================
              RESET
          ================================================= */}

          <div
            className="map-location-badge"
            aria-label="Map controls"
          >
            <button
              type="button"
              className="mumbai-map-reset"
              onClick={resetMap}
            >
              RESET
            </button>
          </div>
        </MapContainer>

        {/* =================================================
            PROJECT CARD
        ================================================= */}

       {selectedProject && (
          <div
            className="project-map-overlay is-visible"
            onClick={closeProject}
            aria-hidden="true"
          />
        )}

        {selectedProject && (
          <ProjectCard
            project={selectedProject}
            isVisible={true}
            onClose={closeProject}
          />
        )}
      </div>
    </section>
  );
}