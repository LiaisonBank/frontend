"use client";

import { useEffect, useRef } from "react";
import Link from 'next/link'

import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";

import { certificateList } from "@/lib/data/certificateList";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function AwardP() {
   const galleryRef = useRef(null);

  useEffect(() => {
    const container = galleryRef.current;

    if (!container) return;

    Fancybox.bind(
      container,
      '[data-fancybox="certificates"]',
      {
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
            middle: [
              "zoomIn",
              "zoomOut",
              "toggle1to1",
            ],
            right: [
              "slideshow",
              "fullscreen",
              "close",
            ],
          },
        },
      }
    );

    return () => {
      Fancybox.unbind(container);
      Fancybox.close();
    };
  }, []);

  if (!certificateList?.length) {
    return null;
  }

  return (
    <section
      className="certificate-section"
      aria-labelledby="certificates-heading"
    >
      <div className="container">
        <div className="row g-4" ref={galleryRef}>
          {certificateList.slice(0, 8).map((certificate, index) => (
            <div
              className="col-12 col-sm-6 col-md-6 col-lg-3"
              key={certificate.src}
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              <article className="certificate-card">
                <a
                  href={certificate.src}
                  data-fancybox="certificates"
                  data-caption={certificate.caption}
                  className="certificate-link"
                  aria-label={`Open ${certificate.caption}`}
                >
                  <div className="certificate-image-wrapper">
                    <Image
                      src={certificate.src}
                      alt={certificate.caption}
                      width={600}
                      height={850}
                      className="certificate-image"
                      loading="lazy"
                      sizes="
                        (max-width: 576px) 50vw,
                        (max-width: 991px) 33vw,
                        25vw
                      "
                    />
                  </div>

                  <div className="certificate-caption">
                    {certificate.caption}
                  </div>
                </a>
              </article>
            </div>
          ))}
        </div>
        <div className="col-8  mx-auto text-center d-flex align-items-center justify-content-center" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="900">
            <Link href="/awards" scroll={true} className="themeht-btn btn btn-primary btn-lg primary-btn d-flex align-items-center mr-2 mt-4">
            View More &nbsp;&nbsp;&nbsp;
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                className="bi bi-arrow-right"
                viewBox="0 0 16 16"
            >
                <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
            </svg>
            </Link>
        </div>
      </div>
    </section>
  );
}