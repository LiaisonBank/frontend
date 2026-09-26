"use client";

import { useCallback, useEffect, useRef, useState  } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "react-bootstrap-icons";

import logo from "@/assets/images/company/logo.png";
import name from "@/assets/images/company/name.png";
import whitename from "@/assets/images/company/whitename.png";
import tagline from "@/assets/images/company/tagline.png";

import { navLinks } from "@/lib/data/menus";

import pdfIcon from "@/public/pdf_icon.png";

import NewLauncb from "@/components/NewLaunch";

import { useModal } from "@/context/ModalContext";

/* ============================================================================
   MOBILE MENU ITEM
   ============================================================================ */
function MobileMenuItems({ items, onNavigate }) {
  // Stack of { label, items, services? } — each level is a "panel"
  const [stack, setStack] = useState([{ label: "Our Services", items: items || [] }]);
  const [direction, setDirection] = useState("forward");

  const current = stack[stack.length - 1];
  const isRoot = stack.length === 1;

  const goForward = (node) => {
    setDirection("forward");
    setStack((prev) => [...prev, node]);
  };

  const goBack = () => {
    if (isRoot) return;
    setDirection("back");
    setStack((prev) => prev.slice(0, -1));
  };

  const jumpTo = (index) => {
    if (index === stack.length - 1) return;
    setDirection("back");
    setStack((prev) => prev.slice(0, index + 1));
  };

  return (
    <div className="mobile-menu w-full overflow-hidden">
      {/* Top breadcrumb bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
        {!isRoot && (
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 active:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <nav className="flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap">
          {stack.map((level, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-400">/</span>}
              <button
                type="button"
                onClick={() => jumpTo(i)}
                className={`px-1 ${
                  i === stack.length - 1
                    ? "font-semibold text-gray-900"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {level.label}
              </button>
            </span>
          ))}
        </nav>
      </div>

      {/* Sliding panel */}
      <div className="relative">
        <Panel
          key={stack.length}
          direction={direction}
          node={current}
          onForward={goForward}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

/**
 * Resolves the next-level children for a given node based on your API shape:
 *   Category        → subCategories
 *   subCategory     → items
 *   item            → services (leaf)
 */
function getChildren(node) {
  if (!node) return null;

  // Category has subCategories
  if (Array.isArray(node.subCategories) && node.subCategories.length > 0) {
    return {
      kind: "subCategories",
      items: node.subCategories,
    };
  }

  // subCategory has items
  if (Array.isArray(node.items) && node.items.length > 0) {
    return {
      kind: "items",
      items: node.items,
    };
  }

  // Leaf item may have a `service` array (plain strings)
  if (Array.isArray(node.service) && node.service.length > 0) {
    return {
      kind: "services",
      items: node.service.map((s) => ({ name: s })),
    };
  }

  return null;
}

/* ----------------------------------------------------------------------------
   FEATURED PROJECTS PANEL
   Rendered when a node has is_featured === true.
   Groups children by status: Completed / In Progress / Upcoming
   ---------------------------------------------------------------------------- */
const FEATURED_GROUPS = [
  { key: "completed", label: "Completed", statuses: ["completed", "complete", "done"] },
  { key: "inprogress", label: "In Progress", statuses: ["inprogress", "in_progress", "in-progress", "ongoing", "running"] },
  { key: "upcoming", label: "Upcoming", statuses: ["upcoming", "pending", "future"] },
];

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function FeaturedProjectsPanel({ node, animClass, onNavigate }) {
  const projects = Array.isArray(node?.items) ? node.items : [];

  // Bucket projects by status
  const buckets = FEATURED_GROUPS.map((group) => ({
    ...group,
    projects: projects.filter((p) => {
      const s = normalizeStatus(p?.status || p?.project_status || p?.state);
      return group.statuses.map(normalizeStatus).includes(s);
    }),
  }));

  const grouped = new Set(buckets.flatMap((b) => b.projects.map((p) => p?.id ?? p?.name)));
  const ungrouped = projects.filter(
    (p) => !grouped.has(p?.id ?? p?.name)
  );

  return (
    <div className={`w-full ${animClass}`}>
      {buckets.map((group) => (
        <section key={group.key} className="mb-2">
          {/* Group header */}
          <div
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              group.key === "completed"
                ? "bg-green-50 text-green-700"
                : group.key === "inprogress"
                ? "bg-amber-50 text-amber-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                group.key === "completed"
                  ? "bg-green-500"
                  : group.key === "inprogress"
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
            />
            {group.label}
            <span className="ml-auto text-[10px] font-normal opacity-70">
              {group.projects.length}
            </span>
          </div>

          {group.projects.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 italic">
              No {group.label.toLowerCase()} projects
            </div>
          ) : (
            <ul>
              {group.projects.map((project, idx) => (
                <li key={`${group.key}-${project.id ?? project.name}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(project)}
                    className="flex items-start justify-between w-full px-4 py-3 text-left border-b hover:bg-gray-50 active:bg-gray-100"
                  >
                    <span className="flex-1">
                      <span className="block truncate">{project.name}</span>
                      {project.location && (
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {project.location}
                        </span>
                      )}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-gray-400 shrink-0 ml-2 mt-1"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Optional: any projects with unknown status */}
      {ungrouped.length > 0 && (
        <section className="mb-2">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-600">
            Other
          </div>
          <ul>
            {ungrouped.map((project, idx) => (
              <li key={`other-${project.id ?? project.name}-${idx}`}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(project)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left border-b hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="flex-1 truncate">{project.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-gray-400 shrink-0 ml-2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Panel({ node, direction, onForward, onNavigate }) {
  const animClass =
    direction === "forward"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";

  // ✅ Condition: if this node is featured, show grouped projects
  if (node?.is_featured === true) {
    return (
      <FeaturedProjectsPanel
        node={node}
        animClass={animClass}
        onNavigate={onNavigate}
      />
    );
  }

  const items = node?.items || [];

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className={`p-4 text-gray-500 text-sm ${animClass}`}>
        No items to display
      </div>
    );
  }

  return (
    <ul className={`w-full ${animClass}`}>
      {items.map((item, index) => {
        if (!item) return null;

        const childInfo = getChildren(item);
        const hasChildren = Boolean(childInfo);

        const handleClick = () => {
          if (hasChildren) {
            onForward({
              label: item.name,
              items: childInfo.items,
              kind: childInfo.kind,
              // 👇 carry the flag through so the next Panel knows
              is_featured: item.is_featured === true,
            });
            return;
          }
          onNavigate?.(item);
        };

        return (
          <li key={`${item.id ?? item.name}-${index}`}>
            <button
              type="button"
              onClick={handleClick}
              className="flex items-center justify-between w-full px-4 py-3 text-left border-b hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="flex-1 truncate">{item.name}</span>
              {hasChildren && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-gray-400 shrink-0 ml-2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}


/* ============================================================================
   HEADER
   ============================================================================ */

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { setServiceModalOpen } = useModal();

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  /* --------------------------------------------------------------------------
     Refs
     -------------------------------------------------------------------------- */

  const megaCloseTimerRef = useRef(null);

  /* --------------------------------------------------------------------------
     Mega Menu Timer Cleanup
     -------------------------------------------------------------------------- */

  const clearMegaCloseTimer = useCallback(() => {
    if (megaCloseTimerRef.current) {
      clearTimeout(megaCloseTimerRef.current);
      megaCloseTimerRef.current = null;
    }
  }, []);

  /* --------------------------------------------------------------------------
     Open Mega Menu
     -------------------------------------------------------------------------- */

  const openMegaMenu = useCallback(
    (menuName) => {
      clearMegaCloseTimer();
      setActiveMegaMenu(menuName);
      setServiceModalOpen(menuName === "Our Services");
    },
    [clearMegaCloseTimer, setServiceModalOpen],
  );

  /* --------------------------------------------------------------------------
     Close Mega Menu
     -------------------------------------------------------------------------- */

  const closeMegaMenu = useCallback(() => {
    clearMegaCloseTimer();

    megaCloseTimerRef.current = window.setTimeout(() => {
      setActiveMegaMenu(null);
      setServiceModalOpen(false);
      megaCloseTimerRef.current = null;
    }, 80);
  }, [clearMegaCloseTimer, setServiceModalOpen]);

  useEffect(() => {
    return () => {
      clearMegaCloseTimer();
    };
  }, [clearMegaCloseTimer]);

  /* --------------------------------------------------------------------------
     Close Everything
     -------------------------------------------------------------------------- */

  const closeAllMenus = useCallback(() => {
    clearMegaCloseTimer();
    setActiveMegaMenu(null);
    setServiceModalOpen(false);
  }, [clearMegaCloseTimer, setServiceModalOpen]);

  /* --------------------------------------------------------------------------
     Navigation
     -------------------------------------------------------------------------- */

  const handleNavigation = useCallback(
    (href) => {
      if (!href) return;
      closeAllMenus();
      setIsOpen(false);
      router.push(href);
    },
    [closeAllMenus, router],
  );

  /* --------------------------------------------------------------------------
     Mobile Toggle
     -------------------------------------------------------------------------- */

  const toggleMobileMenu = useCallback((key) => {
    setOpenMenus((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }, []);

  /* --------------------------------------------------------------------------
     Mobile Navigation
     -------------------------------------------------------------------------- */

  const handleMobileNavigation = useCallback(
    (item) => {
      if (!item) return;

      if (item.name === "Our Services") {
        setIsOpen(false);
        closeAllMenus();
        router.push("/our-services");
        return;
      }

      if (!item.href) return;

      setIsOpen(false);
      closeAllMenus();
      router.push(item.href);
    },
    [closeAllMenus, router],
  );

  /* --------------------------------------------------------------------------
     Mega Menu Scroll
     -------------------------------------------------------------------------- */

  const handleMegaWheel = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleMegaTouchMove = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleMegaScroll = useCallback((event) => {
    event.stopPropagation();
  }, []);

  /* --------------------------------------------------------------------------
     Render
     -------------------------------------------------------------------------- */

  return (
    <>
      {/* ======================================================================
          HEADER
          ====================================================================== */}

      <header
        className={`fixed w-full z-50 py-2 transition-all ${
          isSticky ? "is-sticky" : ""
        }`}
      >
        <div className="container-fluid mx-auto">
          <nav key={pathname} className="flex items-center justify-between h-16">
            {/* ================================================================
                LOGO STACK — logo + name → oval line → tagline
                ================================================================ */}

            <div>
              <Link
                href="/"
                onClick={() => {
                  setIsOpen(false);
                  closeAllMenus();
                }}
                className="d-inline-flex flex-column"
                style={{
                  gap: "6px",
                  textDecoration: "none",
                  color: "inherit",
                  width: "167px",
                }}
              >
                {/* ROW: LB logo + Liaison Bank name — bottom-aligned, defines width */}
                <div
                  className="d-flex align-items-end"
                  style={{ gap: "5px", width: "max-content" }}
                >
                  <Image
                    src={logo}
                    width={52}
                    height={60}
                    title="Liaisonbank"
                    alt="Liaisonbank"
                    priority
                    className="lg-1"
                    style={{
                      width: "auto",
                      height: "45px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />

                  <Image
                    src={isOpen ? whitename : name}
                    width={140}
                    height={35}
                    title="Liaisonbank"
                    alt="Liaisonbank"
                    priority
                    style={{
                      width: "auto",
                      height: "45px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                {/* OVAL LINE — full row width */}
               <svg
                  viewBox="0 0 250 12"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "6px",
                  }}
                >
                  <defs>
                    <linearGradient
                      id="ovalGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      {/* Sharp orange/yellow edges → bright center → orange edges */}
                      <stop offset="0%" stopColor="#FF8A00" />
                      <stop offset="20%" stopColor="#FFB000" />
                      <stop offset="50%" stopColor="#FFD21A" />
                      <stop offset="80%" stopColor="#FFB000" />
                      <stop offset="100%" stopColor="#FF7A00" />
                    </linearGradient>
                  </defs>

                  <path
                    d="
                      M 0 6
                      C 45 4.8, 80 3.2, 110 2.2
                      C 130 1.5, 145 1.5, 150 1.5
                      C 175 1.7, 205 3.8, 250 6
                      C 205 8.2, 175 10.3, 150 10.5
                      C 145 10.5, 130 10.5, 110 9.8
                      C 80 8.8, 45 7.2, 0 6
                      Z
                    "
                    fill="url(#ovalGrad)"
                  />
                </svg>

                {/* TAGLINE — 98% width, centered under the oval */}
                <Image
                  src={tagline}
                  width={250}
                  height={16}
                  title="haq se bhado, bhado haq se"
                  alt="haq se bhado, bhado haq se"
                  priority
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Link>
            </div>

            {/* ================================================================
                DESKTOP NAVIGATION
                ================================================================ */}

            <div className="menu xl:flex">
              <ul className="flex space-x-8">
                {Array.isArray(navLinks) &&
                  navLinks.map((link) => {
                    if (!link) return null;

                    const hasSubmenu =
                      Array.isArray(link.submenu) && link.submenu.length > 2;

                    const isActive = activeMegaMenu === link.name;

                    return (
                      <li
                        key={link.name}
                        className={hasSubmenu ? "has-submenu" : ""}
                        onMouseEnter={() => openMegaMenu(link.name)}
                        onMouseLeave={hasSubmenu ? closeMegaMenu : undefined}
                      >
                        {link.name === "Our Services" ? (
                          <button
                            type="button"
                            className="nav-link bg-transparent border-0 cursor-pointer flex items-center gap-1"
                            aria-haspopup="true"
                            aria-expanded={isActive}
                          >
                            {link.name}
                            <ChevronDown
                              size={16}
                              className="nav-arrow"
                              aria-hidden="true"
                            />
                          </button>
                        ) : link.href ? (
                          <button
                            type="button"
                            className="nav-link bg-transparent border-0 cursor-pointer"
                            onClick={() => handleNavigation(link.href)}
                          >
                            {link.name}
                          </button>
                        ) : (
                          <span className="nav-link cursor-pointer flex items-center gap-1">
                            {link.name}
                            {hasSubmenu && (
                              <ChevronDown
                                size={16}
                                className="nav-arrow"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        )}

                        {/* ======================================================
                            MEGA MENU
                            ====================================================== */}

                        {hasSubmenu && (
                          <div
                            className={`mega-menu ${isActive ? "active" : ""}`}
                            aria-hidden={!isActive}
                            onWheel={handleMegaWheel}
                            onTouchMove={handleMegaTouchMove}
                            onScroll={handleMegaScroll}
                          >
                            <div className="mega-menu-inner container">
                              {/* TOP CARDS */}
                              <div className="mega-top">
                                {link.submenu
                                  .filter((sub) => Array.isArray(sub.items))
                                  .map((sub) => {
                                    const isLargeList = sub.items.length > 4;

                                    return (
                                      <div key={sub.name} className="mega-card">
                                        <h4 className="mega-title">
                                          <button
                                            type="button"
                                            className="bg-transparent border-0 p-0 cursor-pointer"
                                            onClick={() =>
                                              handleNavigation(sub.href || "/")
                                            }
                                          >
                                            {sub.name}
                                          </button>

                                          {sub.pdf && (
                                            <a
                                              href={sub.pdf}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="pdf-download"
                                              aria-label={`Download ${sub.name} PDF`}
                                              onClick={(event) =>
                                                event.stopPropagation()
                                              }
                                            >
                                              <Image
                                                src={pdfIcon}
                                                alt=""
                                                width={16}
                                                height={16}
                                              />
                                            </a>
                                          )}
                                        </h4>

                                        <ul
                                          className={`mega-section ${
                                            isLargeList ? "has-more" : ""
                                          }`}
                                        >
                                          {sub.items.map((item, index) => (
                                            <li
                                              key={item.name || index}
                                              className={`mega-item ${
                                                item.children ? "has-child" : ""
                                              }`}
                                            >
                                              <button
                                                type="button"
                                                className="mega-link bg-transparent border-0 cursor-pointer"
                                                onClick={() =>
                                                  handleNavigation(
                                                    item.href || "/",
                                                  )
                                                }
                                              >
                                                <span>{item.name}</span>
                                              </button>

                                              {Array.isArray(item.children) &&
                                                item.children.length > 0 && (
                                                  <ul className="mega-submenu">
                                                    {item.children.map(
                                                      (child, childIndex) => (
                                                        <li
                                                          key={
                                                            child.name ||
                                                            childIndex
                                                          }
                                                          className={`mega-item ${
                                                            child.children
                                                              ? "has-child2"
                                                              : ""
                                                          }`}
                                                        >
                                                          <button
                                                            type="button"
                                                            className="bg-transparent border-0 cursor-pointer"
                                                            onClick={() =>
                                                              handleNavigation(
                                                                child.href ||
                                                                  "/",
                                                              )
                                                            }
                                                          >
                                                            {child.name}
                                                          </button>

                                                          {Array.isArray(
                                                            child.children,
                                                          ) &&
                                                            child.children
                                                              .length > 0 && (
                                                              <ul className="mega-submenu-level2">
                                                                {child.children.map(
                                                                  (
                                                                    subChild,
                                                                    subChildIndex,
                                                                  ) => (
                                                                    <li
                                                                      key={
                                                                        subChild.name ||
                                                                        subChildIndex
                                                                      }
                                                                    >
                                                                      <button
                                                                        type="button"
                                                                        className="bg-transparent border-0 cursor-pointer"
                                                                        onClick={() =>
                                                                          handleNavigation(
                                                                            subChild.href ||
                                                                              "/",
                                                                          )
                                                                        }
                                                                      >
                                                                        {
                                                                          subChild.name
                                                                        }
                                                                      </button>
                                                                    </li>
                                                                  ),
                                                                )}
                                                              </ul>
                                                            )}
                                                        </li>
                                                      ),
                                                    )}
                                                  </ul>
                                                )}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* BOTTOM GRID */}
                              <div className="mega-bottom">
                                {link.submenu
                                  .filter((sub) => !Array.isArray(sub.items))
                                  .map((sub) => (
                                    <div
                                      key={sub.name}
                                      className="mega-bottom-item"
                                    >
                                      <button
                                        type="button"
                                        className="mega-bottom-link bg-transparent border-0 cursor-pointer"
                                        onClick={() =>
                                          handleNavigation(sub.href || "/")
                                        }
                                      >
                                        {sub.name}
                                      </button>

                                      {sub.pdf && (
                                        <a
                                          href={sub.pdf}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="pdf-download"
                                          aria-label={`Download ${sub.name} PDF`}
                                          onClick={(event) =>
                                            event.stopPropagation()
                                          }
                                        >
                                          <Image
                                            src={pdfIcon}
                                            alt=""
                                            width={16}
                                            height={16}
                                          />
                                        </a>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* ================================================================
                HAMBURGER
                ================================================================ */}

            <button
              type="button"
              className={`hamburger xl:hidden ${isOpen ? "active" : ""}`}
              onClick={() => {
                setIsOpen((previous) => !previous);
                closeAllMenus();
              }}
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="myNav"
            >
              <span />
              <span />
            </button>
          </nav>
        </div>

        {/* ======================================================================
            MOBILE NAVIGATION
            ====================================================================== */}

        <div
          id="myNav"
          className={`fixed top-0 right-0 h-screen w-full shadow-xl transition-transform duration-300 ${
            isOpen ? "menu-open translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!isOpen}
        >
          <div className="overflow-y-auto w-full h-full">
            <div className="overlay-content container">
              <MobileMenuItems
                items={navLinks}
                openMenus={openMenus}
                onToggle={toggleMobileMenu}
                onNavigate={handleMobileNavigation}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================
          MARQUEE
          ======================================================================== */}

      <div className="container-fluid theme-bg d-none">
        <div className="row theme-bg">
          <div className="marquee-branch flex items-center bg-white justify-between">
            <div className="comingsoontitle pl-4 w-1/3">
              <p>Our new branch is opening soon</p>
              <div className="arrow arrow-right" />
            </div>

            <div className="location">
              <NewLauncb />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}