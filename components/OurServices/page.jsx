import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import Image from "next/image";

// Default theme
import '@splidejs/react-splide/css';

// or other themes
import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';

// or only core styles
import '@splidejs/react-splide/css/core';

const services = [
  { id: 1, title: "Food & Beverages", img: "/service-images/F_B.webp", slug: "food-beverages" },
  { id: 2, title: "Health Care", img: "/service-images/H_C.webp", slug: "health-care" },
  { id: 3, title: "Industrial & Manufacturer", img: "/service-images/I_M.webp", slug: "industrial-manufacturer" },
  // { id: 4, title: "Real Estate", img: "/service-images/R_E.webp", slug: "real-estate" },
  // { id: 5, title: "Phonographic Performance Limited", img: "/service-images/ppl.webp", slug: "phonographic-performance" },
  // { id: 6, title: "Brihan Mumbai Municipal Corporation", img: "/service-images/bmc.webp", slug: "bmc" },
  { id: 7, title: "Vasai Virar Municipal Corporation", img: "/service-images/vvmc.webp", slug: "vvmc" },
  { id: 8, title: "Kalyan Dombivali Municipal Corporation", img: "/service-images/kdmc.webp", slug: "kdmc" },
  { id: 9, title: "Thane Municipal Corporation", img: "/service-images/tmc.webp", slug: "thane-municipal-corporation" },
  { id: 10, title: "MHADA Rehabilitation Authority", img: "/service-images/mhada.webp", slug: "mhada" },
  { id: 11, title: "Slum Rehabilitation Authority", img: "/service-images/slum.webp", slug: "sra" },
];

export default function ServicesSlider() {
  return (
    <Splide
      options={{
        type: "loop",
        drag: "free",
        focus: "center",

        arrows: true,
        pagination: false,

        perPage: 2,
        gap: "20px",
        autoWidth: true,

        autoScroll: {
          speed: 0.8,
          pauseOnHover: true,
          pauseOnFocus: false,
        },

        breakpoints: {
          991: {
            perPage: 4,
            autoWidth: false,
          },
          768: {
            perPage: 2,
            autoWidth: false,
          },
          576: {
            perPage: 1,
            autoWidth: false,
          },
        },
      }}
      extensions={{ AutoScroll }}
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
      <div className="splide__arrows">
        <button className="splide__arrow splide__arrow--prev">Prev</button>
        <button className="splide__arrow splide__arrow--next">Next</button>
    </div>
    </Splide>
  );
}