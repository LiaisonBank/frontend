"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Dialog,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import useBodyClass from "@/components/useBodyClass";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";
import ProjectDetails from "@/components/ProjectDetail/ProjectDetails";

export default function ProjectsPage() {
  useBodyClass("completed");
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);

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
          <Button variant="outlined" className="outline-theme-btn" onClick={handleOpenPopup}>
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
          },
        }}
      >
        <IconButton
          className="fullscreen-close-btn"
          onClick={handleClosePopup}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <Box className="mumbai-map-fullscreen">
          <MumbaiMap />
        </Box>
      </Dialog>
    </>
  );
}