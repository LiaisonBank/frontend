// AwardP.jsx
// Production-ready Swiper example.
// Install: npm i swiper @fancyapps/ui

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Fancybox } from "@fancyapps/ui";
import { certificateList } from "@/lib/data/certificateList";

import "swiper/css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
// import "./AwardP.scss";

export default function AwardP() {
  const galleryRef = useRef(null);
  const swiperRef = useRef(null);
  useEffect(() => {
  const container = galleryRef.current;

  if (!container) return;

  Fancybox.bind(container, '[data-fancybox="certificates"]', {
    animated: true,

    Carousel: {
      infinite: true,
    },

    Thumbs: {
      autoStart: false,
    },

    Toolbar: {
      display: {
        left: [],
        middle: ["zoomIn", "zoomOut", "toggle1to1"],
        right: ["slideshow", "fullscreen", "close"],
      },
    },

    on: {
      reveal: () => {
        swiperRef.current?.autoplay?.stop();
      },

      close: () => {
        swiperRef.current?.autoplay?.start();
      },
    }
  });

  return () => {
    Fancybox.unbind(container);
    Fancybox.close();
  };
}, []);

  return (
    <section className="certificate-section">
      <div className="container">
        <div ref={galleryRef}>
          <Swiper
           onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay]}
            dir="rtl"
            loop={true}
            speed={5000}
            spaceBetween={24}
            grabCursor={true}
            slidesPerView={4}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              576: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}

            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}

            className="certificate-swiper"
          >
            {[...certificateList.slice(0, 8), ...certificateList.slice(0, 8)].map(
            (certificate, index) => (
              <SwiperSlide key={`${certificate.src}-${index}`}>
                <a
                  href={certificate.src}
                  data-fancybox="certificates"
                  data-caption={certificate.caption}
                  className="certificate-link"
                >
                  <Image
                    src={certificate.src}
                    alt={certificate.caption}
                    width={280}
                    height={396}
                    className="certificate-image"
                  />

                  <div className="certificate-caption">
                    {certificate.caption}
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="col-8  mx-auto text-center d-flex align-items-center justify-content-center">
          <Link href="/awards" className="themeht-btn btn btn-primary btn-lg primary-btn d-flex align-items-center mr-2 mt-4">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}