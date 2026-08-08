"use client";

import { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";

import "@splidejs/react-splide/css";
import { getImageUrl } from "@/lib/utils/getImagehelper";

export default function ServicesSlider() {
  const [activeCard, setActiveCard] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/homelicensingandliaisoning/`
        );

        const result = await response.json();

        console.log(result);

        if (result.success) {
          setServices(result.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleFlip = (id) => {
    if (window.innerWidth <= 991) {
      setActiveCard((prev) => (prev === id ? null : id));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Splide
      className="services-slider"
      options={{
        type: "loop",
        perPage: 4,
        perMove: 1,
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
      {services.map((service) => (
        <SplideSlide key={service.id}>
          <div
            className={`flip-service-card ${activeCard === service.id ? "is-flipped" : ""
              }`}
            onClick={(e) => {
              e.stopPropagation();
              handleFlip(service.id);
            }}
          >
            <div className="flip-service-wrapper">
              {/* Front */}
              <div className="flip-service-front">
                {service.image ? (
                  <Image
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    width={500}
                    height={650}
                    className="flip-service-image"
                    unoptimized
                  />
                ) : null}

                <div className="flip-service-overlay">
                  <h5>{service.name}</h5>
                </div>
              </div>

              {/* Back */}
              <div className="flip-service-back">
                <div className="flip-service-content">
                  <p>{service.description}</p>
                </div>
              </div>
            </div>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
}