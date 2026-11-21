"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useBodyClass from "@/components/useBodyClass";
import devaImg from "@/assets/images/ceoImg1.webp";
import ClientScroller from "@/components/ClientScroller/ClientScroller";
import useFancybox from "@/components/useFancybox";
import TestimonialSlider from "@/components/Testimonals/TestimonialSlider";
import CertificateGallery from "@/components/awards/page";
import FAQAccordion from "@/components/Faqs/FAQAccordion";
import OurServices from "@/components/OurServices/page";
import HeroSlogan from "@/components/HeroSlogan/HeroSlogan";
import santaImg from "@/assets/images/santa1.png";
// import HeroMarquee from "@/components/HeroMarquee/HeroMarquee";

const quotes = [
  {
    text: "We believe every business deserves the freedom to grow without being held back by complexity. Our role is to bring the right expertise, guidance, and solutions to every challenge, so businesses can focus on their vision, strengthen their foundations, and move forward with confidence.",
    author: "Mahadev Biradar",
    title: "Founder & CEO, Liaison Bank",
  },
  {
    text: "Our clients are at the heart of everything we do. We don't just provide services; we build lasting relationships based on trust, transparency, and a genuine commitment to their success. When our clients succeed, we succeed.",
    author: "Mahadev Biradar",
    title: "Founder & CEO, Liaison Bank",
  },
  {
    text: "Leadership is not about having all the answers. It's about creating an environment where people feel empowered to find solutions, take ownership, and grow together. A true leader builds trust, inspires confidence, and leads by example.",
    author: "Mahadev Biradar",
    title: "Founder & CEO, Liaison Bank",
  },
];

