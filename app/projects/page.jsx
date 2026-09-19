"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button, Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useBodyClass from "@/components/useBodyClass";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";
import ProjectDetails from "@/components/ProjectDetail/ProjectDetails";
import CountUp from "@/hooks/Countup";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

export default function ProjectsPage() {
  useBodyClass("completed");

  const [openPopup, setOpenPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [projectCounts, setProjectCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const scrollYRef = useRef(0);

  /* ------------------------------------------------------------------ */
  /*  Fetch project counts                                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const controller = new AbortController();

    const fetchProjectCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/projects/counts`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result?.data || result;

        setProjectCounts(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch project counts";
        setError(errorMessage);
        console.error("❌ Project Counts API Error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectCounts();
    return () => controller.abort();
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Parallax on the hero video (sets --parallax-y)                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Respect reduced-motion
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let rafId = null;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      // Only translate while hero is on screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        rafId = null;
        return;
      }
      // Move video slightly opposite to scroll direction
      const offset = rect.top * -0.15; // ~15% parallax
      hero.style.setProperty("--parallax-y", `${offset}px`);
      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    update(); // initial
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Body scroll lock (single source of truth)                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!openPopup) {
      const scrollY = scrollYRef.current;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
      return;
    }

    scrollYRef.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollYRef.current}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [openPopup]);

  /* ------------------------------------------------------------------ */
  /*  Cleanup on unmount                                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, []);

  const handleOpenPopup = useCallback(() => {
    setOpenPopup(true);
    animationTimeoutRef.current = setTimeout(() => setIsAnimating(true), 50);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsAnimating(false);
    closeTimeoutRef.current = setTimeout(() => setOpenPopup(false), 300);
  }, []);

  return (
    <>
      <div className="page-header d-none">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Projects</h1>
                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" />
                            Home
                          </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          Projects
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

      {/* Hero — ref added for parallax */}
      <section className="projects-hero-section" ref={heroRef}>
        <video
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/projects-poster.png"
        >
          <source src="/videos/projects-bg.mp4" type="video/mp4" />
          <source src="/videos/projects-bg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        <div className="elementor-background-overlay"></div>

        <div className="hero-content">
          <h1>PROJECTS</h1>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">
                {loading ? (
                  "..."
                ) : (
                  <CountUp
                    end={projectCounts?.completed_projects ?? 0}
                    className="total-value"
                    duration={20000}
                  />
                )}
              </span>
              <span className="stat-label">Completed</span>
            </div>

            <div className="stat-item">
              <span className="stat-number">
                {loading ? (
                  "..."
                ) : (
                  <CountUp
                    end={projectCounts?.ongoing_projects ?? 0}
                    className="total-value"
                  />
                )}
              </span>
              <span className="stat-label">In Progress</span>
            </div>

            <div className="stat-item">
              <span className="stat-number">
                {loading ? (
                  "..."
                ) : (
                  <CountUp
                    end={projectCounts?.upcoming_projects ?? 0}
                    className="total-value"
                  />
                )}
              </span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>

          {error && (
            <div className="text-center text-danger mb-3">
              <small>⚠️ {error}</small>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="outlined"
              className="mapblock"
              onClick={handleOpenPopup}
            >
              View Full Screen Map
            </Button>
          </div>
        </div>
      </section>

      <section className="container-fluid p-0 m-0 bg-white position-relative">
        <div className="container py-4 bg-white" aria-label="Projects section">
          <div className="auto-grid">
            <ProjectDetails
              projectCounts={projectCounts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </section>

      {/* Full Screen Map Dialog */}
      <Dialog
        fullScreen
        open={openPopup}
        onClose={handleClosePopup}
        className="fullscreen-map-dialog"
        disableScrollLock={false}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#f5f5f5",
            position: "relative",
            overflow: "hidden",
            transform: isAnimating ? "scale(1)" : "scale(0.3)",
            opacity: isAnimating ? 1 : 0,
            transition:
              "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
            transformOrigin: "center center",
            borderRadius: isAnimating ? 0 : "50%",
            width: isAnimating ? "100%" : "0px",
            height: isAnimating ? "100%" : "0px",
            margin: isAnimating ? 0 : "auto",
          },
          "& .MuiBackdrop-root": {
            position: "fixed",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: isAnimating
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(0, 0, 0, 0)",
              transition: "background-color 0.5s ease",
            },
          },
        }}
      >
        <IconButton
          className="fullscreen-close-btn"
          onClick={handleClosePopup}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          className="mumbai-map-fullscreen"
          sx={{
            width: "100%",
            height: "100%",
            opacity: isAnimating ? 1 : 0,
            transition: "opacity 0.3s ease 0.3s",
          }}
        >
          <MumbaiMap />
        </Box>
      </Dialog>
    </>
  );
}