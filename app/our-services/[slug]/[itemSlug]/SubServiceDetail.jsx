// app/our-services/[slug]/[itemSlug]/SubServiceDetail.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import "./item-detail.scss";
import ApiError from "@/components/ApiError/ApiError";

/* ============================================================
   SPOTLIGHT CARD — Aceternity-style mouse-following gradient
   ============================================================ */
function SpotlightCard({ children, className = "", delay = 0, index = 0 }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="spotlight-glow"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(249, 115, 22, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="spotlight-border"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(249, 115, 22, 0.6),
              transparent 80%
            )
          `,
        }}
      />
      <div className="spotlight-content">{children}</div>
    </motion.div>
  );
}

/* ============================================================
   3D TILT CARD — Premium hover effect
   ============================================================ */
function TiltCard({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   ANIMATED COUNTER — Number that counts up on view
   ============================================================ */
function AnimatedCounter({ end, duration = 1.5, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            start = Math.floor(eased * end);
            setCount(start);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ============================================================
   SCROLL PROGRESS INDICATOR
   ============================================================ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div className="scroll-progress" style={{ scaleX }} />
  );
}

/* ============================================================
   SECTION NAV WITH ACTIVE TRACKING
   ============================================================ */
function SectionNav({ sections, activeId, onSelect }) {
  return (
    <nav className="section-nav" aria-label="On this page">
      <div className="section-nav-title">On this page</div>
      <ul className="section-nav-list">
        {sections.map((section, i) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={isActive ? "active" : ""}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(section.id);
                }}
              >
                <span className="nav-number">{String(i + 1).padStart(2, "0")}</span>
                <span className="nav-label">{section.title}</span>
                {isActive && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ============================================================
   CMS PARSING (kept from your original)
   ============================================================ */
function decodeContentEntities(value) {
  const named = { "&nbsp;": "  ", "&amp;": " & ", "&lt;": " < ", "&gt;": " > ", "&quot;": ' "', "&#39;": "' ", "&apos;": "' " };
  return String(value).replace(/&(?:nbsp|amp|lt|gt|quot|#39|apos);|&#(\d+);|&#x([\da-f]+);/gi,
    (entity, decimal, hex) => {
      if (decimal) return String.fromCodePoint(Number(decimal));
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      return named[entity.toLowerCase()] ?? entity;
    });
}
function stripContentMarkup(value) {
  return decodeContentEntities(String(value).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}
function parseContentBlocks(rawContent) {
  if (rawContent == null || rawContent === "") return [];
  let source = String(rawContent)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  source = source.replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, heading) => `\n@@HEADING@@${stripContentMarkup(heading)}@@END_HEADING@@\n`);
  source = source.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, type, inner) => {
    const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => stripContentMarkup(m[1])).filter(Boolean);
    if (!items.length) return `\n${inner}\n`;
    const ordered = type.toLowerCase() === "ol";
    return `\n${items.map((item, index) => `${ordered ? `${index + 1}.` : "•"} ${item}`).join("\n")}\n`;
  });
  source = source
    .replace(/<li\b[^>]*>/gi, "\n• ").replace(/<\/li>/gi, "\n ").replace(/<br\s*\/?>/gi, "\n ")
    .replace(/<\/(?:p|div|section|article|blockquote|tr)>/gi, "\n\n ").replace(/<(?:p|div|section|article|blockquote|tr)\b[^>]*>/gi, "\n ")
    .replace(/<t[dh]\b[^>]*>/gi, "  ").replace(/<\/t[dh]>/gi, "  |   ")
    .replace(/<(?:strong|b)\b[^>]*>/gi, "**").replace(/<\/(?:strong|b)>/gi, "**").replace(/<[^>]*>/g, " ");
  source = decodeContentEntities(source).replace(/\r\n?/g, "\n");
  const blocks = []; let paragraphLines = []; let listItems = []; let listType = "unordered";
  const flushParagraph = () => { const text = paragraphLines.join(" ").replace(/\s+/g, " ").trim(); if (text) blocks.push({ type: "paragraph", text }); paragraphLines = []; };
  const flushList = () => { if (listItems.length) { blocks.push({ type: listType, items: listItems }); listItems = []; } };
  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (line.startsWith("@@HEADING@@") && line.endsWith("@@END_HEADING@@")) {
      flushParagraph(); flushList();
      const heading = line.slice("@@HEADING@@".length, -"@@END_HEADING@@".length).trim();
      if (heading) blocks.push({ type: "heading", text: heading });
      continue;
    }
    const ordered = line.match(/^(\d{1,3})[.)]\s+(.+)$/);
    const unordered = line.match(/^(?:[•●▪◦*–—-]|✓|✔|→)\s+(.+)$/);
    if (ordered || unordered) {
      flushParagraph();
      const nextType = ordered ? "ordered" : "unordered";
      if (listItems.length && listType !== nextType) flushList();
      listType = nextType; listItems.push((ordered ? ordered[2] : unordered[1]).trim());
      continue;
    }
    flushList(); paragraphLines.push(line);
  }
  flushParagraph(); flushList();
  return blocks;
}
function renderInlineContent(text) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
}
function RichContent({ content }) {
  const blocks = parseContentBlocks(content);
  if (!blocks.length) return null;

  // Use the first CMS paragraph as the lead only when it is first in the source.
  // All text, headings and list items remain unchanged; only their presentation changes.
  const hasLead = blocks[0]?.type === "paragraph";
  const lead = hasLead ? blocks[0] : null;
  const detailBlocks = hasLead ? blocks.slice(1) : blocks;

  return (
    <div className={`rich-content${lead ? " has-lead" : ""}`}>
      {lead && (
        <p className="rich-intro">
          {renderInlineContent(lead.text)}
        </p>
      )}

      {detailBlocks.length > 0 && (
        <div className={`rich-content-grid${detailBlocks.length === 1 ? " is-single" : ""}`}>
          {detailBlocks.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h3 className="rich-heading" key={`h-${index}`}>
                  {renderInlineContent(block.text)}
                </h3>
              );
            }

            if (block.type === "ordered" || block.type === "unordered") {
              const ListTag = block.type === "ordered" ? "ol" : "ul";
              return (
                <ListTag
                  className={`rich-list rich-list--${block.type}`}
                  key={`l-${index}`}
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={`${index}-${itemIndex}`}>
                      {renderInlineContent(item)}
                    </li>
                  ))}
                </ListTag>
              );
            }

            const isWide = block.text.length > 260;
            return (
              <p
                className={`rich-detail-paragraph${isWide ? " is-wide" : ""}`}
                key={`p-${index}`}
              >
                {renderInlineContent(block.text)}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function SubServiceDetail({ initialData }) {
  const params = useParams();
  const slug = params?.slug;
  const itemSlug = params?.itemSlug;
  const [item, setItem] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState("overview");
  const [isMobileDeck, setIsMobileDeck] = useState(false);

  // Enable swipe navigation only on tablet/mobile widths.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const syncViewport = () => setIsMobileDeck(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener?.("change", syncViewport);
    return () => mediaQuery.removeEventListener?.("change", syncViewport);
  }, []);

  // Keep the first available section at the front whenever a different item loads.
  useEffect(() => {
    if (!item) return;
    const firstSectionId = item.fullDescription
      ? "overview"
      : item.contentSections.length > 0
        ? "item-section-1"
        : "overview";
    setActiveSectionId(firstSectionId);
  }, [item]);

  useEffect(() => {
    if (!slug || !itemSlug) return;
    const fetchItemDetail = async () => {
      try {
        setLoading(true); setError(null);
        let itemData = initialData;
        if (!itemData) {
          const itemResponse = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/${itemSlug}`);
          if (!itemResponse.ok) {
            if (itemResponse.status === 404) throw Object.assign(new Error("Item not found"), { status: 404 });
            throw new Error(`Failed: ${itemResponse.status}`);
          }
          itemData = await itemResponse.json();
        }
        if (!itemData || !itemData.id) throw new Error("Invalid response format from API");

        let servicesList = [];
        if (itemData.itemServices) {
          if (Array.isArray(itemData.itemServices)) servicesList = itemData.itemServices;
          else if (typeof itemData.itemServices === "string") {
            try { const parsed = JSON.parse(itemData.itemServices); servicesList = Array.isArray(parsed) ? parsed : [itemData.itemServices]; }
            catch { servicesList = itemData.itemServices.split(",").map((s) => s.trim()).filter(Boolean); }
          }
        }
        const rawSections = itemData.contentSection ?? itemData.contentSections ?? itemData.content_section ?? null;
        let sections = [];
        if (Array.isArray(rawSections)) sections = rawSections;
        else if (typeof rawSections === "string") {
          try { const parsed = JSON.parse(rawSections); sections = Array.isArray(parsed) ? parsed : []; } catch { sections = []; }
        }
        sections = sections.filter(Boolean).map((s) => ({ title: s?.title || s?.heading || "", content: s?.content || s?.body || s?.description || "" })).filter((s) => s.title || s.content);

        setItem({
          id: itemData.id, name: itemData.name, slug: itemData.slug, description: itemData.description || "",
          fullDescription: itemData.full_description || itemData.description || "", servicesList, contentSections: sections,
          subCategoryId: itemData.subCategoryId, subCategoryName: itemData.subCategoryName,
        });
        try {
          const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/category/${slug}`);
          if (categoryResponse.ok) { const categoryData = await categoryResponse.json(); setParentCategory({ id: categoryData.id, name: categoryData.name, slug: categoryData.slug }); }
        } catch (relatedErr) { console.error("Error fetching related items:", relatedErr); }
      } catch (err) { console.error("Error fetching item detail:", err); setError(err); } finally { setLoading(false); }
    };
    fetchItemDetail();
  }, [slug, itemSlug, initialData]);

  if (loading) {
    return (
      <div className="item-loading">
        <div className="container">
          <div className="skeleton-hero" />
          <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    const isNotFound = error.status === 404;
    return (
      <ApiError
        title={isNotFound ? "Service Not Found" : "Service Temporarily Unavailable"}
        message={isNotFound ? "The service you're looking for doesn't exist or has been removed." : "Our service information is temporarily unavailable. Please try again shortly."}
        onRetry={() => window.location.reload()}
        statusCode={isNotFound ? "ERR · NOT FOUND" : error.status ? `ERR · ${error.status}` : "ERR · TIMEOUT"}
        statusTone={isNotFound ? "info" : error.status >= 500 ? "danger" : "warning"}
        backToHome={() => window.open("/", "_self")}
      />
    );
  }
  if (!item) return null;

  const pageSections = [
    ...(item.fullDescription ? [{ id: "overview", title: "Overview" }] : []),
    ...item.contentSections.map((section, index) => ({ id: `item-section-${index + 1}`, title: section.title })).filter((section) => section.title),
  ];
  if (!pageSections.length) pageSections.push({ id: "overview", title: "Overview" });

  const allSections = [
    ...(item.fullDescription ? [{ id: "overview", title: "Overview", content: item.fullDescription, overview: true }] : []),
    ...item.contentSections.map((section, i) => ({ id: `item-section-${i + 1}`, title: section.title, content: section.content })),
  ];
  if (!allSections.length) allSections.push({ id: "overview", title: "Overview", overview: true, fallback: true });

  return (
    <div className="item-page">
      <ScrollProgress />

      {/* Breadcrumb */}
      <div className="item-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/our-services">Services</Link>
            <span className="sep">/</span>
            {parentCategory && (<><Link href={`/our-services/${parentCategory.slug}`}>{parentCategory.name}</Link><span className="sep">/</span></>)}
            {item.subCategoryName && (<><span className="crumb-muted">{item.subCategoryName}</span><span className="sep">/</span></>)}
            <span className="crumb-current">{item.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero — UNTOUCHED */}
      <div className="item-hero">
        <span className="item-hero-orb item-hero-orb--a" aria-hidden="true" />
        <span className="item-hero-orb item-hero-orb--b" aria-hidden="true" />
        <div className="container">
          <div className="item-hero-main">
            {item.subCategoryName && (<span className="item-hero-tag">{item.subCategoryName}</span>)}
            <h1 className="item-hero-title">{item.name}</h1>
            {item.description && (<p className="item-hero-desc">{item.description}</p>)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="item-body" id="details">
        <div className="container">

          {/* Stats Row */}
          {/* <div className="stats-row">
            <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }}>
              <div className="stat-icon">📋</div>
              <div className="stat-value"><AnimatedCounter end={allSections.length} /></div>
              <div className="stat-label">Content Sections</div>
            </motion.div>
            <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
              <div className="stat-icon">✨</div>
              <div className="stat-value"><AnimatedCounter end={item.servicesList.length} /></div>
              <div className="stat-label">Services Included</div>
            </motion.div>
            <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}>
              <div className="stat-icon">⚡</div>
              <div className="stat-value">Pro</div>
              <div className="stat-label">Quality Level</div>
            </motion.div>
          </div> */}

          <div className="item-content-layout">
            {/* Sidebar */}
            <aside className="item-aside">
              <div className="item-aside-sticky">
                {item.servicesList.length > 0 && (
                  <SpotlightCard className="services-card">
                    <div className="card-kicker">
                      <span className="kicker-dot" />
                      <span>Inclusions</span>
                    </div>
                    <h2 className="card-title">What&apos;s included</h2>
                    <ul className="services-list">
                      {item.servicesList.map((service, i) => (
                        <motion.li
                          key={i}
                          className="service-item"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                        >
                          <span className="service-check">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          </span>
                          <span>{service}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </SpotlightCard>
                )}

                <SectionNav sections={pageSections} activeId={activeSectionId} onSelect={setActiveSectionId} />
              </div>
            </aside>

            {/* Main Content — every section shares one stacked deck footprint. */}
            <main className="item-main">
              <div className="mobile-card-controls">
                <button
                  type="button"
                  className="card-arrow card-arrow--left"
                  aria-label="Previous card"
                  onClick={() => {
                    const currentIndex = allSections.findIndex(
                      (section) => section.id === activeSectionId
                    );

                    const previousIndex =
                      (currentIndex - 1 + allSections.length) % allSections.length;

                    setActiveSectionId(allSections[previousIndex].id);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="card-arrow card-arrow--right"
                  aria-label="Next card"
                  onClick={() => {
                    const currentIndex = allSections.findIndex(
                      (section) => section.id === activeSectionId
                    );

                    const nextIndex = (currentIndex + 1) % allSections.length;

                    setActiveSectionId(allSections[nextIndex].id);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <motion.div
                className="stack-deck"
                layout
                transition={{ layout: { type: "spring", stiffness: 180, damping: 26 } }}
              >
                {allSections.map((section, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const activeIndex = Math.max(0, allSections.findIndex((entry) => entry.id === activeSectionId));
                  const depth = (i - activeIndex + allSections.length) % allSections.length;
                  const isActive = depth === 0;
                  const visibleDepth = Math.min(depth, 3);

                  // Render inactive sections as slim deck edges only. Their full
                  // blank card surfaces are intentionally not mounted/visible.
                  if (!isActive) {
                    if (depth > 3) return null;
                    return (
                      <motion.div
                        key={`backplate-${section.id}`}
                        className={`stack-card-backplate stack-card-backplate--${visibleDepth}`}
                        aria-hidden="true"
                        animate={{ y: visibleDepth * 7, x: visibleDepth * 3, scale: 1 - visibleDepth * 0.006 }}
                        transition={{ type: "spring", stiffness: 190, damping: 25, mass: 0.9 }}
                        style={{ zIndex: allSections.length - depth }}
                      />
                    );
                  }

                  return (
                    <motion.section
                      key={section.id}
                      id={section.id}
                      className="content-card is-active"
                      initial={false}
                      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 190, damping: 25, mass: 0.9 }}
                      style={{ zIndex: allSections.length + 2 }}
                      aria-hidden={false}
                      drag={isMobileDeck && allSections.length > 1 ? "x" : false}
                      dragDirectionLock
                      dragConstraints={{ left: -120, right: 120 }}
                      dragElastic={0.16}
                      dragMomentum={false}
                      whileDrag={{ scale: 0.985, rotate: -0.4 }}
                      onDragEnd={(_, info) => {
                        if (!isMobileDeck || allSections.length < 2) return;
                        const threshold = Math.max(55, window.innerWidth * 0.14);
                        const swipedNext = info.offset.x < -threshold || info.velocity.x < -500;
                        const swipedPrevious = info.offset.x > threshold || info.velocity.x > 500;
                        if (swipedNext) {
                          setActiveSectionId(allSections[(i + 1) % allSections.length].id);
                        } else if (swipedPrevious) {
                          setActiveSectionId(allSections[(i - 1 + allSections.length) % allSections.length].id);
                        }
                      }}
                    >
                      <div className="card-inner">
                        <div className="card-header">
                          <div className="card-number">{num}</div>
                          <div className="card-header-content">
                            {/* <div className="card-tag">{section.overview ? "Overview" : "Detail"}</div> */}
                            <h2 className="card-title-main">{section.title}</h2>
                          </div>
                        </div>
                        <div className="card-body">
                          {section.fallback ? (
                            <p className="card-text">No additional details available for this service.</p>
                          ) : (
                            <RichContent content={section.content} />
                          )}
                        </div>
                      </div>
                    </motion.section>
                  );
                })}
              </motion.div>
            </main>
          </div>

          {/* CTA */}
          <motion.section
            className="item-bottom-cta"
            aria-labelledby="item-bottom-cta-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cta-glow" />
            <div className="item-bottom-cta-content">
              <span className="item-bottom-cta-eyebrow">Need assistance?</span>
              <h2 id="item-bottom-cta-title">Need help with {item.name}?</h2>
              <p>Connect with our team to discuss your requirements and the next steps.</p>
            </div>
            <Link href="/contact-us-liaison-bank" className="item-bottom-cta-button">
              <span>Get in touch</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h11M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.section>
        </div>
      </div>
    </div>
  );
}