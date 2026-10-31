// app/careers-liaison-bank/jobs/page.jsx
"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Map,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  X,
  SlidersHorizontal,
  Building2,
  BadgeCheck,
} from "lucide-react";
import "./jobs.scss";
import JobDetailsModal from "./JobDetailsModal";
import AuthModal from "../AuthModal";

const PAGE_SIZE = 8; // Slightly smaller page size for a denser, cleaner look

// ── Helpers ──────────────────────────────────────────────────
const getServiceType = (job) => job.custom_service_type || job.serviceType || "";

const getJobSkills = (job) => {
  const skills = [];
  const push = (val) => {
    if (!val) return;
    if (typeof val === "string")
      skills.push(...val.split("\n").map((s) => s.trim()).filter(Boolean));
    else if (Array.isArray(val)) skills.push(...val.filter(Boolean));
  };
  push(job.custom_skills);
  push(job.skills_required);
  push(job.skills);
  return skills;
};

const getJobTitle = (job) =>
  job.job_title || job.title || job.job_opening_template || job.designation || "";

const getFormattedJobTitle = (job) =>
  (getJobTitle(job) || "Position").replace(/\b\w/g, (c) => c.toUpperCase());

const getJobKey = (job, fallback = "") =>
  job?.__key || job?.id || job?.name || `job-${fallback}`;

const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diff <= 0) return "Just now";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff} days ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const deriveExperience = (job) => {
  const min = job.min_experience ?? job.experience_min;
  const max = job.max_experience ?? job.experience_max;
  if (min != null && max != null) return `${min}–${max} Yrs`;
  if (min != null) return `${min}+ Yrs`;
  if (max != null) return `Up to ${max} Yrs`;
  return null;
};

// ── Job Card (Enterprise Style) ──────────────────────────────
function JobCard({ job, onView }) {
  const skills = getJobSkills(job).slice(0, 3);
  const posted = formatDate(job.posted_on || job.creation);
  const exp = deriveExperience(job);
  const serviceType = getServiceType(job);

  return (
    <article
      className="job-card-list"
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
      <div className="job-card-main">
        <div className="job-card-head">
          <div className="job-title-group">
            <h2>{getFormattedJobTitle(job)}</h2>
            <span className="job-verified">
              <BadgeCheck size={14} /> Verified
            </span>
          </div>
          {posted && (
            <span className="job-posted">
              <Clock size={12} /> {posted}
            </span>
          )}
        </div>

        <div className="job-meta">
          <span className="job-id">{job.id || job.name || "—"}</span>
          <span className="separator">|</span>
          <span className="meta-item">
            <MapPin size={14} /> {job.location || "—"}
            {job.state ? `, ${job.state}` : ""}
          </span>
          <span className="separator">|</span>
          <span className="meta-item">
            <Briefcase size={14} /> {job.department || "General"}
          </span>
          {exp && (
            <>
              <span className="separator">|</span>
              <span className="meta-item">{exp}</span>
            </>
          )}
        </div>

        {skills.length > 0 && (
          <div className="job-skills">
            {skills.map((s, i) => (
              <span key={i} className="skill-chip">
                {s}
              </span>
            ))}
            {getJobSkills(job).length > 3 && (
              <span className="skill-chip-more">+{getJobSkills(job).length - 3} more</span>
            )}
          </div>
        )}
      </div>

      <div className="job-card-right">
        {serviceType && <span className="job-category-badge">{serviceType}</span>}
        <div className="job-card-cta">
          View Details
          <ChevronRight size={16} />
        </div>
      </div>
    </article>
  );
}

