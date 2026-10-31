"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowRight,
  Network,
  FileCheck,
  Fuel,
  Flame,
  Zap,
  Wrench,
  Calculator,
  ClipboardList,
  Ruler,
  Users,
  Monitor,
  Briefcase,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import useBodyClass from "@/components/useBodyClass";
import AuthModal from "./AuthModal";
import RecruitemtnModal from "./RecruitemtnModal";
import EmployeeActivityGallery from "@/components/EmployeeActivityGallery/page";
import "./career.scss";
import electricIcon from '@/assets/images/Electrical Audit & Certification.png';
import fireIcon from '@/assets/images/Fire & Safety Compliance.png';
import licenseIcon from '@/assets/images/License Renewal & Compliance icon.png';
import pngIcon from '@/assets/images/PNG Infra Maintenance icon.png';
import accountantIcon from '@/assets/images/Accountant icon.png'
import administrationIcon from '@/assets/images/Administration icon.png'
import amcIcon from '@/assets/images/Annual Maintenance icon.png'
import architectureIcon from '@/assets/images/Architecture icon.png'
import hrIcon from '@/assets/images/Human Resource icon.png'
import itIcon from '@/assets/images/information technology icon.png'
import liaisoningIcon from '@/assets/images/Liaisoning icon.png'
import salesIcon from '@/assets/images/Sales icon.png'

gsap.registerPlugin(ScrollTrigger);

// ---------- SERVICE DEPARTMENTS ----------
const services = [
  { id: 1, name: "Liaisoning", link: "Liaisoning", icon:liaisoningIcon},
  { id: 2, name: "Licensing", link: "Licensing", icon: licenseIcon },
  { id: 5, name: "Piped Natural Gas", link: "PNG", icon: pngIcon },
  { id: 4, name: "Fire Safety", link: "Fire Safety", icon: fireIcon },
  { id: 3, name: "Electrical", link: "Electrical", icon: electricIcon },
  { id: 6, name: "AMC", link: "AMC", icon:amcIcon },
];

const OTHER_OPTIONS = [
  { id: 1, name: "Accountant", link: "/careers-liaison-bank/jobs?department=ACCOUNTS DEPARTMENT - DBRE", icon :accountantIcon},
  { id: 2, name: "Administration", link: `/careers-liaison-bank/jobs?department=${encodeURIComponent("Administration & Facilities - DBRE")}`, icon:administrationIcon },
  { id: 3, name: "Architecture", link: "/careers-liaison-bank/jobs?department=ARCHITECTURE DEPARTMENT - DBRE" , icon:architectureIcon},
  { id: 4, name: "Human Resource", link: "/careers-liaison-bank/jobs?department=HUMAN RESOURCE - DBRE" , icon :hrIcon},
  { id: 5, name: "Information Technology", link: "/careers-liaison-bank/jobs?department=IT%20DEPARTMENT%20-%20DBRE", icon:itIcon },
  { id: 6, name: "Sales", link: "/careers-liaison-bank/jobs?department=SALES DEPARTMENT - DBRE", icon:salesIcon },
];

// Icons are presentation-only; cards contain no descriptions or images.
const SERVICE_CARD_ICONS = [Network, FileCheck, Fuel, Flame, Zap, Wrench];
const CORPORATE_CARD_ICONS = [Calculator, ClipboardList, Ruler, Users, Monitor, Briefcase];

const BENEFITS = [
  { title: "Career Advancement", tag: "Inclusive Culture", description: "Build a strong foundation for your future with industry exposure, valuable experience, and opportunities for long-term growth.", image: "/meaningfullWork.jpg" },
  { title: "Meaningful Work", tag: "ESG Initiatives", description: "Contribute to real projects that create business impact while gaining practical, hands-on experience.", image: "/CareerAdvancement.png" },
  { title: "Continuous Learning", tag: "Fair Opportunity", description: "Develop technical and professional skills through mentorship, collaboration, and continuous learning opportunities.", image: "/ContinuousLearning.png" },
];

