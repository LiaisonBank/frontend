"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

const PROJECT_MARKER_PANE = "projectMarkerPane";
const PROJECT_MARKER_PANE_Z_INDEX = 650;

function ProjectMarkerPane() {
  const map = useMap();

  useEffect(() => {
    let pane = map.getPane(PROJECT_MARKER_PANE);

    if (!pane) {
      pane = map.createPane(PROJECT_MARKER_PANE);
    }

    pane.style.zIndex = String(PROJECT_MARKER_PANE_Z_INDEX);
    pane.style.pointerEvents = "auto";
  }, [map]);

  return null;
}

export default ProjectMarkerPane;