// ── Map / Grouped View ───────────────────────────────────────
function JobMapView({ jobs, onView }) {
  const grouped = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const dept = job.department || "General / Unassigned";
      (map[dept] ??= []).push(job);
    });
    return map;
  }, [jobs]);

  if (jobs.length === 0) {
    return (
      <div className="map-empty">
        <Map size={48} />
        <p>No jobs to display</p>
      </div>
    );
  }

  return (
    <div className="job-map-view">
      <div className="map-banner">
        <LayoutList size={18} />
        <span>Grouped view — jobs organized by department</span>
      </div>
      <div className="map-grid">
        {Object.entries(grouped).map(([dept, deptJobs]) => (
          <div key={dept} className="map-location-card">
            <div className="map-location-header">
              <Building2 size={16} />
              <h3>{dept}</h3>
              <span className="map-count">{deptJobs.length}</span>
            </div>
            <div className="map-location-jobs">
              {deptJobs.map((job) => (
                <div
                  key={getJobKey(job)}
                  className="map-job-item"
                  onClick={() => onView(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onView(job);
                    }
                  }}
                >
                  <h4>{getFormattedJobTitle(job)}</h4>
                  <div className="map-job-meta">
                    <span>{job.id || "—"}</span>
                    <span className="separator">•</span>
                    <span>{job.location || "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pagination ───────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const out = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  }, [currentPage, totalPages]);

  return (
    <nav className="jp-pagination" aria-label="Pagination">
      <button
        type="button"
        className="jp-page-btn jp-nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        suppressHydrationWarning
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {pages[0] > 1 && (
        <>
          <button
            type="button"
            className="jp-page-btn"
            onClick={() => onPageChange(1)}
            suppressHydrationWarning
          >
            1
          </button>
          {pages[0] > 2 && <span className="jp-page-ellipsis">…</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`jp-page-btn ${page === currentPage ? "jp-active" : ""}`}
          onClick={() => onPageChange(page)}
          suppressHydrationWarning
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="jp-page-ellipsis">…</span>
          )}
          <button
            type="button"
            className="jp-page-btn"
            onClick={() => onPageChange(totalPages)}
            suppressHydrationWarning
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="jp-page-btn jp-nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        suppressHydrationWarning
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ── Skeleton Loader ──────────────────────────────────────────
function JobSkeleton() {
  return (
    <div className="job-card-list job-skeleton" aria-hidden="true">
      <div className="sk-line sk-title" />
      <div className="sk-line sk-meta" />
      <div className="sk-line sk-chips" />
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
function JobsPageContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const departmentParam = searchParams.get("department");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [otherJobs, setOtherJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(departmentParam || "");
  const [selectedServiceType, setSelectedServiceType] = useState(serviceParam || "");
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("list");

  const [currentPage, setCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-jobs`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();

        let jobsData = [];
        if (Array.isArray(data)) jobsData = data;
        else if (data?.message && typeof data.message === "object") {
          if (Array.isArray(data.message.data)) jobsData = data.message.data;
          else if (Array.isArray(data.message)) jobsData = data.message;
        } else if (Array.isArray(data?.data)) jobsData = data.data;

        const normalized = jobsData.map((job, i) => ({
          ...job,
          __key: job.id || job.name || `job-${i}-${getJobTitle(job) || "untitled"}`,
        }));

        if (!cancelled) {
          setJobs(normalized);
          setFilteredJobs(normalized);
          setOtherJobs([]);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load jobs. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Filter
  useEffect(() => {
    let result = jobs;

    if (selectedDepartment) {
      const deptLower = selectedDepartment.toLowerCase().trim();
      result = result.filter((job) => (job.department || "").toLowerCase().includes(deptLower));
    }

    if (selectedServiceType) {
      const svc = selectedServiceType.toLowerCase().trim();
      result = result.filter((job) => getServiceType(job).toLowerCase().includes(svc));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      if (term) {
        const words = term.split(/\s+/).filter(Boolean);
        result = result.filter((job) => {
          const haystack = [
            getJobTitle(job),
            job.department || "",
            getJobSkills(job).join(" "),
            getServiceType(job),
            job.id || "",
            job.name || "",
          ].join(" ").toLowerCase();
          return words.every((w) => haystack.includes(w));
        });
      }
    }

    const sortFn = (a, b) => {
      const da = new Date(a.posted_on || a.creation || 0).getTime();
      const db = new Date(b.posted_on || b.creation || 0).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    };
    result = [...result].sort(sortFn);

    const hasActiveFilter = !!(selectedDepartment || selectedServiceType || searchTerm);

    if (hasActiveFilter) {
      const matchKeys = new Set(result.map((j) => getJobKey(j)));
      const nonMatching = jobs.filter((j) => !matchKeys.has(getJobKey(j))).sort(sortFn);
      setFilteredJobs(result);
      setOtherJobs(nonMatching);
    } else {
      setFilteredJobs(result);
      setOtherJobs([]);
    }

    setCurrentPage(1);
    setOtherCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedServiceType, sortOrder, jobs]);

  // Derived
  const departments = useMemo(() => [...new Set(jobs.map((j) => j.department).filter(Boolean))].sort(), [jobs]);
  const serviceTypes = useMemo(() => [...new Set(jobs.map(getServiceType).filter(Boolean)), "AMC"].sort(), [jobs]);

  const totalMatching = filteredJobs.length;
  const totalPages = Math.ceil(totalMatching / PAGE_SIZE);
  const paginatedMatching = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const paginationStart = totalMatching === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const paginationEnd = Math.min(currentPage * PAGE_SIZE, totalMatching);

  const totalOthers = otherJobs.length;
  const totalOtherPages = Math.ceil(totalOthers / PAGE_SIZE);
  const paginatedOthers = useMemo(() => {
    const start = (otherCurrentPage - 1) * PAGE_SIZE;
    return otherJobs.slice(start, start + PAGE_SIZE);
  }, [otherJobs, otherCurrentPage]);

  const allVisibleJobs = useMemo(() => [...paginatedMatching, ...paginatedOthers], [paginatedMatching, paginatedOthers]);

  // Handlers
  const handleServiceTypeChange = useCallback((e) => {
    const val = e.target.value;
    setSelectedServiceType(val);
    if (val && selectedDepartment) {
      const valid = jobs.some((j) => getServiceType(j) === val && j.department === selectedDepartment);
      if (!valid) setSelectedDepartment("");
    }
  }, [jobs, selectedDepartment]);

  const handleDepartmentChange = useCallback((e) => {
    const val = e.target.value;
    setSelectedDepartment(val);
    if (val && selectedServiceType) {
      const valid = jobs.some((j) => j.department === val && getServiceType(j) === selectedServiceType);
      if (!valid) setSelectedServiceType("");
    }
  }, [jobs, selectedServiceType]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedServiceType("");
    setSortOrder("newest");
    setCurrentPage(1);
    setOtherCurrentPage(1);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    setOtherCurrentPage(1);
  }, []);

  const handleViewDetails = useCallback((job, indexInAll) => {
    setSelectedJob(job);
    setSelectedJobIndex(indexInAll);
    setIsModalOpen(true);
  }, []);

  const goToPrevious = useCallback(() => {
    if (selectedJobIndex > 0) {
      const i = selectedJobIndex - 1;
      setSelectedJobIndex(i);
      setSelectedJob(allVisibleJobs[i]);
    }
  }, [selectedJobIndex, allVisibleJobs]);

  const goToNext = useCallback(() => {
    if (selectedJobIndex < allVisibleJobs.length - 1) {
      const i = selectedJobIndex + 1;
      setSelectedJobIndex(i);
      setSelectedJob(allVisibleJobs[i]);
    }
  }, [selectedJobIndex, allVisibleJobs]);

  const handleMapViewDetails = useCallback((job) => {
    let idx = paginatedMatching.findIndex((j) => getJobKey(j) === getJobKey(job));
    if (idx >= 0) return handleViewDetails(job, idx);
    const oIdx = paginatedOthers.findIndex((j) => getJobKey(j) === getJobKey(job));
    if (oIdx >= 0) return handleViewDetails(job, paginatedMatching.length + oIdx);
    setSelectedJob(job);
    setSelectedJobIndex(0);
    setIsModalOpen(true);
  }, [paginatedMatching, paginatedOthers, handleViewDetails]);

  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [totalPages]);

  const handleOtherPageChange = useCallback((page) => {
    if (page < 1 || page > totalOtherPages) return;
    setOtherCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [totalOtherPages]);

  const hasActiveFilter = !!(selectedDepartment || selectedServiceType || searchTerm);
  const isEmpty = filteredJobs.length === 0 && otherJobs.length === 0;

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="jobs-page-layout">
      
      {/* Premium Dark Search Hero */}
      <section className="top-search-bar">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <Sparkles size={14} /> Join our Enterprise Team
            </span>
            <h1>Discover your next career move.</h1>
            {/* <p>Explore opportunities across engineering, product, and business teams.</p> */}
          </div>

          <div className="search-box-container">
            <div className="search-input-group">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search by skills, keywords, or requisition ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                suppressHydrationWarning
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-input"
                  onClick={() => setSearchTerm("")}
                  suppressHydrationWarning
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button className="search-btn" type="button" onClick={handleSearch} suppressHydrationWarning>
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="main-content-wrapper">
        <div className="container layout-grid">
          
          {/* Sidebar Filters */}
          <aside className="sidebar">
            <div className="filter-header">
              <h2><SlidersHorizontal size={18} /> Filters</h2>
              {hasActiveFilter && (
                <button type="button" className="filter-clear-link" onClick={clearFilters} suppressHydrationWarning>
                  Clear all
                </button>
              )}
            </div>

            <div className="filter-accordion">
              <div className="accordion-item active">
                <div className="accordion-title">
                  <span>Department</span>
                  <ChevronDown size={18} />
                </div>
                <div className="accordion-content select-content">
                  <select value={selectedDepartment} onChange={handleDepartmentChange} suppressHydrationWarning>
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="accordion-item active">
                <div className="accordion-title">
                  <span>Service Type</span>
                  <ChevronDown size={18} />
                </div>
                <div className="accordion-content select-content">
                  <select value={selectedServiceType} onChange={handleServiceTypeChange} suppressHydrationWarning>
                    <option value="">All Services</option>
                    {serviceTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Job Results */}
          <main className="job-results-area">
            
            <div className="results-header">
              <div className="results-count">
                {loading ? (
                  "Loading..."
                ) : totalMatching === 0 ? (
                  "0 Jobs found"
                ) : (
                  <>Showing <strong>{paginationStart}–{paginationEnd}</strong> of <strong>{totalMatching}</strong> jobs</>
                )}
                {otherJobs.length > 0 && (
                  <span className="other-count"> · {otherJobs.length} other</span>
                )}
              </div>

              <div className="results-actions">
                <div className="sort-container">
                  <span className="sort-label">Sort by:</span>
                  <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} suppressHydrationWarning>
                    <option value="newest">Most Recent</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                <div className="view-toggles">
                  <button type="button" className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} suppressHydrationWarning>
                    <LayoutList size={18} />
                  </button>
                  <button type="button" className={`view-btn ${viewMode === "map" ? "active" : ""}`} onClick={() => setViewMode("map")} suppressHydrationWarning>
                    <Map size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="jobs-list-container">
              {loading ? (
                <div className="jobs-list">
                  {Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)}
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()} className="clear-btn" suppressHydrationWarning>Try Again</button>
                </div>
              ) : isEmpty ? (
                <div className="empty-state">
                  <Briefcase size={48} />
                  <h3>No jobs found</h3>
                  <p>Try adjusting your filters or search criteria.</p>
                  <button onClick={clearFilters} className="clear-btn" suppressHydrationWarning>Clear Filters</button>
                </div>
              ) : viewMode === "map" ? (
                <JobMapView jobs={filteredJobs} onView={handleMapViewDetails} />
              ) : (
                <>
                  {paginatedMatching.length > 0 ? (
                    <>
                      <div className="jobs-list">
                        {paginatedMatching.map((job, index) => (
                          <JobCard key={getJobKey(job, index)} job={job} onView={() => handleViewDetails(job, index)} />
                        ))}
                      </div>
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                  ) : (
                    hasActiveFilter && (
                      <div className="no-match-notice">
                        <h3>No exact matches found</h3>
                        <p>Try adjusting your search criteria to see more results.</p>
                        <button type="button" onClick={clearFilters} className="clear-btn" suppressHydrationWarning>Clear all filters</button>
                      </div>
                    )
                  )}

                  {otherJobs.length > 0 && (
                    <div className="other-jobs-section">
                      <div className="other-jobs-header">
                        <h3>Other Opportunities</h3>
                        <span>{otherJobs.length} more roles available</span>
                      </div>
                      <div className="jobs-list">
                        {paginatedOthers.map((job, index) => (
                          <JobCard key={getJobKey(job, `other-${index}`)} job={job} onView={() => handleViewDetails(job, paginatedMatching.length + index)} />
                        ))}
                      </div>
                      <Pagination currentPage={otherCurrentPage} totalPages={totalOtherPages} onPageChange={handleOtherPageChange} />
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode="login"
        onSuccess={() => {
          setAuthModalOpen(false);
          window.open("/careers-liaison-bank/candidate-dashboard", "_blank", "noopener,noreferrer");
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
    <Suspense fallback={<div style={{ padding: "60px", textAlign: "center" }}>Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}