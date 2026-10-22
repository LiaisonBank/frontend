  "use client";

  import Link from "next/link";
  import Image from "next/image";
  import { useState, useEffect, useRef, useMemo } from "react";
  import { useRouter } from "next/navigation";
  import { ArrowUpRight } from "lucide-react";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

  import useBodyClass from "@/components/useBodyClass";
  import AuthModal from "./AuthModal";
  import RecruitemtnModal from "./RecruitemtnModal";
  import EmployeeActivityGallery from "@/components/EmployeeActivityGallery/page";
  import "./career.scss";

  gsap.registerPlugin(ScrollTrigger);

  // ---------- SERVICE DATA ----------
  const services = [
    { id: 1, name: "Liaisoning", slug: "Linking Needs With The Right Solutions", link: "Liaisoning", image: "/liaisoning-in-real-estate.jpg", description: "____________________________" },
    { id: 2, name: "Licensing", slug: "We Handle the Process. You Build the Future.", link: "Licensing", image: "/licensing-services.png", description: "_______________________________________________" },
    { id: 5, name: "Piped Natural Gas", slug: "Reliable Gas, Smarter Living.", link: "PNG", image: "/PNG.png", description: "_____________________________________" },
    { id: 4, name: "Fire Safety", slug: "Turning Safety into Security.", link: "Fire Safety", image: "/fire4.png", description: "____________________________________________" },
    { id: 3, name: "Electrical", slug: "Powering Your Needs, Connecting Your Future.", link: "Electrical", image: "/Electrical.png", description: "________________________________________________" },
    { id: 6, name: "AMC", slug: "Protect Performance. Preserve Value.", link: "AMC", image: "/dummyAMC.png", description: "_______________________________________" },
  ];

  const OTHER_OPTIONS = [
    { id: 1, name: "Accountant", link: "/careers-liaison-bank/jobs?department=ACCOUNTS DEPARTMENT - DBRE" },
    { id: 2, name: "Administration", link: "/careers-liaison-bank/jobs?department=ADMINISTRATOR - DBRE" },
    { id: 3, name: "Architecture", link: "/careers-liaison-bank/jobs?department=ARCHITECTURE DEPARTMENT - DBRE" },
    { id: 4, name: "Human Resource", link: "/careers-liaison-bank/jobs?department=HUMAN RESOURCE - DBRE" },
    { id: 5, name: "Information Technology", link: "/careers-liaison-bank/jobs?department=IT%20DEPARTMENT%20-%20DBRE" },
    { id: 6, name: "Sales", link: "/careers-liaison-bank/jobs?department=SALES - DBRE" },
  ];

  const BENEFITS = [
    { title: "Career Advancement", tag: "Inclusive Culture", description: "Build a strong foundation for your future with industry exposure, valuable experience, and opportunities for long-term growth.", image: "/meaningfullWork.jpg" },
    { title: "Meaningful Work", tag: "ESG Initiatives", description: "Contribute to real projects that create business impact while gaining practical, hands-on experience.", image: "/CareerAdvancement.png" },
    { title: "Continuous Learning", tag: "Fair Opportunity", description: "Develop technical and professional skills through mentorship, collaboration, and continuous learning opportunities.", image: "/ContinuousLearning.png" },
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
    const tabsRef = useRef(null);
    const tabsDragRef = useRef({
      isPointerDown: false,
      startX: 0,
      lastX: 0,
      scrollLeft: 0,
      hasMoved: false,
      originalScrollBehavior: "",
      originalScrollSnapType: "",
    });
    const suppressTabClickRef = useRef(false);
    const autoScrollPausedRef = useRef(false);

    // ---------- HORIZONTAL TAB DRAGGING ----------
    const handleTabsPointerEnter = () => {
      // Pause automatic motion while the user is interacting with the row.
      autoScrollPausedRef.current = true;
    };

    const handleTabsPointerLeave = () => {
      if (!tabsDragRef.current.isPointerDown) {
        autoScrollPausedRef.current = false;
      }
    };

    // ---------- HORIZONTAL TAB DRAGGING ----------
    
const handleTabsPointerDown = (event) => {
  // Only handle the primary mouse button or touch/pen input.
  if (event.pointerType === "mouse" && event.button !== 0) return;

  const container = tabsRef.current;
  if (!container) return;

  // Clear any stale click suppression from a previous drag.
  suppressTabClickRef.current = false;

  const drag = tabsDragRef.current;

  drag.isPointerDown = true;
  drag.startX = event.clientX;
  drag.lastX = event.clientX;
  drag.scrollLeft = container.scrollLeft;
  drag.hasMoved = false;
  drag.originalScrollBehavior = container.style.scrollBehavior;
  drag.originalScrollSnapType = container.style.scrollSnapType;

  autoScrollPausedRef.current = true;

  container.style.scrollBehavior = "auto";
  container.style.scrollSnapType = "none";
  container.classList.add("is-dragging");

  // IMPORTANT:
  // Do not capture the pointer here.
  // Normal button clicks must work without pointer capture.
};


    
const handleTabsPointerMove = (event) => {
  const container = tabsRef.current;
  const drag = tabsDragRef.current;

  if (!container || !drag.isPointerDown) return;

  const totalDelta = event.clientX - drag.startX;

  // Require an actual drag, not a small movement during a click.
  if (!drag.hasMoved && Math.abs(totalDelta) > 8) {
    drag.hasMoved = true;

    // Capture only after the user actually starts dragging.
    try {
      container.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture may be unavailable.
    }
  }

  if (!drag.hasMoved) return;

  event.preventDefault();

  // Move the row immediately with the mouse.
  container.scrollLeft = drag.scrollLeft - totalDelta;
  drag.lastX = event.clientX;
};


    const handleTabsPointerEnd = () => {
      const container = tabsRef.current;
      const drag = tabsDragRef.current;
      if (!drag.isPointerDown) return;

      const didDrag = drag.hasMoved;
      drag.isPointerDown = false;
      drag.hasMoved = false;
      if (container) {
        container.classList.remove("is-dragging");
        container.style.scrollBehavior = drag.originalScrollBehavior;
        container.style.scrollSnapType = drag.originalScrollSnapType;
      }

      // Don't let the mouse-up after a drag activate a tab.
        if (didDrag) {
        suppressTabClickRef.current = true;
        window.setTimeout(() => {
          suppressTabClickRef.current = false;
        }, 250);
      }

      // Stay paused if the pointer is still over the tabs. Auto-scroll resumes
      // after the pointer leaves the row.
      autoScrollPausedRef.current = Boolean(container?.matches(":hover"));
    };

    const handleTabsClickCapture = (event) => {
      if (!suppressTabClickRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      suppressTabClickRef.current = false;
    };
    // ---------- CONTINUOUS AUTO-SCROLL WHILE IDLE ----------
    

useEffect(() => {
  const container = tabsRef.current;
  if (!container) return;

  let animationFrameId;
  let previousTime = 0;
  let direction = 1;

  const SPEED = 30; // Pixels per second

  // Override smooth scrolling for immediate scrollLeft updates.
  const previousBehavior = container.style.scrollBehavior;
  container.style.scrollBehavior = "auto";

  const animate = (time) => {
    const elapsed = previousTime
      ? Math.min((time - previousTime) / 1000, 0.05)
      : 0;

    previousTime = time;

    const maxScroll = container.scrollWidth - container.clientWidth;

    // Pause only while the user is actively dragging.
    if (
      maxScroll > 2 &&
      !tabsDragRef.current.isPointerDown
    ) {
      let nextPosition =
        container.scrollLeft + direction * SPEED * elapsed;

      if (nextPosition >= maxScroll) {
        nextPosition = maxScroll;
        direction = -1;
      } else if (nextPosition <= 0) {
        nextPosition = 0;
        direction = 1;
      }

      container.scrollLeft = nextPosition;
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrameId);
    container.style.scrollBehavior = previousBehavior;
  };
}, []);


  // ---------- 0. AUTO-SCROLL ACTIVE TAB INTO VIEW (LEFT-ALIGNED) ----------
// useEffect(() => {
//   const container = tabsRef.current;
//   if (!container) return;

//   // Defer to next frame so the .active class is committed to the DOM
//   const raf = requestAnimationFrame(() => {
//     const activeBtn = container.querySelector(".tab-btn.active");
//     if (!activeBtn) return;

//     const containerRect = container.getBoundingClientRect();
//     const btnRect = activeBtn.getBoundingClientRect();

//     // Button's left/right relative to the scrollable content (not the viewport)
//     const btnLeft = btnRect.left - containerRect.left + container.scrollLeft;
//     const btnRight = btnLeft + btnRect.width;

//     const viewLeft = container.scrollLeft;
//     const viewRight = viewLeft + container.clientWidth;

//     // Leave a little breathing room on both sides
//     const PAD = 16;
//     const fullyVisible =
//       btnLeft >= viewLeft + PAD &&
//       btnRight <= viewRight - PAD;

//     if (fullyVisible) return;

//     // Center the active tab if possible, else scroll just enough
//     const target = Math.max(
//       0,
//       Math.min(
//         btnLeft - (container.clientWidth - btnRect.width) / 2,
//         container.scrollWidth - container.clientWidth
//       )
//     );

//     container.scrollTo({ left: target, behavior: "smooth" });
//   });

//   return () => cancelAnimationFrame(raf);
// }, [activeService]);

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
      () => `/careers-liaison-bank/jobs?service=${encodeURIComponent(activeService.link)}`,
      [activeService.link]
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

        {/* Services Section — NO GSAP ANIMATION */}
        <section ref={servicesRef} className="services-section" id="openings">
          <div className="container">
            <div className="section-header">
              <h2 className="job-header">Current Openings</h2>
            </div>

            {/* ✅ Scrollable tabs row — services + other options inline, no dropdown */}
            <div
              className="services-tabs"
              ref={tabsRef}
              // onPointerEnter={handleTabsPointerEnter}
              // onPointerLeave={handleTabsPointerLeave}
              onPointerDown={handleTabsPointerDown}
              onPointerMove={handleTabsPointerMove}
              onPointerUp={handleTabsPointerEnd}
              onPointerCancel={handleTabsPointerEnd}
              onLostPointerCapture={handleTabsPointerEnd}
              onClickCapture={handleTabsClickCapture}
            >
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`tab-btn ${activeService.id === service.id ? "active" : ""}`}
                  onClick={() => setActiveService(service)}
                  onMouseEnter={() => {
                    // Don't let hover-driven state changes fight with click-and-drag scrolling.
                    if (!tabsDragRef.current.isPointerDown) {
                      setActiveService(service);
                    }
                  }}
                  onFocus={() => setActiveService(service)}
                >
                  {service.name}
                </button>
              ))}

              {OTHER_OPTIONS.map((option) => (
                <button
                  key={`other-${option.id}`}
                  type="button"
                  className="tab-btn"
                  onClick={() =>
                    window.open(option.link, "_blank", "noopener,noreferrer")
                  }
                >
                  {option.name}
                </button>
              ))}
            </div>

            
<Link
  href={activeServiceJobsHref}
  target="_blank"
  rel="noopener noreferrer"
  className="career-opening-card career-opening-card--design3"
>
  <div className="career-opening-card__visual">
    <Image
      src={activeService.image}
      alt={activeService.name}
      fill
      sizes="(max-width: 700px) 100vw, 1120px"
      className="career-opening-card__image"
      unoptimized
    />
    <div className="career-opening-card__image-overlay" />
  </div>

  <div className="career-opening-card__content">
    <span className="career-opening-card__accent" />

    <h3 className="career-opening-card__title">
      {activeService.slug}
    </h3>

    <span className="career-opening-card__cta">
      View Openings
      <span className="career-opening-card__arrow">
        <ArrowUpRight size={20} />
      </span>
    </span>
  </div>
</Link>

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