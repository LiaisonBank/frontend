"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import Link from "next/link";

import {
  Button,
  Dialog,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import confetti from "canvas-confetti";

import useBodyClass from "@/components/useBodyClass";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";
import ProjectDetails from "@/components/ProjectDetail/ProjectDetails";
import CountUp from "@/hooks/Countup";

/* -------------------------------------------------------------------------- */
/*                              API Configuration                              */
/* -------------------------------------------------------------------------- */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

/* -------------------------------------------------------------------------- */
/*                             Site Configuration                              */
/* -------------------------------------------------------------------------- */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://liaisonbank.com";

/* -------------------------------------------------------------------------- */
/*                              Video Configuration                            */
/* -------------------------------------------------------------------------- */

const PROJECTS_VIDEO = {
  mp4: "/videos/projects-bg.mp4",
  webm: "/videos/projects-bg.webm",
  poster: "/images/projects-poster.png",

  name: "Liaison Bank Projects and Business Services",

  description:
    "Explore Liaison Bank's completed, ongoing and upcoming projects delivered through business licensing, government liaison and compliance services for businesses in Mumbai.",

  uploadDate: "2026-09-20T00:00:00+05:30",

  duration: "PT30S",
};

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                               */
/* -------------------------------------------------------------------------- */

function toAbsoluteUrl(path) {
  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/* -------------------------------------------------------------------------- */
/*                    Featured Image Resolver                                  */
/* -------------------------------------------------------------------------- */

function resolveFeaturedImage(project) {
  if (!project) return "";

  const raw =
    project?.featured_image ||
    project?.featuredImage ||
    project?.featured_image_url ||
    project?.project_thumbnail_image ||
    project?.image ||
    project?.thumbnail ||
    "";

  const imageUrl =
    typeof raw === "object" && raw !== null
      ? raw?.url || raw?.src || ""
      : raw;

  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

/* -------------------------------------------------------------------------- */
/*                         Project Status Normalizer                           */
/* -------------------------------------------------------------------------- */

function normalizeProjectStatus(status) {
  if (Array.isArray(status)) {
    status = status.join(" ");
  }

  return String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

function isCompletedStatus(status) {
  return normalizeProjectStatus(status) === "completed";
}

function isInProgressStatus(status) {
  const normalized = normalizeProjectStatus(status);
  return (
    normalized === "in progress" ||
    normalized === "inprogress"
  );
}

function isUpcomingStatus(status) {
  return normalizeProjectStatus(status) === "upcoming";
}

/* -------------------------------------------------------------------------- */
/*                         UI → API Status Mapping                             */
/* -------------------------------------------------------------------------- */

const PROJECT_STATUS_API_MAP = {
  Completed: "Completed",
  "In Progress": "In Progress",
  Upcoming: "Upcoming",
};

/* -------------------------------------------------------------------------- */
/*                    Dialog Entry Direction Per Status                        */
/* -------------------------------------------------------------------------- */

/*
 * Completed   → slides in from the LEFT
 * In Progress → slides in from the TOP
 * Upcoming    → slides in from the RIGHT
 */
const DIALOG_ENTRY_DIRECTION = {
  Completed: "left",
  "In Progress": "top",
  Upcoming: "right",
};

/*
 * Offscreen transform used BEFORE the dialog enters.
 * Applied when `dialogEntered === false`.
 */
const DIALOG_OFFSCREEN_TRANSFORM = {
  left: "translateX(-120%)",
  right: "translateX(120%)",
  top: "translateY(-120%)",
  bottom: "translateY(120%)",
  center: "scale(0.85)",
};

const DIALOG_ENTER_DURATION_MS = 480;
const DIALOG_EXIT_DURATION_MS = 320;

/* -------------------------------------------------------------------------- */
/*                          Confetti Burst Helper                              */
/* -------------------------------------------------------------------------- */

function fireConfettiBurst() {
  if (typeof window === "undefined") return;

  const colors = [
    "#1976d2",
    "#42a5f5",
    "#ffb300",
    "#ff7043",
    "#66bb6a",
    "#ab47bc",
  ];

  /* Center pop */
  confetti({
    particleCount: 120,
    spread: 90,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    colors,
    scalar: 1.1,
    zIndex: 2000,
  });

  /* Side cannons */
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.9 },
      colors,
      zIndex: 2000,
    });

    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.9 },
      colors,
      zIndex: 2000,
    });
  }, 150);

  /* Trailing fall from top */
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 160,
      startVelocity: 20,
      gravity: 0.6,
      origin: { x: 0.5, y: 0 },
      colors,
      scalar: 0.9,
      ticks: 300,
      zIndex: 2000,
    });
  }, 300);
}

