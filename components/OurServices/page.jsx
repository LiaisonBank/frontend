"use client";

import { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import Link from "next/link";

import "@splidejs/react-splide/css";
import { getImageUrl } from "@/lib/utils/getImagehelper";

// Helper to create a URL-friendly slug from text
const createRobustSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(and|the|of)\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
};

export default function ServicesSlider() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/homelicensingandliaisoning/`,
        );
        const result = await response.json();

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
          1199: { perPage: 3 },
          991: { perPage: 2 },
          767: { perPage: 1 },
        },
      }}
    >
      {services.map((service) => {
        // 🔥 DEBUG LOG
        const subcategorySlug = createRobustSlug(service.name);
        const targetUrl = `/our-services/liaisoning?sub=${subcategorySlug}`;

        console.log(
          `🟢 [SLIDER] Original Name: "${service.name}" | Generated Slug: "${subcategorySlug}" | URL: ${targetUrl}`,
        );

        return (
          <SplideSlide key={service.id}>
            <div className="flip-service-card" style={{ position: "relative" }}>
              <Link
                href={targetUrl}
                style={{ position: "absolute", inset: 0, zIndex: 10 }}
                aria-label={`View ${service.name}`}
              />
              <div className="flip-service-wrapper">
                {/* Front */}
                <div className="flip-service-front">
                  {service.image ? (
                    <Image
                      src={getImageUrl(service.image)}
                      alt={service.name}
                      width={500}
                      height={50}
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
        );
      })}
    </Splide>
  );
}
