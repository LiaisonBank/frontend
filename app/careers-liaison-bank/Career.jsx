"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import useBodyClass from "@/components/useBodyClass";
import AuthModal from "./AuthModal";
import RecruitemtnModal from "./RecruitemtnModal";
import EmployeeActivityGallery from "@/components/EmployeeActivityGallery/page";
import "./career.scss";

gsap.registerPlugin(ScrollTrigger);

// ---------- SERVICE DATA ----------
const services = [
  {
    id: 1,
    name: "Liaisoning",
    slug: "Linking Needs With The Right Solutions",
    image: "/liaisoning-in-real-estate.jpg",
    description: "____________________________",
  },
  {
    id: 2,
    name: "Licensing",
    slug: "We Handle the Process. You Build the Future.",
    image: "/licensing-services.png",
    description: "_______________________________________________",
  },
  {
    id: 5,
    name: "Piped Natural Gas",
    slug: "Reliable Gas, Smarter Living.",
    image: "/PNG.png",
    description: "_____________________________________",
  },
  {
    id: 4,
    name: "Fire Safety",
    slug: "Turning Safety into Security.",
    image: "/fire4.png",
    description: "____________________________________________",
  },
  {
    id: 3,
    name: "Electrical",
    slug: "Powering Your Needs, Connecting Your Future.",
    image: "/Electrical.png",
    description: "________________________________________________",
  },
  {
    id: 6,
    name: "AMC",
    slug: "Protect Performance. Preserve Value.",
    image: "/dummyAMC.png",
    description: "_______________________________________",
  },
];

const OTHER_OPTIONS = [
  { id: 1, name: "Administration", link: "/careers-liaison-bank/jobs?service=Work%20Department&department=Administration%20%26%20Facilities%20-%20DBRE" },
  { id: 2, name: "Human Resource", link: "/careers-liaison-bank/jobs?service=Human%20Resource" },
  { id: 3, name: "Accountant", link: "/careers-liaison-bank/jobs?service=Accountant" },
  { id: 4, name: "Sales", link: "/careers-liaison-bank/jobs?service=Sales" },
  { id: 5, name: "Information Technology", link: "/careers-liaison-bank/jobs?service=Information%20Technology" },
];

const BENEFITS = [
  {
    title: "Career Advancement",
    tag: "Inclusive Culture",
    description:
      "Build a strong foundation for your future with industry exposure, valuable experience, and opportunities for long-term growth.",
    image: "/meaningfullWork.jpg",
  },
  {
    title: "Meaningful Work",
    tag: "ESG Initiatives",
    description:
      "Contribute to real projects that create business impact while gaining practical, hands-on experience.",
    image: "/CareerAdvancement.png",
  },
  {
    title: "Continuous Learning",
    tag: "Fair Opportunity",
    description:
      "Develop technical and professional skills through mentorship, collaboration, and continuous learning opportunities.",
    image: "/ContinuousLearning.png",
  },
];

