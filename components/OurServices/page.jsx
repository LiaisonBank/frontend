"use client";

import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import servicesList from "@/lib/data/servicesList";

import "@splidejs/react-splide/css";

export default function ServicesSlider() {
  const [activeCard, setActiveCard] = useState(null);

  const handleFlip = (id) => {
    if (window.innerWidth <= 991) {
      setActiveCard((prev) => (prev === id ? null : id));
    }
  };

  return (
    <Splide
      className="services-slider"
      options={{
        type: "loop",
        perPage: 4,
        perMove: 1, // Slides one item at a time
        gap: "20px",
        arrows: true,
        pagination: false,
        autoplay: true,
        interval: 2000,
        

        breakpoints: {
          1199: {
            perPage: 3,
          },
          991: {
            perPage: 2,
          },
          767: {
            perPage: 1,
          },
        },
      }}
    >
      {servicesList.map((service) => (
        <SplideSlide key={service.id}>
          <div
            className={`flip-service-card ${
              activeCard === service.id ? "is-flipped" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleFlip(service.id);
            }}
          >
            <div className="flip-service-wrapper">
              {/* Front */}
              <div className="flip-service-front">
                <Image
                  src={service.img}
                  alt={service.title}
                  width={500}
                  height={650}
                  className="flip-service-image"
                />

                <div className="flip-service-overlay">
                  <h5>{service.title}</h5>
                </div>
              </div>

              {/* Back */}
              <div className="flip-service-back">
                <div className="flip-service-content">
                  {/* <h4>{service.title}</h4> */}
                  <p>{service.desc}</p>
                  {/* <button>Learn More</button> */}
                </div>
              </div>
            </div>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
}