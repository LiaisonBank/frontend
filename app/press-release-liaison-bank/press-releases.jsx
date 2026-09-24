"use client";

import { useMemo, useState, useRef } from "react";
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

  const ITEMS_PER_LOAD = 10;
 

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const heroRef = useRef(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  const resetVisibleCount = () => setVisibleCount(ITEMS_PER_LOAD);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    resetVisibleCount();
  };

  const handleCategoryChange = (option) => {
    setCategory(option?.value || "All");
    resetVisibleCount();
  };

  const handleLoadMore = () => setVisibleCount(filteredPressReleases.length);

  const handleLoadLess = () => {
    
    setVisibleCount(ITEMS_PER_LOAD);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      <section  className="pr-hero-section" ref={heroRef}>
          {/* <video
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/projects-poster.png"
        >
          <source
            src="/videos/projects-bg.mp4"
            type="video/mp4"
          />

          <source
            src="/videos/projects-bg.webm"
            type="video/webm"
          />

          Your browser does not support the video tag.
        </video> */}

        <div className="elementor-background-overlay" />

        <div className="hero-content position-absolute top-50 start-50 translate-middle text-center">
          <h1>Press Release</h1>
          <div className="stats-grid">
            <div className="stat-item">
              <CountUp end={totalCount} className="total-value"/>
              {/* <span className="stat-number">
                {loading ? "..." : count || "0"}
              </span> */}
              <span className="stat-label">PRESS RELEASE</span>
            </div>
          </div>
          {error && (
            <div className="text-center text-danger mb-3">
              <small>⚠️ {error}</small>
            </div>
          )}
        </div>
        {/* <div className="container">
          <p className="mb-0 text-muted">
            Total Press Releases: <strong>{totalCount}</strong>
          </p>
        </div> */}
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
            <div className="col-12 text-center mt-5">
              {visibleCount < filteredPressReleases.length && (
                <button
                  type="button"
                  className="themeht-btn btn btn-primary btn-lg primary-btn d-inline-flex align-items-center mt-4"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}
              {visibleCount >= filteredPressReleases.length &&
                filteredPressReleases.length > ITEMS_PER_LOAD && (
                  <button
                    type="button"
                    className="themeht-btn btn btn-primary btn-lg primary-btn d-inline-flex align-items-center mt-4"
                    onClick={handleLoadLess}
                  >
                    Load Less
                  </button>
                )}
            </div>
          </>
        )}
      </section>
    </>
  );
}