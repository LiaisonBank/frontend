"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import { createBluePinIcon } from "./createBluePinIcon";

const PROJECT_MARKER_PANE = "projectMarkerPane";

function MarkerLayer({ projects = [], selectedProject = null, onSelect }) {
  const map = useMap();
  const markersRef = useRef(new Map());
    
  /*
   * Create / configure marker pane
   */
  useEffect(() => {
    let pane = map.getPane(PROJECT_MARKER_PANE);

    if (!pane) {
      pane = map.createPane(PROJECT_MARKER_PANE);
    }

    pane.style.zIndex = "650";
    pane.style.pointerEvents = "auto";
  }, [map]);

  /*
   * Create markers
   */
  useEffect(() => {
    if (!Array.isArray(projects)) {
      return undefined;
    }

    const markerMap = markersRef.current;

    // Remove existing markers
    markerMap.forEach((marker) => {
      marker.off();
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });

    markerMap.clear();

    projects.forEach((project) => {
      if (!project) {
        return;
      }

      const lat = Number(project.lat);
      const lng = Number(project.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
      }

      const marker = L.marker([lat, lng], {
        icon: createBluePinIcon(false),

        pane: PROJECT_MARKER_PANE,

        keyboard: true,

        title: project.title || project.location || "Project",

        alt: project.title || project.location || "Project",

        riseOnHover: true,

        autoPan: false,

        zIndexOffset: 0,
      });

      marker.on("click", (event) => {
        const originalEvent = event?.originalEvent;

        if (originalEvent) {
          L.DomEvent.stopPropagation(originalEvent);
          L.DomEvent.preventDefault(originalEvent);
        }

        if (typeof onSelect === "function") {
          onSelect(project);
        }
      });

      marker.addTo(map);

      markerMap.set(String(project.id), marker);
    });

    /*
     * Cleanup
     */
    return () => {
      markerMap.forEach((marker) => {
        marker.off();

        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });

      markerMap.clear();
    };
  }, [map, projects, onSelect]);

  /*
   * Update active marker
   */
  useEffect(() => {
    const markerMap = markersRef.current;

    markerMap.forEach((marker, projectId) => {
      const isActive =
        String(selectedProject?.id) === String(projectId);

      marker.setIcon(createBluePinIcon(isActive));

      marker.setZIndexOffset(isActive ? 1000 : 0);
    });
  }, [selectedProject]);

  return null;
}

export default MarkerLayer;