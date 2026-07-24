"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils/getImagehelper";

const API_URL = "http://localhost:8000/api/our-clients";

const ClientScroller = () => {
  const pathname = usePathname();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success) {
          setClients(
            pathname === "/" ? result.data.slice(0, 19) : result.data
          );
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [pathname]);

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
      {clients.map((client) => (
        <SplideSlide key={client.id}>
          <div className="client-image-wrapper py-3 px-2">
            <Image
              src={getImageUrl(client.logo)}
              alt={client.name || "Client"}
              width={175}
              height={125}
              unoptimized
            />
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default ClientScroller;