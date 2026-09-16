"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import "./ProjectDetails.scss";

const ITEMS_PER_LOAD = 20;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

export default function ProjectDetails({ projectCounts, loading: parentLoading, error: parentError }) {
  // =========================================================
  // REFS
  // =========================================================
  const tableBodyRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const sentinelRef = useRef(null);          // IntersectionObserver sentinel
  const loadingRef = useRef(false);          // Prevents duplicate fetches
  const hasMoreRef = useRef(true);           // Tracks hasMore without stale closure
  const pageRef = useRef(1);                 // Tracks current page without stale closure

  // =========================================================
  // STATE
  // =========================================================
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSentinelVisible, setIsSentinelVisible] = useState(false);

  // =========================================================
  // SCROLL FUNCTIONS
  // =========================================================
  const scrollTableToTop = useCallback(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, []);

  const scrollToTableWrapper = useCallback(() => {
    if (tableWrapperRef.current) {
      const wrapperRect = tableWrapperRef.current.getBoundingClientRect();
      const offset = 80;
      const targetPosition = window.scrollY + wrapperRect.top - offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
      setTimeout(scrollTableToTop, 100);
    }
  }, [scrollTableToTop]);

  // =========================================================
  // NORMALIZE HELPERS
  // =========================================================
  const normalize = useCallback((value) => {
    return String(value ?? "").trim().toLowerCase();
  }, []);

  const normalizeProjects = useCallback((projectsData, pageNum = 1) => {
    return projectsData.map((project, index) => ({
      ...project,
      id: project.id || project.project_id || `project-${pageNum}-${index}`,
      client_name: project.client_name || project.name,
      project_status: project.project_status || project.status,
      projectsCategory:
        project.projectsCategory ||
        project.type ||
        project.category ||
        "Uncategorized",
      location: project.location,
    }));
  }, []);

  // =========================================================
  // FETCH PROJECTS - INITIAL LOAD
  // =========================================================
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        hasMoreRef.current = true;
        pageRef.current = 1;

        const response = await fetch(
          `${API_BASE_URL}/api/projects/distinct?page=1&limit=${ITEMS_PER_LOAD}`,
          {
            method: "GET",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch projects: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        if (!isMounted) return;

        const projectsData = Array.isArray(data)
          ? data
          : data.projects || data.data || [];

        const hasMoreItems =
          data.hasMore !== undefined
            ? data.hasMore
            : data.next_page !== null
              ? true
              : projectsData.length === ITEMS_PER_LOAD;

        hasMoreRef.current = hasMoreItems;
        setHasMore(hasMoreItems);

        const normalizedProjects = normalizeProjects(projectsData, 1);
        setProjects(normalizedProjects);
        setVisibleCount(Math.min(ITEMS_PER_LOAD, normalizedProjects.length));
        setPage(1);
        pageRef.current = 1;
      } catch (err) {
        if (err.name === "AbortError") return;
        if (!isMounted) return;
        console.error("Error fetching projects:", err);
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [normalizeProjects]);

  // =========================================================
  // FETCH MORE PROJECTS - AUTO INFINITE SCROLL
  // =========================================================
  const fetchMoreProjects = useCallback(
    async (pageNum) => {
      if (loadingRef.current || !hasMoreRef.current) return;

      try {
        loadingRef.current = true;
        setLoadingMore(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/projects/distinct?page=${pageNum}&limit=${ITEMS_PER_LOAD}`,
          {
            method: "GET",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch more projects: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const projectsData = Array.isArray(data)
          ? data
          : data.projects || data.data || [];

        const hasMoreItems =
          data.hasMore !== undefined
            ? data.hasMore
            : data.next_page !== null
              ? true
              : projectsData.length === ITEMS_PER_LOAD;

        hasMoreRef.current = hasMoreItems;
        setHasMore(hasMoreItems);

        if (projectsData.length === 0) {
          setLoadingMore(false);
          loadingRef.current = false;
          return;
        }

        const normalizedProjects = normalizeProjects(projectsData, pageNum);

        setProjects((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewProjects = normalizedProjects.filter(
            (p) => !existingIds.has(p.id),
          );
          return [...prev, ...uniqueNewProjects];
        });

        setVisibleCount((prev) => prev + projectsData.length);
        setPage(pageNum);
        pageRef.current = pageNum;
      } catch (err) {
        console.error("Error fetching more projects:", err);
        setError(err instanceof Error ? err.message : "Failed to load more projects");
      } finally {
        setLoadingMore(false);
        loadingRef.current = false;
      }
    },
    [normalizeProjects],
  );

  // =========================================================
  // INTERSECTION OBSERVER — AUTO LOAD MORE ON SCROLL
  // =========================================================
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = tableBodyRef.current;

    if (!sentinel || !scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsSentinelVisible(entry.isIntersecting);

        if (
          entry.isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current &&
          !loading
        ) {
          const nextPage = pageRef.current + 1;
          fetchMoreProjects(nextPage);
        }
      },
      {
        root: scrollContainer,       // Observe inside the scrollable table body
        rootMargin: "200px",         // Pre-load before user hits bottom
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchMoreProjects, loading]);

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================
  const categoryOptions = useMemo(() => {
    const categories = projects
      .map((project) => project?.projectsCategory)
      .filter(Boolean)
      .map((type) => String(type).trim());
    return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // =========================================================
  // FILTERED PROJECTS - MEMOIZED
  // =========================================================
  const filteredProjects = useMemo(() => {
    const location = normalize(locationFilter);
    const status = normalize(statusFilter);
    const category = normalize(categoryFilter);

    return projects.filter((project) => {
      const projectLocation = normalize(project?.location);
      const projectStatus = normalize(project?.project_status);
      const projectType = normalize(project?.projectsCategory);

      const matchesLocation = !location || projectLocation.includes(location);
      const matchesStatus = statusFilter === "All" || projectStatus === status;
      const matchesCategory = categoryFilter === "All" || projectType === category;

      return matchesLocation && matchesStatus && matchesCategory;
    });
  }, [projects, locationFilter, statusFilter, categoryFilter, normalize]);

  // =========================================================
  // VISIBLE PROJECTS
  // =========================================================
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  // =========================================================
  // LOAD STATES
  // =========================================================
  const hasActiveFilters =
    locationFilter.trim() !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All";

  // =========================================================
  // STATUS COLOR
  // =========================================================
  const getStatusClass = useCallback(
    (status) => {
      const normalizedStatus = normalize(status);
      if (normalizedStatus === "completed") return "status-completed";
      if (normalizedStatus === "upcoming") return "status-upcoming";
      if (normalizedStatus === "in progress") return "status-in-progress";
      return "status-default";
    },
    [normalize],
  );

  // =========================================================
  // FILTER HANDLERS
  // =========================================================
  const handleLocationChange = useCallback(
    (event) => {
      setLocationFilter(event.target.value);
      setVisibleCount(ITEMS_PER_LOAD);
      scrollToTableWrapper();
    },
    [scrollToTableWrapper],
  );

  const handleStatusChange = useCallback(
    (event) => {
      setStatusFilter(event.target.value);
      setVisibleCount(ITEMS_PER_LOAD);
      scrollToTableWrapper();
    },
    [scrollToTableWrapper],
  );

  const handleCategoryChange = useCallback(
    (event) => {
      setCategoryFilter(event.target.value);
      setVisibleCount(ITEMS_PER_LOAD);
      scrollToTableWrapper();
    },
    [scrollToTableWrapper],
  );

  const handleClearFilters = useCallback(() => {
    setLocationFilter("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setVisibleCount(ITEMS_PER_LOAD);
    scrollToTableWrapper();
  }, [scrollToTableWrapper]);

  // =========================================================
  // HANDLE TABLE SCROLL WITH BODY SCROLL PASS-THROUGH
  // =========================================================
  const handleTableWheel = useCallback((e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const atTop = scrollTop === 0;
    const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) return;

    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const tableBody = tableBodyRef.current;
    if (!tableBody) return;

    const wheelHandler = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = tableBody;
      const atTop = scrollTop === 0;
      const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) return;

      e.preventDefault();
      e.stopPropagation();
    };

    tableBody.addEventListener("wheel", wheelHandler, { passive: false });
    return () => tableBody.removeEventListener("wheel", wheelHandler);
  }, []);

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <section className="project-details" aria-label="Loading projects">
        <div className="client-table-container">
          <div className="premium-skeleton" role="status" aria-live="polite">
            <div className="skeleton-header" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton-row" key={i}>
                <div className="skeleton-cell wide" />
                <div className="skeleton-cell" />
                <div className="skeleton-cell short" />
                <div className="skeleton-cell" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================
  if (error && projects.length === 0) {
    return (
      <section className="project-details" aria-label="Error loading projects">
        <div className="client-table-container">
          <div className="project-error" role="alert">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Projects</h3>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="retry-btn"
              aria-label="Retry loading projects"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <section className="project-details" aria-label="Project details">
      <div className="client-table-container">
        {/* FILTERS */}
        <div className="project-filters">
          <div className="project-filter location-filter">
            <label htmlFor="project-location">Location</label>
            <div className="filter-input">
              <svg
                className="filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                id="project-location"
                type="search"
                value={locationFilter}
                onChange={handleLocationChange}
                placeholder="Search location..."
                autoComplete="off"
                aria-label="Filter by location"
              />
            </div>
          </div>

          <div className="project-filter">
            <label htmlFor="project-status">Status</label>
            <select
              id="project-status"
              value={statusFilter}
              onChange={handleStatusChange}
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div className="project-filter">
            <label htmlFor="project-category">Category Type</label>
            <select
              id="project-category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* TOTAL COUNT (FILTERED) */}
          <div className="project-filter filter-actions">
            <span className="total-projects">
              Total: <strong>{filteredProjects.length}</strong>
            </span>
            {hasActiveFilters && (
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
                aria-label="Clear all filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* RESULTS INFO */}
        <div className="project-results-info" role="status" aria-live="polite">
          <span>
            Showing <strong>{visibleProjects.length}</strong> of{" "}
            <strong>{projectCounts?.total_projects ?? filteredProjects.length}</strong> projects
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="project-empty" role="status">
            <div className="empty-icon">🔍</div>
            <h3>No projects found</h3>
            <p>Try changing your filters.</p>
            <button onClick={handleClearFilters} aria-label="Clear all filters">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* TABLE WITH FIXED HEADER */}
            <div className="table-wrapper" ref={tableWrapperRef}>
              <div className="table-container">
                <div className="table-header" role="row">
                  <div role="columnheader">Brand Name</div>
                  <div role="columnheader">Category Type</div>
                  <div role="columnheader">Status</div>
                  <div role="columnheader">Location</div>
                </div>

                <div
                  className="table-body"
                  ref={tableBodyRef}
                  onWheel={handleTableWheel}
                  role="rowgroup"
                >
                  {visibleProjects.map((project, idx) => (
                    <div
                      key={project.id}
                      className="table-row"
                      role="row"
                      style={{ animationDelay: `${Math.min(idx, 10) * 25}ms` }}
                    >
                      <div
                        className="item-name"
                        title={project.client_name}
                        role="cell"
                      >
                        {project.client_name}
                      </div>
                      <div
                        className="item-type"
                        title={project.projectsCategory}
                        role="cell"
                      >
                        {project.projectsCategory}
                      </div>
                      <div className="item-status" role="cell">
                        <Chip
                          label={project.project_status}
                          size="small"
                          className={getStatusClass(project.project_status)}
                          aria-label={`Status: ${project.project_status}`}
                        />
                      </div>
                      <div
                        className="item-location"
                        title={project.location}
                        role="cell"
                      >
                        {project.location &&
                          `${project.location
                            .replace(/\(/g, " (")
                            .replace(/,/g, ", ")}${
                            !project.location.includes("Vasai") &&
                            !project.location.includes("Virar") &&
                            !project.location.includes("Mumbai")
                              ? ", Mumbai"
                              : ""
                          }`}
                      </div>
                    </div>
                  ))}

                  {/* ====== INFINITE SCROLL SENTINEL ====== */}
                  {hasMore && (
                    <div
                      ref={sentinelRef}
                      className="infinite-scroll-sentinel"
                      aria-hidden="true"
                    >
                      {loadingMore && (
                        <div className="infinite-scroll-loading">
                          <span className="premium-spinner" />
                          <span>Loading more projects…</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ====== END OF LIST ====== */}
                  {!hasMore && visibleProjects.length > 0 && (
                    <div className="all-projects-loaded">
                      <span className="divider" />
                      <span>You&quote;ve reached the end — {filteredProjects.length} projects</span>
                      <span className="divider" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}