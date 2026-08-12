
"use client";

import { useMemo, useState } from "react";
import Select from "react-select";
import useBodyClass from "@/components/useBodyClass";
import PressReleaseCard from "./PressReleaseCard";

export default function PressReleaseLiaisonbankPage({ pressReleases = [] }) {
  useBodyClass("pressrelease");

  // Initial number of records to display
  const ITEMS_PER_LOAD = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");

  // Initially show 10 records
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  /**
   * ---------------------------------------------------------
   * CATEGORY OPTIONS
   * ---------------------------------------------------------
   */
  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(
        pressReleases
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ].sort();

    return [
      {
        value: "All",
        label: "All Categories",
      },
      ...categories.map((cat) => ({
        value: cat,
        label: cat,
      })),
    ];
  }, [pressReleases]);

  /**
   * ---------------------------------------------------------
   * YEAR OPTIONS
   * ---------------------------------------------------------
   */
  const yearOptions = useMemo(() => {
    const years = [
      ...new Set(
        pressReleases
          .map((item) => {
            if (item.year) {
              return String(item.year);
            }

            if (item.publishedAt) {
              return String(
                new Date(item.publishedAt).getFullYear()
              );
            }

            return null;
          })
          .filter(Boolean)
      ),
    ].sort((a, b) => Number(b) - Number(a));

    return [
      {
        value: "All",
        label: "All Years",
      },
      ...years.map((yr) => ({
        value: yr,
        label: yr,
      })),
    ];
  }, [pressReleases]);

  /**
   * ---------------------------------------------------------
   * FILTER DATA
   * ---------------------------------------------------------
   */
  const filteredPressReleases = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return pressReleases.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const itemCategory = item.category?.toLowerCase() || "";

      let itemYear = "";

      if (item.year) {
        itemYear = String(item.year);
      } else if (item.publishedAt) {
        itemYear = String(
          new Date(item.publishedAt).getFullYear()
        );
      }

      /**
       * Search
       */
      const matchesSearch =
        !search ||
        title.includes(search) ||
        itemCategory.includes(search) ||
        itemYear.includes(search);

      /**
       * Category
       */
      const matchesCategory =
        category === "All" ||
        item.category === category;

      /**
       * Year
       */
      const matchesYear =
        year === "All" ||
        itemYear === String(year);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesYear
      );
    });
  }, [
    pressReleases,
    searchTerm,
    category,
    year,
  ]);

  /**
   * ---------------------------------------------------------
   * VISIBLE DATA
   * ---------------------------------------------------------
   *
   * Initially:
   * 10 records
   *
   * After Load More:
   * all filtered records
   */
  const visiblePressReleases = useMemo(() => {
    return filteredPressReleases.slice(
      0,
      visibleCount
    );
  }, [
    filteredPressReleases,
    visibleCount,
  ]);

  /**
   * ---------------------------------------------------------
   * RESET PAGINATION
   * ---------------------------------------------------------
   */
  const resetVisibleCount = () => {
    setVisibleCount(ITEMS_PER_LOAD);
  };

  /**
   * ---------------------------------------------------------
   * SEARCH HANDLER
   * ---------------------------------------------------------
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    resetVisibleCount();
  };

  /**
   * ---------------------------------------------------------
   * CATEGORY HANDLER
   * ---------------------------------------------------------
   */
  const handleCategoryChange = (option) => {
    setCategory(option?.value || "All");
    resetVisibleCount();
  };

  /**
   * ---------------------------------------------------------
   * YEAR HANDLER
   * ---------------------------------------------------------
   */
  const handleYearChange = (option) => {
    setYear(option?.value || "All");
    resetVisibleCount();
  };

  /**
   * ---------------------------------------------------------
   * LOAD MORE
   * ---------------------------------------------------------
   *
   * Clicking Load More displays ALL remaining records.
   */
  const handleLoadMore = () => {
    setVisibleCount(filteredPressReleases.length);
  };

  /**
   * ---------------------------------------------------------
   * LOAD LESS
   * ---------------------------------------------------------
   */
  const handleLoadLess = () => {
    setVisibleCount(ITEMS_PER_LOAD);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
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

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <section className="py-4 border-bottom">
        <div className="container">
          <div className="row g-3">

            {/* SEARCH */}
            <div className="col-lg-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, category or year..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* CATEGORY */}
            <div className="col-lg-3">
              <Select
                instanceId="category-select"
                inputId="category-select"
                classNamePrefix="react-select"
                options={categoryOptions}
                value={
                  categoryOptions.find(
                    (option) =>
                      option.value === category
                  ) || categoryOptions[0]
                }
                onChange={handleCategoryChange}
                isSearchable={false}
              />
            </div>

            {/* YEAR */}
            <div className="col-lg-3">
              <Select
                instanceId="year-select"
                inputId="year-select"
                classNamePrefix="react-select"
                options={yearOptions}
                value={
                  yearOptions.find(
                    (option) =>
                      option.value === year
                  ) || yearOptions[0]
                }
                onChange={handleYearChange}
                isSearchable={false}
              />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PRESS RELEASE GRID
      ====================================================== */}
      <section className="container py-5 not-fount-pr">

        {/* NO RESULTS */}
        {filteredPressReleases.length === 0 ? (
          <div className="text-center py-5">
            <h4>No press releases found.</h4>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="press-grid">
              {visiblePressReleases.map((item) => (
                <PressReleaseCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>

            {/* =================================================
                LOAD MORE / LOAD LESS
            ================================================== */}
            <div className="col-12 text-center mt-5">

              {/* LOAD MORE */}
              {visibleCount <
                filteredPressReleases.length && (
                <button
                  type="button"
                  className="themeht-btn btn btn-primary btn-lg primary-btn d-inline-flex align-items-center mt-4"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}

              {/* LOAD LESS */}
              {visibleCount >=
                filteredPressReleases.length &&
                filteredPressReleases.length >
                  ITEMS_PER_LOAD && (
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

