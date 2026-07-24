"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";

import useBodyClass from "@/components/useBodyClass";
import { getImageUrl } from "@/lib/utils/getImagehelper";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function AwardPage() {
  useBodyClass("awards-recognition");

  const galleryRef = useRef(null);

  const [animateCards, setAnimateCards] = useState(false);
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
        const response = await fetch("http://localhost:8000/api/awards/");
        
        if (!response.ok) {
          throw new Error("Failed to fetch awards");
        }
        
        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.success && result.data && result.data.length > 0) {
          // Transform API data to match certificate format
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
          setError("No awards found");
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
   * Always start from top.
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  /**
   * Fancybox
   */
  useEffect(() => {
    if (!galleryRef.current || certificates.length === 0) return;

    Fancybox.bind(galleryRef.current, '[data-fancybox="certificates"]', {
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
      Fancybox.unbind(galleryRef.current);
      Fancybox.close();
    };
  }, [certificates]);

  /**
   * Card animation
   */
  useEffect(() => {
    if (!galleryRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setAnimateCards(true);
        observer.disconnect();
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(galleryRef.current);

    return () => observer.disconnect();
  }, []);

  // Loading state
  if (loading) {
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
                              <i className="bi bi-house-door me-1" />
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
            <div className="certificate-loading">
              <div className="loading-spinner"></div>
              <p>Loading awards...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (error) {
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
                              <i className="bi bi-house-door me-1" />
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
            <div className="certificate-error">
              <p>Failed to load awards. Please try again later.</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Empty state
  if (certificates.length === 0) {
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
                              <i className="bi bi-house-door me-1" />
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
            <div className="certificate-empty">
              <p>No awards available at the moment.</p>
            </div>
          </div>
        </section>
      </>
    );
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
                            <i className="bi bi-house-door me-1" />
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
            ref={galleryRef}
            className="certificate-masonry"
          >
            {certificates.map((certificate, index) => (
              <article
                key={certificate.id || `cert-${index}`}
                className={`certificate-card certificate-item-wrapper ${
                  animateCards ? "animate" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
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
                      sizes="(max-width:576px) 100vw,
                             (max-width:768px) 50vw,
                             (max-width:1200px) 33vw,
                             25vw"
                      unoptimized={true} // ✅ Add this

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