export default function CareersLiaisonPage() {
  useBodyClass("careers");

  const router = useRouter();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Refs
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroTitleRef = useRef(null);
  const saturdayFunRef = useRef(null);
  const saturdayFunHeaderRef = useRef(null);
  const benefitsRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);
  const heroScrollTriggerRef = useRef(null);

  // Current Openings entrance animation disabled for the static card layout.



  // ---------- 1. HERO LOAD + SCROLL ANIMATION ----------
  useEffect(() => {
    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current) return;

    const hero = heroRef.current;
    const content = heroContentRef.current;
    const title = heroTitleRef.current;

    const ctx = gsap.context(() => {
      gsap.set(hero, { scale: 0, opacity: 0, borderRadius: "0px", transformOrigin: "center center" });
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

        ScrollTrigger.refresh();
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
    let refreshTimeout = null;
    let rafId = null;

    const ctx = gsap.context(() => {
      const refresh = () => {
        rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      const onceConfig = (trigger) => ({
        trigger,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
        invalidateOnRefresh: true,
      });

      const animate = (target, fromVars, toVars, trigger) => {
        if (!target || !trigger) return;
        gsap.fromTo(target, fromVars, {
          ...toVars,
          scrollTrigger: onceConfig(trigger),
        });
      };

      animate(
        saturdayFunRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        saturdayFunRef.current
      );

      const saturdayHeader =
        saturdayFunHeaderRef.current ||
        saturdayFunRef.current?.querySelector("h2, .section-header");
      if (saturdayHeader) {
        gsap.fromTo(
          saturdayHeader,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: saturdayHeader,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      const galleryItems = saturdayFunRef.current?.querySelectorAll(
        ".gallery-item, .activity-card, .employee-activity-card, .gallery-card"
      );
      if (galleryItems?.length) {
        gsap.set(galleryItems, { opacity: 0, y: 60, scale: 0.95 });
        ScrollTrigger.batch(galleryItems, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      }

      animate(
        benefitsRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        benefitsRef.current
      );

      const benefitCards = benefitsRef.current?.querySelectorAll(".benefit-card-wrapper");
      if (benefitCards?.length) {
        gsap.set(benefitCards, { opacity: 0, y: 60, scale: 0.9 });
        ScrollTrigger.batch(benefitCards, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.15,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      }

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
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      document.querySelectorAll(".section-header").forEach((header) => {
        if (
          servicesRef.current?.contains(header) ||
          ctaRef.current?.contains(header)
        ) {
          return;
        }

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
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      const doRefresh = () => refresh();

      if (document.readyState === "complete") {
        doRefresh();
      } else {
        window.addEventListener("load", doRefresh, { once: true });
      }

      if (document.fonts?.ready) {
        document.fonts.ready.then(doRefresh);
      }

      refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 1500);
    });

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  // ---------- 3. RESIZE HANDLING (debounced) ----------
  useEffect(() => {
    let timeout = null;
    const handleRefresh = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", handleRefresh);
    window.addEventListener("orientationchange", handleRefresh);
    return () => {
      if (timeout) clearTimeout(timeout);
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

  // Current Openings particle/hover/auto-scroll logic removed for the card layout.

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

      {/* Saturday Fun / Employee Activity Gallery */}
      <section ref={saturdayFunRef} className="saturdayfun" id="saturdayfun">
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
                    <Image src={benefit.image} alt={benefit.title} width={800} height={500} />
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

      {/* Current Openings — static department cards; no image or particle animation */}
      <section
        ref={servicesRef}
        className="current-openings-cards-section"
        id="openings"
      >
        <div className="container current-openings-cards-container">
          {/* <header className="current-openings-cards-header"> */}
          {/* <p className="current-openings-eyebrow">CAREERS AT LIAISON BANK</p> */}
          <h2>Current Openings</h2>
          {/* </header> */}

          <section className="current-openings-group" aria-labelledby="service-departments-heading">

            <div className="current-openings-card-grid">
              {services.map((service, index) => {
                const Icon = SERVICE_CARD_ICONS[index] || Briefcase;
                const href = `/careers-liaison-bank/jobs?service=${encodeURIComponent(service.link)}`;

                return (
                  <div key={service.id} className="current-opening-card-wrapper">
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="current-opening-card-link"
                      aria-label={`View openings for ${service.name}`}
                    >
                      <article className="current-opening-card">
                        <div className="current-opening-card-header">
                          <span className="current-opening-card-icon">
                            {service.icon ? (
                              <Image
                                src={service.icon}
                                alt=""
                                width={40}
                                height={40}
                                className="current-opening-icon-img"
                              />
                            ) : (
                              <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                            )}
                          </span>
                          <h4 className="current-opening-card-title">{service.name}</h4>
                        </div>
                        <div className="current-opening-card-cta">
                          <span>View Opening</span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </div>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="current-openings-group" aria-labelledby="corporate-functions-heading">

            <div className="current-openings-card-grid">
              {OTHER_OPTIONS.map((option, index) => {
                const Icon = CORPORATE_CARD_ICONS[index] || Briefcase;

                return (
                  <div key={option.id} className="current-opening-card-wrapper">
                    <Link
                      href={option.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="current-opening-card-link"
                      aria-label={`View openings for ${option.name}`}
                    >
                      <article className="current-opening-card">
                        <div className="current-opening-card-header">
                          <span className="current-opening-card-icon">
                            {option.icon ? (
                              <Image
                                src={option.icon}
                                alt=""
                                width={40}
                                height={40}
                                className="current-opening-icon-img"
                              />
                            ) : (
                              <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                            )}
                          </span>
                          <h4 className="current-opening-card-title">{option.name}</h4>
                        </div>
                        <div className="current-opening-card-cta">
                          <span>View Opening</span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </div>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      {/* CTA Section — NO GSAP ANIMATION */}
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