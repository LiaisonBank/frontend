"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  PenTool,
  Target,
  Star,
} from 'lucide-react';
import AuthModal from './AuthModal';
import './career.scss';
import RecruitemtnModal from "./RecruitemtnModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ---------- SERVICE DATA (6 items) ----------
const services = [
  {
    id: 1,
    name: "Liaisoning",
    slug: "liaisoning",
    image: "/commitment.webp",
    description: "____________________________"
  },
  {
    id: 2,
    name: "Licensing",
    slug: "Licensing",
    image: "/LicensingCareer.jpg",
    description: "_______________________________________________"
  },
  {
    id: 3,
    name: "Electrical",
    slug: "Electrical",
    image: "/ElectricalCareer.jpg",
    description: "________________________________________________"
  },
  {
    id: 4,
    name: "Fire",
    slug: "media",
    image: "/FireCareer.jpg",
    description: "____________________________________________"
  },
  {
    id: 5,
    name: "Piped Natural Gas",
    slug: "Piped Natural Gas",
    image: "/pipedNaturalGas.jpg",
    description: "_____________________________________"
  },
  {
    id: 6,
    name: "AMC",
    slug: "AMC",
    image: "/AMCCareer.jpg",
    description: "_______________________________________"
  }
];

export default function CareersLiaisonPage() {
  useBodyClass('careers');

  const [activeService, setActiveService] = useState(services[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const router = useRouter();
  
  // Refs for sections
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroTitleRef = useRef(null);
  const cultureRef = useRef(null);
  const benefitsRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);

  // Hero banner animation - open from zero on load + scroll effects
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state - completely hidden
      gsap.set(heroRef.current, {
        scale: 0,
        opacity: 0,
        borderRadius: "0px",
        transformOrigin: "center center",
      });

      gsap.set(heroContentRef.current, {
        scale: 0,
        opacity: 0,
        y: 0,
      });

      gsap.set(heroTitleRef.current, {
        opacity: 0,
        y: 30,
      });

      // 1. INITIAL LOAD ANIMATION - Open from zero (scale 0 to 1)
      const loadTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2 // Slight delay for dramatic effect
      });

      // Hero container: scale from 0 to 1 with spring effect
      loadTl.to(heroRef.current, {
        scale: 1,
        opacity: 1,
        borderRadius: "0px",
        duration: 1.2,
        ease: "back.out(1.7)",
      })
      // Hero content: scale from 0 to 1 with slight delay
      .to(heroContentRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      }, "-=0.6")
      // Title text: fade in with animation
      .to(heroTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }, "-=0.4");

      // 2. SCROLL ANIMATION - Scale back to 0 from center
      const setupScrollAnimation = () => {
        // Kill any existing scroll triggers
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === heroRef.current) {
            st.kill();
          }
        });

        // Set transform origin to center for scaling from center
        gsap.set(heroRef.current, {
          transformOrigin: "center center",
          scale: 1,
          borderRadius: "0px",
          opacity: 1,
        });

        gsap.set(heroContentRef.current, {
          scale: 1,
          opacity: 1,
          y: 0,
        });

        // Create scroll trigger - scales to 0 from center
        const heroScrollTrigger = ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom -20%",
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = Math.min(self.progress, 1);
            
            // Only apply scroll effects when scrolling
            if (progress > 0) {
              // Hero container: scale from 1 to 0 (center origin)
              const scale = 1 - progress;
              const opacity = 1 - (progress * 0.5);
              const borderRadius = progress * 50;
              
              gsap.set(heroRef.current, {
                scale: Math.max(scale, 0),
                borderRadius: `0px 0px ${borderRadius}px ${borderRadius}px`,
                opacity: Math.max(opacity, 0.5),
                force3D: true,
              });
              
              // Content: scales and moves up
              const contentScale = 1 - (progress * 0.6);
              const contentOpacity = 1 - (progress * 0.7);
              const contentY = -progress * 80;
              
              gsap.set(heroContentRef.current, {
                scale: Math.max(contentScale, 0.4),
                opacity: Math.max(contentOpacity, 0.3),
                y: contentY,
                force3D: true,
              });
            }
          }
        });

        heroRef.current._scrollTrigger = heroScrollTrigger;
      };

      // Setup scroll animation after load completes
      loadTl.eventCallback("onComplete", setupScrollAnimation);

      // Fallback: setup after timeout if callback fails
      setTimeout(setupScrollAnimation, 1500);

    }, heroRef);

    return () => {
      if (heroRef.current && heroRef.current._scrollTrigger) {
        heroRef.current._scrollTrigger.kill();
      }
      ctx.revert();
    };
  }, []);

  // Scroll animations for all sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger after a small delay
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // CULTURE SECTION
      gsap.fromTo(
        cultureRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cultureRef.current,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Culture cards stagger animation
      const cultureCards = cultureRef.current?.querySelectorAll('.culture-card');
      if (cultureCards) {
        gsap.fromTo(
          cultureCards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cultureRef.current,
              start: "top 80%",
              end: "top 30%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // BENEFITS SECTION
      gsap.fromTo(
        benefitsRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Benefits cards stagger animation
      const benefitCards = benefitsRef.current?.querySelectorAll('.benefit-card-wrapper');
      if (benefitCards) {
        gsap.fromTo(
          benefitCards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: "top 80%",
              end: "top 30%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // SERVICES SECTION
      gsap.fromTo(
        servicesRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Services tabs stagger animation
      const tabButtons = servicesRef.current?.querySelectorAll('.tab-btn');
      if (tabButtons) {
        gsap.fromTo(
          tabButtons,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: servicesRef.current,
              start: "top 80%",
              end: "top 30%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Featured service image animation
      const featuredImage = servicesRef.current?.querySelector('.featured-image');
      if (featuredImage) {
        gsap.fromTo(
          featuredImage,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuredImage,
              start: "top 85%",
              end: "top 40%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // CTA SECTION
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // CTA Box animation with scale
      const ctaBox = ctaRef.current?.querySelector('.cta-box');
      if (ctaBox) {
        gsap.fromTo(
          ctaBox,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ctaBox,
              start: "top 85%",
              end: "top 40%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Benefits header animation
      const benefitsHeader = benefitsRef.current?.querySelector('.benefits-header h2');
      if (benefitsHeader) {
        gsap.fromTo(
          benefitsHeader,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: benefitsHeader,
              start: "top 90%",
              end: "top 50%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Section headers animation
      const sectionHeaders = document.querySelectorAll('.section-header');
      sectionHeaders.forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 90%",
              end: "top 50%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      });

    }, []);

    return () => ctx.revert();
  }, []);

  // Refresh ScrollTrigger on resize and route changes
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleRefresh);
    window.addEventListener('orientationchange', handleRefresh);

    return () => {
      window.removeEventListener('resize', handleRefresh);
      window.removeEventListener('orientationchange', handleRefresh);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('career_token');
    const userData = localStorage.getItem('career_user');
    if (token && userData) {
      try {
        if (userData && userData !== 'undefined' && userData !== 'null') {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } else {
          localStorage.removeItem('career_token');
          localStorage.removeItem('career_user');
        }
      } catch (e) {
        localStorage.removeItem('career_token');
        localStorage.removeItem('career_user');
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleApplyClick = (job) => {
    if (isAuthenticated) {
      router.push('/careers-liaison-bank/candidate-dashboard');
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  
  // Benefits data
  const benefits = [
    {
      title: "Career Advancement",
      tag: "Inclusive Culture",
      description: "Build a strong foundation for your future with industry exposure, valuable experience, and opportunities for long-term growth.",
      image: "../mahadev_Rupali_Arvind.webp"
    },
      {
      title: "Meaningful Work",
      tag: "ESG Initiatives",
      description: "Contribute to real projects thatcreate business impact whilegaining practical, hands-on experience.",
      image: "/meaningfullWork.jpg"
    },
    {
      title: "Continuous Learning",
      tag: "Fair Opportunity",
      description: "Develop technical and professional skills through mentorship, collaboration, and continuous learning opportunities.",
      image: "/expert.jpg"
    }
  
  ];

  return (
    <div className="careers-page">
      <RecruitemtnModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Hero Banner */}
      <section ref={heroRef} className="hero-banner">
        <div className="container" ref={heroContentRef}>
          <div className="page-title">
            <h2 ref={heroTitleRef}>
              A culture that inspires people to take ownership, unlock their potential, embrace growth, and transform their ambitions into meaningful and rewarding careers
            </h2>
          </div>
        </div>
      </section>

      <section className="hero-section"></section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="benefits-section" id="benefits">
        <div className="container">
          <div className="benefits-header">
            <h2>Together We Rise, Leaving No One Behind</h2>
          </div>

          <div className="benefits-grid-cards">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`benefit-card-wrapper ${hoveredIndex === index ? 'active' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="benefit-card-hover">
                  <div className="benefit-card-image">
                    <img src={benefit.image} alt={benefit.title} />
                    
                    {/* 1. The short vertical label on the left */}
                    <div className="benefit-card-label">
                      <span>{benefit.title}</span>
                    </div>

                    {/* 2. The overlay that appears on hover */}
                    <div className="benefit-card-overlay">
                      <h3 className="benefit-title">{benefit.title}</h3>
                      <p className="benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section ref={servicesRef} className="services-section" id="openings">
        <div className="container">
          <div className="section-header">
            <h2 className="job-header">Current Openings</h2>
          </div>

          <div className="services-tabs">
            {services.map((service) => (
              <button
                key={service.id}
                className={`tab-btn ${activeService.id === service.id ? 'active' : ''}`}
                onClick={() => setActiveService(service)}
              >
                {service.name}
              </button>
            ))}
          </div>

          <div className="featured-service">
            <div
              className="featured-image"
              style={{ backgroundImage: `url(${activeService.image})` }}
            >
              <div className="featured-overlay">
                <h3>{activeService.name}</h3>
                <p>{activeService.description}</p>

                <Link
                  href="/careers-liaison-bank/jobs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link featured-view"
                >
                  View Openings <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <span className="cta-tag">Join Our Team</span>
              <h3>Ready to make an impact?</h3>
              <p>Explore our current openings and become part of a team that values innovation and growth.</p>
              <div className="cta-actions">
                <Link href="#openings" className="btn-primary">
                  View All Openings <ArrowUpRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}