"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { clientImageName } from "@/lib/data/clientImageList";

const ClientScroller = () => {
  return (
    <Splide
      options={{
        type: "loop",
        drag: false,
        arrows: false,
        pagination: false,
        perPage: 5,
        gap: "2rem",
        autoWidth: true,
        autoScroll: {
          speed: 1,
          pauseOnHover: true,
          pauseOnFocus: false,
        },
        breakpoints: {
          992: {
            perPage: 4,
          },
          768: {
            perPage: 3,
          },
          576: {
            perPage: 2,
          },
        },
      }}
      extensions={{ AutoScroll }}
    >
      {clientImageName.map((name, index) => (
        <SplideSlide key={index}>
          <div className="client-image-wrapper">
            <Image
              src={`/clients/${name}.webp`}
              alt={name}
              width={175}
              height={125}
            />
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default ClientScroller;