"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

import "./MumbaiMap.scss";

const MAP_WIDTH = 962;
const MAP_HEIGHT = 1635;

const PROJECTS = [
  {
    id: 1,
    name: "Lodha Project",
    location: "Lower Parel",
    category: "Residential",
    x: 335,
    y: 1115,
    description:
      "Strategic liaisoning and licensing support for a premium development.",
  },
  {
    id: 2,
    name: "Bandra Project",
    location: "Bandra West",
    category: "Commercial",
    x: 270,
    y: 875,
    description:
      "Comprehensive statutory approvals and liaisoning support.",
  },
  {
    id: 3,
    name: "Andheri Project",
    location: "Andheri",
    category: "Residential",
    x: 315,
    y: 720,
    description:
      "End-to-end licensing and regulatory coordination.",
  },
  {
    id: 4,
    name: "Powai Project",
    location: "Powai",
    category: "Commercial",
    x: 475,
    y: 590,
    description:
      "Project approval and government liaisoning services.",
  },
  {
    id: 5,
    name: "Thane Project",
    location: "Thane",
    category: "Mixed Use",
    x: 620,
    y: 455,
    description:
      "Regulatory approvals, permissions and liaisoning support.",
  },
];

export default function MumbaiMap() {
  const viewportRef = useRef(null);

  const [activeProject, setActiveProject] = useState(null);
  const [mapSettings, setMapSettings] = useState(null);

  useEffect(() => {
    const calculateMapSettings = () => {
      const viewport = viewportRef.current;

      if (!viewport) return;

      const viewportWidth = viewport.clientWidth;
      const viewportHeight = viewport.clientHeight;

      if (!viewportWidth || !viewportHeight) return;

      /*
       * Calculate scale required to fit the COMPLETE
       * 962 x 1635 map inside the viewport.
       */
      const scaleX = viewportWidth / MAP_WIDTH;
      const scaleY = viewportHeight / MAP_HEIGHT;

      const scale = Math.min(scaleX, scaleY);

      /*
       * Calculate position so the complete map is centered.
       */
      const scaledWidth = MAP_WIDTH * scale;
      const scaledHeight = MAP_HEIGHT * scale;

      const x = (viewportWidth - scaledWidth) / 2;
      const y = (viewportHeight - scaledHeight) / 2;

      setMapSettings({
        scale,
        x,
        y,
      });
    };

    calculateMapSettings();

    const resizeObserver = new ResizeObserver(() => {
      calculateMapSettings();
    });

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!mapSettings) {
    return (
      <section className="mumbai-map-section">
        <div
          ref={viewportRef}
          className="mumbai-map-wrapper"
        />
      </section>
    );
  }

  const handleProjectClick = (project, zoomToElement) => {
    setActiveProject(project);

    zoomToElement(
      `project-marker-${project.id}`,
        2.0,
        700
    );
  };

  return (
    <section className="mumbai-map-section">
      <div
        ref={viewportRef}
        className="mumbai-map-wrapper"
      >
        <TransformWrapper
          initialScale={mapSettings.scale}
          initialPositionX={mapSettings.x}
          initialPositionY={mapSettings.y}
          minScale={mapSettings.scale}
          maxScale={3.5}
          limitToBounds={true}
          centerOnInit={false}
          centerZoomedOut={false}
          alignmentAnimation={{
            disabled: true,
          }}
          velocityAnimation={{
            disabled: true,
          }}
          wheel={{
            step: 0.12,
            smoothStep: 0.01,
          }}
          pinch={{
            step: 5,
          }}
          doubleClick={{
            disabled: true,
          }}
          panning={{
            disabled: false,
            velocityDisabled: true,
          }}
        >
          {({
            zoomToElement,
            zoomIn,
            zoomOut,
            resetTransform,
          }) => (
            <>
              {/* RESET */}
              <div className="map-top-controls">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject(null);

                    resetTransform(500, "easeOut");
                  }}
                >
                  RESET
                </button>
              </div>

              {/* MAP VIEWPORT */}
              <TransformComponent
                wrapperClass="mumbai-map-transform-wrapper"
                contentClass="mumbai-map-transform-content"
              >
                <div
                  className="mumbai-map-canvas"
                  style={{
                    width: `${MAP_WIDTH}px`,
                    height: `${MAP_HEIGHT}px`,
                  }}
                >
                  {/* MAP */}
                  <Image
                    src="/images/mumbai-map.svg"
                    alt="Mumbai map"
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    priority
                    draggable={false}
                    unoptimized
                    className="mumbai-map-image"
                  />

                  {/* PROJECT MARKERS */}
                  <div className="mumbai-project-layer">
                    {PROJECTS.map((project) => (
                      <button
                        key={project.id}
                        id={`project-marker-${project.id}`}
                        type="button"
                        className={`project-marker ${
                          activeProject?.id === project.id
                            ? "is-active"
                            : ""
                        }`}
                        style={{
                          left: `${project.x}px`,
                          top: `${project.y}px`,
                        }}
                        onClick={() =>
                          handleProjectClick(
                            project,
                            zoomToElement,
                            
                          )
                        }
                        aria-label={`View ${project.name}`}
                      >
                        <span className="marker-pulse" />
                        <span className="marker-dot" />
                      </button>
                    ))}
                  </div>
                </div>
              </TransformComponent>

              {/* ZOOM CONTROLS */}
              <div className="map-zoom-controls">
                <button
                  type="button"
                  onClick={() => zoomIn(0.2, 400)}
                  aria-label="Zoom in"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => zoomOut(0.2, 400)}
                  aria-label="Zoom out"
                >
                  −
                </button>
              </div>
            </>
          )}
        </TransformWrapper>

        {/* PROJECT CARD */}
        <div
          className={`project-info-card ${
            activeProject ? "is-visible" : ""
          }`}
        >
          {activeProject && (
            <>
              <button
                type="button"
                className="project-card-close"
                onClick={() => setActiveProject(null)}
                aria-label="Close project"
              >
                ×
              </button>
              <span className="project-category">
                {activeProject.category}
              </span>
              <h3>{activeProject.name}</h3>
              <div className="project-location">
                <span className="location-icon">●</span>
                {activeProject.location}, Mumbai
              </div>
              <p>{activeProject.description}</p>
              <button
                type="button"
                className="project-view-button"
              >
                View Project
                <span>↗</span>
              </button>
            </>
          )}
        </div>

      </div>
    </section>
  );
}