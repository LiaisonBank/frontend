"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";

import { certificateList } from "@/lib/data/certificateList";
import useBodyClass from "@/components/useBodyClass"; // Adjust path as needed

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function AwardPage() {
  useBodyClass("awards-recognition");
  const galleryRef = useRef(null);
  const [animateCards, setAnimateCards] = useState(false);
  

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
    });

    return () => {
      Fancybox.unbind(container);
      Fancybox.close();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateCards(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
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
                    <h1>Awards and Certifications</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i
                              className="bi bi-house-door me-1"
                              aria-hidden="true"
                            ></i>
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Awards & Certifications
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
        className="certificate-section"
        aria-labelledby="certificates-heading"
      >
        <div className="container">
          <div className="certificate-masonry" ref={galleryRef}>
            {certificateList.map((certificate) => (
              <article className={`certificate-card  certificate-item-wrapper ${animateCards ? 'animate' : ''}`} key={certificate.src}>
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
                      width={700}
                      height={1000}
                      className="certificate-image"
                      loading="lazy"
                      sizes="
                        (max-width:576px) 100vw,
                        (max-width:768px) 50vw,
                        (max-width:1200px) 33vw,
                        25vw
                      "
                    />
                  </div>
                  <div className="certificate-caption">
                    {certificate.caption}
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