export default function CareersLiaisonPage() {
  useBodyClass("careers");

  const router = useRouter();

  const [activeService, setActiveService] = useState(services[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showOthersDropdown, setShowOthersDropdown] = useState(false);

  // Refs
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroTitleRef = useRef(null);
  const cultureRef = useRef(null);
  const benefitsRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);

  // Keeps the hero ScrollTrigger so it can be killed independently
  const heroScrollTriggerRef = useRef(null);

  // ---------- 1. HERO LOAD + SCROLL ANIMATION ----------
  useEffect(() => {
    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current) return;

    const hero = heroRef.current;
    const content = heroContentRef.current;
    const title = heroTitleRef.current;

    const ctx = gsap.context(() => {
      gsap.set(hero, {
        scale: 0,
        opacity: 0,
        borderRadius: "0px",
        transformOrigin: "center center",
      });
      gsap.set(content, { scale: 0, opacity: 0, y: 0 });
      gsap.set(title, { opacity: 0, y: 30 });

      const loadTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });

      loadTl
        .to(hero, { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" })
        .to(content, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, "-=0.6")
        .to(title, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4");

      loadTl.eventCallback("onComplete", () => {
        if (heroScrollTriggerRef.current) {
          heroScrollTriggerRef.current.kill();
          heroScrollTriggerRef.current = null;
        }

        heroScrollTriggerRef.current = ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom -20%",
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = Math.min(self.progress, 1);
            if (progress <= 0) return;

            const scale = Math.max(1 - progress, 0);
            const borderRadius = progress * 50;
            const opacity = Math.max(1 - progress * 0.5, 0.5);

            gsap.set(hero, {
              scale,
              borderRadius: `0px 0px ${borderRadius}px ${borderRadius}px`,
              opacity,
              force3D: true,
            });

            const contentScale = Math.max(1 - progress * 0.6, 0.4);
            const contentOpacity = Math.max(1 - progress * 0.7, 0.3);
            const contentY = -progress * 80;

            gsap.set(content, {
              scale: contentScale,
              opacity: contentOpacity,
              y: contentY,
              force3D: true,
            });
          },
        });
      });
    }, heroRef);

    return () => {
      if (heroScrollTriggerRef.current) {
        heroScrollTriggerRef.current.kill();
        heroScrollTriggerRef.current = null;
      }
      ctx.revert();
    };
  }, []);

  // ---------- 2. SECTION SCROLL ANIMATIONS ----------
  useEffect(() => {
    // ⬇️ declared OUTSIDE the gsap.context callback (fixes TDZ)
    let refreshId = null;

    const ctx = gsap.context(() => {
      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 100);

      const animate = (target, fromVars, toVars, trigger) => {
        if (!target || !trigger) return;
        gsap.fromTo(target, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      };

      // Culture
      animate(
        cultureRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        cultureRef.current,
      );

      const cultureCards = cultureRef.current?.querySelectorAll(".culture-card");
      if (cultureCards?.length) {
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
          },
        );
      }

      // Benefits
      animate(
        benefitsRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        benefitsRef.current,
      );

      const benefitCards = benefitsRef.current?.querySelectorAll(".benefit-card-wrapper");
      if (benefitCards?.length) {
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
          },
        );
      }

      // Services
      animate(
        servicesRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
        servicesRef.current,
      );

      const tabButtons = servicesRef.current?.querySelectorAll(".tab-btn");
      if (tabButtons?.length) {
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
          },
        );
      }

      const featuredImage = servicesRef.current?.querySelector(".featured-image");
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
          },
        );
      }

      // CTA
      animate(
        ctaRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        ctaRef.current,
      );

      const ctaBox = ctaRef.current?.querySelector(".cta-box");
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
          },
        );
      }

      // Benefits header
      const benefitsHeader = benefitsRef.current?.querySelector(".benefits-header h2");
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
          },
        );
      }

      // Generic section headers
      document.querySelectorAll(".section-header").forEach((header) => {
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
          },
        );
      });
    });

    return () => {
      if (refreshId) clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  // ---------- 3. RESIZE HANDLING ----------
  useEffect(() => {
    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleRefresh);
    window.addEventListener("orientationchange", handleRefresh);
    return () => {
      window.removeEventListener("resize", handleRefresh);
      window.removeEventListener("orientationchange", handleRefresh);
    };
  }, []);

  // ---------- 4. AUTH BOOTSTRAP ----------
  useEffect(() => {
    const token = localStorage.getItem("career_token");
    const userData = localStorage.getItem("career_user");

    if (!token || !userData || userData === "undefined" || userData === "null") {
      if (token || userData) {
        localStorage.removeItem("career_token");
        localStorage.removeItem("career_user");
      }
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setIsAuthenticated(true);
      setUser(parsedUser);
    } catch (e) {
      localStorage.removeItem("career_token");
      localStorage.removeItem("career_user");
      console.error("Error parsing user data:", e);
    }
  }, []);

  // ---------- HANDLERS ----------
  const handleApplyClick = (_job) => {
    if (isAuthenticated) {
      router.push("/careers-liaison-bank/candidate-dashboard");
    } else {
      setAuthMode("login");
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const activeServiceJobsHref = useMemo(
    () => `/careers-liaison-bank/jobs?service=${encodeURIComponent(activeService.name)}`,
    [activeService.name],
  );

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
              A culture that inspires people to take ownership, unlock their
              potential, embrace growth, and transform their ambitions into
              meaningful and rewarding careers
            </h2>
          </div>
        </div>
      </section>

      <section className="hero-section" />

      <section className="saturdayfun">
        <EmployeeActivityGallery />
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="benefits-section" id="benefits">
        <div className="container">
          <div className="benefits-header">
            <h2>Together We Rise, Leaving No One Behind</h2>
          </div>

          <div className="benefits-grid-cards">
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`benefit-card-wrapper ${hoveredIndex === index ? "active" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="benefit-card-hover">
                  <div className="benefit-card-image">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      width={800}
                      height={500}
                    />

                    <div className="benefit-card-label">
                      <span>{benefit.title}</span>
                    </div>

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
                type="button"
                className={`tab-btn ${activeService.id === service.id ? "active" : ""}`}
                onClick={() => setActiveService(service)}
                onMouseEnter={() => setActiveService(service)}
                onFocus={() => setActiveService(service)}
              >
                {service.name}
              </button>
            ))}

            {/* Others dropdown */}
            <div
              className="others-wrapper"
              onMouseEnter={() => setShowOthersDropdown(true)}
              onMouseLeave={() => setShowOthersDropdown(false)}
            >
              <button
                type="button"
                className="tab-btn"
                onClick={() => setShowOthersDropdown((prev) => !prev)}
                onFocus={() => setShowOthersDropdown(true)}
              >
                More +
              </button>

              {showOthersDropdown && (
                <div className="others-dropdown">
                  {OTHER_OPTIONS.map((option) => (
                    <a
                      key={option.id}
                      href={option.link}
                      className="dropdown-item"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {option.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured service — single Link wraps everything; no nested anchors */}
          <Link
            href={activeServiceJobsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="view-link featured-view"
          >
            <div className="featured-service">
              <div className="featured-image">
                <Image
                  src={activeService.image}
                  alt={activeService.name}
                  className="featured-image-img"
                  fill
                  unoptimized
                />
                <div className="featured-overlay">
                  <h3>{activeService.slug}</h3>
                  <span className="featured-cta">
                    View Openings <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <span className="cta-tag">Join Our Team</span>
              <h3>Ready to make an impact?</h3>
              <div className="cta-actions">
                <Link
                  href="/careers-liaison-bank/jobs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
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