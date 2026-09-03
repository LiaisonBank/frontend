"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useBodyClass from "@/components/useBodyClass";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";
import ProjectDetails from "@/components/ProjectDetail/ProjectDetails";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

export default function ProjectsPage() {
  useBodyClass("completed");
  const [openPopup, setOpenPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [projectCounts, setProjectCounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);

  // Fetch project counts on page load
  useEffect(() => {
    const fetchProjectCounts = async () => {
      try {
        setIsLoading(true);
        setLoading(true); // Set loading to true when fetch starts
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/projects/counts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Extract data from the nested structure
        const data = result?.data || result;
        
        setProjectCounts(data);
        
        // Production-ready console log with specific values from nested data
        console.log("✅ Project Counts API Response:", {
          completed_projects: data.completed_projects || 0,
          ongoing_projects: data.ongoing_projects || 0,
          upcoming_projects: data.upcoming_projects || 0,
          total_projects: data.total_projects || 0,
          active_projects: data.active_projects || 0,
          featured_projects: data.featured_projects || 0,
          inactive_projects: data.inactive_projects || 0,
          full_response: result,
          timestamp: new Date().toISOString(),
          status: "success",
          endpoint: "/api/projects/counts",
        });

        // Individual console logs for each value
        console.log("📊 Completed Projects:", data.completed_projects || 0);
        console.log("📊 Ongoing Projects:", data.ongoing_projects || 0);
        console.log("📊 Upcoming Projects:", data.upcoming_projects || 0);
        console.log("📊 Total Projects:", data.total_projects || 0);
        console.log("📊 Active Projects:", data.active_projects || 0);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch project counts";
        setError(errorMessage);
        
        // Error logging for production
        console.error("❌ Project Counts API Error:", {
          error: errorMessage,
          timestamp: new Date().toISOString(),
          endpoint: "/api/projects/counts",
          originalError: err,
        });
      } finally {
        setIsLoading(false);
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchProjectCounts();
  }, []);

  // Log project counts whenever they update with specific values
  useEffect(() => {
    if (projectCounts) {
      console.log("📊 Project Counts Updated:", {
        completed_projects: projectCounts.completed_projects || 0,
        ongoing_projects: projectCounts.ongoing_projects || 0,
        upcoming_projects: projectCounts.upcoming_projects || 0,
        total_projects: projectCounts.total_projects || 0,
        timestamp: new Date().toISOString(),
      });
    }
  }, [projectCounts]);

  const handleOpenPopup = () => {
    // Remove body scrollbar
    document.body.style.overflow = "hidden";
    setOpenPopup(true);
    // Trigger animation after a small delay
    setTimeout(() => setIsAnimating(true), 50);
  };

  const handleClosePopup = () => {
    setIsAnimating(false);
    // Restore body scrollbar with a delay to allow animation to complete
    setTimeout(() => {
      setOpenPopup(false);
      document.body.style.overflow = "";
    }, 300);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Control body scroll when popup is open
useEffect(() => {
  if (openPopup) {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
    
    // Store scroll position for restoration
    window._scrollY = window.scrollY;
  } else {
    // Restore scrolling
    const scrollY = window._scrollY || 0;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollY);
  }

  // Cleanup function
  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  };
}, [openPopup]);

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
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
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
      <section className="projects-hero-section">
        <div className="elementor-background-overlay"></div>
        <div className="hero-content">
          <h1>PROJECTS</h1>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">
                {loading ? "..." : projectCounts?.completed_projects || "0"}
              </span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {loading ? "..." : projectCounts?.ongoing_projects || "0"}
              </span>
              <span className="stat-label">Ongoing</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {loading ? "..." : projectCounts?.upcoming_projects || "0"}
              </span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>
          
          {/* Add loading/error state indicator */}
          {error && (
            <div className="text-center text-danger mb-3">
              <small>⚠️ {error}</small>
            </div>
          )}
          
          <div className="text-center">
            <Button
              variant="outlined"
              className="outline-theme-btn"
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
            <ProjectDetails />
          </div>
        </div>
      </section>

      {/* Full Screen Map Dialog */}
      <Dialog
  fullScreen
  open={openPopup}
  onClose={handleClosePopup}
  className="fullscreen-map-dialog"
  disableScrollLock={false} // Ensure scroll lock is enabled
  sx={{
    "& .MuiDialog-paper": {
      backgroundColor: "#f5f5f5",
      position: "relative",
      overflow: "hidden", // Prevent scroll inside dialog
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
    // Prevent body scroll when dialog is open
    "& .MuiBackdrop-root": {
      position: 'fixed',
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

      {/* Add global styles for body scrollbar removal */}
      <style jsx global>{`
        body {
          overflow: ${openPopup ? "hidden" : ""};
        }
      `}</style>
    </>
  );
}