"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Chip from "@mui/material/Chip";
import Select from "react-select";
import "./ProjectDetails.scss";
import ApiError from "../ApiError/ApiError";

const ITEMS_PER_LOAD = 20;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";
const PROJECTS_ENDPOINT = `${API_BASE_URL}/api/projects/distinct`;

/* ---------- icons ---------- */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

/* ---------- helpers ---------- */
const NOISE_TOKENS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg", "pdf", "psd", "ai",
  "mp4", "mov", "avi", "webm",
  "null", "n/a", "na", "none", "undefined", "-", "",
]);

const cleanStr = (v) => {
  if (v == null) return "";
  const s = String(v).trim();
  if (!s || NOISE_TOKENS.has(s.toLowerCase())) return "";
  return s;
};

const cleanArr = (arr) =>
  (Array.isArray(arr) ? arr : arr ? [arr] : []).map(cleanStr).filter(Boolean);

const uniq = (arr) => [...new Set(arr)];

function buildImageUrl(path) {
  const p = cleanStr(path);
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  return `${API_BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`;
}

/* Case-insensitive, locale-aware sort */
const sortAlpha = (a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" });

/* Build a react-select option list with an "All" head */
const buildOptions = (values, allLabel) => {
  const cleaned = [...new Set(values.map(cleanStr).filter(Boolean))].sort(sortAlpha);
  return [
    { value: "All", label: allLabel },
    ...cleaned.map((v) => ({ value: v, label: v })),
  ];
};

/* ---------- component ---------- */
export default function ProjectDetails({ projectCounts }) {
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const abortRef = useRef(null);
  const searchTimerRef = useRef(null);

  /* ---- full dataset ---- */
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---- filters ---- */
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All"); // services
  const [industry, setIndustry] = useState("All"); // projectsCategory
  const [location, setLocation] = useState("All");

  /* ---- client pagination ---- */
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  /* ---------- debounce search ---------- */
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setSearchTerm(searchInput.trim()), 300);
    return () => searchTimerRef.current && clearTimeout(searchTimerRef.current);
  }, [searchInput]);

  /* ---------- extraction ---------- */
  const extract = useCallback((data) => {
    if (Array.isArray(data)) return data;
    return data?.data || data?.projects || data?.items || [];
  }, []);

  /* ---------- normalization ---------- */
  const normalize = useCallback((p, idx) => {
    const title = cleanStr(p.title) || cleanStr(p.client_name) || "Untitled Project";
    const clientRaw = cleanStr(p.client_name);
    const clientName =
      clientRaw && clientRaw.toLowerCase() !== title.toLowerCase() ? clientRaw : null;

    const projectTypes = uniq(cleanArr(p.projectsCategory)); // industry
    const services = uniq(cleanArr(p.category)); // services
    const statusVal =
      cleanStr(p.project_status) || cleanStr(p.status) || "Unknown";
    const locationVal = cleanStr(p.location);

    return {
      id: p.id ?? p.project_id ?? `p-${idx}`,
      slug: cleanStr(p.slug) || null,
      title,
      clientName,
      projectTypes,
      services,
      status: statusVal,
      location: locationVal,
      imageUrl: buildImageUrl(p.featured_image),
      initial: title.trim().charAt(0).toUpperCase() || "·",
      // pre-computed haystack for fast search
      _searchBlob: [
        title,
        clientName,
        locationVal,
        statusVal,
        ...projectTypes,
        ...services,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  }, []);

  /* ---------- fetch all pages once ---------- */
  const fetchAll = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const PAGE = 100;
      let page = 1;
      let collected = [];

      // Loop until backend says no more pages.
      // Safety cap prevents infinite loops on malformed responses.
      while (page <= 200) {
        const qs = new URLSearchParams({ page: String(page), limit: String(PAGE) });
        const res = await fetch(`${PROJECTS_ENDPOINT}?${qs}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          const e = new Error(`HTTP ${res.status}`);
          e.status = res.status;
          throw e;
        }

        const data = await res.json();
        const raw = extract(data);
        collected.push(...raw.map((p, i) => normalize(p, collected.length + i)));

        const hasNext =
          data?.pagination?.has_next ??
          (typeof data?.hasMore === "boolean"
            ? data.hasMore
            : raw.length === PAGE);

        if (!hasNext || raw.length === 0) break;
        page += 1;
      }

      setAllProjects(collected);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [extract, normalize]);

  useEffect(() => {
    fetchAll();
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
      isFetchingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- derived options (from FULL dataset) ---------- */
  const statusOptions = useMemo(() => {
    const canonical = ["Completed", "In Progress", "Upcoming"];
    const present = new Set(
      allProjects.map((p) => p.status).filter((s) => s && s !== "Unknown"),
    );
    const ordered = [
      ...canonical.filter((s) => present.has(s)),
      ...[...present].filter((s) => !canonical.includes(s)).sort(sortAlpha),
    ];
    return [
      { value: "All", label: "All Status" },
      ...ordered.map((s) => ({ value: s, label: s })),
    ];
  }, [allProjects]);

  const categoryOptions = useMemo(
    () => buildOptions(allProjects.flatMap((p) => p.services), "All Services"),
    [allProjects],
  );

  const industryOptions = useMemo(
    () => buildOptions(allProjects.flatMap((p) => p.projectTypes), "All Industries"),
    [allProjects],
  );

  const locationOptions = useMemo(
    () => buildOptions(allProjects.map((p) => p.location), "All Locations"),
    [allProjects],
    
  );

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const cat = category.toLowerCase();
    const ind = industry.toLowerCase();
    const loc = location.toLowerCase();
    const st = status.toLowerCase();

    return allProjects.filter((p) => {
      if (st !== "all" && p.status.toLowerCase() !== st) return false;
      if (cat !== "all" && !p.services.some((s) => s.toLowerCase() === cat)) return false;
      if (ind !== "all" && !p.projectTypes.some((t) => t.toLowerCase() === ind)) return false;
      if (loc !== "all" && p.location.toLowerCase() !== loc) return false;
      if (term && !p._searchBlob.includes(term)) return false;
      return true;
    });
  }, [allProjects, searchTerm, status, category, industry, location]);

  /* reset pagination when filters change */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [searchTerm, status, category, industry, location]);

  const visibleProjects = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const hasMore = visibleCount < filtered.length;

  /* ---------- infinite scroll (local) ---------- */
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setVisibleCount((c) => c + ITEMS_PER_LOAD);
        }
      },
      { rootMargin: "600px" },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [hasMore, visibleProjects.length]);

  /* ---------- helpers ---------- */
  const statusClass = (s) => {
    const v = String(s).toLowerCase();
    if (v === "completed") return "is-completed";
    if (v === "in progress" || v === "ongoing") return "is-progress";
    if (v === "upcoming") return "is-upcoming";
    return "is-unknown";
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    status !== "All" ||
    category !== "All" ||
    industry !== "All" ||
    location !== "All";

  const clearAllFilters = () => {
    setSearchInput("");
    setStatus("All");
    setCategory("All");
    setIndustry("All");
    setLocation("All");
  };

  /* ---------- full-table skeleton ---------- */
  if (loading && allProjects.length === 0) {
    return (
      <section className="archive" aria-busy="true" aria-label="Loading project archive">
        <div className="archive-inner">
          <div className="sk-toolbar">
            <div className="sk-line sk-search" />
            <div className="sk-line sk-select" />
            <div className="sk-line sk-select" />
            <div className="sk-line sk-select" />
            <div className="sk-line sk-select" />
          </div>

          <div className="sk-list">
            {Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => (
              <div key={i} className="sk-row">
                <span className="sk-cell sk-thumb" />
                <div className="sk-body">
                  <span className="sk-line sk-title" />
                  <span className="sk-line sk-meta" />
                </div>
                <span className="sk-cell sk-status" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------- error ---------- */
  if (error && allProjects.length === 0) {
    return (
      <ApiError
        showStatus
        statusLabel="Error"
        statusCode={error?.status ? `ERR · ${error.status}` : "ERR · TIMEOUT"}
        statusTone={error?.status >= 500 ? "danger" : "warning"}
        title="Projects Temporarily Unavailable"
        message="Our project archive is temporarily unavailable. Please try again shortly."
        onRetry={fetchAll}
        backToHome={() => window.open("/", "_self")}
      />
    );
  }

  /* ---------- row ---------- */
  const renderRow = (project) => (
    <div key={project.id} className="archive-row" role="listitem">
      <div className="row-thumb" aria-hidden="true">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.add("is-visible");
            }}
          />
        )}
        <span className="thumb-letter">{project.initial}</span>
      </div>

      <div className="row-content">
        <div className="row-top">
          <h3 className="row-title">{project.title}</h3>
          <div className="row-meta">
            {project.clientName && <span className="meta-client">{project.clientName}</span>}
            {project.location && (
              <span className="meta-location">
                <IconPin /> {project.location}
              </span>
            )}
          </div>
        </div>

        <div className="row-tags">
          {project.projectTypes.length > 0 && (
            <div className="tag-group">
              <span className="tag-label">Industry</span>
              <span className="tag-values">{project.projectTypes.join(" · ")}</span>
            </div>
          )}
          {project.services.length > 0 && (
            <div className="tag-group">
              <span className="tag-label">Services</span>
              <span className="tag-values">{project.services.join(" · ")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="row-status-wrap">
        <Chip
          label={project.status}
          size="small"
          className={`row-status ${statusClass(project.status)}`}
        />
      </div>
    </div>
  );

  /* ---------- render ---------- */
  return (
    <section className="archive" aria-label="Project archive">
      <div className="archive-inner">
        {/* ============ TOOLBAR ============ */}
        <div className="archive-toolbar" role="search">
          <div className="toolbar-search">
            <IconSearch />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search projects, services, industry, locations…"
              aria-label="Search projects"
              autoComplete="off"
            />
            {searchInput && (
              <button
                className="search-clear"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="toolbar-selects">
            <Select
              inputId="f-category"
              value={categoryOptions.find((o) => o.value === category) || categoryOptions[0]}
              options={categoryOptions}
              onChange={(o) => setCategory(o?.value ?? "All")}
              className="archive-select"
              classNamePrefix="archive-select"
              isSearchable={false}
              aria-label="Service category"
            />
            <Select
              inputId="f-industry"
              value={industryOptions.find((o) => o.value === industry) || industryOptions[0]}
              options={industryOptions}
              onChange={(o) => setIndustry(o?.value ?? "All")}
              className="archive-select"
              classNamePrefix="archive-select"
              isSearchable={false}
              aria-label="Industry"
            />
            <Select
              inputId="f-status"
              value={statusOptions.find((o) => o.value === status) || statusOptions[0]}
              options={statusOptions}
              onChange={(o) => setStatus(o?.value ?? "All")}
              className="archive-select"
              classNamePrefix="archive-select"
              isSearchable={false}
              aria-label="Project status"
            />
            <Select
              inputId="f-location"
              value={locationOptions.find((o) => o.value === location) || locationOptions[0]}
              options={locationOptions}
              
              onChange={(o) => setLocation(o?.value ?? "All")}
              className="archive-select"
              classNamePrefix="archive-select"
              isSearchable
              aria-label="Location"
            />
          </div>
        </div>

        {/* ============ ACTIVE FILTER CHIPS ============ */}
        {hasActiveFilters && !loading && (
          <div className="archive-active-filters">
            <span className="af-count">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>

            {category !== "All" && (
              <button className="af-chip" onClick={() => setCategory("All")}>
                {category} <span aria-hidden>×</span>
              </button>
            )}
            {industry !== "All" && (
              <button className="af-chip" onClick={() => setIndustry("All")}>
                {industry} <span aria-hidden>×</span>
              </button>
            )}
            {status !== "All" && (
              <button className="af-chip" onClick={() => setStatus("All")}>
                {status} <span aria-hidden>×</span>
              </button>
            )}
            {location !== "All" && (
              <button className="af-chip" onClick={() => setLocation("All")}>
                {location} <span aria-hidden>×</span>
              </button>
            )}
            {searchTerm && (
              <button className="af-chip" onClick={() => setSearchInput("")}>
                “{searchTerm}” <span aria-hidden>×</span>
              </button>
            )}
            <button className="af-clear-all" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* ============ EMPTY ============ */}
        {!loading && filtered.length === 0 && (
          <div className="archive-empty">
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button onClick={clearAllFilters}>Clear Filters</button>
          </div>
        )}

        {/* ============ LIST ============ */}
        {visibleProjects.length > 0 && (
          <div className="archive-list" role="list">
            {visibleProjects.map(renderRow)}

            {hasMore && <div ref={observerRef} className="scroll-sentinel" aria-hidden="true" />}

            {hasMore && (
              <div className="archive-more">
                <button
                  className="archive-more-btn"
                  onClick={() => setVisibleCount((c) => c + ITEMS_PER_LOAD)}
                >
                  Load more projects
                </button>
              </div>
            )}

            {/* {!hasMore && (
              <div className="archive-end" role="status">
                <span className="end-rule" /> End of archive <span className="end-rule" />
              </div>
            )} */}
          </div>
        )}
      </div>
    </section>
  );
}