const Home = () => {
  // Use a ref to track if we're on the client
  const isClientRef = useRef(false);

  // Initialize with first quote (0) for SSR, will update on client
  const [currentQuote, setCurrentQuote] = useState(0);
  // Track if we should show the random quote
  const [showRandomQuote, setShowRandomQuote] = useState(false);

  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const ceoInnerRef = useRef(null);

  useBodyClass("home");
  const fancyboxRef = useFancybox({
    Thumbs: false,
  });

  // Handle client-side initialization without cascading renders
  useEffect(() => {
    // Only run once on client mount
    if (!isClientRef.current) {
      isClientRef.current = true;
      // Set random quote after client-side hydration
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(randomIndex);
      // Enable showing random quote
      setShowRandomQuote(true);
    }
  }, []); // Empty dependency array - runs once after mount

  // Scroll detection - triggers only once when section first comes into view
  useEffect(() => {
    let hasTriggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setIsVisible(true);
          hasTriggered = true;
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Keep the CEO panel attached to the viewport on desktop while the
  // transparent Our Services section scrolls upward over it.
  // The CEO remains in normal document flow, so the services section does
  // not jump upward when the pinning starts.
  useEffect(() => {
    let raf = null;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const MOBILE_PARALLAX_SPEED = 0.35;

    const update = () => {
      raf = null;

      const stage = stageRef.current;
      const section = sectionRef.current;
      const inner = ceoInnerRef.current;
      if (!stage || !section || !inner) return;

      // Desktop: pin the complete CEO section by translating it down at
      // exactly the page scroll rate. Its layout space is preserved.
      if (desktopQuery.matches) {
        const stageTop = stage.getBoundingClientRect().top + window.scrollY;

        const availableTravel = Math.max(
          stage.offsetHeight - section.offsetHeight,
          0,
        );

        // Release CEO before the services section finishes.
        const releaseEarlyBy = Math.min(
          Math.max(Math.round(window.innerHeight * 0.08), 64),
          availableTravel * 0.18,
        );

        const maxTravel = Math.max(availableTravel - releaseEarlyBy, 0);

        const travel = Math.min(
          Math.max(window.scrollY - stageTop, 0),
          maxTravel,
        );

        section.style.transform = `translate3d(0, ${travel.toFixed(1)}px, 0)`;

        section.style.transform = `translate3d(0, ${travel.toFixed(1)}px, 0)`;
        inner.style.transform = "";
        return;
      }

      // Tablet/mobile: do not pin the CEO section; preserve normal page flow.
      section.style.transform = "";

      if (reduceMotionQuery.matches) {
        inner.style.transform = "";
        return;
      }

      // Keep the existing subtle inner-content parallax on smaller screens.
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        inner.style.transform = "";
        return;
      }

      const scrolled = Math.max(-rect.top, 0);
      inner.style.transform = `translate3d(0, ${(scrolled * MOBILE_PARALLAX_SPEED).toFixed(1)}px, 0)`;
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (raf) cancelAnimationFrame(raf);

      if (sectionRef.current) sectionRef.current.style.transform = "";
      if (ceoInnerRef.current) ceoInnerRef.current.style.transform = "";
    };
  }, []);

  return (
    <>
      <div className="hero-section page-header">
        <div className="inner-header">
          <HeroSlogan />
        </div>
      </div>

      {/* CEO + Services share one scroll stage so Services can cover the pinned CEO panel. */}
      <div className="ceo-services-stage" ref={stageRef}>
        {/* CEO Message Section */}
        <section
          ref={sectionRef}
          className={`ceo-message-full ${isVisible ? "in-view" : ""}`}
        >
          <div className="ceo-full-container" ref={ceoInnerRef}>
            <div className="ceo-full-grid">
              {/* Left Column - Image */}
              <div className="ceo-full-left">
                <div className="ceo-full-image-wrapper">
                  <Image
                    src={devaImg}
                    width={700}
                    height={700}
                    alt="Mahadev Biradar - Founder & CEO"
                    className="ceo-full-image"
                    priority
                  />
                </div>
              </div>

              {/* Right Column - Quote */}
              <div className="ceo-full-right">
                <div className="ceo-full-content">
                  {/* Name & Title */}
                  <div className="ceo-full-name-wrapper">
                    <h2 className="ceo-full-name">Mahadev Biradar</h2>
                    <p className="ceo-full-title">Founder &amp; CEO</p>
                  </div>

                  {/* Quote Container */}
                  <div className="ceo-full-quote-container">
                    {quotes.map((quote, index) => {
                      // Use showRandomQuote flag to determine which quote to show
                      const isActive = showRandomQuote
                        ? index === currentQuote
                        : index === 0;
                      return (
                        <div
                          key={index}
                          className={`ceo-full-quote-item ${isActive ? "active" : ""}`}
                        >
                          <div className="ceo-full-quote-text">
                            {/* Top-left decoration */}
                            <div className="quote-decoration-top">
                              <span className="quote-symbol">“</span>
                              <span className="quote-line quote-line-horizontal"></span>
                              <span className="quote-line quote-line-vertical"></span>
                            </div>

                            {/* Quote content */}
                            <p className="ceo-full-quote-paragraph">
                              {quote.text}
                            </p>

                            {/* Bottom-right decoration */}
                            <div className="quote-decoration-bottom">
                              <span className="quote-line quote-line-horizontal"></span>
                              <span className="quote-line quote-line-vertical"></span>
                              <span className="quote-symbol">”</span>
                            </div>
                          </div>

                          {/* View Profile Link */}
                          <div className="ceo-full-view-profile">
                            <Link
                              href="/ceo-profile"
                              className="ceo-full-profile-link"
                            >
                              <span>View Profile</span>
                              <svg
                                className="ceo-full-profile-icon"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LIAISONING & LICENSING (CARD + SANTA) ================= */}
        <section className="ourservices">
          <div className="mx-auto py-5 service-list">
            <div className="licensing-card-wrapper">
              <div className="santa-wrap" aria-hidden="true">
                <div className="santa-inner">
                  <Image
                    src={santaImg}
                    width={620}
                    height={620}
                    alt=""
                    className="santa-img"
                  />
                </div>
              </div>

              <div className="licensing-card">
                <div className="licensing-card-body">
                  <div className="section-title">
                    <div className="santa-title-anchor">
                      <h3>Liaisoning and Licensing</h3>
                    </div>
                    <h5>
                      We bring our services to multiple sectors and create
                      customised solutions for diverse set of business needs.
                    </h5>
                  </div>
                  <div className="mx-auto">
                    <OurServices />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* End CEO + Services scroll stage */}

      <section className="awardscertification px-0">
        <div className="container-fluid mx-auto py-5 px-0">
          <div className="section-title">
            <h3>Awards & Certifications</h3>
          </div>
          <div
            ref={fancyboxRef}
            className="d-flex align-items-center px-0 mx-0"
          >
            <CertificateGallery />
          </div>
        </div>
      </section>

      <section className="ourclients">
        <div className="container-fluid mx-auto px-0 pt-5 pb-4 bg-white">
          <div className="section-title pb-3">
            <h3>Our Clients</h3>
          </div>
          <div>
            <ClientScroller />
          </div>
        </div>
      </section>

      <section className="clientfeedback pb-5">
        <div className="container-fluid mx-auto px-0 bg-white">
          <div className="section-title pt-3">
            <h3>What Clients Say</h3>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      <section className="faqs">
        <div className="container-fluid mx-auto py-4 bg-white">
          <div className="section-title">
            <h3>Frequently ask Questions</h3>
          </div>
          <div>
            <FAQAccordion />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
