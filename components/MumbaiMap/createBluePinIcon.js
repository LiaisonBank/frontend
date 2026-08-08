// createBluePinIcon.js

import L from "leaflet";

export function createBluePinIcon(active = false) {
  return L.divIcon({
    className: "project-marker-wrapper",
    html: `
      <div class="project-marker ${active ? "is-active" : ""}">
        <span class="project-marker-dot"></span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}