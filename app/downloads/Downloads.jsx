"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";

import useBodyClass from "@/components/useBodyClass";

import {
  FileText,
  Download,
  File,
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Grid3x3,
  Maximize2,
  Building2,
  Award,
  Flame,
  Shield,
  Zap,
  Wrench,
  Users,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
| react-pageflip manipulates the DOM internally.
| Therefore:
|
| 1. Do NOT progressively add/remove pages after FlipBook mounts.
| 2. Load the complete PDF first.
| 3. Render all PDF pages.
| 4. Mount FlipBook once.
| 5. When changing PDF, completely unmount old FlipBook first.
|--------------------------------------------------------------------------
*/

const HTMLFlipBook = dynamic(
  () => import("react-pageflip"),
  {
    ssr: false,
    loading: () => (
      <div className="pdf-loading">
        <div className="loading-spinner" />
        <p>Preparing flipbook...</p>
      </div>
    ),
  }
);

/*
|--------------------------------------------------------------------------
| PDF.js
|--------------------------------------------------------------------------
*/

let pdfjsInstance = null;

async function getPdfJs() {
  if (pdfjsInstance) {
    return pdfjsInstance;
  }

  const pdfjs = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  );

  pdfjs.GlobalWorkerOptions.workerSrc =
    new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

  pdfjsInstance = pdfjs;

  return pdfjs;
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function Downloads() {
  useBodyClass("downloads");

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [isClient, setIsClient] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [pageImages, setPageImages] =
    useState([]);

  const [totalPages, setTotalPages] =
    useState(0);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(false);

  const [loadingProgress, setLoadingProgress] =
    useState(0);

  const [flipbookReady, setFlipbookReady] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isFullscreen, setIsFullscreen] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Refs
  |--------------------------------------------------------------------------
  */

  const flipBookRef =
    useRef(null);

  const mountedRef =
    useRef(false);

  const requestIdRef =
    useRef(0);

  const pdfRef =
    useRef(null);

  const viewerRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Documents
  |--------------------------------------------------------------------------
  */

  const downloads = useMemo(
    () => [
      {
        name: "Company Profile",
        file: "COMPANYPROFILE",
        category: "profile",
        description:
          "Comprehensive overview of our company, services, and achievements",
        size: "3.5 MB",
        color: "#f97316",
      },
      {
        name: "Liaisoning Services",
        file: "liaisoning-new",
        category: "liaisoning",
        description:
          "Complete guide to liaisoning services and government approvals",
        size: "2.4 MB",
        color: "#3b82f6",
      },
      {
        name: "Licensing Services",
        file: "licensing",
        category: "licensing",
        description:
          "Comprehensive licensing solutions across various sectors",
        size: "1.8 MB",
        color: "#8b5cf6",
      },
      {
        name: "PNG Services",
        file: "png",
        category: "png",
        description: "Piped natural gas services and compliance",
        size: "1.2 MB",
        color: "#06b6d4",
      },
      {
        name: "Fire Services",
        file: "fss",
        category: "fire-safety",
        description:
          "Fire safety audits, risk assessments, and certification services",
        size: "3.1 MB",
        color: "#ef4444",
      },
      {
        name: "Electrical Services",
        file: "electrical",
        category: "electrical",
        description:
          "Professional electrical audit and certification services",
        size: "2.2 MB",
        color: "#f59e0b",
      },
      {
        name: "AMC Services",
        file: "amc",
        category: "amc",
        description:
          "Comprehensive annual maintenance contracts for compliance",
        size: "1.5 MB",
        color: "#10b981",
      },
    ],
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Categories - ENHANCED WITH ICONS
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(
    () => [
      { id: "all", label: "All", icon: <Grid3x3 size={18} /> },
      { id: "profile", label: "Profile", icon: <Building2 size={18} /> },
      { id: "liaisoning", label: "Liaisoning", icon: <Users size={18} /> },
      { id: "licensing", label: "Licensing", icon: <Award size={18} /> },
      { id: "png", label: "PNG", icon: <Flame size={18} /> },
      { id: "fire-safety", label: "Fire Safety", icon: <Shield size={18} /> },
      { id: "electrical", label: "Electrical", icon: <Zap size={18} /> },
      { id: "amc", label: "AMC", icon: <Wrench size={18} /> },
    ],
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredDownloads = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return downloads.filter(
      (item) => {
        const matchesSearch =
          !search ||
          item.name
            .toLowerCase()
            .includes(search) ||
          item.description
            .toLowerCase()
            .includes(search);

        const matchesCategory =
          activeFilter === "all" ||
          item.category ===
            activeFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    downloads,
    searchTerm,
    activeFilter,
  ]);

  const currentDoc =
    filteredDownloads[
      currentIndex
    ] || null;

  /*
  |--------------------------------------------------------------------------
  | Client mount
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    mountedRef.current = true;

    setIsClient(true);

    return () => {
      mountedRef.current = false;

      requestIdRef.current += 1;

      if (pdfRef.current) {
        try {
          pdfRef.current.destroy();
        } catch {}
      }
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reset document index when search/filter changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentIndex(0);
  }, [
    activeFilter,
    searchTerm,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Load PDF
  |--------------------------------------------------------------------------
  */

  const loadPDF = useCallback(
    async (documentData) => {
      if (!documentData) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | New request ID
      |--------------------------------------------------------------------------
      */

      const requestId =
        ++requestIdRef.current;

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT:
      | Remove FlipBook BEFORE loading another document.
      |--------------------------------------------------------------------------
      */

      setFlipbookReady(false);

      setPageImages([]);

      setTotalPages(0);

      setCurrentPage(1);

      setLoadingProgress(0);

      setError("");

      setIsLoading(true);

      /*
      |--------------------------------------------------------------------------
      | Destroy previous PDF
      |--------------------------------------------------------------------------
      */

      if (pdfRef.current) {
        try {
          await pdfRef.current.destroy();
        } catch {}

        pdfRef.current = null;
      }

      try {
        /*
        |--------------------------------------------------------------------------
        | Load PDF.js
        |--------------------------------------------------------------------------
        */

        const pdfjs =
          await getPdfJs();

        if (
          !mountedRef.current ||
          requestId !==
            requestIdRef.current
        ) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | PDF URL
        |--------------------------------------------------------------------------
        */

        const url =
          `/pdf/${documentData.file}.pdf`;

        console.log(
          "Loading PDF:",
          url
        );

        /*
        |--------------------------------------------------------------------------
        | Load PDF
        |--------------------------------------------------------------------------
        */

        const loadingTask =
          pdfjs.getDocument({
            url,

            useWorkerFetch: true,

            useSystemFonts: true,

            isEvalSupported: false,
          });

        const pdf =
          await loadingTask.promise;

        pdfRef.current = pdf;

        if (
          !mountedRef.current ||
          requestId !==
            requestIdRef.current
        ) {
          try {
            await pdf.destroy();
          } catch {}

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Number of pages
        |--------------------------------------------------------------------------
        */

        const numberOfPages =
          pdf.numPages;

        setTotalPages(
          numberOfPages
        );

        console.log(
          "Total pages:",
          numberOfPages
        );

        /*
        |--------------------------------------------------------------------------
        | Render every PDF page
        |--------------------------------------------------------------------------
        */

        const images = [];

        for (
          let pageNumber = 1;
          pageNumber <=
            numberOfPages;
          pageNumber++
        ) {
          /*
          |--------------------------------------------------------------------------
          | Cancel old request if user changed document
          |--------------------------------------------------------------------------
          */

          if (
            !mountedRef.current ||
            requestId !==
              requestIdRef.current
          ) {
            try {
              await pdf.destroy();
            } catch {}

            return;
          }

          /*
          |--------------------------------------------------------------------------
          | Get page
          |--------------------------------------------------------------------------
          */

          const page =
            await pdf.getPage(
              pageNumber
            );

          /*
          |--------------------------------------------------------------------------
          | Render scale
          |--------------------------------------------------------------------------
          */

          const viewport =
            page.getViewport({
              scale: 1.35,
            });

          /*
          |--------------------------------------------------------------------------
          | Canvas
          |--------------------------------------------------------------------------
          */

          const canvas =
            document.createElement(
              "canvas"
            );

          const context =
            canvas.getContext(
              "2d",
              {
                alpha: false,
              }
            );

          if (!context) {
            throw new Error(
              "Canvas context could not be created."
            );
          }

          canvas.width =
            Math.ceil(
              viewport.width
            );

          canvas.height =
            Math.ceil(
              viewport.height
            );

          /*
          |--------------------------------------------------------------------------
          | White background
          |--------------------------------------------------------------------------
          */

          context.fillStyle =
            "#ffffff";

          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );

          /*
          |--------------------------------------------------------------------------
          | Render PDF page
          |--------------------------------------------------------------------------
          */

          await page.render({
            canvasContext:
              context,

            viewport,

            background:
              "#ffffff",
          }).promise;

          /*
          |--------------------------------------------------------------------------
          | Convert to JPEG
          |--------------------------------------------------------------------------
          */

          const image =
            canvas.toDataURL(
              "image/jpeg",
              0.86
            );

          images.push(image);

          /*
          |--------------------------------------------------------------------------
          | Release canvas memory
          |--------------------------------------------------------------------------
          */

          canvas.width = 1;
          canvas.height = 1;

          /*
          |--------------------------------------------------------------------------
          | Progress
          |--------------------------------------------------------------------------
          */

          const progress =
            Math.round(
              (pageNumber /
                numberOfPages) *
                100
            );

          setLoadingProgress(
            progress
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Destroy PDF.js document
        |--------------------------------------------------------------------------
        */

        try {
          await pdf.destroy();
        } catch {}

        pdfRef.current = null;

        /*
        |--------------------------------------------------------------------------
        | Verify request still active
        |--------------------------------------------------------------------------
        */

        if (
          !mountedRef.current ||
          requestId !==
            requestIdRef.current
        ) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        |
        | Set ALL images at once.
        |
        | Never add/remove pages while PageFlip is mounted.
        |--------------------------------------------------------------------------
        */

        setPageImages(images);

        setCurrentPage(1);

        /*
        |--------------------------------------------------------------------------
        | Wait for React to render images.
        |--------------------------------------------------------------------------
        */

        requestAnimationFrame(
          () => {
            if (
              !mountedRef.current ||
              requestId !==
                requestIdRef.current
            ) {
              return;
            }

            setIsLoading(false);

            /*
            |--------------------------------------------------------------------------
            | Now mount FlipBook.
            |--------------------------------------------------------------------------
            */

            setFlipbookReady(
              true
            );
          }
        );

        console.log(
          "PDF ready:",
          documentData.file
        );
      } catch (err) {
        console.error(
          "PDF loading failed:",
          err
        );

        if (
          mountedRef.current &&
          requestId ===
            requestIdRef.current
        ) {
          setIsLoading(false);

          setFlipbookReady(false);

          setError(
            "Unable to load this PDF. Please try again."
          );
        }
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Load current document
  |--------------------------------------------------------------------------
  |
  | ONLY ONE effect is used for PDF loading.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !isClient ||
      !currentDoc
    ) {
      return;
    }

    loadPDF(currentDoc);

    return () => {
      requestIdRef.current += 1;
    };
  }, [
    isClient,
    currentDoc,
    loadPDF,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Change document
  |--------------------------------------------------------------------------
  */

  const changeDocument =
    useCallback(
      (index) => {
        if (
          index < 0 ||
          index >=
            filteredDownloads.length
        ) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Invalidate current PDF request.
        |--------------------------------------------------------------------------
        */

        requestIdRef.current += 1;

        /*
        |--------------------------------------------------------------------------
        | First remove FlipBook.
        |--------------------------------------------------------------------------
        */

        setFlipbookReady(false);

        setPageImages([]);

        setTotalPages(0);

        setCurrentPage(1);

        setLoadingProgress(0);

        setError("");

        setIsLoading(true);

        /*
        |--------------------------------------------------------------------------
        | Change document.
        |--------------------------------------------------------------------------
        */

        setCurrentIndex(index);
      },
      [filteredDownloads.length]
    );

  /*
  |--------------------------------------------------------------------------
  | Previous document
  |--------------------------------------------------------------------------
  */

  const goToPrevious =
    useCallback(() => {
      if (
        currentIndex > 0
      ) {
        changeDocument(
          currentIndex - 1
        );
      }
    }, [
      currentIndex,
      changeDocument,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Next document
  |--------------------------------------------------------------------------
  */

  const goToNext =
    useCallback(() => {
      if (
        currentIndex <
        filteredDownloads.length -
          1
      ) {
        changeDocument(
          currentIndex + 1
        );
      }
    }, [
      currentIndex,
      filteredDownloads.length,
      changeDocument,
    ]);

  /*
  |--------------------------------------------------------------------------
  | FlipBook page change
  |--------------------------------------------------------------------------
  */

  const onPageChange =
    useCallback(
      (event) => {
        if (
          event &&
          typeof event.data ===
            "number"
        ) {
          setCurrentPage(
            event.data + 1
          );
        }
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Next page
  |--------------------------------------------------------------------------
  */

  const nextPage =
    useCallback(() => {
      if (
        !flipBookRef.current
      ) {
        return;
      }

      try {
        const pageFlip =
          flipBookRef.current.pageFlip();

        pageFlip.flipNext();
      } catch (error) {
        console.error(
          "Next page error:",
          error
        );
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Previous page
  |--------------------------------------------------------------------------
  */

  const prevPage =
    useCallback(() => {
      if (
        !flipBookRef.current
      ) {
        return;
      }

      try {
        const pageFlip =
          flipBookRef.current.pageFlip();

        pageFlip.flipPrev();
      } catch (error) {
        console.error(
          "Previous page error:",
          error
        );
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Go to page
  |--------------------------------------------------------------------------
  */

  const goToPage =
    useCallback(
      (page) => {
        if (
          page < 1 ||
          page > totalPages
        ) {
          return;
        }

        if (
          !flipBookRef.current
        ) {
          return;
        }

        try {
          flipBookRef.current
            .pageFlip()
            .flip(page - 1);

          setCurrentPage(page);
        } catch (error) {
          console.error(
            "Go to page error:",
            error
          );
        }
      },
      [totalPages]
    );

  /*
  |--------------------------------------------------------------------------
  | Retry
  |--------------------------------------------------------------------------
  */

  const retryPDF =
    useCallback(() => {
      if (!currentDoc) {
        return;
      }

      loadPDF(currentDoc);
    }, [
      currentDoc,
      loadPDF,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Toggle fullscreen
  |--------------------------------------------------------------------------
  */

  const toggleFullscreen = useCallback(() => {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Client loading
  |--------------------------------------------------------------------------
  */

  if (!isClient) {
    return (
      <div
        className="pdf-loading"
        style={{
          minHeight: "200px",
        }}
      >
        <div className="loading-spinner" />

        <p>
          Loading viewer...
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="downloads-hero">
        <div className="hero-particles">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="hero-badge">
                <BookOpen size={24} />

                <span>
                  Resources
                </span>
              </div>

              <h1 className="hero-title">
                 Company Profile {" "}
                <span className="hero-highlight">
                 Download
                </span>
              </h1>

              <p className="hero-description">
                Browse through our comprehensive collection
                of service guides and compliance documents.
                
              </p>
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

      {/* ============================================================
          DOWNLOAD SECTION
      ============================================================ */}

      <section className="downloads-section">
        <div className="container">

          {/* ========================================================
              SEARCH / FILTER - TAB STYLE WITH UNDERLINE
          ======================================================== */}

          <div className="downloads-toolbar">
            <div className="filter-wrapper">
              {categories.map(
                (category) => (
                  <button
                    type="button"
                    key={
                      category.id
                    }
                    className={`filter-btn ${
                      activeFilter ===
                      category.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveFilter(
                        category.id
                      )
                    }
                  >
                    <span className="filter-label">
                      {category.label}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* ========================================================
              RESULT COUNT
          ======================================================== */}

          <div className="results-count">
            <span>
              {
                filteredDownloads.length
              }
            </span>{" "}
            documents available
          </div>

          {/* ========================================================
              DOCUMENT VIEWER
          ======================================================== */}

          {filteredDownloads.length >
            0 &&
            currentDoc && (
              <div className="pdf-flipbook-wrapper">

                {/* ==================================================
                    CARD
                ================================================== */}

                <div className="pdf-flipbook-card" ref={viewerRef}>

                  {/* ==================================================
                      HEADER
                  ================================================== */}

                  <div className="pdf-card-header">

                    <div className="pdf-info">

                      <div className="pdf-details">

                        <h3 className="pdf-title">
                          {
                            currentDoc.name
                          }
                        </h3>

                        <p className="pdf-description">
                          {
                            currentDoc.description
                          }
                        </p>

                        <div className="pdf-meta">

                          <span className="meta-item">
                            <File
                              size={
                                14
                              }
                            />

                            {
                              currentDoc.size
                            }
                          </span>

                          <span
                            className="meta-item category-tag"
                            style={{
                              background:
                                `${currentDoc.color}15`,
                              color:
                                currentDoc.color,
                            }}
                          >
                            <Tag
                              size={
                                14
                              }
                            />

                            {currentDoc.category
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                              currentDoc.category
                                .slice(
                                  1
                                )
                                .replace(
                                  "-",
                                  " "
                                )}
                          </span>

                        </div>
                      </div>
                    </div>

                    <div className="pdf-actions">
                      <button
                        type="button"
                        className="btn-fullscreen"
                        onClick={toggleFullscreen}
                        aria-label="Toggle fullscreen"
                      >
                        <Maximize2 size={18} />
                      </button>
                      <a
                        href={`/pdf/${currentDoc.file}.pdf`}
                        download
                        className="btn-download-pdf"
                      >
                        <Download
                          size={18}
                        />

                        Download
                      </a>
                    </div>

                  </div>

                  {/* ==================================================
                      FLIPBOOK VIEWER
                  ================================================== */}

                  <div className="pdf-viewer-container">

                    {/* ERROR */}
                    {error ? (
                      <div className="pdf-error">
                        <FileText
                          size={60}
                        />

                        <h3>
                          Unable to load
                          document
                        </h3>

                        <p>
                          {error}
                        </p>

                        <button
                          type="button"
                          className="btn-retry"
                          onClick={
                            retryPDF
                          }
                        >
                          Try Again
                        </button>
                      </div>
                    ) : flipbookReady &&
                      pageImages.length >
                        0 ? (

                      /*
                      |--------------------------------------------------------------------------
                      | IMPORTANT
                      |--------------------------------------------------------------------------
                      | FlipBook is mounted ONLY here.
                      |
                      | pageImages will NOT change while this
                      | FlipBook is mounted.
                      |--------------------------------------------------------------------------
                      */

                      <div className="flipbook-wrapper">

                        <HTMLFlipBook
                          key={
                            currentDoc.file
                          }
                          ref={
                            flipBookRef
                          }
                          width={550}
                          height={350}
                          size="stretch"
                          minWidth={280}
                          maxWidth={1200}
                          minHeight={175}
                          maxHeight={450}
                          maxShadowOpacity={
                            0.5
                          }
                          showCover={
                            true
                          }
                          mobileScrollSupport={
                            true
                          }
                          useMouseEvents={
                            true
                          }
                          drawShadow={
                            true
                          }
                          flippingTime={
                            700
                          }
                          startPage={0}
                          onFlip={
                            onPageChange
                          }
                          className="flipbook-container"
                        >
                          {pageImages.map(
                            (
                              image,
                              index
                            ) => (
                              <div
                                key={`${currentDoc.file}-page-${index}`}
                                className="flipbook-page"
                              >
                                <img
                                  src={
                                    image
                                  }
                                  alt={`Page ${
                                    index +
                                    1
                                  }`}
                                  className="flipbook-image"
                                  loading="lazy"
                                />
                              </div>
                            )
                          )}
                        </HTMLFlipBook>

                        {/* =================================================
                            PAGE CONTROLS - SIDE ARROWS
                        ================================================= */}

                        {/* Left Arrow */}
                        <button
                          type="button"
                          className={`page-btn page-btn-left ${
                            currentPage <= 1
                              ? "disabled"
                              : ""
                          }`}
                          disabled={
                            currentPage <= 1
                          }
                          onClick={prevPage}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={24} />
                        </button>

                        {/* Right Arrow */}
                        <button
                          type="button"
                          className={`page-btn page-btn-right ${
                            currentPage >= totalPages
                              ? "disabled"
                              : ""
                          }`}
                          disabled={
                            currentPage >= totalPages
                          }
                          onClick={nextPage}
                          aria-label="Next page"
                        >
                          <ChevronRight size={24} />
                        </button>

                        {/* Page counter at bottom center */}
                        <div className="pdf-controls">
                          <button
                            type="button"
                            className="page-nav-btn"
                            onClick={prevPage}
                            disabled={currentPage <= 1}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <span className="page-info">
                            <span className="current-page-num">
                              {currentPage}
                            </span>
                            <span className="total-page-num">
                              {" "}
                              /{" "}
                              {totalPages}
                            </span>
                          </span>
                          <button
                            type="button"
                            className="page-nav-btn"
                            onClick={nextPage}
                            disabled={currentPage >= totalPages}
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>

                      </div>

                    ) : (

                      /*
                      |--------------------------------------------------------------------------
                      | LOADING
                      |--------------------------------------------------------------------------
                      */

                      <div className="pdf-loading">

                        <div className="loading-spinner" />

                        <p>
                          Loading document...
                        </p>

                        <div className="loading-progress">
                          <div
                            className="loading-progress-bar"
                            style={{
                              width: `${loadingProgress}%`,
                            }}
                          />
                        </div>

                        <span className="loading-percentage">
                          {loadingProgress}%
                        </span>

                      </div>
                    )}

                  </div>

                  {/* ==================================================
                      DOCUMENT NAVIGATION DOTS
                  ================================================== */}

                  {filteredDownloads.length > 1 && (
                    <div className="doc-navigation">
                      <button
                        type="button"
                        className={`doc-nav-btn ${currentIndex === 0 ? "disabled" : ""}`}
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                      >
                        <ArrowLeft size={18} />
                        Previous
                      </button>
                      <div className="doc-dots">
                        {filteredDownloads.map(
                          (document, index) => (
                            <button
                              type="button"
                              key={document.file}
                              className={`doc-dot ${currentIndex === index ? "active" : ""}`}
                              onClick={() => changeDocument(index)}
                              aria-label={`Open ${document.name}`}
                              title={document.name}
                            />
                          )
                        )}
                      </div>
                      <button
                        type="button"
                        className={`doc-nav-btn ${currentIndex === filteredDownloads.length - 1 ? "disabled" : ""}`}
                        onClick={goToNext}
                        disabled={currentIndex === filteredDownloads.length - 1}
                      >
                        Next
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

          {/* ========================================================
              EMPTY
          ======================================================== */}

          {filteredDownloads.length ===
            0 && (
            <div className="empty-state">
              <FileText
                size={72}
              />

              <h3>
                No documents found
              </h3>

              <p>
                Try adjusting your
                search or filter
                criteria.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          CSS
      ============================================================ */}

      <style jsx>{`

        /* ============================================================
           GLOBAL
        ============================================================ */

        * {
          box-sizing: border-box;
        }

        /* ============================================================
           HERO
        ============================================================ */

        .downloads-hero {
          position: relative;
          background: linear-gradient(
            135deg,
            #0a1628 0%,
            #1a2a4a 50%,
            #0d1b2a 100%
          );
          padding: 100px 0 70px;
          overflow: hidden;
        }

        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(
            239,
            127,
            26,
            0.06
          );
          animation: float 20s ease-in-out infinite;
        }

        .particle-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -80px;
          animation-delay: 0s;
        }

        .particle-2 {
          width: 200px;
          height: 200px;
          bottom: -60px;
          left: -60px;
          animation-delay: -5s;
        }

        .particle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 50%;
          transform: translate(
            -50%,
            -50%
          );
          animation-delay: -10s;
        }

        .particle-4 {
          width: 100px;
          height: 100px;
          top: 15%;
          right: 15%;
          animation-delay: -3s;
        }

        .particle-5 {
          width: 80px;
          height: 80px;
          bottom: 25%;
          left: 10%;
          animation-delay: -7s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(
            239,
            127,
            26,
            0.15
          );
          color: #ef7f1a;
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          border: 1px solid
            rgba(
              239,
              127,
              26,
              0.2
            );
          position: relative;
          z-index: 2;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 16px;
          line-height: 1.1;
          position: relative;
          z-index: 2;
        }

        .hero-highlight {
          color: #ef7f1a;
          position: relative;
        }

        .hero-highlight::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 8px;
          background: rgba(239, 127, 26, 0.2);
          border-radius: 4px;
          z-index: -1;
        }

        .hero-description {
          font-size: 1.15rem;
          color: rgba(
            255,
            255,
            255,
            0.7
          );
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
          position: relative;
          z-index: 2;
        }

        .hero-shape {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 2;
        }

        .hero-shape svg {
          display: block;
          width: 100%;
        }

        /* ============================================================
           SECTION
        ============================================================ */

        .downloads-section {
          padding: 30px 0 60px;
          background: #f8f7f6;
        }

        /* ============================================================
           TOOLBAR - TAB STYLE WITH UNDERLINE
        ============================================================ */

        .downloads-toolbar {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
        }

        .filter-wrapper {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 900px;
          margin: 0 auto;
          padding: 4px 8px;
          width: 100%;
          border-bottom: 2px solid #e5e7eb;
        }

        .filter-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 20px;
          min-height: 70px;
          background: transparent;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          width: auto;
          border-radius: 0;
        }

        .filter-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 80%;
          height: 3px;
          background: #ef7f1a;
          border-radius: 3px 3px 0 0;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          color: #1a202c;
          transform: translateY(-2px);
        }

        .filter-btn:hover::after {
          transform: translateX(-50%) scaleX(0.6);
          background: #d1d5db;
        }

        .filter-btn.active {
          color: #ef7f1a;
        }

        .filter-btn.active::after {
          transform: translateX(-50%) scaleX(1);
          background: #ef7f1a;
        }

        .filter-btn.active .filter-icon {
          color: #ef7f1a;
        }

      

        .filter-label {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.2;
        }

        /* ============================================================
           RESULT
        ============================================================ */

        .results-count {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid
            #e5e7eb;
          text-align: center;
        }

        .results-count span {
          color: #1a202c;
          font-weight: 700;
        }

        /* ============================================================
           CARD
        ============================================================ */

        .pdf-flipbook-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid
            #e5e7eb;
          overflow: hidden;
          box-shadow:
            0 4px 24px
            rgba(
              0,
              0,
              0,
              0.04
            );
          transition: all 0.3s ease;
        }

        .pdf-flipbook-card:hover {
          box-shadow:
            0 8px 40px
            rgba(
              0,
              0,
              0,
              0.08
            );
        }

        /* ============================================================
           HEADER
        ============================================================ */

        .pdf-card-header {
          padding: 20px 28px;
          border-bottom: 1px solid
            #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          background: #fafafa;
        }

        .pdf-info {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          flex: 1;
        }

        .pdf-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.8rem;
        }

        .pdf-emoji {
          line-height: 1;
        }

        .pdf-details {
          min-width: 0;
          flex: 1;
        }

        .pdf-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 4px;
        }

        .pdf-description {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0 0 6px;
          line-height: 1.5;
        }

        .pdf-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .category-tag {
          padding: 3px 12px;
          border-radius: 6px;
          font-weight: 500;
        }

        .pdf-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .btn-fullscreen {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 2px solid #e5e7eb;
          background: #ffffff;
          border-radius: 10px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-fullscreen:hover {
          border-color: #ef7f1a;
          color: #ef7f1a;
          background: rgba(239, 127, 26, 0.05);
        }

        .btn-download-pdf {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 24px;
          background: #ef7f1a;
          color: #ffffff;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
          border: none;
        }

        .btn-download-pdf:hover {
          background: #e06b0e;
          transform: translateY(
            -2px
          );
          box-shadow: 0 6px 20px
            rgba(
              239,
              127,
              26,
              0.3
            );
        }

        /* ============================================================
           PDF VIEWER
        ============================================================ */

        .pdf-viewer-container {
          position: relative;
          width: 100%;
          min-height: 250px;
          background: #f0ece6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .flipbook-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 20px 0;
        }

        .flipbook-container {
          width: 100% !important;
          max-width: 1100px;
          margin: 0 auto;
        }

        .flipbook-page {
          width: 100%;
          height: 100%;
          background: #ffffff;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .flipbook-image {
          width: 100% !important;
          height: 100% !important;
          display: block;
          object-fit: contain !important;
          background: #ffffff;
          user-select: none;
          -webkit-user-drag: none;
          
        }

        /* ============================================================
           PAGE CONTROLS - SIDE ARROWS
        ============================================================ */

        .page-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
        }

        .page-btn-left {
          left: 20px;
        }

        .page-btn-right {
          right: 20px;
        }

        .page-btn:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.75);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
        }

        .page-btn:active:not(:disabled) {
          transform: translateY(-50%) scale(0.95);
        }

        .page-btn.disabled,
        .page-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
          transform: translateY(-50%) scale(0.9);
        }

        /* ============================================================
           PAGE CONTROLS - BOTTOM COUNTER
        ============================================================ */

        .pdf-controls {
          position: absolute;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 6px 16px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
        }

        .page-nav-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .page-nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .page-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .page-info {
          min-width: 70px;
          text-align: center;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .current-page-num {
          font-weight: 700;
          color: #ef7f1a;
        }

        .total-page-num {
          opacity: 0.6;
        }

        /* ============================================================
           DOCUMENT NAVIGATION
        ============================================================ */

        .doc-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 28px;
          background: #fafafa;
          border-top: 1px solid #f3f4f6;
          flex-wrap: wrap;
        }

        .doc-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          background: #ffffff;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a202c;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .doc-nav-btn:hover:not(:disabled) {
          border-color: #ef7f1a;
          color: #ef7f1a;
          background: rgba(239, 127, 26, 0.05);
        }

        .doc-nav-btn.disabled,
        .doc-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .doc-dots {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
          justify-content: center;
        }

        .doc-dot {
          width: 12px;
          height: 12px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .doc-dot:hover {
          transform: scale(1.3);
          background: #9ca3af;
        }

        .doc-dot.active {
          width: 32px;
          border-radius: 6px;
          background: #ef7f1a;
          box-shadow: 0 0 16px
            rgba(
              239,
              127,
              26,
              0.3
            );
        }

        .doc-dot.active::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 8px;
          border: 2px solid rgba(239, 127, 26, 0.2);
        }

        /* ============================================================
           LOADING
        ============================================================ */

        .pdf-loading {
          width: 100%;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #6b7280;
          padding: 40px 20px;
        }

        .loading-spinner {
          width: 44px;
          height: 44px;
          border: 3px solid
            #e5e7eb;
          border-top-color: #ef7f1a;
          border-radius: 50%;
          animation: spin
            0.8s linear infinite;
        }

        .loading-progress {
          width: 280px;
          max-width: 80%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 20px;
          overflow: hidden;
        }

        .loading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ef7f1a, #f97316);
          border-radius: inherit;
          transition: width
            0.3s ease;
        }

        .loading-percentage {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ef7f1a;
        }

        @keyframes spin {
          to {
            transform: rotate(
              360deg
            );
          }
        }

        /* ============================================================
           ERROR
        ============================================================ */

        .pdf-error {
          width: 100%;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          color: #6b7280;
          padding: 40px 20px;
        }

        .pdf-error svg {
          color: #ef7f1a;
          opacity: 0.5;
        }

        .pdf-error h3 {
          color: #1a202c;
          margin: 0;
          font-size: 1.2rem;
        }

        .pdf-error p {
          margin: 0 0 10px;
        }

        .btn-retry {
          border: none;
          background: #ef7f1a;
          color: #ffffff;
          padding: 10px 28px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-retry:hover {
          background: #e06b0e;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(239, 127, 26, 0.3);
        }

        /* ============================================================
           EMPTY
        ============================================================ */

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #ffffff;
          border-radius: 16px;
          border: 2px dashed
            #e5e7eb;
        }

        .empty-state svg {
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #1a202c;
          margin-bottom: 6px;
          font-size: 1.3rem;
        }

        .empty-state p {
          color: #6b7280;
        }

        /* ============================================================
           FULLSCREEN
        ============================================================ */

        .pdf-flipbook-card:fullscreen {
          background: #f0ece6;
          border-radius: 0;
          display: flex;
          flex-direction: column;
        }

        .pdf-flipbook-card:fullscreen .pdf-viewer-container {
          flex: 1;
          min-height: 60vh;
        }

        .pdf-flipbook-card:fullscreen .pdf-card-header {
          background: rgba(255, 255, 255, 0.95);
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */

        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .pdf-title {
            font-size: 1.2rem;
          }

          .filter-btn {
            padding: 10px 14px;
            min-height: 60px;
          }

          .filter-label {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 768px) {

          .downloads-hero {
            padding: 100px 0 50px;
          }

          .hero-title {
            font-size: 2.2rem;
          }

          .hero-description {
            font-size: 0.95rem;
            padding: 0 15px;
          }

          .downloads-section {
            padding: 20px 0 40px;
          }

          .downloads-toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .filter-wrapper {
            gap: 4px;
            padding: 2px 4px;
          }

          .filter-btn {
            padding: 8px 10px;
            min-height: 50px;
            gap: 4px;
          }

          .filter-icon {
            font-size: 1.1rem;
          }

          .filter-label {
            font-size: 0.6rem;
          }

          .pdf-card-header {
            flex-direction: column;
            align-items: stretch;
            padding: 16px 20px;
          }

          .pdf-info {
            align-items: flex-start;
          }

          .pdf-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .btn-download-pdf {
            flex: 1;
            justify-content: center;
          }

          .pdf-viewer-container {
            min-height: 180px;
          }

          .page-btn {
            width: 38px;
            height: 38px;
          }

          .page-btn-left {
            left: 10px;
          }

          .page-btn-right {
            right: 10px;
          }

          .page-btn svg {
            width: 18px;
            height: 18px;
          }

          .pdf-controls {
            bottom: 14px;
            padding: 4px 12px;
          }

          .page-info {
            min-width: 60px;
            font-size: 0.8rem;
          }

          .doc-navigation {
            padding: 12px 16px;
            flex-direction: column;
            gap: 10px;
          }

          .doc-dots {
            gap: 6px;
          }

          .doc-nav-btn {
            padding: 6px 14px;
            font-size: 0.8rem;
          }

          .flipbook-wrapper {
            padding: 12px 0;
          }
        }

        @media (max-width: 480px) {

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-badge {
            font-size: 0.8rem;
            padding: 6px 16px;
          }

          .filter-wrapper {
            gap: 2px;
          }

          .filter-btn {
            padding: 6px 8px;
            min-height: 42px;
            gap: 3px;
          }

          .filter-icon {
            font-size: 0.9rem;
          }

          .filter-label {
            font-size: 0.5rem;
          }

          .pdf-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .pdf-icon-wrapper {
            width: 44px;
            height: 44px;
            font-size: 1.4rem;
          }

          .pdf-title {
            font-size: 1rem;
          }

          .pdf-description {
            font-size: 0.8rem;
          }

          .pdf-viewer-container {
            min-height: 150px;
          }

          .pdf-loading {
            min-height: 150px;
          }

          .page-btn {
            width: 32px;
            height: 32px;
          }

          .page-btn-left {
            left: 6px;
          }

          .page-btn-right {
            right: 6px;
          }

          .page-btn svg {
            width: 16px;
            height: 16px;
          }

          .pdf-controls {
            bottom: 8px;
            padding: 3px 10px;
            gap: 6px;
          }

          .page-info {
            min-width: 50px;
            font-size: 0.7rem;
          }

          .page-nav-btn {
            width: 26px;
            height: 26px;
          }

          .page-nav-btn svg {
            width: 14px;
            height: 14px;
          }

          .loading-progress {
            width: 160px;
          }

          .doc-dot {
            width: 10px;
            height: 10px;
          }

          .doc-dot.active {
            width: 24px;
          }

          .btn-download-pdf {
            padding: 8px 16px;
            font-size: 0.8rem;
          }

          .btn-fullscreen {
            width: 38px;
            height: 38px;
          }
        }

        /* For very small screens */
        @media (max-width: 360px) {
          .filter-wrapper {
            gap: 2px;
          }

          .filter-btn {
            padding: 4px 6px;
            min-height: 36px;
          }

          .filter-icon {
            font-size: 0.8rem;
          }

          .filter-label {
            font-size: 0.45rem;
          }
        }

        /* ============================================================
           SCROLLBAR
        ============================================================ */

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

      `}</style>
    </>
  );
}