"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import Select, { components } from "react-select";
import useBodyClass from "@/components/useBodyClass";
import PressReleaseCard from "./PressReleaseCard";
import CountUp from "@/hooks/Countup";

// Custom MenuList that prevents page scroll while scrolling inside the dropdown
const MenuList = (props) => {
  return (
    <components.MenuList {...props}>
      <div
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ maxHeight: 300, overflowY: "auto" }}
      >
        {props.children}
      </div>
    </components.MenuList>
  );
};

export default function PressReleaseLiaisonbankPage({ pressReleases = [] }) {
  useBodyClass("pressrelease");

  // Number of items per row in your grid (used to load 2 rows at a time)
  const ITEMS_PER_ROW = 3;
  const ROWS_PER_LOAD = 2;
  const ITEMS_PER_LOAD = ITEMS_PER_ROW * ROWS_PER_LOAD; // 6 items = 2 rows

  // Delay (ms) to show the spinner before new rows appear
  const LOAD_DELAY = 800;

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const heroRef = useRef(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMoreRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  // ✅ Total count of ALL press releases
  const totalCount = pressReleases.length;

  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(
        pressReleases.map((item) => item.category).filter(Boolean)
      ),
    ].sort();

    return [
      { value: "All", label: "All Categories" },
      ...categories.map((cat) => ({ value: cat, label: cat })),
    ];
  }, [pressReleases]);

  const filteredPressReleases = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return pressReleases.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const itemCategory = item.category?.toLowerCase() || "";

      const matchesSearch =
        !search || title.includes(search) || itemCategory.includes(search);

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [pressReleases, searchTerm, category]);

  const visiblePressReleases = useMemo(
    () => filteredPressReleases.slice(0, visibleCount),
    [filteredPressReleases, visibleCount]
  );

  const resetVisibleCount = () => {
    // Clear any pending load when filters change
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setIsLoadingMore(false);
    setVisibleCount(ITEMS_PER_LOAD);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    resetVisibleCount();
  };

  const handleCategoryChange = (option) => {
    setCategory(option?.value || "All");
    resetVisibleCount();
  };

  // ✅ Infinite scroll with a visual loading delay before showing next rows
  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    if (visibleCount >= filteredPressReleases.length) return;

    setIsLoadingMore(true);

    // Show spinner for LOAD_DELAY ms, then append next batch
    loadTimeoutRef.current = setTimeout(() => {
      setVisibleCount((prev) => {
        if (prev >= filteredPressReleases.length) return prev;
        return Math.min(prev + ITEMS_PER_LOAD, filteredPressReleases.length);
      });
      setIsLoadingMore(false);
      loadTimeoutRef.current = null;
    }, LOAD_DELAY);
  }, [isLoadingMore, visibleCount, filteredPressReleases.length]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    // Stop observing if all items are shown
    if (visibleCount >= filteredPressReleases.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px 0px" } // Trigger slightly before reaching bottom
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, visibleCount, filteredPressReleases.length]);

  // Cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="page-header d-none">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Press Releases</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="pr-hero-section" ref={heroRef}>
        <div className="elementor-background-overlay" />

        <div className="hero-content position-absolute top-50 start-50 translate-middle text-center">
          <h1>Press Release</h1>
          <div className="stats-grid">
            <div className="stat-item">
              <CountUp end={totalCount} className="total-value" />
              <span className="stat-label">PRESS RELEASE</span>
            </div>
          </div>
          {error && (
            <div className="text-center text-danger mb-3">
              <small>⚠️ {error}</small>
            </div>
          )}
        </div>
      </section>

      <section className="py-4 border-bottom">
        <div className="container">
          <div className="row g-3">
            <div className="col-lg-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, category..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-lg-4">
              <Select
                instanceId="category-select"
                inputId="category-select"
                classNamePrefix="react-select"
                options={categoryOptions}
                value={
                  categoryOptions.find((o) => o.value === category) ||
                  categoryOptions[0]
                }
                onChange={handleCategoryChange}
                isSearchable={false}
                components={{ MenuList }}
                menuShouldScrollIntoView={false}
                captureMenuScroll={false}
                styles={{
                  menuList: (base) => ({
                    ...base,
                    padding: 0,
                  }),
                  menu: (base) => ({
                    ...base,
                    overflow: "hidden",
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5 not-fount-pr">
        {filteredPressReleases.length === 0 ? (
          <div className="text-center py-5">
            <h4>No press releases found.</h4>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="press-grid">
              {visiblePressReleases.map((item) => (
                <PressReleaseCard key={item.id} item={item} />
              ))}
            </div>

            {/* Loading spinner + sentinel for infinite scroll */}
            {visibleCount < filteredPressReleases.length && (
              <div
                ref={loadMoreRef}
                className="text-center py-4"
                aria-live="polite"
              >
                {isLoadingMore ? (
                  <div className="d-inline-flex align-items-center gap-2">
                    <div
                      className="spinner-border text-warning"
                      role="status"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Loading more...</span>
                  </div>
                ) : (
                  // Invisible spacer so the sentinel still has height to trigger
                  <div style={{ height: 40 }} />
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}