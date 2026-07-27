// AwardP.jsx
// Production-ready Swiper example with API integration
// Install: npm i swiper @fancyapps/ui

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Fancybox } from "@fancyapps/ui";
import { getImageUrl } from "@/lib/utils/getImagehelper";

import "swiper/css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
// import "./AwardP.scss";

export default function AwardP() {
  const galleryRef = useRef(null);
  const swiperRef = useRef(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch awards from API
   */
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/awards`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch awards");
        }
        
        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.success && result.data && result.data.length > 0) {
          // Transform API data
          const apiCertificates = result.data.map((item) => ({
            id: item.id,
            src: getImageUrl(item.file),
            caption: item.title || "Award Certificate",
            description: item.description,
            original: item,
          }));
          
          setCertificates(apiCertificates);
        } else {
          setCertificates([]);
        }
      } catch (err) {
        console.error("Error fetching awards:", err);
        setError(err.message);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  /**
   * Fancybox
   */
  useEffect(() => {
    const container = galleryRef.current;

    if (!container || certificates.length === 0) return;

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
  }, [certificates]);

  // Loading state
  if (loading) {
    return (
      <section className="certificate-section">
        <div className="m-0 p-0">
          <div className="certificate-loading">
            <div className="loading-spinner"></div>
            <p>Loading awards...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error || certificates.length === 0) {
    return (
      <section className="certificate-section">
        <div className="m-0 p-0">
          <div className="certificate-empty">
            <p>No awards available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="certificate-section">
      <div className="m-0 p-0">
        <div ref={galleryRef}>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay]}
            dir="rtl"
            loop={true}
            speed={600}
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
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            autoplay={{
              delay: 1200,
              disableOnInteraction: false,
            }}
            className="certificate-swiper"
          >
            {/* Double the certificates for seamless looping */}
            {[...certificates, ...certificates].map((certificate, index) => (
              <SwiperSlide key={`${certificate.id || certificate.src}-${index}`}>
                <a
                  href={certificate.src}
                  data-fancybox="certificates"
                  data-caption={certificate.caption}
                  className="certificate-link"
                  aria-label={`Open ${certificate.caption}`}
                >
                  <Image
                    src={certificate.src}
                    alt={certificate.caption}
                    width={280}
                    height={396}
                    className="certificate-image"
                    unoptimized={true}
                    loading="lazy"
                  />

                  <div className="certificate-caption">
                    {certificate.caption}
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="col-8 mx-auto text-center d-flex align-items-center justify-content-center">
          <Link href="/awards" className="themeht-btn btn btn-primary btn-lg primary-btn d-flex align-items-center mr-2 mt-4">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}