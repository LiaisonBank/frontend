// app/careers-liaison-bank/jobs/page.jsx
"use client";

import { useState, useEffect, useMemo, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ArrowUpRight,
  Loader2,
  Briefcase,
  Users,
} from "lucide-react";
import "./jobs.scss";
import JobDetailsModal from "./JobDetailsModal";
import AuthModal from "../AuthModal";

// ─────────────────────────────────────────────────────────────
// Helpers (module scope so JobCard can use them too)
// ─────────────────────────────────────────────────────────────
const getServiceType = (job) => job.custom_service_type || job.serviceType || "";

const getJobSkills = (job) => {
  const skills = [];
  if (job.custom_skills) {
    if (typeof job.custom_skills === "string")
      skills.push(...job.custom_skills.split("\n").filter((s) => s.trim()));
    else if (Array.isArray(job.custom_skills))
      skills.push(...job.custom_skills.filter((s) => s));
  }
  if (job.skills_required) {
    if (typeof job.skills_required === "string")
      skills.push(...job.skills_required.split("\n").filter((s) => s.trim()));
    else if (Array.isArray(job.skills_required))
      skills.push(...job.skills_required.filter((s) => s));
  }
  if (job.skills) {
    if (typeof job.skills === "string")
      skills.push(...job.skills.split("\n").filter((s) => s.trim()));
    else if (Array.isArray(job.skills))
      skills.push(...job.skills.filter((s) => s));
  }
  return skills;
};

const getJobTitle = (job) =>
  job.job_title ||
  job.title ||
  job.job_opening_template ||
  job.designation ||
  "";

