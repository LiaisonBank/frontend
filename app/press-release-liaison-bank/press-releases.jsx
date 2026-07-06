"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Select from "react-select";
import useBodyClass from "@/components/useBodyClass";
import pressReleaseData from "@/lib/data/pressReleaseData";
import PressReleaseCard from "./PressReleaseCard";
import { section } from "framer-motion/client";


export default function PressReleaseLiaisonbankPage({
  pressReleases,
}) {
  useBodyClass("pressrelease");
  const itemsPerPage = 6;
  const ITEMS_PER_LOAD = 6;
  const sectionRef = useRef(null);
  const listingRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);


  // Category Options
  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(pressReleaseData.map((item) => item.category)),
    ];

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
  }, []);

  // Year Options
  const yearOptions = useMemo(() => {
    const years = [
      ...new Set(
        pressReleaseData.map((item) =>
          String(new Date(item.publishedAt).getFullYear()),
        ),
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
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return pressReleaseData.filter((post) => {
      const title = post.title?.toLowerCase() ?? "";

      const postCategory = post.category?.toLowerCase() ?? "";

      const postYear = String(new Date(post.publishedAt).getFullYear());

      const matchesSearch =
        !search ||
        title.includes(search) ||
        postCategory.includes(search) ||
        postYear.includes(search);

      const matchesCategory = category === "All" || post.category === category;

      const matchesYear = year === "All" || postYear === year;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [searchTerm, category, year]);

  // Pagination
  const visibleData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  return (
    <>
      {/* PAGE HEADER */}
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

        {/* FILTERS */}
        <section className="py-4 border-bottom">
            <div className="container">
            <div className="row g-3">
                {/* Search */}
                <div className="col-lg-6">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title, category or year..."
                    value={searchTerm}
                    onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleCount(ITEMS_PER_LOAD);
                    }}
                />
                </div>

                {/* Category */}
                <div className="col-lg-3">
                <Select
                    instanceId="category-select"
                    inputId="category-select"
                    classNamePrefix="react-select"
                    options={categoryOptions}
                    value={categoryOptions.find(
                    (option) => option.value === category,
                    )}
                    onChange={(option) => {
                    setCategory(option?.value ?? "All");
                    setVisibleCount(ITEMS_PER_LOAD);
                    }}
                    isSearchable={false}
                />
                </div>

                {/* Year */}
                <div className="col-lg-3">
                <Select
                    instanceId="year-select"
                    inputId="year-select"
                    classNamePrefix="react-select"
                    options={yearOptions}
                    value={yearOptions.find((option) => option.value === year)}
                    onChange={(option) => {
                    setYear(option?.value ?? "All");
                    setVisibleCount(ITEMS_PER_LOAD);
                    }}
                    isSearchable={false}
                />
                </div>
            </div>
            </div>
        </section>
        {/* GRID */}
        <section className="container py-5">
        <div className="press-grid">
            {pressReleases.map((item) => (
            <PressReleaseCard
                key={item.id}
                item={item}
            />
            ))}
        </div>
        </section>


      <section className="press-release-content py-5 d-none">
        <div className="container">
          <div className="row">
            <div className="col-6 mx-auto">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                 <p className="d-block px-3 py-2 border border-success rounded-pill bg-success-subtle text-success fw-semibold text-center text-capitalize"
                  >
                    Status: {dbStatus?.status}
                    Data: {pressReleases.length > 0 ? "Available" : "Not Available"}
                    DataLength: {pressReleases.length}
                  </p>
                   {pressReleases?.map((release) => (
                    <article key={release.id} className="press-card">
                        <h2>{release.title}</h2>

                        <p>{release.category}</p>

                        <p>{release.excerpt}</p>
                    </article>
                    ))}
                  <p>
                    Database: {dbStatus?.database}</p>
                  <p>
                    Version: {dbStatus?.version}</p>
                </div>
              )}
              </div></div>
              </div>
      </section>
      
      <section className="press-release-content py-5 d-none" ref={sectionRef}>
        <div className="container" ref={listingRef}>
          <div className="row g-4">          

            {visibleData.length > 0 ? (
              <>
                {visibleData.map((post, index) => (
                  <div
                    key={post.id}
                  >
                    <div className="card h-100 shadow-sm border-0">
                      <Link href={`/press-release-liaison-bank/${post.slug}`}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="card-img-top"
                        />
                      </Link>

                      <div className="card-body d-flex flex-column">
                        <h5>
                          <Link
                            href={`/press-release-liaison-bank/${post.slug}`}
                            className="text-dark text-decoration-none"
                          >
                            {post.title}
                          </Link>
                        </h5>

                        <div className="d-flex align-items-center justify-between">
                          <div>
                            <Link
                              href={`/press-release-liaison-bank/${post.slug}`}
                            >
                              <span className="badge theme-bg mb-2 align-self-start">
                                {post.category}
                              </span>
                            </Link>
                          </div>

                          <div>
                            <small className="text-muted d-block mb-2">
                              {post.publishedAt}
                            </small>
                          </div>
                        </div>

                        <Link
                          href={`/press-release-liaison-bank/${post.slug}`}
                          className="btn btn-sm mt-auto align-self-end"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-box-arrow-up-right"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                            />
                            <path
                              fillRule="evenodd"
                              d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-12 text-center mt-5">
                  {/* Load More */}{" "}
                  {visibleCount < filteredData.length && (
                    <button
                      type="button"
                      className="themeht-btn btn btn-primary btn-lg primary-btn d-inline-flex align-items-center mt-4"
                      onClick={() => {
                        setVisibleCount((prev) =>
                          Math.min(prev + ITEMS_PER_LOAD, filteredData.length),
                        );
                        setTimeout(() => {
                          listingRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          });
                        }, 100);
                      }}
                    >
                      {" "}
                      Load More{" "}
                    </button>
                  )}{" "}
                  {/* Load Less */}{" "}
                  {visibleCount > ITEMS_PER_LOAD && (
                    <button
                      type="button"
                      className="themeht-btn btn btn-primary btn-lg primary-btn d-inline-flex align-items-center mt-4"
                      onClick={() => {
                        setVisibleCount((prev) =>
                          Math.max(prev - ITEMS_PER_LOAD, ITEMS_PER_LOAD),
                        );
                        setTimeout(() => {
                          listingRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          });
                        }, 100);
                      }}
                    >
                      {" "}
                      Load Less{" "}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <h4 className="mb-2">
                    {pressReleaseData.length === 0
                      ? "Press Releases Not Yet Released"
                      : "No Data Found"}
                  </h4>

                  <p className="text-center text-muted mb-0">
                    {pressReleaseData.length === 0
                      ? "Press releases will appear here once they are published."
                      : "No press releases match your search or filter criteria."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
        

    </>
  );
}
