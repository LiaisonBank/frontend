"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useBodyClass from "@/components/useBodyClass";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";
import ProjectDetails from "@/components/ProjectDetail/ProjectDetails";

export default function ProjectsPage() {
  useBodyClass("completed");
  const [openPopup, setOpenPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <>
      <div className="page-header">
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

      <section className="container py-4" aria-label="Projects section">
        <div className="mb-4 text-end">
          <Button
            variant="outlined"
            className="outline-theme-btn"
            onClick={handleOpenPopup}
          >
            View Full Screen Map
          </Button>
        </div>
        <div className="auto-grid">
          <ProjectDetails />
        </div>
      </section>

      {/* Full Screen Map Dialog */}
      <Dialog
        fullScreen
        open={openPopup}
        onClose={handleClosePopup}
        className="fullscreen-map-dialog"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#f5f5f5",
            position: "relative",
            overflow: "hidden",
            transform: isAnimating ? "scale(1)" : "scale(0.3)",
            opacity: isAnimating ? 1 : 0,
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
            transformOrigin: "center center",
            borderRadius: isAnimating ? 0 : "50%",
            width: isAnimating ? "100%" : "0px",
            height: isAnimating ? "100%" : "0px",
            margin: isAnimating ? 0 : "auto",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: isAnimating ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)",
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