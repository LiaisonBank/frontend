import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import Image from "next/image";

import servicesList from "../../lib/data/servicesList.js";
// Default theme
import "@splidejs/react-splide/css";

// or other themes
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";

// or only core styles
import "@splidejs/react-splide/css/core";

export default function ServicesSlider() {
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
        interval: 900,
        speed: 600,
        pauseOnHover: true,
        pauseOnFocus: false,
        resetProgress: false,
        breakpoints: {
          1024: {
            perPage: 3,
          },
          991: {
            perPage: 2,
          },
          768: {
            perPage: 2,
          },
          576: {
            perPage: 1,
          },
        },
      }}
    >
      {servicesList.map((service) => (
        <SplideSlide key={service.id}>
          <div className="service-card">
            <div className="service-img">
              <Image
                src={service.img}
                alt={service.title}
                width={400}
                height={250}
                className="service-image"
              />
            </div>
            <div className="service-overlay">
              <div className="service-content">
                <h5>{service.title}</h5>
                <p>Counsel of Architect Registered with {service.title}</p>
                {/* <span>Learn More →</span> */}
              </div>
            </div>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
}