/* -------------------------------------------------------------------------- */
/*                              Video JSON-LD                                  */
/* -------------------------------------------------------------------------- */

function createProjectsVideoJsonLd() {
  const contentUrl = toAbsoluteUrl(PROJECTS_VIDEO.mp4);
  const thumbnailUrl = toAbsoluteUrl(PROJECTS_VIDEO.poster);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: PROJECTS_VIDEO.name,
    description: PROJECTS_VIDEO.description,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: PROJECTS_VIDEO.uploadDate,
    duration: PROJECTS_VIDEO.duration,
    contentUrl,
    publisher: {
      "@type": "Organization",
      name: "Liaison Bank",
      url: SITE_URL,
    },
    creator: {
      "@type": "Organization",
      name: "Liaison Bank",
      url: SITE_URL,
    },
    isFamilyFriendly: true,
  };
}

/* -------------------------------------------------------------------------- */
/*                              Component                                      */
/* -------------------------------------------------------------------------- */

export default function ProjectsPage() {
  useBodyClass("completed");

  /* ------------------------------------------------------------------------ */
  /*                                  State                                   */
  /* ------------------------------------------------------------------------ */

  const [openPopup, setOpenPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [projectCounts, setProjectCounts] = useState(null);
  const [error, setError] = useState(null);

  const [selectedProjectStatus, setSelectedProjectStatus] =
    useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] =
    useState(false);

  const [projectsByStatus, setProjectsByStatus] = useState({
    completed: [],
    inProgress: [],
    upcoming: [],
  });

  /*
   * Direction the dialog animates from ("left" | "top" | "right").
   * Set when a stat is clicked; used to compute the offscreen transform.
   */
  const [dialogDirection, setDialogDirection] = useState("center");

  /*
   * When false, the dialog sits offscreen using `dialogDirection`.
   * When true, it transitions to its final centered position.
   * Two RAFs flip this after mount so the enter transition runs.
   */
  const [dialogEntered, setDialogEntered] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                                   Refs                                   */
  /* ------------------------------------------------------------------------ */

  const heroRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const dialogCloseTimeoutRef = useRef(null);
  const scrollYRef = useRef(0);
  const projectListRef = useRef(null);
  const projectsFetchControllerRef = useRef(null);

  /* ------------------------------------------------------------------------ */
  /*                          Video JSON-LD                                   */
  /* ------------------------------------------------------------------------ */

  const projectsVideoJsonLd = createProjectsVideoJsonLd();

  /* ------------------------------------------------------------------------ */
  /*                         Status Click Handler                             */
  /* ------------------------------------------------------------------------ */

  const handleStatClick = useCallback(async (status) => {
    if (projectsFetchControllerRef.current) {
      projectsFetchControllerRef.current.abort();
    }

    /*
     * Clear any pending close timeout from a previous dialog.
     */
    if (dialogCloseTimeoutRef.current) {
      clearTimeout(dialogCloseTimeoutRef.current);
      dialogCloseTimeoutRef.current = null;
    }

    const controller = new AbortController();
    projectsFetchControllerRef.current = controller;

    /*
     * Resolve entry direction and stage the dialog offscreen.
     */
    const direction = DIALOG_ENTRY_DIRECTION[status] ?? "center";
    setDialogEntered(false);
    setDialogDirection(direction);

    setSelectedProjectStatus(status);
    setSelectedProjects([]);
    setIsLoadingProjects(true);

    /*
     * Confetti on Upcoming click.
     */
    if (status === "Upcoming") {
      fireConfettiBurst();
    }

    const apiStatus = PROJECT_STATUS_API_MAP[status] ?? status;

    try {
      const url = new URL(`${API_BASE_URL}/api/projects`);
      url.searchParams.set("project_status", apiStatus);

      console.log(`📡 Fetching projects: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      const projects = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

      if (projectsFetchControllerRef.current === controller) {
        setSelectedProjects(projects);
        setIsLoadingProjects(false);
      }
    } catch (err) {
      if (err?.name === "AbortError") return;

      if (projectsFetchControllerRef.current !== controller) {
        return;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch projects";

      setError(errorMessage);
      setSelectedProjects([]);
      setIsLoadingProjects(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         Close Project Dialog                              */
  /* ------------------------------------------------------------------------ */

  const handleCloseDialog = useCallback(() => {
    if (projectsFetchControllerRef.current) {
      projectsFetchControllerRef.current.abort();
      projectsFetchControllerRef.current = null;
    }

    setIsLoadingProjects(false);
    setSelectedProjects([]);

    /*
     * Flip entered → false to trigger exit animation.
     */
    setDialogEntered(false);

    /*
     * Unmount the dialog after the exit transition finishes.
     */
    dialogCloseTimeoutRef.current = setTimeout(() => {
      setSelectedProjectStatus(null);
      dialogCloseTimeoutRef.current = null;
    }, DIALOG_EXIT_DURATION_MS);
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                    Dialog Enter Animation Trigger                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedProjectStatus) return;

    /*
     * Two RAFs: first paints the offscreen state,
     * second flips to entered so the transition runs.
     */
    let raf1 = null;
    let raf2 = null;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setDialogEntered(true);
      });
    });

    return () => {
      if (raf1 !== null) cancelAnimationFrame(raf1);
      if (raf2 !== null) cancelAnimationFrame(raf2);
    };
  }, [selectedProjectStatus]);

  /* ------------------------------------------------------------------------ */
  /*                         Fetch Project Counts                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjectCounts = async () => {
      try {
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/projects/counts`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}`
          );
        }

        const result = await response.json();
        const data = result?.data || result || {};

        setProjectCounts(data);
      } catch (err) {
        if (err?.name === "AbortError") return;

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch project counts";

        setError(errorMessage);
        console.error("❌ Project Counts API Error:", errorMessage);
      }
    };

    fetchProjectCounts();

    return () => controller.abort();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         Fetch Projects By Status                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjectsByStatus = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/projects`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}`
          );
        }

        const result = await response.json();

        const projects = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];

        const completed = projects.filter((p) =>
          isCompletedStatus(p?.project_status ?? p?.status)
        );

        const inProgress = projects.filter((p) =>
          isInProgressStatus(p?.project_status ?? p?.status)
        );

        const upcoming = projects.filter((p) =>
          isUpcomingStatus(p?.project_status ?? p?.status)
        );

        setProjectsByStatus({ completed, inProgress, upcoming });
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("❌ Projects pre-load error:", err);
      }
    };

    fetchProjectsByStatus();

    return () => controller.abort();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         Hero Video Parallax                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      hero.style.setProperty("--parallax-y", "0px");
      return;
    }

    let rafId = null;

    const update = () => {
      const rect = hero.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        rafId = null;
        return;
      }

      const offset = rect.top * -0.15;
      hero.style.setProperty("--parallax-y", `${offset}px`);

      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                            Body Scroll Lock                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!openPopup) return;

    scrollYRef.current = window.scrollY;

    const previousStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollYRef.current}px`;

    return () => {
      document.body.style.overflow = previousStyles.overflow;
      document.body.style.position = previousStyles.position;
      document.body.style.width = previousStyles.width;
      document.body.style.top = previousStyles.top;

      window.scrollTo(0, scrollYRef.current);
    };
  }, [openPopup]);

  useEffect(() => {
    if (!selectedProjectStatus) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProjectStatus]);

  /* ------------------------------------------------------------------------ */
  /*                    Dialog Internal Scroll Handling                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const container = projectListRef.current;
    if (!container) return;

    container.scrollTop = 0;

    const onWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const atTop = scrollTop <= 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1;

      const scrollingUp = event.deltaY < 0;
      const scrollingDown = event.deltaY > 0;

      if (
        (atTop && scrollingUp) ||
        (atBottom && scrollingDown)
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.stopPropagation();
    };

    container.addEventListener("wheel", onWheel, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [selectedProjectStatus, selectedProjects]);

  /* ------------------------------------------------------------------------ */
  /*                              Cleanup                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (dialogCloseTimeoutRef.current) {
        clearTimeout(dialogCloseTimeoutRef.current);
      }
      if (projectsFetchControllerRef.current) {
        projectsFetchControllerRef.current.abort();
        projectsFetchControllerRef.current = null;
      }

      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                             Map Popup                                     */
  /* ------------------------------------------------------------------------ */

  const handleOpenPopup = useCallback(() => {
    setOpenPopup(true);
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsAnimating(false);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenPopup(false);
    }, 300);
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         Project Card Renderer                              */
  /* ------------------------------------------------------------------------ */

  const renderProjectCard = (project, index) => {
    const projectId =
      project?.id ??
      project?.project_id ??
      project?.slug ??
      `project-${index}`;

    const title =
      project?.title ||
      project?.name ||
      project?.project_name ||
      "Untitled Project";

    const location =
      project?.location || project?.project_location || "";

    const category =
      project?.category || project?.project_category || "";

    const featuredImageUrl = resolveFeaturedImage(project);
    const hasImage = Boolean(featuredImageUrl);

    return (
      <Box
        key={projectId}
        className="project-card"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          minHeight: 220,
          padding: 2,
          borderRadius: 2,
          overflow: "hidden",
          color: hasImage ? "#fff" : "#222",
          backgroundColor: hasImage ? "#000" : "#fff",
          border: hasImage ? "none" : "1px solid #e5e5e5",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

          backgroundImage: hasImage
            ? `url("${featuredImageUrl}")`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          transition: "transform 0.3s ease, box-shadow 0.3s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          },

          "&::before": hasImage
            ? {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.10) 100%)",
                zIndex: 1,
                pointerEvents: "none",
              }
            : {},
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "8px",
              fontSize: "1.25rem",
              lineHeight: 1.3,
              color: hasImage ? "#fff" : "#111",
            }}
          >
            {title}
          </h3>

          {location && (
            <p
              style={{
                margin: "4px 0",
                color: hasImage
                  ? "rgba(255,255,255,0.92)"
                  : "#555",
              }}
            >
              <strong>Location:</strong> {location}
            </p>
          )}

          {category && (
            <p
              style={{
                margin: "4px 0",
                color: hasImage
                  ? "rgba(255,255,255,0.92)"
                  : "#555",
              }}
            >
              <strong>Service:</strong> {category}
            </p>
          )}
        </Box>
      </Box>
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                                  Render                                  */
  /* ------------------------------------------------------------------------ */

  /*
   * Compute the dialog paper transform based on entered state.
   * Offscreen uses `dialogDirection`; on-screen is identity.
   */
  const dialogOffscreenTransform =
    DIALOG_OFFSCREEN_TRANSFORM[dialogDirection] ?? "scale(0.85)";

  return (
    <>
      {/* VideoObject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsVideoJsonLd),
        }}
      />

      {/* Projects Hero */}
      <section
        className="projects-hero-section"
        ref={heroRef}
        aria-labelledby="projects-hero-title"
      >
        <div className="projects-video-wrapper" aria-hidden="true">
          <video
            className="bg-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={PROJECTS_VIDEO.poster}
            width="1920"
            height="1080"
            disablePictureInPicture
          >
            <source src={PROJECTS_VIDEO.mp4} type="video/mp4" />
            <source src={PROJECTS_VIDEO.webm} type="video/webm" />
          </video>
        </div>

        <div
          className="elementor-background-overlay"
          aria-hidden="true"
        />

        <p className="projects-video-description">
          {PROJECTS_VIDEO.description}
        </p>

        <div className="hero-content position-absolute top-50 start-50 translate-middle text-center">
          <h1 id="projects-hero-title">Our Projects</h1>

          <div className="stats-grid">
            {/* Completed */}
            <div
              className="stat-item completed"
              onClick={() => handleStatClick("Completed")}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  handleStatClick("Completed");
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="View completed projects"
            >
              <span className="stat-number">
                <CountUp
                  end={
                    projectCounts?.completed_projects ??
                    projectsByStatus.completed.length
                  }
                  className="total-value"
                  duration={20000}
                />
              </span>
              <span className="stat-label">Completed</span>
            </div>

            {/* In Progress */}
            <div
              className="stat-item inprogress"
              onClick={() => handleStatClick("In Progress")}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  handleStatClick("In Progress");
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="View in progress projects"
            >
              <span className="stat-number">
                <CountUp
                  end={
                    projectCounts?.ongoing_projects ??
                    projectsByStatus.inProgress.length
                  }
                  className="total-value"
                />
              </span>
              <span className="stat-label">In Progress</span>
            </div>

            {/* Upcoming */}
            <div
              className="stat-item upcoming"
              onClick={() => handleStatClick("Upcoming")}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  handleStatClick("Upcoming");
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="View upcoming projects"
            >
              <span className="stat-number">
                <CountUp
                  end={
                    projectCounts?.upcoming_projects ??
                    projectsByStatus.upcoming.length
                  }
                  className="total-value"
                />
              </span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>

          {/* Project Status Dialog */}
          <Dialog
            open={Boolean(selectedProjectStatus)}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="md"
            aria-labelledby="project-status-dialog-title"
            disableScrollLock
            /* Keep mounted during exit so the exit animation plays */
            keepMounted
            sx={{ zIndex: 1400 }}
            slotProps={{
              paper: {
                sx: {
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",

                  /*
                   * Directional enter/exit animation.
                   */
                  transform: dialogEntered
                    ? "translate(0, 0) scale(1)"
                    : dialogOffscreenTransform,

                  opacity: dialogEntered ? 1 : 0,

                  transition: `transform ${
                    dialogEntered
                      ? DIALOG_ENTER_DURATION_MS
                      : DIALOG_EXIT_DURATION_MS
                  }ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${
                    dialogEntered
                      ? DIALOG_ENTER_DURATION_MS
                      : DIALOG_EXIT_DURATION_MS
                  }ms ease`,

                  willChange: "transform, opacity",

                  /*
                   * Respect users who prefer reduced motion.
                   */
                  "@media (prefers-reduced-motion: reduce)": {
                    transform: "none !important",
                    opacity: "1 !important",
                    transition: "none !important",
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                maxHeight: "90vh",
                overflow: "hidden",
              }}
            >
              {/* Dialog Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  gap: 2,
                  flexShrink: 0,
                }}
              >
                <Box>
                  <h2
                    id="project-status-dialog-title"
                    style={{ margin: 0 }}
                  >
                    {selectedProjectStatus} Projects
                  </h2>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#666",
                    }}
                  >
                    {isLoadingProjects
                      ? "Loading…"
                      : `${selectedProjects.length} project${
                          selectedProjects.length !== 1 ? "s" : ""
                        }`}
                  </p>
                </Box>

                <IconButton
                  onClick={handleCloseDialog}
                  aria-label="Close project dialog"
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Project List */}
              {isLoadingProjects ? (
                <Box
                  sx={{
                    py: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <CircularProgress
                    size={32}
                    aria-label="Loading projects"
                  />
                </Box>
              ) : selectedProjects.length > 0 ? (
                <Box
                  ref={projectListRef}
                  tabIndex={0}
                  role="region"
                  aria-label={`${selectedProjectStatus} projects list`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",

                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 1,
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                    outline: "none",
                    "&:focus-visible": {
                      outline: "2px solid #1976d2",
                      outlineOffset: 2,
                      borderRadius: 1,
                    },
                  }}
                >
                  {selectedProjects.map(renderProjectCard)}
                </Box>
              ) : (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <p>
                    No{" "}
                    {selectedProjectStatus?.toLowerCase()}{" "}
                    projects found.
                  </p>
                </Box>
              )}
            </Box>
          </Dialog>

          {/* API Error */}
          {error && (
            <div className="text-center text-danger mb-3">
              <small>⚠️ {error}</small>
            </div>
          )}

          {/* Fullscreen Map Button */}
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

      {/* Projects Listing */}
      <section className="container-fluid p-0 m-0 bg-white position-relative">
        <div
          className="container py-4 bg-white"
          aria-label="Projects section"
        >
          <div className="auto-grid">
            <ProjectDetails
              projectCounts={projectCounts}
              error={error}
            />
          </div>
        </div>
      </section>

      {/* Fullscreen Map Dialog */}
      <Dialog
        fullScreen
        open={openPopup}
        onClose={handleClosePopup}
        className="fullscreen-map-dialog"
        disableScrollLock
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#f5f5f5",
            position: "relative",
            overflow: "hidden",
            transform: isAnimating
              ? "scale(1)"
              : "scale(0.3)",
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
          aria-label="Close fullscreen map"
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