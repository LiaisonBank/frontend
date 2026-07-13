import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import Image from "next/image";

import services from "../../lib/data/servicesList.js";
// Default theme
import '@splidejs/react-splide/css';

// or other themes
import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';

// or only core styles
import '@splidejs/react-splide/css/core';



export default function ServicesSlider() {
  return (
  <Splide
  options={{
    type: "loop",
    perPage: 4,
    perMove: 1,
    gap: "20px",

    arrows: true,
    pagination: false,

    autoplay: true,
    interval: 800,
    speed: 600,
    pauseOnHover: true,
    pauseOnFocus: false,
    resetProgress: false,

    breakpoints: {
      991: {
        perPage: 3,
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
  {services.map((service) => (
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
        <h3>{service.title}</h3>
      </div>
    </SplideSlide>
  ))}
</Splide>
  );
}