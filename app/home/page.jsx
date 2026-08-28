"use client";

import { useState, useEffect, useRef } from "react";
import Link from 'next/link'
import Image from 'next/image'
import useBodyClass from '@/components/useBodyClass';
import welcomeImg from "@/assets/images/mahadev_Rupali_Arvind.webp"
import devaImg from "@/assets/images/ceoImg1.jpg"
import ServicesSection from "@/components/ServicesSection";
import ClientScroller from "@/components/ClientScroller"
import useFancybox from '@/components/useFancybox';
import TestimonialSlider from '@/components/TestimonialSlider';
import CertificateGallery from "@/components/awards/page";
import FAQAccordion from "@/components/Faqs/FAQAccordion";
import OurServices from "@/components/OurServices/page";
import HeroMarquee from "@/components/HeroMarquee/HeroMarquee";

const quotes = [
  {
    text: "We believe every business deserves the freedom to grow without being held back by complexity. Our role is to bring the right expertise, guidance, and solutions to every challenge, so businesses can focus on their vision, strengthen their foundations, and move forward with confidence.",
    author: "Mahadev Biradar",
    title: "Founder & CEO, Liaison Bank"
  },
  {
    text: "Our clients are at the heart of everything we do. We don't just provide services; we build lasting relationships based on trust, transparency, and a genuine commitment to their success. When our clients succeed, we succeed.",
    author: "Mahadev Biradar",
    title: "Founder & CEO, Liaison Bank"
  },
  {
    text: "Leadership is not about having all the answers. It's about creating an environment where people feel empowered to find solutions, take ownership, and grow together. A true leader builds trust, inspires confidence, and leads by example.",
    author: "Mahadev Biradar",
    title: "Founder & CEO, Liaison Bank"
  }
];

const Home = () => {
  // Use a ref to track if we're on the client
  const isClientRef = useRef(false);
  
  // Initialize with first quote (0) for SSR, will update on client
  const [currentQuote, setCurrentQuote] = useState(0);
  // Track if we should show the random quote
  const [showRandomQuote, setShowRandomQuote] = useState(false);

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useBodyClass('home');
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
      }
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

  return (
    <>
      <div className="hero-section page-header">
        <div className="inner-header">
          <HeroMarquee />
        </div>
      </div>

      {/* CEO Message Section */}
      <section 
        ref={sectionRef}
        className={`ceo-message-full ${isVisible ? 'in-view' : ''}`}
      >
        <div className="ceo-full-container">
          <div className="ceo-full-grid">

            {/* Left Column - Image */}
            <div className="ceo-full-left">
              <div className="ceo-full-image-wrapper">
                <Image
                  src={devaImg}
                  width={700}
                  height={700}
                  alt="Mahadev Biradar"
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
                    const isActive = showRandomQuote ? index === currentQuote : index === 0;
                    return (
                      <div
                        key={index}
                        className={`ceo-full-quote-item ${isActive ? 'active' : ''}`}
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
                          <Link href="/ceo-profile" className="ceo-full-profile-link">
                            <span>View Profile</span>
                            <svg
                              className="ceo-full-profile-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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

      {/* Rest of your sections */}
      <section className="welcome d-none">
        {/* Welcome section */}
      </section>

      <section className="ourservices">
        <div className="mx-auto py-5 service-list">
          <div className="section-title">
            <h3>Liaisoning and Licensing</h3>
            <h5>We bring our services to multiple sectors and create customised solutions for diverse set of business needs.</h5>
          </div>
          <div className='mx-auto'>
            <OurServices />
          </div>
        </div>
      </section>

      <section className="weprovide d-none">
        {/* We provide section */}
      </section>

      <section className="awardscertification px-0">
        <div className="container-fluid mx-auto py-5 px-0">
          <div className="section-title">
            <h3>Awards & Certifications</h3>
          </div>
          <div ref={fancyboxRef} className="d-flex align-items-center px-0 mx-0">
            <CertificateGallery />
          </div>
        </div>
      </section>

      <section className="ourclients">
        <div className="container-fluid mx-auto px-0 pt-5 pb-4 bg-white">
          <div className="section-title pb-3">
            <h3>Our Latest Clients</h3>
          </div>
          <div>
            <ClientScroller />
          </div>
        </div>
      </section>

      <section className="assistance d-none">
        {/* Assistance section */}
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