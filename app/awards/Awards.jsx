"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";

import { certificateList } from "@/lib/data/certificateList";
import useBodyClass from "@/components/useBodyClass";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

/**
 * Fisher-Yates Shuffle
 * Returns a new shuffled array without mutating the original array.
 */
const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export default function AwardPage() {
  useBodyClass("awards-recognition");

  const galleryRef = useRef(null);

  const [animateCards, setAnimateCards] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [mounted, setMounted] = useState(false);

  /**
   * Shuffle only after hydration.
   * Prevents SSR hydration mismatch.
   */
  useEffect(() => {
    setCertificates(shuffleArray(certificateList));
    setMounted(true);
  }, []);

  /**
   * Fancybox
   */
  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted]);

  /**
   * Animate cards on scroll
   */
  useEffect(() => {
    if (!mounted) return;

    const container = galleryRef.current;

    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateCards(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [mounted]);

  /**
   * Prevent hydration mismatch
   */
  if (!mounted) {
    return null;
  }

  /**
   * Empty state
   */
  if (!certificates.length) {
    return null;
  }

  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Awards and Certifications</h1>

                    <nav
                      aria-label="breadcrumb"
                      className="page-breadcrumb"
                    >
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i
                              className="bi bi-house-door me-1"
                              aria-hidden="true"
                            />
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Awards &amp; Certifications
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        className="certificate-section"
        aria-labelledby="certificates-heading"
      >
        <div className="container">
          <div
            className="certificate-masonry"
            ref={galleryRef}
          >
            {certificates.map((certificate, index) => (
              <article
                key={`${certificate.src}-${index}`}
                className={`certificate-card certificate-item-wrapper ${
                  animateCards ? "animate" : ""
                }`}
              >
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