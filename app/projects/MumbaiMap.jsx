"use client";

import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import mapImage from "@/assets/images/mumbaimap.png";
import ProjectMarker from "./ProjectMarker";

const projects = [
  {
    id: 1,
    name: "Project 1",
    top: "18%",
    left: "42%",
  },
  {
    id: 2,
    name: "Project 2",
    top: "30%",
    left: "58%",
  },
  {
    id: 3,
    name: "Project 3",
    top: "45%",
    left: "35%",
  },
  {
    id: 4,
    name: "Project 4",
    top: "60%",
    left: "52%",
  },
  {
    id: 5,
    name: "Project 5",
    top: "72%",
    left: "47%",
  },
];

const MumbaiMap = () => {
  return (
    <div className="mapWrapper">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit
        limitToBounds={false}
        smooth={true}
        wheel={{
          step: 0.15,
          smoothStep: 0.008,
          wheelDisabled: false,
        }}
        pinch={{
          step: 5,
        }}
        doubleClick={{
          step: 1.5,
          animationTime: 300,
          animationType: "easeOut",
        }}
        zoomAnimation={{
          animationTime: 350,
          animationType: "easeOut",
        }}
        panning={{
          velocityDisabled: false,
          animationTime: 300,
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="zoomControls">
              <button onClick={() => zoomIn(0.3, 300, "easeOut")}>+</button>

              <button onClick={() => zoomOut(0.3, 300, "easeOut")}>−</button>

              <button onClick={() => resetTransform(300, "easeOut")}>⟳</button>
            </div>

            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "650px",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <div className="mapContainer">
                <Image
                  src={mapImage}
                  alt="Mumbai Map"
                  fill
                  priority
                  className="mapImage"
                />

                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="pointer"
                    style={{
                      top: project.top,
                      left: project.left,
                    }}
                  >
                    <ProjectMarker
                      width={20}
                      height={50}
                      topColor="#ff4500"
                      bottomColor="#ffb347"
                    />
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MumbaiMap;
