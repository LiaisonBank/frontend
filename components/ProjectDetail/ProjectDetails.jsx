"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Chip from "@mui/material/Chip";
import Select from "react-select";

import "./ProjectDetails.scss";
import ApiError from "../ApiError/ApiError";

const ITEMS_PER_LOAD = 20;
const MIN_LOADING_DISPLAY_MS = 600;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

const PROJECTS_ENDPOINT = `${API_BASE_URL}/api/projects/distinct`;

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
  const observerTargetRef = useRef(null);

  const isFetchingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const abortControllerRef = useRef(null);

  // Used to ignore stale requests after unmount/re-entry.
  const requestIdRef = useRef(0);

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
  // NORMALIZE
  // =========================================================

  const normalize = useCallback((value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  }, []);

  // =========================================================
  // NORMALIZE PROJECTS
  // =========================================================

  const normalizeProjects = useCallback(
    (projectsData, pageNum = 1) => {
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
    },
    [],
  );

  // =========================================================
  // DETERMINE HAS MORE
  // =========================================================

  const determineHasMore = useCallback(
    (data, projectsData) => {
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
    },
    [],
  );

  // =========================================================
  // EXTRACT PROJECT DATA
  // =========================================================

  const extractProjects = useCallback((data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.projects)) {
      return data.projects;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    return [];
  }, []);

  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  const fetchProjects = useCallback(
    async (pageNum = 1, isInitialLoad = false) => {
      // Prevent duplicate requests.
      if (isFetchingRef.current) {
        return;
      }

      // Do not request pages after the API says there is no more data.
      if (!isInitialLoad && !hasMoreRef.current) {
        return;
      }

      isFetchingRef.current = true;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const requestId = ++requestIdRef.current;
      const startedAt = Date.now();

      // -------------------------------------------------------
      // Minimum loading duration
      // -------------------------------------------------------

      const waitMinimumDisplay = async () => {
        const elapsed = Date.now() - startedAt;
        const remaining =
          MIN_LOADING_DISPLAY_MS - elapsed;

        if (remaining > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, remaining),
          );
        }
      };

      // -------------------------------------------------------
      // Abort previous request
      // -------------------------------------------------------

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();

      abortControllerRef.current = controller;

      try {
        // -----------------------------------------------------
        // IMPORTANT:
        // Every request MUST use /distinct with pagination.
        // -----------------------------------------------------

        const url =
          `${PROJECTS_ENDPOINT}` +
          `?page=${pageNum}` +
          `&limit=${ITEMS_PER_LOAD}`;

        if (process.env.NODE_ENV === "development") {
          console.debug(
            `[ProjectDetails] Fetching page ${pageNum}:`,
            url,
          );
        }

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const apiError = new Error(
            `Failed to fetch projects: ${response.status} ${response.statusText}`,
          );

          apiError.status = response.status;

          throw apiError;
        }

        const data = await response.json();

        // Ignore stale requests.
        if (requestId !== requestIdRef.current) {
          return;
        }

        const projectsData = extractProjects(data);

        const normalizedProjects =
          normalizeProjects(
            projectsData,
            pageNum,
          );

        const moreAvailable =
          determineHasMore(
            data,
            projectsData,
          );

        await waitMinimumDisplay();

        // Check again after the artificial delay.
        if (requestId !== requestIdRef.current) {
          return;
        }

        // =====================================================
        // INITIAL LOAD
        // =====================================================

        if (isInitialLoad) {
          setProjects(normalizedProjects);

          setPage(1);
          pageRef.current = 1;

          setHasMore(moreAvailable);
          hasMoreRef.current = moreAvailable;

          return;
        }

        // =====================================================
        // LOAD MORE
        // =====================================================

        setProjects((previousProjects) => {
          const existingIds = new Set(
            previousProjects.map(
              (project) => project.id,
            ),
          );

          const uniqueProjects =
            normalizedProjects.filter(
              (project) =>
                !existingIds.has(project.id),
            );

          return [
            ...previousProjects,
            ...uniqueProjects,
          ];
        });

        setPage(pageNum);
        pageRef.current = pageNum;

        setHasMore(moreAvailable);
        hasMoreRef.current = moreAvailable;
      } catch (err) {
        // Abort is expected during navigation/unmount.
        if (err?.name === "AbortError") {
          return;
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error(
          "[ProjectDetails] Project API error:",
          err,
        );

        await waitMinimumDisplay();

        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(
          err instanceof Error
            ? err
            : new Error(
                "Failed to load projects",
              ),
        );
      } finally {
        if (requestId === requestIdRef.current) {
          isFetchingRef.current = false;

          if (isInitialLoad) {
            setLoading(false);
          } else {
            setLoadingMore(false);
          }
        }
      }
    },
    [
      determineHasMore,
      extractProjects,
      normalizeProjects,
    ],
  );

  // =========================================================
  // INITIAL PROJECT LOAD
  //
  // Every time this component mounts/re-mounts:
  //
  // /api/projects/distinct?page=1&limit=20
  //
  // =========================================================

  useEffect(() => {
    // Cancel anything left from a previous mount.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset pagination.
    pageRef.current = 1;
    hasMoreRef.current = true;

    // Reset state.
    setProjects([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoading(true);

    // Always start from page 1.
    fetchProjects(1, true);

    return () => {
      // Invalidate current request.
      requestIdRef.current += 1;

      // Abort request during navigation/unmount.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      isFetchingRef.current = false;
    };
  }, [fetchProjects]);

  // =========================================================
  // INFINITE SCROLL
  // =========================================================

  useEffect(() => {
    const target = observerTargetRef.current;
    const tableBody = tableBodyRef.current;

    if (!target || !tableBody) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            !entry?.isIntersecting ||
            isFetchingRef.current ||
            !hasMoreRef.current
          ) {
            return;
          }

          const nextPage =
            pageRef.current + 1;

          fetchProjects(
            nextPage,
            false,
          );
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
    if (!tableBodyRef.current) {
      return;
    }

    tableBodyRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // =========================================================
  // SCROLL PAGE TO TABLE
  //
  // Used ONLY by location search.
  // React Select does not call this.
  // =========================================================

  const scrollToTableWrapper =
    useCallback(() => {
      if (!tableWrapperRef.current) {
        return;
      }

      const wrapperRect =
        tableWrapperRef.current.getBoundingClientRect();

      const offset = 80;

      const targetPosition =
        window.scrollY +
        wrapperRect.top -
        offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      requestAnimationFrame(() => {
        scrollTableToTop();
      });
    }, [scrollTableToTop]);

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const statusOptions = useMemo(
    () => [
      {
        value: "All",
        label: "All Status",
      },
      {
        value: "Completed",
        label: "Completed",
      },
      {
        value: "In Progress",
        label: "In Progress",
      },
      {
        value: "Upcoming",
        label: "Upcoming",
      },
    ],
    [],
  );

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================

  const categoryOptions = useMemo(() => {
    const categories = projects
      .flatMap((project) => {
        const category =
          project?.projectsCategory;

        if (Array.isArray(category)) {
          return category;
        }

        return [category];
      })
      .filter(Boolean)
      .map((category) =>
        String(category).trim(),
      )
      .filter(Boolean);

    const excludedCategories = new Set([
      "Residential/Commercial",
      "Residential / Commercial",
      "ResidentialCommercial",
    ]);

    return [...new Set(categories)]
      .filter(
        (category) =>
          !excludedCategories.has(category),
      )
      .sort((a, b) =>
        a.localeCompare(b),
      );
  }, [projects]);

  // =========================================================
  // CATEGORY SELECT OPTIONS
  // =========================================================

  const categorySelectOptions = useMemo(
    () => [
      {
        value: "All",
        label: "All Categories",
      },
      ...categoryOptions.map(
        (category) => ({
          value: category,
          label: category,
        }),
      ),
    ],
    [categoryOptions],
  );

  // =========================================================
  // SELECTED STATUS
  // =========================================================

  const selectedStatusOption = useMemo(
    () =>
      statusOptions.find(
        (option) =>
          option.value === statusFilter,
      ) ?? statusOptions[0],
    [statusFilter, statusOptions],
  );

  // =========================================================
  // SELECTED CATEGORY
  // =========================================================

  const selectedCategoryOption = useMemo(
    () =>
      categorySelectOptions.find(
        (option) =>
          option.value === categoryFilter,
      ) ?? categorySelectOptions[0],
    [
      categoryFilter,
      categorySelectOptions,
    ],
  );

  // =========================================================
  // FILTER HANDLERS
  // =========================================================

  const handleLocationChange =
    useCallback(
      (event) => {
        setLocationFilter(
          event.target.value,
        );

        requestAnimationFrame(() => {
          scrollToTableWrapper();
        });
      },
      [scrollToTableWrapper],
    );

  // IMPORTANT:
  // Do NOT scroll the page when Select changes.
  // This prevents Category Type dropdown scroll issues.

  const handleStatusChange =
    useCallback(
      (selectedOption) => {
        setStatusFilter(
          selectedOption?.value ?? "All",
        );
      },
      [],
    );

  const handleCategoryChange =
    useCallback(
      (selectedOption) => {
        setCategoryFilter(
          selectedOption?.value ?? "All",
        );
      },
      [],
    );

  // =========================================================
  // FILTERED PROJECTS
  // =========================================================

  const filteredProjects = useMemo(() => {
    const location =
      normalize(locationFilter);

    const status =
      normalize(statusFilter);

    const category =
      normalize(categoryFilter);

    return projects.filter(
      (project) => {
        const projectLocation =
          normalize(
            project.location,
          );

        const projectStatus =
          normalize(
            project.project_status,
          );

        const projectCategories =
          Array.isArray(
            project.projectsCategory,
          )
            ? project.projectsCategory.map(
                (item) =>
                  normalize(item),
              )
            : [
                normalize(
                  project.projectsCategory,
                ),
              ];

        const matchesLocation =
          !location ||
          projectLocation.includes(
            location,
          );

        const matchesStatus =
          statusFilter === "All" ||
          projectStatus === status;

        const matchesCategory =
          categoryFilter === "All" ||
          projectCategories.includes(
            category,
          );

        return (
          matchesLocation &&
          matchesStatus &&
          matchesCategory
        );
      },
    );
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
      const normalizedStatus =
        normalize(status);

      if (
        normalizedStatus ===
        "completed"
      ) {
        return "status-completed";
      }

      if (
        normalizedStatus ===
        "upcoming"
      ) {
        return "status-upcoming";
      }

      if (
        normalizedStatus ===
          "in progress" ||
        normalizedStatus ===
          "ongoing"
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

  const formatLocation = useCallback(
    (location) => {
      if (!location) {
        return "";
      }

      let formattedLocation =
        String(location)
          .replace(/\(/g, " (")
          .replace(/\s+/g, " ")
          .replace(/,\s*/g, ", ")
          .trim();

      const lowerLocation =
        formattedLocation.toLowerCase();

      const alreadyHasMumbai =
        lowerLocation.includes(
          "mumbai",
        );

      const alreadyHasVasai =
        lowerLocation.includes(
          "vasai",
        );

      const alreadyHasVirar =
        lowerLocation.includes(
          "virar",
        );

      if (
        !alreadyHasMumbai &&
        !alreadyHasVasai &&
        !alreadyHasVirar
      ) {
        formattedLocation += ", Mumbai";
      }

      return formattedLocation;
    },
    [],
  );

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters =
    useCallback(() => {
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

  const handleTableWheel =
    useCallback((event) => {
      const element =
        event.currentTarget;

      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = element;

      const atTop =
        scrollTop <= 0;

      const atBottom =
        Math.ceil(
          scrollTop + clientHeight,
        ) >= scrollHeight;

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
    const tableBody =
      tableBodyRef.current;

    if (!tableBody) {
      return;
    }

    const wheelHandler = (event) => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = tableBody;

      const atTop =
        scrollTop <= 0;

      const atBottom =
        Math.ceil(
          scrollTop + clientHeight,
        ) >= scrollHeight;

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
    if (isFetchingRef.current) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    pageRef.current = 1;
    hasMoreRef.current = true;

    setProjects([]);
    setPage(1);
    setHasMore(true);
    setError(null);

    fetchProjects(1, true);
  }, [fetchProjects]);

  // =========================================================
  // DISPLAY COUNT
  // =========================================================

  const filteredCount =
    filteredProjects.length;

  const totalProjectCount =
    projectCounts?.total_projects ??
    projects.length;

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section
        className="project-details py-4"
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

            <p>
              Loading projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (
    error &&
    projects.length === 0
  ) {
    return (
      <ApiError
        showStatus={true}
        statusLabel="Error"
        statusCode={
          error?.status
            ? `ERR · ${error.status}`
            : "ERR · TIMEOUT"
        }
        statusTone={
          error?.status >= 500
            ? "danger"
            : "warning"
        }
        title="Projects Temporarily Unavailable"
        message="Our project information is temporarily unavailable. Please try again shortly."
        onRetry={handleRetry}
        backToHome={() =>
          window.open("/", "_self")
        }
      />
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
                onChange={
                  handleLocationChange
                }
                placeholder="Search location..."
                autoComplete="off"
                className="form-control"
                aria-label="Filter by location"
              />
            </div>
          </div>

          {/* STATUS */}

          <div className="project-filter">
            <label htmlFor="project-status">
              Status
            </label>

            <Select
              inputId="project-status"
              value={selectedStatusOption}
              options={statusOptions}
              onChange={
                handleStatusChange
              }
              className="react-select"
              classNamePrefix="react-select"
              aria-label="Filter by status"
              isSearchable={false}
              isClearable={false}
              menuPlacement="auto"
              menuPosition="absolute"
            />
          </div>

          {/* CATEGORY */}

          <div className="project-filter">
            <label htmlFor="project-category">
              Category Type
            </label>

            <Select
              inputId="project-category"
              value={
                selectedCategoryOption
              }
              options={
                categorySelectOptions
              }
              onChange={
                handleCategoryChange
              }
              className="react-select"
              classNamePrefix="react-select"
              aria-label="Filter by category"
              isSearchable={false}
              isClearable={false}
              menuPlacement="auto"
              menuPosition="absolute"
            />
          </div>

          {/* COUNT + CLEAR */}

          <div className="project-filter project-count-filter">
            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={
                  handleClearFilters
                }
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

          <span className="total-projects">
            Total:{" "}
            <strong>
              {hasActiveFilters
                ? filteredCount
                : totalProjectCount}
            </strong>
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
                onClick={
                  handleClearFilters
                }
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
                  onWheel={
                    handleTableWheel
                  }
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
                          {
                            project.client_name
                          }
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

                  {/* INFINITE SCROLL SENTINEL */}

                  {hasMore && (
                    <div
                      ref={
                        observerTargetRef
                      }
                      className="infinite-scroll-sentinel"
                      aria-hidden="true"
                    />
                  )}

                  {/* LOADING MORE */}

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
                        Loading more
                        projects...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PAGINATION ERROR */}

            {error &&
              projects.length > 0 && (
                <div
                  className="project-load-error"
                  role="alert"
                >
                  <span>
                    {error.message ||
                      "Failed to load projects"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      fetchProjects(
                        pageRef.current + 1,
                        false,
                      )
                    }
                    disabled={
                      loadingMore
                    }
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

