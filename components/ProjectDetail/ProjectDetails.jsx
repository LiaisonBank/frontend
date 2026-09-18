"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Chip from "@mui/material/Chip";

import "./ProjectDetails.scss";

const ITEMS_PER_LOAD = 20;
const MIN_LOADING_DISPLAY_MS = 600; // 👈 minimum overlay duration

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

export default function ProjectDetails({
  projectCounts,
  loading: parentLoading,
  error: parentError,
}) {
  // =========================================================
  // REFS
  // =========================================================

  const tableBodyRef = useRef(null);
  const tableWrapperRef = useRef(null);

  // Sentinel element used by IntersectionObserver
  const observerTargetRef = useRef(null);

  // Prevent duplicate requests
  const isFetchingRef = useRef(false);

  // Keep current page in a ref so IntersectionObserver
  // always gets the latest page without stale closures
  const pageRef = useRef(1);

  // Keep hasMore in a ref for the observer
  const hasMoreRef = useRef(true);

  // Abort currently running request when component unmounts
  const abortControllerRef = useRef(null);

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

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // =========================================================
  // KEEP REFS SYNCHRONIZED
  // =========================================================

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // =========================================================
  // NORMALIZE HELPER
  // =========================================================

  const normalize = useCallback((value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  }, []);

  // =========================================================
  // NORMALIZE PROJECTS
  // =========================================================

  const normalizeProjects = useCallback((projectsData, pageNum = 1) => {
    return projectsData.map((project, index) => ({
      ...project,

      id:
        project.id ??
        project.project_id ??
        `project-${pageNum}-${index}`,

      client_name:
        project.client_name ??
        project.name ??
        "Unnamed Project",

      project_status:
        project.project_status ??
        project.status ??
        "Unknown",

      projectsCategory:
        project.projectsCategory ??
        project.type ??
        project.category ??
        "Uncategorized",

      location: project.location ?? "",
    }));
  }, []);

  // =========================================================
  // DETERMINE HAS MORE
  // =========================================================

  const determineHasMore = useCallback((data, projectsData) => {
    /*
     * Supports different backend response formats:
     *
     * {
     *   hasMore: true
     * }
     *
     * {
     *   next_page: 2
     * }
     *
     * {
     *   total: 100
     * }
     *
     * Or simply:
     *
     * 20 records = probably another page
     */

    if (typeof data?.hasMore === "boolean") {
      return data.hasMore;
    }

    if (typeof data?.has_more === "boolean") {
      return data.has_more;
    }

    if (data?.next_page !== undefined) {
      return data.next_page !== null;
    }

    if (data?.nextPage !== undefined) {
      return data.nextPage !== null;
    }

    if (
      typeof data?.total === "number" &&
      typeof data?.page === "number" &&
      typeof data?.limit === "number"
    ) {
      return data.page * data.limit < data.total;
    }

    return projectsData.length === ITEMS_PER_LOAD;
  }, []);

  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  const fetchProjects = useCallback(
    async (pageNum = 1, isInitialLoad = false) => {
      if (isFetchingRef.current) return;
      if (!isInitialLoad && !hasMoreRef.current) return;

      isFetchingRef.current = true;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      // 👇 record start time so we can enforce minimum display
      const startedAt = Date.now();

      // 👇 helper that waits the remaining time
      const waitMinimumDisplay = async () => {
        const elapsed = Date.now() - startedAt;
        const remaining = MIN_LOADING_DISPLAY_MS - elapsed;

        if (remaining > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, remaining),
          );
        }
      };

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const url =
          `${API_BASE_URL}/api/projects/distinct` +
          `?page=${pageNum}&limit=${ITEMS_PER_LOAD}`;

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch projects: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const projectsData = Array.isArray(data)
          ? data
          : Array.isArray(data?.projects)
            ? data.projects
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.items)
                ? data.items
                : [];

        const normalizedProjects = normalizeProjects(
          projectsData,
          pageNum,
        );

        const moreAvailable = determineHasMore(
          data,
          projectsData,
        );

        // 👇 enforce minimum overlay time BEFORE hiding it
        await waitMinimumDisplay();

        if (isInitialLoad) {
          setProjects(normalizedProjects);
          setPage(1);
          pageRef.current = 1;
          setHasMore(moreAvailable);
          hasMoreRef.current = moreAvailable;
          return;
        }

        setProjects((previousProjects) => {
          const existingIds = new Set(
            previousProjects.map((p) => p.id),
          );

          const uniqueProjects = normalizedProjects.filter(
            (p) => !existingIds.has(p.id),
          );

          return [...previousProjects, ...uniqueProjects];
        });

        setPage(pageNum);
        pageRef.current = pageNum;
        setHasMore(moreAvailable);
        hasMoreRef.current = moreAvailable;
      } catch (err) {
        if (err?.name === "AbortError") return;

        console.error("Project API error:", err);

        // still wait before showing the error (optional)
        await waitMinimumDisplay();

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load projects",
        );
      } finally {
        isFetchingRef.current = false;

        if (isInitialLoad) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [determineHasMore, normalizeProjects],
  );

  // =========================================================
  // INITIAL PROJECT LOAD
  // =========================================================

  useEffect(() => {
    fetchProjects(1, true);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProjects]);

  // =========================================================
  // INFINITE SCROLL - INTERSECTION OBSERVER
  // =========================================================

  useEffect(() => {
    const target = observerTargetRef.current;
    const tableBody = tableBodyRef.current;

    if (!target || !tableBody) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * root = tableBodyRef.current
     *
     * This means the observer watches scrolling
     * INSIDE the project table, not the browser window.
     */

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry?.isIntersecting &&
          !isFetchingRef.current &&
          hasMoreRef.current
        ) {
          const nextPage = pageRef.current + 1;

          fetchProjects(nextPage, false);
        }
      },
      {
        root: tableBody,
        rootMargin: "150px",
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchProjects, projects.length]);

  // =========================================================
  // SCROLL TABLE TO TOP
  // =========================================================

  const scrollTableToTop = useCallback(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  // =========================================================
  // SCROLL PAGE TO TABLE
  // =========================================================

  const scrollToTableWrapper = useCallback(() => {
    if (!tableWrapperRef.current) {
      return;
    }

    const wrapperRect =
      tableWrapperRef.current.getBoundingClientRect();

    const offset = 80;

    const targetPosition =
      window.scrollY + wrapperRect.top - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      scrollTableToTop();
    });
  }, [scrollTableToTop]);

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================

  const categoryOptions = useMemo(() => {
    const categories = projects
      .flatMap((project) => {
        const category = project?.projectsCategory;

        if (Array.isArray(category)) {
          return category;
        }

        return [category];
      })
      .filter(Boolean)
      .map((category) => String(category).trim())
      .filter(Boolean);

    /*
     * Keep combined values such as:
     *
     * Residential/Commercial
     *
     * in the table data, but do not add them
     * to the Category Type dropdown.
     */

    const excludedCategories = new Set([
      "Residential/Commercial",
      "Residential / Commercial",
      "ResidentialCommercial",
    ]);

    return [...new Set(categories)]
      .filter(
        (category) => !excludedCategories.has(category),
      )
      .sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // =========================================================
  // FILTERED PROJECTS
  // =========================================================

  const filteredProjects = useMemo(() => {
    const location = normalize(locationFilter);
    const status = normalize(statusFilter);
    const category = normalize(categoryFilter);

    return projects.filter((project) => {
      const projectLocation = normalize(project.location);

      const projectStatus = normalize(
        project.project_status,
      );

      const projectType = normalize(
        Array.isArray(project.projectsCategory)
          ? project.projectsCategory.join(", ")
          : project.projectsCategory,
      );

      const matchesLocation =
        !location ||
        projectLocation.includes(location);

      const matchesStatus =
        statusFilter === "All" ||
        projectStatus === status;

      const matchesCategory =
        categoryFilter === "All" ||
        projectType === category;

      return (
        matchesLocation &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    projects,
    locationFilter,
    statusFilter,
    categoryFilter,
    normalize,
  ]);

  // =========================================================
  // ACTIVE FILTERS
  // =========================================================

  const hasActiveFilters =
    locationFilter.trim() !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All";

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = useCallback(
    (status) => {
      const normalizedStatus = normalize(status);

      if (normalizedStatus === "completed") {
        return "status-completed";
      }

      if (
        normalizedStatus === "upcoming"
      ) {
        return "status-upcoming";
      }

      if (
        normalizedStatus === "in progress" ||
        normalizedStatus === "ongoing"
      ) {
        return "status-in-progress";
      }

      return "status-default";
    },
    [normalize],
  );

  // =========================================================
  // LOCATION FORMATTER
  // =========================================================

  const formatLocation = useCallback((location) => {
    if (!location) {
      return "";
    }

    let formattedLocation = String(location)
      .replace(/\(/g, " (")
      .replace(/\s+/g, " ")
      .replace(/,\s*/g, ", ")
      .trim();

    const lowerLocation =
      formattedLocation.toLowerCase();

    const alreadyHasMumbai =
      lowerLocation.includes("mumbai");

    const alreadyHasVasai =
      lowerLocation.includes("vasai");

    const alreadyHasVirar =
      lowerLocation.includes("virar");

    if (
      !alreadyHasMumbai &&
      !alreadyHasVasai &&
      !alreadyHasVirar
    ) {
      formattedLocation += ", Mumbai";
    }

    return formattedLocation;
  }, []);

  // =========================================================
  // FILTER HANDLERS
  // =========================================================

  const handleLocationChange = useCallback(
    (event) => {
      setLocationFilter(event.target.value);

      requestAnimationFrame(() => {
        scrollToTableWrapper();
      });
    },
    [scrollToTableWrapper],
  );

  const handleStatusChange = useCallback(
    (event) => {
      setStatusFilter(event.target.value);

      requestAnimationFrame(() => {
        scrollToTableWrapper();
      });
    },
    [scrollToTableWrapper],
  );

  const handleCategoryChange = useCallback(
    (event) => {
      setCategoryFilter(event.target.value);

      requestAnimationFrame(() => {
        scrollToTableWrapper();
      });
    },
    [scrollToTableWrapper],
  );

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = useCallback(() => {
    setLocationFilter("");
    setStatusFilter("All");
    setCategoryFilter("All");

    requestAnimationFrame(() => {
      scrollToTableWrapper();
    });
  }, [scrollToTableWrapper]);

  // =========================================================
  // WHEEL BEHAVIOR
  // =========================================================

  const handleTableWheel = useCallback((event) => {
    const element = event.currentTarget;

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = element;

    const atTop = scrollTop <= 0;

    const atBottom =
      Math.ceil(scrollTop + clientHeight) >=
      scrollHeight;

    /*
     * Allow the page to continue scrolling when
     * the table itself reaches the top/bottom.
     */

    if (
      (event.deltaY < 0 && atTop) ||
      (event.deltaY > 0 && atBottom)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }, []);

  // =========================================================
  // TABLE WHEEL LISTENER
  // =========================================================

  useEffect(() => {
    const tableBody = tableBodyRef.current;

    if (!tableBody) {
      return;
    }

    const wheelHandler = (event) => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = tableBody;

      const atTop = scrollTop <= 0;

      const atBottom =
        Math.ceil(scrollTop + clientHeight) >=
        scrollHeight;

      if (
        (event.deltaY < 0 && atTop) ||
        (event.deltaY > 0 && atBottom)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    tableBody.addEventListener(
      "wheel",
      wheelHandler,
      {
        passive: false,
      },
    );

    return () => {
      tableBody.removeEventListener(
        "wheel",
        wheelHandler,
      );
    };
  }, []);

  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = useCallback(() => {
    setProjects([]);
    setPage(1);
    pageRef.current = 1;

    setHasMore(true);
    hasMoreRef.current = true;

    setError(null);

    fetchProjects(1, true);
  }, [fetchProjects]);

  // =========================================================
  // DISPLAY COUNT
  // =========================================================

  const filteredCount = filteredProjects.length;

  const totalProjectCount =
    projectCounts?.total_projects ??
    projects.length;

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section
        className="project-details"
        aria-label="Loading projects"
      >
        <div className="client-table-container">
          <div
            className="project-loading"
            role="status"
            aria-live="polite"
          >
            <div
              className="spinner"
              aria-hidden="true"
            />

            <p>Loading projects...</p>
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
      <section
        className="project-details"
        aria-label="Error loading projects"
      >
        <div className="client-table-container">
          <div
            className="project-error"
            role="alert"
          >
            <h3>Error Loading Projects</h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={handleRetry}
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
    <section
      className="project-details"
      aria-label="Project details"
    >
      <div className="client-table-container">

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <div className="project-filters">

          {/* LOCATION */}

          <div className="project-filter location-filter">
            <label htmlFor="project-location">
              Location
            </label>

            <div className="filter-input">
              <svg
                className="filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

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

          {/* STATUS */}

          <div className="project-filter">
            <label htmlFor="project-status">
              Status
            </label>

            <select
              id="project-status"
              value={statusFilter}
              onChange={handleStatusChange}
              aria-label="Filter by status"
            >
              <option value="All">
                All Status
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Upcoming">
                Upcoming
              </option>
            </select>
          </div>

          {/* CATEGORY */}

          <div className="project-filter">
            <label htmlFor="project-category">
              Category Type
            </label>

            <select
              id="project-category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              aria-label="Filter by category"
            >
              <option value="All">
                All Categories
              </option>

              {categoryOptions.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* COUNT + CLEAR */}

          <div className="project-filter project-count-filter">

            {/* {loadingMore && (
              <span
                className="loading-more"
                aria-live="polite"
              >
                Loading more...
              </span>
            )} */}

            <span className="total-projects">
              Total:{" "}
              <strong>
                {hasActiveFilters
                  ? filteredCount
                  : totalProjectCount}
              </strong>
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={handleClearFilters}
                aria-label="Clear all filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            RESULTS INFO
        ====================================================== */}

        <div
          className="project-results-info"
          role="status"
          aria-live="polite"
        >
          <span>
            Showing{" "}
            <strong>
              {filteredCount}
            </strong>{" "}
            of{" "}
            <strong>
              {totalProjectCount}
            </strong>{" "}
            projects
          </span>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredCount === 0 ? (
          <div
            className="project-empty"
            role="status"
          >
            <h3>
              No projects found
            </h3>

            <p>
              Try changing your filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                aria-label="Clear all filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* =================================================
                TABLE
            ================================================== */}

            <div
              className="table-wrapper"
              ref={tableWrapperRef}
            >
              <div className="table-container">

                {/* FIXED HEADER */}

                <div
                  className="table-header"
                  role="row"
                >
                  <div role="columnheader">
                    Brand Name
                  </div>

                  <div role="columnheader">
                    Category Type
                  </div>

                  <div role="columnheader">
                    Status
                  </div>

                  <div role="columnheader">
                    Location
                  </div>
                </div>

                {/* TABLE BODY */}

                <div
                  className="table-body"
                  ref={tableBodyRef}
                  onWheel={handleTableWheel}
                  role="rowgroup"
                >
                  {filteredProjects.map(
                    (project) => (
                      <div
                        key={project.id}
                        className="table-row"
                        role="row"
                      >
                        {/* BRAND */}

                        <div
                          className="item-name"
                          title={
                            project.client_name
                          }
                          role="cell"
                        >
                          {project.client_name}
                        </div>

                        {/* CATEGORY */}

                        <div
                          className="item-type"
                          title={
                            Array.isArray(
                              project.projectsCategory,
                            )
                              ? project.projectsCategory.join(
                                  ", ",
                                )
                              : project.projectsCategory
                          }
                          role="cell"
                        >
                          {Array.isArray(
                            project.projectsCategory,
                          )
                            ? project.projectsCategory.join(
                                ", ",
                              )
                            : project.projectsCategory}
                        </div>

                        {/* STATUS */}

                        <div
                          className="item-status"
                          role="cell"
                        >
                          <Chip
                            label={
                              project.project_status
                            }
                            size="small"
                            className={getStatusClass(
                              project.project_status,
                            )}
                            aria-label={`Status: ${project.project_status}`}
                          />
                        </div>

                        {/* LOCATION */}

                        <div
                          className="item-location"
                          title={
                            project.location
                          }
                          role="cell"
                        >
                          {formatLocation(
                            project.location,
                          )}
                        </div>
                      </div>
                    ),
                  )}

                  {/* =================================================
                      INFINITE SCROLL SENTINEL
                  ================================================== */}

                  {hasMore && (
                    <div
                      ref={observerTargetRef}
                      className="infinite-scroll-sentinel"
                      aria-hidden="true"
                    />
                  )}

                  {/* =================================================
                      CENTERED LOADING OVERLAY FOR NEXT PAGE
                  ================================================== */}

                  {loadingMore && (
                    <div
                      className="table-loading-overlay"
                      role="status"
                      aria-live="polite"
                    >
                      <div
                        className="spinner"
                        aria-hidden="true"
                      />

                      <span>
                        Loading more projects...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                PAGINATION ERROR
            ================================================== */}

            {error && projects.length > 0 && (
              <div
                className="project-load-error"
                role="alert"
              >
                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    fetchProjects(
                      pageRef.current + 1,
                      false,
                    )
                  }
                  disabled={loadingMore}
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}