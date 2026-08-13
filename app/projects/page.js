"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import useBodyClass from "@/components/useBodyClass";
import { completedList } from "@/lib/data/completedList";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";

// Constants
const ITEMS_PER_PAGE = 10;
const SCROLL_INTERVAL_MS = 30000;
const MOBILE_SCROLL_INTERVAL_MS = 3000;

export default function ProjectsPage() {
  useBodyClass("completed");

  // =========================
  // State
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // =========================
  // Refs
  // =========================
  const listRef = useRef(null);
  const mobileListRef = useRef(null);
  const intervalRef = useRef(null);
  const mobileIntervalRef = useRef(null);

  // =========================
  // Memoized calculations
  // =========================
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(completedList.length / ITEMS_PER_PAGE)),
    [],
  );

  const safeCurrentPage = useMemo(
    () => Math.min(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const currentProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return completedList.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [safeCurrentPage]);

  // =========================
  // Status color
  // =========================
  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";

      case "in progress":
        return "warning";

      case "upcoming":
        return "primary";

      case "cancelled":
        return "error";

      default:
        return "default";
    }
  }, []);

  // =========================
  // Pagination
  // =========================
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  // =========================
  // Infinite scroll
  // =========================
  const setupInfiniteScroll = useCallback(
    (element, intervalMs) => {
      if (!element || completedList.length <= 1) {
        return () => {};
      }

      let isAnimating = false;

      const scroll = () => {
        if (isAnimating || isTransitioning) {
          return;
        }

        const first = element.firstElementChild;

        if (!first) {
          return;
        }

        const height = first.getBoundingClientRect().height;

        if (height === 0) {
          return;
        }

        isAnimating = true;
        setIsTransitioning(true);

        element.style.transition =
          "transform 0.6s ease-in-out";

        element.style.transform =
          `translateY(-${height}px)`;

        const onTransitionEnd = () => {
          try {
            element.appendChild(first);

            element.style.transition = "none";
            element.style.transform = "translateY(0)";

            // Force reflow
            void element.offsetHeight;
          } catch (error) {
            console.error(
              "Infinite scroll transition error:",
              error,
            );
          } finally {
            isAnimating = false;
            setIsTransitioning(false);

            element.removeEventListener(
              "transitionend",
              onTransitionEnd,
            );
          }
        };

        element.addEventListener(
          "transitionend",
          onTransitionEnd,
          {
            once: true,
          },
        );
      };

      const interval = setInterval(scroll, intervalMs);

      return () => {
        clearInterval(interval);

        element.style.transition = "none";
        element.style.transform = "translateY(0)";
      };
    },
    [isTransitioning],
  );

  // =========================
  // Desktop infinite scroll
  // =========================
  useEffect(() => {
    const cleanup = setupInfiniteScroll(
      listRef.current,
      SCROLL_INTERVAL_MS,
    );

    return cleanup;
  }, [setupInfiniteScroll]);

  // =========================
  // Mobile infinite scroll
  // =========================
  useEffect(() => {
    const cleanup = setupInfiniteScroll(
      mobileListRef.current,
      MOBILE_SCROLL_INTERVAL_MS,
    );

    return cleanup;
  }, [setupInfiniteScroll]);

  // =========================
  // Cleanup
  // =========================
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (mobileIntervalRef.current) {
        clearInterval(mobileIntervalRef.current);
      }
    };
  }, []);

  // =========================
  // Pagination buttons
  // =========================
  const renderPaginationButtons = useCallback(() => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(
      1,
      safeCurrentPage - Math.floor(maxVisible / 2),
    );

    let endPage = Math.min(
      totalPages,
      startPage + maxVisible - 1,
    );

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(
        1,
        endPage - maxVisible + 1,
      );
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        type="button"
        key={page}
        className={`pagination-page ${
          safeCurrentPage === page ? "active" : ""
        }`}
        onClick={() => handlePageChange(page)}
        aria-label={`Go to page ${page}`}
        aria-current={
          safeCurrentPage === page
            ? "page"
            : undefined
        }
      >
        {page}
      </button>
    ));
  }, [
    safeCurrentPage,
    totalPages,
    handlePageChange,
  ]);

  // =========================
  // Empty state
  // =========================
  if (completedList.length === 0) {
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

                      <nav
                        aria-label="breadcrumb"
                        className="page-breadcrumb"
                      >
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

        <section className="container">
          <div className="empty-state">
            <p>
              No projects available at the moment.
            </p>
          </div>
        </section>
      </>
    );
  }

  // =========================
  // Main render
  // =========================
  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Projects</h1>

                    <nav
                      aria-label="breadcrumb"
                      className="page-breadcrumb"
                    >
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

      {/* Projects Section */}
      <section
        className="container pb-4"
        aria-label="Projects section"
      >
        <div className="auto-grid">

          {/* Mumbai Map */}
          <MumbaiMap />

          <div className="client-table-container">

            {/* =========================
                Desktop Table
            ========================= */}
            <div
              className="client-table-wrapper"
              role="region"
              aria-label="Projects table"
            >
              <table className="client-table">

                <thead>
                  <tr className="header-row">
                    <th
                      className="item-name"
                      scope="col"
                    >
                      Brand Name
                    </th>

                    <th
                      className="item-type"
                      scope="col"
                    >
                      Category Type
                    </th>

                    <th
                      className="item-status"
                      scope="col"
                    >
                      Status
                    </th>

                    <th
                      className="item-location"
                      scope="col"
                    >
                      Location
                    </th>
                  </tr>
                </thead>

                <tbody ref={listRef}>
                  {currentProjects.map((project) => (
                    <tr
                      className="client-row"
                      key={project.id}
                    >
                      <td className="item-name">
                        {project.clientName}
                      </td>

                      <td className="item-type">
                        {project.type}
                      </td>

                      <td className="item-status">
                        <Chip
                          label={project.status}
                          size="small"
                          color={getStatusColor(
                            project.status,
                          )}
                        />
                      </td>

                      <td className="item-location">
                        {project.location}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* =========================
                Mobile Cards
            ========================= */}
            <div
              className="mobile-cards"
              ref={mobileListRef}
              aria-label="Mobile project cards"
            >
              {currentProjects.map((project) => (
                <div
                  className="mobile-card"
                  key={`mobile-${project.id}`}
                >
                  <div className="mobile-card-content">

                    <div className="mobile-card-header">

                      <h3 className="mobile-card-title">
                        {project.clientName}
                      </h3>

                      <Chip
                        label={project.status}
                        size="small"
                        color={getStatusColor(
                          project.status,
                        )}
                      />

                    </div>

                    <div className="mobile-card-details">

                      <span className="mobile-card-type">
                        {project.type}
                      </span>

                      <span className="mobile-card-location">
                        {project.location}
                      </span>

                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* =========================
                Pagination
            ========================= */}
            {totalPages > 1 && (
              <nav
                className="pagination"
                aria-label="Project pagination"
              >
                <button
                  type="button"
                  className="pagination-btn prev-btn"
                  onClick={() =>
                    handlePageChange(
                      safeCurrentPage - 1,
                    )
                  }
                  disabled={safeCurrentPage === 1}
                  aria-label="Previous page"
                >
                  Previous
                </button>

                <div
                  className="pagination-pages"
                  role="group"
                  aria-label="Page numbers"
                >
                  {renderPaginationButtons()}
                </div>

                <button
                  type="button"
                  className="pagination-btn next-btn"
                  onClick={() =>
                    handlePageChange(
                      safeCurrentPage + 1,
                    )
                  }
                  disabled={
                    safeCurrentPage === totalPages
                  }
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            )}

          </div>
        </div>
      </section>
    </>
  );
}