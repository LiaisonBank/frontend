"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import Chip from "@mui/material/Chip";
import "./ProjectDetails.scss";

const ITEMS_PER_LOAD = 20;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

export default function ProjectDetails() {
  // =========================================================
  // REFS
  // =========================================================
  const tableBodyRef = useRef(null);
  const tableWrapperRef = useRef(null); // NEW: Ref for table wrapper
  const fetchedRef = useRef(false);
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
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);

  // =========================================================
  // SCROLL FUNCTIONS
  // =========================================================
  
  // Scroll to top of table body (keeps header visible)
  const scrollTableToTop = useCallback(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, []);

  // NEW: Scroll to table wrapper (makes header visible)
  const scrollToTableWrapper = useCallback(() => {
    if (tableWrapperRef.current) {
      // Get the position of the table wrapper relative to the viewport
      const wrapperRect = tableWrapperRef.current.getBoundingClientRect();
      const offset = 80; // Adjust this value based on your header height
      const targetPosition = window.scrollY + wrapperRect.top - offset;
      
      // Smooth scroll to the table wrapper
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Also scroll table body to top
      setTimeout(scrollTableToTop, 100);
    }
  }, [scrollTableToTop]);

  // =========================================================
  // NORMALIZE HELPER
  // =========================================================
  const normalize = useCallback((value) => {
    return String(value ?? "").trim().toLowerCase();
  }, []);

  // =========================================================
  // NORMALIZE PROJECTS
  // =========================================================
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
  let abortController = new AbortController();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/projects/distinct?page=1&limit=${ITEMS_PER_LOAD}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch projects: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Only update state if component is still mounted
      if (!isMounted) return;
      
      const projectsData = Array.isArray(data)
        ? data
        : data.projects || data.data || [];
      
      const total = data.total || data.count || projectsData.length;
      setTotalProjects(total);

      const hasMoreItems = data.hasMore !== undefined 
        ? data.hasMore 
        : data.next_page !== null 
        ? true 
        : projectsData.length === ITEMS_PER_LOAD;
      setHasMore(hasMoreItems);

      const normalizedProjects = normalizeProjects(projectsData, 1);
      setProjects(normalizedProjects);
      setVisibleCount(Math.min(ITEMS_PER_LOAD, normalizedProjects.length));
      setPage(1);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      if (!isMounted) return;
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchProjects();

  return () => {
    isMounted = false;
    if (abortController) {
      abortController.abort();
    }
  };
}, [normalizeProjects]);

  // =========================================================
  // FETCH MORE PROJECTS - LOAD MORE
  // =========================================================
  const fetchMoreProjects = useCallback(async (pageNum) => {
    // Prevent multiple simultaneous load more requests
    if (loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/projects/distinct?page=${pageNum}&limit=${ITEMS_PER_LOAD}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch more projects: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Handle different response structures
      const projectsData = Array.isArray(data)
        ? data
        : data.projects || data.data || [];
      
      // Update total if available
      if (data.total || data.count) {
        setTotalProjects(data.total || data.count);
      }

      // Check if there are more items
      const hasMoreItems = data.hasMore !== undefined
        ? data.hasMore
        : data.next_page !== null
        ? true
        : projectsData.length === ITEMS_PER_LOAD;
      setHasMore(hasMoreItems);

      // If no projects returned, there's nothing more to load
      if (projectsData.length === 0) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      const normalizedProjects = normalizeProjects(projectsData, pageNum);
      
      // Append new projects to existing ones
      setProjects(prev => {
        // Avoid duplicates by checking IDs
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewProjects = normalizedProjects.filter(
          p => !existingIds.has(p.id)
        );
        return [...prev, ...uniqueNewProjects];
      });
      
      // Update visible count to show all loaded projects
      setVisibleCount(prev => prev + projectsData.length);
      
      setPage(pageNum);

      // Scroll to table wrapper after loading more
      setTimeout(scrollToTableWrapper, 150);
    } catch (err) {
      console.error("Error fetching more projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load more projects");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, normalizeProjects, scrollToTableWrapper]);

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
      const matchesCategory =
        categoryFilter === "All" || projectType === category;

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
  const hasMoreToLoad = hasMore || visibleCount < filteredProjects.length;
  const canLoadLess = visibleCount > ITEMS_PER_LOAD;
  const hasActiveFilters =
    locationFilter.trim() !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All";

  // =========================================================
  // STATUS COLOR
  // =========================================================
  const getStatusClass = useCallback((status) => {
    const normalizedStatus = normalize(status);

    if (normalizedStatus === "completed") return "status-completed";
    if (normalizedStatus === "upcoming") return "status-upcoming";
    if (normalizedStatus === "in progress") return "status-in-progress";

    return "status-default";
  }, [normalize]);

  // =========================================================
  // FILTER HANDLERS
  // =========================================================
  const handleLocationChange = useCallback((event) => {
    setLocationFilter(event.target.value);
    setVisibleCount(ITEMS_PER_LOAD);
    scrollToTableWrapper(); // Scroll to table when filtering
  }, [scrollToTableWrapper]);

  const handleStatusChange = useCallback((event) => {
    setStatusFilter(event.target.value);
    setVisibleCount(ITEMS_PER_LOAD);
    scrollToTableWrapper(); // Scroll to table when filtering
  }, [scrollToTableWrapper]);

  const handleCategoryChange = useCallback((event) => {
    setCategoryFilter(event.target.value);
    setVisibleCount(ITEMS_PER_LOAD);
    scrollToTableWrapper(); // Scroll to table when filtering
  }, [scrollToTableWrapper]);

  const handleClearFilters = useCallback(() => {
    setLocationFilter("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setVisibleCount(ITEMS_PER_LOAD);
    scrollToTableWrapper(); // Scroll to table when clearing filters
  }, [scrollToTableWrapper]);

  // =========================================================
  // LOAD MORE / LESS - FIXED
  // =========================================================
  const handleLoadMore = useCallback(() => {
    // Calculate how many more items we need to show
    const currentVisible = visibleCount;
    const totalAvailable = filteredProjects.length;
    const needed = currentVisible + ITEMS_PER_LOAD;
    
    // If we need more items than currently available AND there are more on server
    if (needed > totalAvailable && hasMore) {
      // Fetch next page from API
      const nextPage = page + 1;
      fetchMoreProjects(nextPage);
    } else {
      // Just show more items client-side (from already loaded data)
      setVisibleCount(Math.min(needed, filteredProjects.length));
      // Scroll to table wrapper after updating
      setTimeout(scrollToTableWrapper, 100);
    }
  }, [visibleCount, filteredProjects.length, hasMore, page, fetchMoreProjects, scrollToTableWrapper]);

  const handleLoadLess = useCallback(() => {
    setVisibleCount(ITEMS_PER_LOAD);
    // Scroll to table wrapper after updating
    setTimeout(scrollToTableWrapper, 100);
  }, [scrollToTableWrapper]);

  // =========================================================
  // PREVENT OVERSCROLL BUBBLING
  // =========================================================
  // =========================================================
// =========================================================
// HANDLE TABLE SCROLL WITH BODY SCROLL PASS-THROUGH
// =========================================================
const handleTableWheel = useCallback((e) => {
  const element = e.currentTarget;
  const { scrollTop, scrollHeight, clientHeight } = element;
  
  // Check if we're at boundaries
  const atTop = scrollTop === 0;
  const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
  
  // If at boundary and scrolling in the direction of the boundary,
  // let the event bubble to the page body
  if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
    // Don't prevent default - allow body scroll
    return;
  }
  
  // Otherwise, prevent body scroll and let table scroll
  e.preventDefault();
  e.stopPropagation();
}, []);

// Add native event listener with passive: false
useEffect(() => {
  const tableBody = tableBodyRef.current;
  if (!tableBody) return;

  // Use native event listener with passive: false
  const wheelHandler = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = tableBody;
    
    const atTop = scrollTop === 0;
    const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    
    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      return; // Allow body scroll
    }
    
    e.preventDefault();
    e.stopPropagation();
  };

  tableBody.addEventListener('wheel', wheelHandler, { passive: false });
  
  return () => {
    tableBody.removeEventListener('wheel', wheelHandler);
  };
}, []);

  // =========================================================
  // KEYBOARD ACCESSIBILITY FOR LOAD MORE BUTTON
  // =========================================================
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLoadMore();
    }
  }, [handleLoadMore]);

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <section className="project-details" aria-label="Loading projects">
        <div className="client-table-container">
          <div className="project-loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================
  if (error) {
    return (
      <section className="project-details" aria-label="Error loading projects">
        <div className="client-table-container">
          <div className="project-error" role="alert">
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

        {/* RESULTS INFO */}
        <div className="project-results-info" role="status" aria-live="polite">
          <span>
            Showing <strong>{visibleProjects.length}</strong> of{" "}
            <strong>{filteredProjects.length}</strong> projects
            {totalProjects > 0 && ` (${totalProjects} total)`}
          </span>
          {hasActiveFilters && (
            <span className="filter-active">Filters applied</span>
          )}
          {loadingMore && (
            <span className="loading-more" aria-hidden="true">
              Loading more...
            </span>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="project-empty" role="status">
            <h3>No projects found</h3>
            <p>Try changing your filters.</p>
            <button 
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* TABLE WITH FIXED HEADER - Added ref */}
            <div 
              className="table-wrapper" 
              ref={tableWrapperRef}
            >
              <div className="table-container">
                {/* FIXED HEADER - STICKY AT TOP */}
                <div className="table-header" role="row">
                  <div role="columnheader">Brand Name</div>
                  <div role="columnheader">Category Type</div>
                  <div role="columnheader">Status</div>
                  <div role="columnheader">Location</div>
                </div>

                {/* SCROLLABLE BODY */}
                <div 
                  className="table-body" 
                  ref={tableBodyRef}
                  onWheel={handleTableWheel}
                  role="rowgroup"
                >
                  {visibleProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="table-row" 
                      role="row"
                    >
                      <div className="item-name" title={project.client_name} role="cell">
                        {project.client_name}
                      </div>
                      <div className="item-type" title={project.projectsCategory} role="cell">
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
                      <div className="item-location" title={project.location} role="cell">
                        {project.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LOAD MORE / LESS BUTTONS */}
            {(hasMoreToLoad || canLoadLess) && (
              <div className="load-more-wrapper">
                {/* Show Load More if there are more items to show */}
                {hasMoreToLoad && visibleCount < filteredProjects.length && (
                  <button 
                    className="load-more-btn" 
                    onClick={handleLoadMore}
                    onKeyDown={handleKeyDown}
                    disabled={loadingMore}
                    aria-label={loadingMore ? "Loading more projects" : "Load more projects"}
                  >
                    <span>{loadingMore ? 'Loading...' : 'Load More'}</span>
                    {!loadingMore && (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                )}
                
                {/* Show Load More when there are server items even if filtered shows all */}
                {hasMore && visibleCount >= filteredProjects.length && (
                  <button 
                    className="load-more-btn" 
                    onClick={handleLoadMore}
                    onKeyDown={handleKeyDown}
                    disabled={loadingMore}
                    aria-label={loadingMore ? "Loading more projects" : "Load more projects"}
                  >
                    <span>{loadingMore ? 'Loading...' : 'Load More'}</span>
                    {!loadingMore && (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                )}
                
                {canLoadLess && (
                  <button 
                    className="load-less-btn" 
                    onClick={handleLoadLess}
                    aria-label="Show fewer projects"
                  >
                    <span>Load Less</span>
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M12 19V5" />
                      <path d="m5 12 7-7 7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}