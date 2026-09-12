"use client";
import { useState, useRef, useEffect } from "react";
import useBodyClass from '@/components/useBodyClass';
import OurClients from "@/components/OurClients/OurClients";
import CountUp from "@/hooks/Countup";

export default function ClientLiaisonbankPage() {
  useBodyClass('client');
  const childRef = useRef();
  const sectionRef = useRef(null);   // ← attach to section, not video

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Parallax — update CSS variable on the section
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        section.style.setProperty('--parallax-y', `${scrolled * 0.4}px`);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClientCount = (total) => {
    setCount(total);
    setLoading(false);
    setError(null);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="clients-hero-section"
      >
        <video
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/clients-poster.jpg"
        >
          <source src="/videos/clients-bg.mp4" type="video/mp4" />
          <source src="/videos/clients-bg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        <div className="elementor-background-overlay"></div>

        <div className="hero-content">
          <h1>CLIENTS</h1>

          <div className="stats-grid">
            <div className="stat-item">
              <CountUp end={count} className="total-value"/>
              {/* <span className="stat-number">
                {loading ? "..." : count || "0"}
              </span> */}
              <span className="stat-label">Total Clients</span>
            </div>
          </div>

          {error && (
            <div className="text-center text-danger mb-3">
              <small>⚠️ {error}</small>
            </div>
          )}
        </div>
      </section>

      <section className="py-5 container-fluid p-0 m-0 bg-white position-relative">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="section-title">
              <h3>Every Milestone We Achieve is a Reflection of our Clients Trust.</h3>
            </div>
            <div className="client-section">
              <div className="row justify-content-center text-center">
                <div className="client-grid">
                  <OurClients
                    ref={childRef}
                    onCountChange={handleClientCount}
                    onError={(msg) => {
                      setError(msg);
                      setLoading(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}