const getFormattedJobTitle = (job) => {
  const title = getJobTitle(job) || "Position";
  return title.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

const getJobDescription = (job) => job.description || job.job_description || "";

const getExperience = (job) => {
  if (
    job.custom_min_experience !== undefined &&
    job.custom_max_experience !== undefined
  ) {
    const min = job.custom_min_experience;
    const max = job.custom_max_experience;
    if (min && max) return `${min} - ${max} years`;
    if (min) return `${min}+ years`;
    if (max) return `Up to ${max} years`;
  }
  return job.experience_level || job.experience || "Not specified";
};

const getOpenings = (job) => job.vacancies || job.openings || 1;

// Stable key for any job object
const getJobKey = (job, fallback = "") =>
  job?.__key || job?.id || job?.name || `job-${fallback}`;

// ─────────────────────────────────────────────────────────────
// JobCard (shared between matching + other grids)
// ─────────────────────────────────────────────────────────────
function JobCard({ job, onView, variant = "match" }) {
  return (
    <div
      className={`job-card card variant-interactive-ring ${
        variant === "other" ? "job-card--other" : ""
      }`}
    >
      <div className="card-header">
        <h2>{getFormattedJobTitle(job)}</h2>
      </div>
      <div className="job-card-body card-body">
        <div className="job-meta">
          {getOpenings(job) && (
            <div className="job-meta-item">
              <Users size={14} />
              <span>
                {getOpenings(job)}{" "}
                {getOpenings(job) === 1 ? "Opening" : "Openings"}
              </span>
            </div>
          )}
          {getExperience(job) && (
            <div className="job-meta-item">
              <Briefcase size={14} />
              <span>{getExperience(job)}</span>
            </div>
          )}
        </div>

        <p className="job-description">
          {getJobDescription(job).length > 120
            ? `${getJobDescription(job).substring(0, 120)}...`
            : getJobDescription(job) || "No description available"}
        </p>

        <div
          className="job-footer"
          onClick={onView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onView();
            }
          }}
        >
          <button type="button" className="view-job-btn">
            View Details <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────────────────────
function JobsPageContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const departmentParam = searchParams.get("department");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [otherJobs, setOtherJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(
    departmentParam || ""
  );
  const [selectedServiceType, setSelectedServiceType] = useState(
    serviceParam || ""
  );
  const [sortOrder, setSortOrder] = useState("newest");

  // Search animation state
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // ───────────────────────────────────────────────────────────
  // Fetch jobs
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-jobs`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const data = await response.json();

        let jobsData = [];
        if (Array.isArray(data)) {
          jobsData = data;
        } else if (data && data.message && typeof data.message === "object") {
          if (Array.isArray(data.message.data)) {
            jobsData = data.message.data;
          } else if (Array.isArray(data.message)) {
            jobsData = data.message;
          }
        } else if (data && Array.isArray(data.data)) {
          jobsData = data.data;
        } else if (data && Array.isArray(data.message)) {
          jobsData = data.message;
        }

        // Attach a stable unique key to every job
        const normalized = jobsData.map((job, i) => ({
          ...job,
          __key:
            job.id ||
            job.name ||
            `job-${i}-${getJobTitle(job) || "untitled"}`,
        }));

        setJobs(normalized);
        setFilteredJobs(normalized);
        setOtherJobs([]);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ───────────────────────────────────────────────────────────
  // Filter + split into matching / non-matching
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    let result = jobs;

    // 1. Department
    if (selectedDepartment) {
      const deptLower = selectedDepartment.toLowerCase().trim();
      result = result.filter((job) => {
        const jobDept = (job.department || "").toLowerCase().trim();
        return jobDept.includes(deptLower) || deptLower.includes(jobDept);
      });
    }

    // 2. Service Type
    if (selectedServiceType) {
      const serviceLower = selectedServiceType.toLowerCase().trim();
      result = result.filter((job) => {
        const jobService = getServiceType(job).toLowerCase().trim();
        return jobService.includes(serviceLower) || jobService === serviceLower;
      });
    }

    // 3. Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      if (term !== "") {
        const searchWords = term.split(" ").filter((w) => w.length > 0);
        result = result.filter((job) => {
          const title = getJobTitle(job).toLowerCase();
          const department = (job.department || "").toLowerCase();
          const skillsString = getJobSkills(job).join(" ").toLowerCase();
          const serviceType = getServiceType(job).toLowerCase();

          if (searchWords.length > 1) {
            return (
              searchWords.every((w) => title.includes(w)) ||
              searchWords.every((w) => department.includes(w)) ||
              searchWords.every((w) => skillsString.includes(w)) ||
              searchWords.every((w) => serviceType.includes(w))
            );
          }
          return (
            title.includes(term) ||
            department.includes(term) ||
            skillsString.includes(term) ||
            serviceType.includes(term)
          );
        });
      }
    }

    // 4. Location
    if (selectedLocation) {
      result = result.filter((job) => (job.location || "") === selectedLocation);
    }

    // 5. Sort
    if (sortOrder === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.posted_on || b.creation) -
          new Date(a.posted_on || a.creation)
      );
    } else if (sortOrder === "oldest") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.posted_on || a.creation) -
          new Date(b.posted_on || b.creation)
      );
    }

    const hasActiveFilter =
      selectedDepartment ||
      selectedServiceType ||
      selectedLocation ||
      searchTerm;

    if (hasActiveFilter) {
      const matchKeys = new Set(result.map((job) => getJobKey(job)));
      const nonMatching = jobs.filter((job) => !matchKeys.has(getJobKey(job)));

      // Keep the same sort for "other" list
      if (sortOrder === "newest") {
        nonMatching.sort(
          (a, b) =>
            new Date(b.posted_on || b.creation) -
            new Date(a.posted_on || a.creation)
        );
      } else if (sortOrder === "oldest") {
        nonMatching.sort(
          (a, b) =>
            new Date(a.posted_on || a.creation) -
            new Date(b.posted_on || b.creation)
        );
      }

      setFilteredJobs(result);
      setOtherJobs(nonMatching);
    } else {
      setFilteredJobs(result);
      setOtherJobs([]);
    }
  }, [
    searchTerm,
    selectedLocation,
    selectedDepartment,
    selectedServiceType,
    sortOrder,
    jobs,
  ]);

  // ───────────────────────────────────────────────────────────
  // Unique filter values
  // ───────────────────────────────────────────────────────────
  const departments = useMemo(
    () => [...new Set(jobs.map((job) => job.department).filter(Boolean))],
    [jobs]
  );

  const serviceTypes = useMemo(
    () =>
      [
        ...new Set(
          jobs.map((job) => getServiceType(job)).filter(Boolean)
        ),
        "AMC",
      ].sort(),
    [jobs]
  );

  // Combined list used for modal navigation across BOTH grids
  const allVisibleJobs = useMemo(
    () => [...filteredJobs, ...otherJobs],
    [filteredJobs, otherJobs]
  );

  // ───────────────────────────────────────────────────────────
  // Handlers
  // ───────────────────────────────────────────────────────────
  const handleServiceTypeChange = useCallback(
    (e) => {
      const newService = e.target.value;
      setSelectedServiceType(newService);

      if (newService && selectedDepartment) {
        const isValid = jobs.some((job) => {
          const jobService = getServiceType(job);
          const jobDept = job.department;
          return jobService === newService && jobDept === selectedDepartment;
        });
        if (!isValid) setSelectedDepartment("");
      }
    },
    [jobs, selectedDepartment]
  );

  const handleDepartmentChange = useCallback(
    (e) => {
      const newDept = e.target.value;
      setSelectedDepartment(newDept);

      if (newDept && selectedServiceType) {
        const isValid = jobs.some((job) => {
          const jobService = getServiceType(job);
          const jobDept = job.department;
          return jobDept === newDept && jobService === selectedServiceType;
        });
        if (!isValid) setSelectedServiceType("");
      }
    },
    [jobs, selectedServiceType]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedDepartment("");
    setSelectedServiceType("");
    setSortOrder("newest");
    setIsSearchExpanded(false);
    window.history.replaceState({}, "", "/careers-liaison-bank/jobs");
  }, []);

  const handleSearchToggle = useCallback(() => {
    setIsSearchExpanded((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => searchInputRef.current?.focus());
      } else if (searchTerm) {
        setSearchTerm("");
      }
      return next;
    });
  }, [searchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setSelectedServiceType("");
    setSelectedDepartment("");
  }, []);

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (searchTerm) {
          setSearchTerm("");
        } else {
          setIsSearchExpanded(false);
        }
      }
    },
    [searchTerm]
  );

  // Close search on outside click
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsSearchExpanded(false);
        if (searchTerm) setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded, searchTerm]);

  // Open modal — index is relative to allVisibleJobs
  const handleViewDetails = useCallback(
    (job, indexInAll) => {
      setSelectedJob(job);
      setSelectedJobIndex(indexInAll);
      setIsModalOpen(true);
    },
    []
  );

  const goToPrevious = useCallback(() => {
    if (selectedJobIndex > 0) {
      const newIndex = selectedJobIndex - 1;
      setSelectedJobIndex(newIndex);
      setSelectedJob(allVisibleJobs[newIndex]);
    }
  }, [selectedJobIndex, allVisibleJobs]);

  const goToNext = useCallback(() => {
    if (selectedJobIndex < allVisibleJobs.length - 1) {
      const newIndex = selectedJobIndex + 1;
      setSelectedJobIndex(newIndex);
      setSelectedJob(allVisibleJobs[newIndex]);
    }
  }, [selectedJobIndex, allVisibleJobs]);

  const hasActiveFilter = !!(
    selectedDepartment ||
    selectedServiceType ||
    selectedLocation ||
    searchTerm
  );

  const isEmpty = filteredJobs.length === 0 && otherJobs.length === 0;

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────
  return (
    <div className="jobs-page">
      {/* Hero Section */}
      <section className="jobs-hero">
        <div className="hero-particles">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
        </div>

        <div className="container">
          <div className="hero-content">
            <h1>Build Your Career with LiaisonBank</h1>
            <p>
              Explore rewarding career opportunities and join a team of
              professionals driving business, licensing, compliance, and
              liaison services forward.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="search-section">
            <div className="filters-expanded">
              {/* Service Type */}
              <div className="filter-group">
                <label>Service Type</label>
                <select
                  value={selectedServiceType}
                  onChange={handleServiceTypeChange}
                >
                  <option value="">All Services</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="filter-group">
                <label>Department</label>
                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Count + Clear */}
              <div className="filter-group action-group">
                <label className="jobs-count">
                  {filteredJobs.length} MATCHING JOB
                  {filteredJobs.length === 1 ? "" : "S"}
                  {otherJobs.length > 0 && (
                    <span className="jobs-count-other">
                      {" · "}
                      {otherJobs.length} other
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Search Bar (Animated) */}
              <div
                ref={searchWrapperRef}
                className={`search-wrapper ${
                  isSearchExpanded ? "expanded" : ""
                }`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input-field"
                  placeholder="Search jobs by title, skill, or department..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  aria-label="Search jobs"
                  tabIndex={isSearchExpanded ? 0 : -1}
                  aria-hidden={!isSearchExpanded}
                />
                <button
                  type="button"
                  className="search-toggle-btn"
                  onClick={handleSearchToggle}
                  aria-label={isSearchExpanded ? "Close search" : "Open search"}
                  aria-expanded={isSearchExpanded}
                >
                  <span
                    className="icon-wrap"
                    key={isSearchExpanded ? "close" : "open"}
                  >
                    {isSearchExpanded ? (
                      <X size={20} strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <Search size={20} strokeWidth={2.5} aria-hidden="true" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-shape">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Jobs Grid Section */}
      <section className="jobs-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" size={48} />
              <p>Loading job opportunities...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="retry-btn"
              >
                Try Again
              </button>
            </div>
          ) : isEmpty ? (
            <div className="empty-state">
              <Briefcase size={56} className="empty-icon" />
              <h3>No jobs available</h3>
              <p className="error-of-filter">
                There are no openings at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <>
              {/* ─── Matching jobs ─── */}
              {filteredJobs.length > 0 ? (
                <>
                  {selectedDepartment && (
                    <div className="service-type-header">
                      <h2>Jobs in {selectedDepartment}</h2>
                      <span>
                        Showing {filteredJobs.length} opportunit
                        {filteredJobs.length === 1 ? "y" : "ies"}
                      </span>
                    </div>
                  )}

                  <div className="jobs-grid">
                    {filteredJobs.map((job, index) => (
                      <JobCard
                        key={getJobKey(job, index)}
                        job={job}
                        variant="match"
                        onView={() => handleViewDetails(job, index)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                hasActiveFilter && (
                  <div className="no-match-notice">
                    <div className="no-match-icon">🔍</div>
                    <h3>No exact matches for your filters</h3>
                    <p>
                      Try adjusting your criteria — or browse the other
                      opportunities below.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="clear-filters-btn primary"
                    >
                      Clear all filters
                    </button>
                  </div>
                )
              )}

              {/* ─── Other (non-matching) jobs ─── */}
              {otherJobs.length > 0 && (
                <div className="other-jobs-section">
                  <div className="other-jobs-header">
                    <h2>Other Opportunities</h2>
                    <span>
                      {otherJobs.length} more role
                      {otherJobs.length === 1 ? "" : "s"} available
                    </span>
                  </div>

                  <div className="jobs-grid">
                    {otherJobs.map((job, index) => (
                      <JobCard
                        key={getJobKey(job, `other-${index}`)}
                        job={job}
                        variant="other"
                        onView={() =>
                          handleViewDetails(
                            job,
                            filteredJobs.length + index
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode="login"
        onSuccess={() => {
          setAuthModalOpen(false);
          window.open(
            "/careers-liaison-bank/candidate-dashboard",
            "_blank",
            "noopener,noreferrer"
          );
        }}
      />

      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={selectedJobIndex > 0}
        hasNext={selectedJobIndex < allVisibleJobs.length - 1}
        onRequireLogin={() => setAuthModalOpen(true)}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={<div className="jobs-page-loading">Loading jobs...</div>}
    >
      <JobsPageContent />
    </Suspense>
  );
}