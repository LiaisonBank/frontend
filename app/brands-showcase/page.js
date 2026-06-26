"use client";

import { useEffect, useRef } from "react";
import Link from 'next/link'

import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";

import { certificateList } from "@/lib/data/certificateList";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed


import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function BrandPage() {
useBodyClass('awards-recognition');
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
    <>
      <div className="page-header">
        <div className="inner-header">
          {/* <PageTitleWave /> */}
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Awards and Recognition</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" aria-hidden="true"></i>
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Browse Our Brand
                        </li>
                      </ol>
                    </nav>

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <PageTitleWaveLeft /> */}
        </div>
      </div>
    <section
      className="certificate-section py-5"
      aria-labelledby="certificates-heading"
    >
      <div className="container">
        <div
          className="row g-4"
          ref={galleryRef}
        >
         {certificateList
            .map((certificate) => (
                <div
                className="col-6 col-md-4 col-lg-3"
                key={certificate.src}
                >
                <article className="certificate-card h-100">
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
      </div>
    </section>
    </>
  );
}