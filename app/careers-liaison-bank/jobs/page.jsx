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

function JobsPageContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const departmentParam = searchParams.get("department");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
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

  // Search Animation State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch jobs from API
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

        setJobs(jobsData);
        setFilteredJobs(jobsData);
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

  // Helper functions
  const getServiceType = useCallback(
    (job) => job.custom_service_type || job.serviceType || "",
    []
  );

  const getJobSkills = useCallback((job) => {
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
  }, []);

  const getJobTitle = useCallback(
    (job) =>
      job.job_title ||
      job.title ||
      job.job_opening_template ||
      job.designation ||
      "",
    []
  );

  // Filter and sort jobs
  useEffect(() => {
    let result = jobs;

    // 1. Department Filter
    if (selectedDepartment) {
      const deptLower = selectedDepartment.toLowerCase().trim();
      result = result.filter((job) => {
        const jobDept = (job.department || "").toLowerCase().trim();
        return jobDept.includes(deptLower) || deptLower.includes(jobDept);
      });
    }

    // 2. Service Type Filter
    if (selectedServiceType) {
      const serviceLower = selectedServiceType.toLowerCase().trim();
      result = result.filter((job) => {
        const jobService = getServiceType(job).toLowerCase().trim();
        return jobService.includes(serviceLower) || jobService === serviceLower;
      });
    }

    // 3. Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      if (term !== "") {
        const searchWords = term.split(" ").filter((word) => word.length > 0);
        result = result.filter((job) => {
          const title = getJobTitle(job).toLowerCase();
          const department = (job.department || "").toLowerCase();
          const skillsString = getJobSkills(job).join(" ").toLowerCase();
          const serviceType = getServiceType(job).toLowerCase();

          if (searchWords.length > 1) {
            return (
              searchWords.every((word) => title.includes(word)) ||
              searchWords.every((word) => department.includes(word)) ||
              searchWords.every((word) => skillsString.includes(word)) ||
              searchWords.every((word) => serviceType.includes(word))
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

    // 4. Location Filter
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

    setFilteredJobs(result);
  }, [
    searchTerm,
    selectedLocation,
    selectedDepartment,
    selectedServiceType,
    sortOrder,
    jobs,
    getJobTitle,
    getJobSkills,
    getServiceType,
  ]);

  // Unique filter values
  const departments = useMemo(
    () => [...new Set(jobs.map((job) => job.department).filter(Boolean))],
    [jobs]
  );

  const serviceTypes = useMemo(
    () => [...new Set(jobs.map((job) => getServiceType(job)).filter(Boolean))],
    [jobs, getServiceType]
  );

  // --- Handlers ---

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

        if (!isValid) {
          setSelectedDepartment("");
        }
      }
    },
    [jobs, selectedDepartment, getServiceType]
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

        if (!isValid) {
          setSelectedServiceType("");
        }
      }
    },
    [jobs, selectedServiceType, getServiceType]
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
    // Reset dropdowns when user types in search
    setSelectedServiceType("");
    setSelectedDepartment("");
  }, []);

  // Close search on Escape key
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

  // Close search when clicking outside
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsSearchExpanded(false);
        if (searchTerm) {
          setSearchTerm("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded, searchTerm]);

  const getFormattedJobTitle = useCallback(
    (job) => {
      const title = getJobTitle(job) || "Position";
      return title
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    [getJobTitle]
  );

  const getJobDescription = useCallback(
    (job) => job.description || job.job_description || "",
    []
  );

  const getExperience = useCallback((job) => {
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
  }, []);

  const getOpenings = useCallback(
    (job) => job.vacancies || job.openings || 1,
    []
  );

  const handleViewDetails = useCallback((job, index) => {
    setSelectedJob(job);
    setSelectedJobIndex(index);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="jobs-page">
      {/* Hero Section */}
      <section className="jobs-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Build Your Career with LiaisonBank</h1>
            <p>
              Explore rewarding career opportunities and join a team of
              professionals driving business, licensing, compliance, and liaison
              services forward.
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

              {/* Job Count & Clear */}
              <div className="filter-group action-group">
                <label className="jobs-count">
                  {filteredJobs.length} OPEN JOBS
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
                className={`search-wrapper ${isSearchExpanded ? "expanded" : ""}`}
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
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={56} className="empty-icon" />
              <h3>No jobs found</h3>
              <p className="error-of-filter">
                {selectedDepartment
                  ? `No openings available for ${selectedDepartment} at the moment. Try exploring other services.`
                  : "Try adjusting your search or filter criteria"}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="clear-filters-btn primary"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {selectedDepartment && (
                <div className="service-type-header">
                  <h2>Jobs in {selectedDepartment}</h2>
                  <span>Showing {filteredJobs.length} opportunities</span>
                </div>
              )}

              <div className="jobs-grid">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.name || job.id || index}
                    className="job-card card variant-interactive-ring"
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
                          : getJobDescription(job) ||
                            "No description available"}
                      </p>

                      <div
                        className="job-footer"
                        onClick={() => handleViewDetails(job, index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleViewDetails(job, index);
                          }
                        }}
                      >
                        <button type="button" className="view-job-btn">
                          View Details <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            "noopener,noreferrer",
          );
        }}
      />

      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrevious={() => {
          if (selectedJobIndex > 0) {
            setSelectedJobIndex(selectedJobIndex - 1);
            setSelectedJob(filteredJobs[selectedJobIndex - 1]);
          }
        }}
        onNext={() => {
          if (selectedJobIndex < filteredJobs.length - 1) {
            setSelectedJobIndex(selectedJobIndex + 1);
            setSelectedJob(filteredJobs[selectedJobIndex + 1]);
          }
        }}
        hasPrevious={selectedJobIndex > 0}
        hasNext={selectedJobIndex < filteredJobs.length - 1}
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