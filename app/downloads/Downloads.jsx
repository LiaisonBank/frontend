// app/downloads/Downloads.jsx
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

export default function Downloads() {
  useBodyClass("downloads");

  // State
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("profile");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageImages, setPageImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [flipbookReady, setFlipbookReady] = useState(false);
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // ✅ New: Track if "All" was clicked and fullscreen was auto-opened
  const [autoFullscreenTriggered, setAutoFullscreenTriggered] = useState(false);

  // Refs
  const flipBookRef = useRef(null);
  const viewerRef = useRef(null);

  // Documents
  const downloads = useMemo(
    () => [
      {
        name: "Company Profile",
        file: "liaisoncompanyprofile",
        category: "profile",
        description: "Comprehensive overview of our company, services, and achievements",
        size: "3.5 MB",
        color: "#f97316",
        maxPages: 30,
      },
      {
        name: "Liaisoning Services",
        file: "liaisoning-new",
        category: "liaisoning",
        description: "Complete guide to liaisoning services and government approvals",
        size: "2.4 MB",
        color: "#f97316",
        maxPages: 20,
      },
      {
        name: "Licensing Services",
        file: "licensing",
        category: "licensing",
        description: "Comprehensive licensing solutions across various sectors",
        size: "1.8 MB",
        color: "#f97316",
        maxPages: 20,
      },
      {
        name: "PNG Services",
        file: "png",
        category: "png",
        description: "Piped natural gas services and compliance",
        size: "1.2 MB",
        color: "#f97316",
        maxPages: 15,
      },
      {
        name: "Fire Services",
        file: "fss",
        category: "fire-safety",
        description: "Fire safety audits, risk assessments, and certification services",
        size: "3.1 MB",
        color: "#f97316",
        maxPages: 14,
      },
      {
        name: "Electrical Services",
        file: "electrical",
        category: "electrical",
        description: "Professional electrical audit and certification services",
        size: "2.2 MB",
        color: "#f97316",
        maxPages: 15,
      },
      {
        name: "AMC Services",
        file: "amc",
        category: "amc",
        description: "Comprehensive annual maintenance contracts for compliance",
        size: "1.5 MB",
        color: "#f97316",
        maxPages: 8,
      },
    ],
    []
  );

  // Categories
  const categories = useMemo(
    () => [
      { id: "all", label: "All" },
      { id: "profile", label: "Profile" },
      { id: "liaisoning", label: "Liaisoning" },
      { id: "licensing", label: "Licensing" },
      { id: "png", label: "PNG" },
      { id: "fire-safety", label: "Fire Safety" },
      { id: "electrical", label: "Electrical" },
      { id: "amc", label: "AMC" },
    ],
    []
  );

  // Filter
  const filteredDownloads = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return downloads.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);
      const matchesCategory = activeFilter === "all" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [downloads, searchTerm, activeFilter]);

  const currentDoc = filteredDownloads[currentIndex] || null;

  // Client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset document index when search/filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter, searchTerm]);

  // Load flipbook images
  const loadFlipbook = useCallback(async (documentData) => {
    if (!documentData) return;

    setIsLoading(true);
    setError("");
    setPageImages([]);
    setFlipbookReady(false);
    setTotalPages(0);
    setLoadingProgress(0);

    try {
      const images = [];
      const basePath = `/flipbook/${documentData.file}`;
      const maxPages = documentData.maxPages || 30;
      let foundPages = 0;
      let consecutiveFailures = 0;
      const MAX_CONSECUTIVE_FAILURES = 3;

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const imgPath = `${basePath}/${pageNum}.jpg`;
        
        const exists = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          const timeoutId = setTimeout(() => {
            resolve(false);
          }, 3000);

          img.onload = () => {
            clearTimeout(timeoutId);
            resolve(true);
          };
          img.onerror = () => {
            clearTimeout(timeoutId);
            resolve(false);
          };
          img.src = imgPath;
        });

        if (exists) {
          images.push(imgPath);
          foundPages++;
          consecutiveFailures = 0;
          setLoadingProgress(Math.round((pageNum / maxPages) * 100));
        } else {
          consecutiveFailures++;
          if (foundPages > 0 && consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            console.log(`Stopped at page ${pageNum} after ${consecutiveFailures} consecutive failures`);
            break;
          }
          if (foundPages === 0 && pageNum >= 10) {
            console.log(`No pages found for ${documentData.file} after checking 10 pages`);
            break;
          }
        }
      }

      if (foundPages === 0) {
        throw new Error(`No pages found for "${documentData.name}"`);
      }

      // Ensure even number of pages
      const blankImage = '/placeholder-page.jpg';
      if (foundPages % 2 !== 0) {
        console.log(`Adding blank page to make even number (${foundPages} -> ${foundPages + 1})`);
        images.push(blankImage);
        foundPages++;
      }

      setTotalPages(foundPages);
      setPageImages(images);
      setFlipbookReady(true);
      setIsLoading(false);
      setCurrentPage(1);

      console.log(`✅ Loaded ${foundPages} pages for ${documentData.file}`);

    } catch (err) {
      console.error("Flipbook loading failed:", err);
      setError(`Unable to load "${documentData.name}". Please try again.`);
      setIsLoading(false);
      setFlipbookReady(false);
    }
  }, []);

  // Load current document
  useEffect(() => {
    if (!isClient || !currentDoc) return;
    loadFlipbook(currentDoc);
  }, [isClient, currentDoc, loadFlipbook]);

  // Change document
  const changeDocument = useCallback((index) => {
    if (index < 0 || index >= filteredDownloads.length) return;
    setFlipbookReady(false);
    setPageImages([]);
    setTotalPages(0);
    setCurrentPage(1);
    setLoadingProgress(0);
    setError("");
    setIsLoading(true);
    setCurrentIndex(index);
  }, [filteredDownloads.length]);

  // Navigation
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) changeDocument(currentIndex - 1);
  }, [currentIndex, changeDocument]);

  const goToNext = useCallback(() => {
    if (currentIndex < filteredDownloads.length - 1) {
      changeDocument(currentIndex + 1);
    }
  }, [currentIndex, filteredDownloads.length, changeDocument]);

  // FlipBook page change
  const onPageChange = useCallback((event) => {
    if (event && typeof event.data === "number") {
      setCurrentPage(event.data + 1);
    }
  }, []);

  const nextPage = useCallback(() => {
    if (!flipBookRef.current) return;
    try {
      flipBookRef.current.pageFlip().flipNext();
    } catch (error) {
      console.error("Next page error:", error);
    }
  }, []);

  const prevPage = useCallback(() => {
    if (!flipBookRef.current) return;
    try {
      flipBookRef.current.pageFlip().flipPrev();
    } catch (error) {
      console.error("Previous page error:", error);
    }
  }, []);

  const retryPDF = useCallback(() => {
    if (currentDoc) loadFlipbook(currentDoc);
  }, [currentDoc, loadFlipbook]);

  // Toggle fullscreen
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

  // Handle "All" click - only auto-open fullscreen once
  const handleAllClick = useCallback(() => {
    setActiveFilter("all");
    setAutoFullscreenTriggered(false); // Reset flag so it can auto-open again
    const firstDoc = filteredDownloads[0];
    if (firstDoc) {
      setCurrentIndex(0);
    }
  }, [filteredDownloads]);

  // ✅ FIX: Only auto-open fullscreen when "All" is clicked and NOT already triggered
  useEffect(() => {
    if (activeFilter === "all" && flipbookReady && !isFullscreen && !autoFullscreenTriggered) {
      setAutoFullscreenTriggered(true);
      setTimeout(() => {
        toggleFullscreen();
      }, 500);
    }
  }, [activeFilter, flipbookReady, isFullscreen, autoFullscreenTriggered, toggleFullscreen]);

  // ✅ Reset auto-fullscreen flag when leaving "All" filter
  useEffect(() => {
    if (activeFilter !== "all") {
      setAutoFullscreenTriggered(false);
    }
  }, [activeFilter]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Loading state
  if (!isClient) {
    return (
      <div className="pdf-loading" style={{ minHeight: "200px" }}>
        <div className="loading-spinner" />
        <p>Loading viewer...</p>
      </div>
    );
  }

  return (
    <>
      {/* HERO SECTION */}
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
                <span>Resources</span>
              </div>

              <h1 className="hero-title">
                Company Profile{" "}
                <span className="hero-highlight">Download</span>
              </h1>

              <p className="hero-description">
                Browse through our comprehensive collection
                of service guides and compliance documents.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-shape">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section className="downloads-section">
        <div className="container">
          {/* Filter */}
          <div className="downloads-toolbar">
            <div className="filter-wrapper">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`filter-btn ${activeFilter === category.id ? "active" : ""}`}
                  onClick={() => {
                    if (category.id === "all") {
                      handleAllClick();
                    } else {
                      setActiveFilter(category.id);
                      setAutoFullscreenTriggered(false);
                    }
                  }}
                >
                  <span className="filter-label">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <div className="results-count">
            <span>{filteredDownloads.length}</span> documents available
          </div>

          {/* Document Viewer */}
          {filteredDownloads.length > 0 && currentDoc && (
            <div className="pdf-flipbook-wrapper">
              <div className="pdf-flipbook-card" ref={viewerRef}>
                {/* Header */}
                <div className="pdf-card-header">
                  <div className="pdf-info">
                    <div className="pdf-details">
                      <h3 className="pdf-title">{currentDoc.name}</h3>
                      <p className="pdf-description">{currentDoc.description}</p>
                      <div className="pdf-meta">
                        <span className="meta-item">
                          <File size={14} />
                          {currentDoc.size}
                        </span>
                        <span
                          className="meta-item category-tag"
                          style={{
                            background: `${currentDoc.color}15`,
                            color: currentDoc.color,
                          }}
                        >
                          <Tag size={14} />
                          {currentDoc.category.charAt(0).toUpperCase() +
                            currentDoc.category.slice(1).replace("-", " ")}
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
                      <Download size={18} />
                      Download PDF
                    </a>
                  </div>
                </div>

                {/* Flipbook Viewer */}
                <div className="pdf-viewer-container">
                  {error ? (
                    <div className="pdf-error">
                      <FileText size={60} />
                      <h3>Unable to load document</h3>
                      <p>{error}</p>
                      <button type="button" className="btn-retry" onClick={retryPDF}>
                        Try Again
                      </button>
                    </div>
                  ) : flipbookReady && pageImages.length > 0 ? (
                    <div className="flipbook-wrapper">
                      <HTMLFlipBook
                        key={currentDoc.file}
                        ref={flipBookRef}
                        width={550}
                        height={350}
                        size="stretch"
                        minWidth={280}
                        maxWidth={1200}
                        minHeight={175}
                        maxHeight={450}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        useMouseEvents={true}
                        drawShadow={true}
                        flippingTime={700}
                        startPage={0}
                        onFlip={onPageChange}
                        className="flipbook-container"
                      >
                        {pageImages.map((image, index) => (
                          <div
                            key={`${currentDoc.file}-page-${index}`}
                            className="flipbook-page"
                          >
                            <img
                              src={image}
                              alt={`Page ${index + 1}`}
                              className="flipbook-image"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </HTMLFlipBook>

                      {/* Page Controls */}
                      <button
                        type="button"
                        className={`page-btn page-btn-left ${currentPage <= 1 ? "disabled" : ""}`}
                        disabled={currentPage <= 1}
                        onClick={prevPage}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button
                        type="button"
                        className={`page-btn page-btn-right ${currentPage >= totalPages ? "disabled" : ""}`}
                        disabled={currentPage >= totalPages}
                        onClick={nextPage}
                        aria-label="Next page"
                      >
                        <ChevronRight size={24} />
                      </button>

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
                          <span className="current-page-num">{currentPage}</span>
                          <span className="total-page-num"> / {totalPages}</span>
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
                    <div className="pdf-loading">
                      <div className="loading-spinner" />
                      <p>Loading document...</p>
                      <div className="loading-progress">
                        <div
                          className="loading-progress-bar"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                      <span className="loading-percentage">{loadingProgress}%</span>
                    </div>
                  )}
                </div>

                {/* Document Navigation Dots */}
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
                      {filteredDownloads.map((document, index) => (
                        <button
                          type="button"
                          key={document.file}
                          className={`doc-dot ${currentIndex === index ? "active" : ""}`}
                          onClick={() => changeDocument(index)}
                          aria-label={`Open ${document.name}`}
                          title={document.name}
                        />
                      ))}
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

          {/* Empty state */}
          {filteredDownloads.length === 0 && (
            <div className="empty-state">
              <FileText size={72} />
              <h3>No documents found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CSS - Keep all existing styles */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        /* HERO */
        .downloads-hero {
          position: relative;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0d1b2a 100%);
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
          background: rgba(239, 127, 26, 0.06);
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
          transform: translate(-50%, -50%);
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
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(239, 127, 26, 0.15);
          color: #ef7f1a;
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          border: 1px solid rgba(239, 127, 26, 0.2);
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
          color: rgba(255, 255, 255, 0.7);
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

        .downloads-section {
          padding: 30px 0 60px;
          background: #f8f7f6;
        }

        /* TOOLBAR */
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

        .filter-label {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.2;
        }

        .results-count {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
          text-align: center;
        }
        .results-count span {
          color: #1a202c;
          font-weight: 700;
        }

        /* CARD */
        .pdf-flipbook-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        .pdf-flipbook-card:hover {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
        }

        .pdf-card-header {
          padding: 20px 28px;
          border-bottom: 1px solid #f3f4f6;
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
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 127, 26, 0.3);
        }

        /* VIEWER */
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

        /* PAGE CONTROLS */
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
        .page-btn-left { left: 20px; }
        .page-btn-right { right: 20px; }

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

        /* DOCUMENT NAVIGATION */
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
          box-shadow: 0 0 16px rgba(239, 127, 26, 0.3);
        }
        .doc-dot.active::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 8px;
          border: 2px solid rgba(239, 127, 26, 0.2);
        }

        /* LOADING */
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
          border: 3px solid #e5e7eb;
          border-top-color: #ef7f1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
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
          transition: width 0.3s ease;
        }
        .loading-percentage {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ef7f1a;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ERROR */
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

        /* EMPTY */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #ffffff;
          border-radius: 16px;
          border: 2px dashed #e5e7eb;
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

        /* FULLSCREEN */
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

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .hero-title { font-size: 2.8rem; }
          .pdf-title { font-size: 1.2rem; }
          .filter-btn { padding: 10px 14px; min-height: 60px; }
          .filter-label { font-size: 0.65rem; }
        }

        @media (max-width: 768px) {
          .downloads-hero { padding: 100px 0 50px; }
          .hero-title { font-size: 2.2rem; }
          .hero-description { font-size: 0.95rem; padding: 0 15px; }
          .downloads-section { padding: 20px 0 40px; }
          .filter-wrapper { gap: 4px; padding: 2px 4px; }
          .filter-btn { padding: 8px 10px; min-height: 50px; gap: 4px; }
          .filter-label { font-size: 0.6rem; }
          .pdf-card-header { flex-direction: column; align-items: stretch; padding: 16px 20px; }
          .pdf-info { align-items: flex-start; }
          .pdf-actions { width: 100%; justify-content: flex-end; }
          .btn-download-pdf { flex: 1; justify-content: center; }
          .pdf-viewer-container { min-height: 180px; }
          .page-btn { width: 38px; height: 38px; }
          .page-btn-left { left: 10px; }
          .page-btn-right { right: 10px; }
          .page-btn svg { width: 18px; height: 18px; }
          .pdf-controls { bottom: 14px; padding: 4px 12px; }
          .page-info { min-width: 60px; font-size: 0.8rem; }
          .doc-navigation { padding: 12px 16px; flex-direction: column; gap: 10px; }
          .doc-dots { gap: 6px; }
          .doc-nav-btn { padding: 6px 14px; font-size: 0.8rem; }
          .flipbook-wrapper { padding: 12px 0; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 1.8rem; }
          .hero-badge { font-size: 0.8rem; padding: 6px 16px; }
          .filter-wrapper { gap: 2px; }
          .filter-btn { padding: 6px 8px; min-height: 42px; gap: 3px; }
          .filter-label { font-size: 0.5rem; }
          .pdf-info { flex-direction: column; align-items: flex-start; gap: 10px; }
          .pdf-title { font-size: 1rem; }
          .pdf-description { font-size: 0.8rem; }
          .pdf-viewer-container { min-height: 150px; }
          .pdf-loading { min-height: 150px; }
          .page-btn { width: 32px; height: 32px; }
          .page-btn-left { left: 6px; }
          .page-btn-right { right: 6px; }
          .page-btn svg { width: 16px; height: 16px; }
          .pdf-controls { bottom: 8px; padding: 3px 10px; gap: 6px; }
          .page-info { min-width: 50px; font-size: 0.7rem; }
          .page-nav-btn { width: 26px; height: 26px; }
          .page-nav-btn svg { width: 14px; height: 14px; }
          .loading-progress { width: 160px; }
          .doc-dot { width: 10px; height: 10px; }
          .doc-dot.active { width: 24px; }
          .btn-download-pdf { padding: 8px 16px; font-size: 0.8rem; }
          .btn-fullscreen { width: 38px; height: 38px; }
        }

        @media (max-width: 360px) {
          .filter-wrapper { gap: 2px; }
          .filter-btn { padding: 4px 6px; min-height: 36px; }
          .filter-label { font-size: 0.45rem; }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </>
  );
}