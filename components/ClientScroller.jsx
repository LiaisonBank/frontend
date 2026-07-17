"use client";

import { usePathname } from "next/navigation";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { clientImageName } from "@/lib/data/clientImageList";

const ClientScroller = () => {
  const pathname = usePathname();

  const images =
    pathname === "/"
      ? clientImageName.slice(0, 19)
      : clientImageName;
  return (
    <Splide
      options={{
        type: "loop",
        drag: true,
        arrows: false,
        pagination: false,
        perPage: 5,
        gap: "2rem",
        autoWidth: true,
        padding: 0,
        margin: 0,
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
      {images.map((name, index) => (
        <SplideSlide key={index}>
          <div className="client-image-wrapper py-3 px-2">
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