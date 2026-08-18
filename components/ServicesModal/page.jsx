"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  List,
  X,
} from "lucide-react";

import { useModal } from "@/context/ModalContext";
import { useLenis } from "@/components/LenisProvider";
import UnderDevelopment from "@/components/UnderDevelopment/page";

import "./ServicesModal.css";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const CLOSE_ANIMATION_DURATION = 300;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_URL;

/* -------------------------------------------------------------------------- */
/* Skeleton Loader                                                            */
/* -------------------------------------------------------------------------- */

function SkeletonLoader({
  hasSubcategories = true,
}) {
  return (
    <div
      className={`services-modal-body ${
        hasSubcategories
          ? "has-subcategories"
          : "no-subcategories"
      }`}
      aria-busy="true"
      aria-label="Loading services"
    >
      <div className="services-modal-skeleton">
        <div className="services-left-panel skeleton-panel">
          {Array.from(
            { length: 5 },
            (_, index) => (
              <div
                className="skeleton-section-header"
                key={`section-skeleton-${index}`}
              >
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ),
          )}
        </div>

        <div className="services-center-panel skeleton-panel">
          {Array.from(
            { length: 5 },
            (_, index) => (
              <div
                className="skeleton-category-item"
                key={`category-skeleton-${index}`}
              />
            ),
          )}
        </div>

        <div className="services-right-panel skeleton-panel">
          <div className="skeleton-details-title" />
          <div className="skeleton-details-line" />
          <div className="skeleton-details-line" />
          <div className="skeleton-details-line short" />

          {Array.from(
            { length: 3 },
            (_, index) => (
              <div
                className="skeleton-service-item"
                key={`service-skeleton-${index}`}
              />
            ),
          )}

          <div className="skeleton-details-line" />
          <div className="skeleton-details-line" />
          <div className="skeleton-details-line short" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recursive Service Children                                                */
/* -------------------------------------------------------------------------- */

function ServiceChildren({
  children,
  level = 0,
  expandedItems,
  expandedServices,
  onToggleItem,
  onToggleService,
}) {
  if (
    !Array.isArray(children) ||
    children.length === 0
  ) {
    return null;
  }

  // Find which child is currently expanded at this level (if any)
  const getExpandedChildKey = () => {
    for (const child of children) {
      const childId = child?.id ?? child?._id ?? child?.name;
      if (childId) {
        const itemKey = `${childId}-${level}`;
        if (expandedItems[itemKey]) {
          return itemKey;
        }
      }
    }
    return null;
  };

  const expandedChildKey = getExpandedChildKey();

  return (
    <>
      {children.map((child, index) => {
        const childId =
          child?.id ??
          child?._id ??
          child?.name ??
          `child-${index}`;

        const itemKey = `${childId}-${level}`;

        const hasChildren =
          Array.isArray(child?.children) &&
          child.children.length > 0;

        const hasServices =
          Array.isArray(child?.service) &&
          child.service.length > 0;

        const isExpanded =
          Boolean(expandedItems[itemKey]);

        const isServicesExpanded =
          Boolean(expandedServices[itemKey]);

        const isExpandable =
          hasChildren || hasServices;

        const isOpen =
          isExpanded ||
          isServicesExpanded;

        // Check if this is a grandchild (level >= 1) and there's an expanded sibling
        const isGrandchild = level >= 1;
        const hasExpandedSibling = isGrandchild && expandedChildKey !== null && expandedChildKey !== itemKey;

        // Hide this item if it's a grandchild and a sibling is expanded
        if (hasExpandedSibling) {
          return null;
        }

        // Check if this item has services (is a GrandChild)
        const hasServiceOfferings = hasServices && child.service.length > 0;
        
        // Determine if the header should be active
        // Active when: it has services AND services are expanded
        const isActive = hasServiceOfferings && isServicesExpanded;

        const handleToggle = () => {
          if (hasChildren) {
            // When expanding, close any other expanded items at this level
            if (!isExpanded) {
              // Close all other expanded items at this level
              Object.keys(expandedItems).forEach(key => {
                if (key !== itemKey && key.endsWith(`-${level}`)) {
                  onToggleItem(key);
                }
              });
            }
            onToggleItem(itemKey);
            return;
          }

          if (hasServices) {
            // When expanding services, close any other expanded services at this level
            if (!isServicesExpanded) {
              Object.keys(expandedServices).forEach(key => {
                if (key !== itemKey && key.endsWith(`-${level}`)) {
                  onToggleService(key);
                }
              });
            }
            onToggleService(itemKey);
          }
        };

        const handleKeyDown = (event) => {
          if (!isExpandable) {
            return;
          }

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            handleToggle();
          }
        };

        return (
          <div
            key={itemKey}
            className={`service-child level-${level}`}
            role="listitem"
          >
            <div
              className={`service-child-header ${
                isExpandable
                  ? "has-children"
                  : ""
              } ${isActive ? "active" : ""}`}
              onClick={
                isExpandable
                  ? handleToggle
                  : undefined
              }
              onKeyDown={handleKeyDown}
              role={
                isExpandable
                  ? "button"
                  : undefined
              }
              tabIndex={
                isExpandable
                  ? 0
                  : undefined
              }
              aria-expanded={
                isExpandable
                  ? isOpen
                  : undefined
              }
            >
              <span className="service-child-name">
                {child?.name}
              </span>

              {isExpandable && (
                <span
                  className="service-child-toggle"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              )}

              {hasServices && (
                <span
                  className="service-services-badge"
                  aria-label={`${child.service.length} offerings`}
                >
                  <List
                    size={12}
                    aria-hidden="true"
                  />

                  {child.service.length}
                </span>
              )}

              {child?.pdf && (
                <a
                  href={child.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-pdf-link"
                  aria-label={`Open PDF for ${child.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <FileText
                    size={14}
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>

            {hasServices &&
              isServicesExpanded && (
                <ul
                  className="service-services-list"
                  role="list"
                >
                  {child.service.map(
                    (
                      serviceItem,
                      serviceIndex,
                    ) => (
                      <li
                        key={`${itemKey}-service-${serviceIndex}`}
                        className="service-service-item"
                      >
                        <span
                          className="service-service-dot"
                          aria-hidden="true"
                        >
                          •
                        </span>

                        <Link
                          href={`/services/${serviceItem
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="service-service-name"
                        >
                          {serviceItem}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}

            {hasChildren &&
              isExpanded && (
                <div
                  className="service-child-children"
                  role="list"
                >
                  <ServiceChildren
                    level={level + 1}
                    expandedItems={
                      expandedItems
                    }
                    expandedServices={
                      expandedServices
                    }
                    onToggleItem={
                      onToggleItem
                    }
                    onToggleService={
                      onToggleService
                    }
                  >
                    {child.children}
                  </ServiceChildren>
                </div>
              )}
          </div>
        );
      })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function ServicesModal() {
  const {
    serviceModalOpen,
    setServiceModalOpen,
  } = useModal();

  const {
    stopLenis,
    startLenis,
    getLenisScroll,
    restoreLenisScroll,
  } = useLenis();

  /* ------------------------------------------------------------------------ */
  /* Refs                                                                     */
  /* ------------------------------------------------------------------------ */

  const modalRef = useRef(null);
  const closeTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const modalScrollRef = useRef(0);
  const isClosingRef = useRef(false);
  const isMountedRef = useRef(true);

  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [servicesData, setServicesData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [isClosing, setIsClosing] =
    useState(false);

  const [selectedSection, setSelectedSection] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [expandedItems, setExpandedItems] =
    useState({});

  const [expandedServices, setExpandedServices] =
    useState({});

  /* ------------------------------------------------------------------------ */
  /* Normalize API Data                                                       */
  /* ------------------------------------------------------------------------ */

  const normalizeServiceData =
    useCallback((categories) => {
      if (!Array.isArray(categories)) {
        return [];
      }

      return categories.map(
        (category, categoryIndex) => ({
          id:
            category?.id ??
            category?._id ??
            category?.name ??
            `category-${categoryIndex}`,

          name:
            category?.name ??
            "Unnamed Category",

          pdf:
            category?.pdf ?? "",

          isUnderDevelopment:
            Boolean(
              category?.isUnderDevelopment,
            ),

          items: Array.isArray(
            category?.subCategories,
          )
            ? category.subCategories.map(
                (
                  sub,
                  subIndex,
                ) => ({
                  id:
                    sub?.id ??
                    sub?._id ??
                    sub?.name ??
                    `subcategory-${categoryIndex}-${subIndex}`,

                  name:
                    sub?.name ??
                    "Unnamed Subcategory",

                  pdf:
                    sub?.pdf ?? "",

                  href:
                    sub?.href ?? "",

                  isUnderDevelopment:
                    Boolean(
                      sub?.isUnderDevelopment,
                    ),

                  service:
                    Array.isArray(
                      sub?.service,
                    )
                      ? sub.service
                      : [],

                  children:
                    Array.isArray(
                      sub?.items,
                    )
                      ? sub.items
                      : [],
                }),
              )
            : [],
        }),
      );
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Fetch Services                                                           */
  /* ------------------------------------------------------------------------ */

  const fetchServices =
    useCallback(async () => {
      if (!API_BASE_URL) {
        const message =
          "NEXT_PUBLIC_LOCAL_API_URL is not configured.";

        console.error(message);

        setError(message);
        setLoading(false);

        return;
      }

      abortControllerRef.current?.abort();

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      setLoading(true);
      setError(null);

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/categories/our-services`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
              cache: "no-store",
              signal:
                controller.signal,
            },
          );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch services: ${response.status}`,
          );
        }

        const result =
          await response.json();

        if (
          !result?.success ||
          !Array.isArray(
            result?.data,
          )
        ) {
          throw new Error(
            "Invalid services response from server.",
          );
        }

        if (
          controller.signal.aborted
        ) {
          return;
        }

        const normalizedData =
          normalizeServiceData(
            result.data,
          );

        setServicesData(
          normalizedData,
        );

        /* -------------------------------------------------------------- */
        /* Initialize first section/category                              */
        /* -------------------------------------------------------------- */

        const firstSection =
          normalizedData[0] ?? null;

        const firstCategory =
          firstSection?.items?.[0] ??
          null;

        setSelectedSection(
          firstSection,
        );

        setSelectedCategory(
          firstCategory,
        );

        setExpandedItems({});
        setExpandedServices({});
      } catch (err) {
        if (
          err?.name ===
          "AbortError"
        ) {
          return;
        }

        if (
          controller.signal.aborted
        ) {
          return;
        }

        console.error(
          "Error fetching services:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load services.",
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }, [normalizeServiceData]);

  /* ------------------------------------------------------------------------ */
  /* Fetch When Modal Opens                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    let cancelled = false;

    const runFetch = () => {
      if (cancelled) {
        return;
      }

      fetchServices();
    };

    queueMicrotask(runFetch);

    return () => {
      cancelled = true;

      abortControllerRef.current?.abort();

      abortControllerRef.current =
        null;
    };
  }, [
    serviceModalOpen,
    fetchServices,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Close Modal - FIXED: Single source of truth                            */
  /* ------------------------------------------------------------------------ */

  const closeModal = useCallback(() => {
    // Prevent multiple close calls
    if (isClosingRef.current || !isMountedRef.current) {
      return;
    }

    // Clear any existing timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    // Set closing flag
    isClosingRef.current = true;
    setIsClosing(true);

    // Set timer for animation
    closeTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setServiceModalOpen(false);
        setIsClosing(false);
        isClosingRef.current = false;
        closeTimerRef.current = null;
      }
    }, CLOSE_ANIMATION_DURATION);
  }, [setServiceModalOpen]);

  /* ------------------------------------------------------------------------ */
  /* Force Close (for parent components) - NO ANIMATION                     */
  /* ------------------------------------------------------------------------ */

  const forceCloseModal = useCallback(() => {
    // Clear any pending timers
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    // Reset all closing states immediately
    isClosingRef.current = false;
    setIsClosing(false);
    setServiceModalOpen(false);
  }, [setServiceModalOpen]);

  /* ------------------------------------------------------------------------ */
  /* Listen for parent close requests                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    // If modal is open and serviceModalOpen becomes false from parent
    if (!serviceModalOpen && isClosingRef.current) {
      // Parent already closed it, just reset our state
      setIsClosing(false);
      isClosingRef.current = false;
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }
  }, [serviceModalOpen]);

  /* ------------------------------------------------------------------------ */
  /* Close Timer Cleanup                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (closeTimerRef.current) {
        clearTimeout(
          closeTimerRef.current,
        );
        closeTimerRef.current = null;
      }
      abortControllerRef.current?.abort();
      isClosingRef.current = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Outside Click - FIXED: Use click and check closing state               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      const modal = modalRef.current;

      if (
        modal &&
        !modal.contains(
          event.target,
        ) &&
        !isClosingRef.current
      ) {
        closeModal();
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside,
      );
    };
  }, [
    serviceModalOpen,
    closeModal,
  ]);

  /* ------------------------------------------------------------------------ */
  /* ESC Key - FIXED                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isClosingRef.current) {
        event.preventDefault();
        closeModal();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    serviceModalOpen,
    closeModal,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Lenis Scroll Lock                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    const savedPosition =
      getLenisScroll();

    modalScrollRef.current =
      savedPosition;

    stopLenis();

    return () => {
      const position =
        modalScrollRef.current;

      startLenis();

      requestAnimationFrame(() => {
        restoreLenisScroll(
          position,
        );
      });
    };
  }, [
    serviceModalOpen,
    getLenisScroll,
    stopLenis,
    startLenis,
    restoreLenisScroll,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Section Hover                                                            */
  /* ------------------------------------------------------------------------ */

  const handleSectionHover =
    useCallback((section) => {
      if (!section) {
        return;
      }

      setSelectedSection(
        (current) =>
          current?.id === section.id
            ? current
            : section,
      );

      setSelectedCategory(
        section.items?.[0] ?? null,
      );

      setExpandedItems({});
      setExpandedServices({});
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Category Hover                                                           */
  /* ------------------------------------------------------------------------ */

  const handleCategoryHover =
    useCallback((category) => {
      if (!category) {
        return;
      }

      setSelectedCategory(
        (current) =>
          current?.id === category.id
            ? current
            : category,
      );
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Section Click                                                            */
  /* ------------------------------------------------------------------------ */

  const handleSectionClick =
    useCallback((section) => {
      if (!section) {
        return;
      }

      setSelectedSection(section);

      setSelectedCategory(
        section.items?.[0] ?? null,
      );

      setExpandedItems({});
      setExpandedServices({});
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Category Click                                                           */
  /* ------------------------------------------------------------------------ */

  const handleCategoryClick =
    useCallback((category) => {
      if (!category) {
        return;
      }

      setSelectedCategory(category);
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Expand / Collapse - Updated to close siblings                           */
  /* ------------------------------------------------------------------------ */

  const toggleExpand =
    useCallback((key) => {
      setExpandedItems(
        (previous) => {
          // Get the level from the key
          const level = parseInt(key.split('-').pop(), 10);
          
          // If we're expanding this item, close all other items at the same level
          if (!previous[key]) {
            const newState = { ...previous };
            Object.keys(newState).forEach(k => {
              const kLevel = parseInt(k.split('-').pop(), 10);
              if (k !== key && kLevel === level) {
                delete newState[k];
              }
            });
            newState[key] = true;
            return newState;
          }
          
          // If we're collapsing, just toggle it off
          return {
            ...previous,
            [key]: false,
          };
        },
      );
    }, []);

  const toggleServiceExpand =
    useCallback((key) => {
      setExpandedServices(
        (previous) => {
          // Get the level from the key
          const level = parseInt(key.split('-').pop(), 10);
          
          // If we're expanding this item, close all other items at the same level
          if (!previous[key]) {
            const newState = { ...previous };
            Object.keys(newState).forEach(k => {
              const kLevel = parseInt(k.split('-').pop(), 10);
              if (k !== key && kLevel === level) {
                delete newState[k];
              }
            });
            newState[key] = true;
            return newState;
          }
          
          // If we're collapsing, just toggle it off
          return {
            ...previous,
            [key]: false,
          };
        },
      );
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Derived State                                                            */
  /* ------------------------------------------------------------------------ */

  const hasSubcategories =
    Boolean(
      selectedSection?.items?.length,
    );

  const displayCategory =
    selectedCategory;

  /* ------------------------------------------------------------------------ */
  /* Render Guard                                                             */
  /* ------------------------------------------------------------------------ */

  if (
    !serviceModalOpen &&
    !isClosing
  ) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* Error State                                                              */
  /* ------------------------------------------------------------------------ */

  if (
    error &&
    servicesData.length === 0 &&
    !loading
  ) {
    return (
      <div
        className="services-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="services-error-title"
      >
        <div
          ref={modalRef}
          className={`services-modal ${
            isClosing
              ? "closing"
              : ""
          }`}
        >
          <div className="services-modal-body error-state">
            <button
              type="button"
              className="services-modal-close"
              onClick={closeModal}
              aria-label="Close services menu"
            >
              <X
                size={24}
                aria-hidden="true"
              />
            </button>

            <div className="error-container">
              <p
                className="error-icon"
                aria-hidden="true"
              >
                ⚠️
              </p>

              <h2 id="services-error-title">
                Unable to load services
              </h2>

              <p className="error-message">
                {error}
              </p>

              <button
                type="button"
                className="error-retry-btn"
                onClick={
                  fetchServices
                }
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main Render                                                              */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      className="services-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Services menu"
    >
      <div
        ref={modalRef}
        className={`services-modal ${
          serviceModalOpen
            ? "active"
            : ""
        } ${
          isClosing
            ? "closing"
            : ""
        }`}
      >
        {loading ? (
          <SkeletonLoader
            hasSubcategories={
              hasSubcategories
            }
          />
        ) : (
          <div
            className={`services-modal-body ${
              hasSubcategories
                ? "has-subcategories"
                : "no-subcategories"
            }`}
          >
            {/* ============================================================ */}
            {/* LEFT PANEL                                                    */}
            {/* ============================================================ */}

            <nav
              className="services-left-panel"
              aria-label="Service categories"
            >
              <h2 className="sr-only">
                Service Categories
              </h2>

              <div
                className="services-section-list"
                role="list"
              >
                {servicesData.map(
                  (section) => {
                    const sectionId =
                      section.id ??
                      section.name;

                    const isActive =
                      selectedSection?.id ===
                      section.id;

                    return (
                      <div
                        key={sectionId}
                        className="services-section-item"
                        role="listitem"
                      >
                        <div className="services-section-row">
                          <button
                            type="button"
                            className={`services-section-btn ${
                              isActive
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleSectionClick(
                                section,
                              )
                            }
                            onMouseEnter={() =>
                              handleSectionHover(
                                section,
                              )
                            }
                            aria-current={
                              isActive
                                ? "page"
                                : undefined
                            }
                          >
                            <span className="services-section-name">
                              {
                                section.name
                              }
                            </span>
                          </button>

                          {section.pdf && (
                            <a
                              href={
                                section.pdf
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="services-section-pdf"
                              aria-label={`Open PDF for ${section.name}`}
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </nav>

            {/* ============================================================ */}
            {/* CENTER PANEL                                                  */}
            {/* ============================================================ */}

            {hasSubcategories && (
              <nav
                className="services-center-panel"
                aria-label="Service subcategories"
              >
                <h2 className="sr-only">
                  Service Subcategories
                </h2>

                <div
                  className="services-category-list"
                  role="list"
                >
                  {selectedSection.items.map(
                    (item) => {
                      const itemId =
                        item.id ??
                        item.name;

                      const isActive =
                        selectedCategory?.id ===
                        item.id;

                      return (
                        <div
                          key={itemId}
                          className="services-category-item"
                          role="listitem"
                        >
                          <div className="services-category-row">
                            <button
                              type="button"
                              className={`services-category-btn ${
                                isActive
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleCategoryClick(
                                  item,
                                )
                              }
                              onMouseEnter={() =>
                                handleCategoryHover(
                                  item,
                                )
                              }
                              aria-current={
                                isActive
                                  ? "page"
                                  : undefined
                              }
                            >
                              <span className="services-category-name">
                                {
                                  item.name
                                }
                              </span>
                            </button>

                            {item.pdf && (
                              <a
                                href={
                                  item.pdf
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="services-category-pdf"
                                aria-label={`Open PDF for ${item.name}`}
                              >
                                <FileText
                                  size={14}
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </nav>
            )}

            {/* ============================================================ */}
            {/* RIGHT PANEL                                                   */}
            {/* ============================================================ */}

            <section
              id="services-right-panel"
              className="services-right-panel"
              aria-label="Service details"
            >
              {displayCategory ? (
                <article className="services-details">
                  {/* <h2 className="services-details-title">
                    {displayCategory.name}
                  </h2> */}

                  {displayCategory.isUnderDevelopment ? (
                    <div className="services-details-under-development">
                      <UnderDevelopment />
                    </div>
                  ) : (
                    <>
                      {/* ------------------------------------------------ */}
                      {/* Service Offerings                                */}
                      {/* ------------------------------------------------ */}

                      {Array.isArray(
                        displayCategory.service,
                      ) &&
                        displayCategory
                          .service
                          .length > 0 && (
                          <section
                            className="services-details-services"
                            aria-label="Service offerings"
                          >
                            <h3 className="services-details-subtitle">
                              <List
                                size={16}
                                aria-hidden="true"
                              />

                              Service Offerings
                            </h3>

                            <ul
                              className="services-details-services-list"
                              role="list"
                            >
                              {displayCategory.service.map(
                                (
                                  serviceItem,
                                  index,
                                ) => (
                                  <li
                                    key={`${displayCategory.id}-service-${index}`}
                                    className="services-details-service-item"
                                  >
                                    <span
                                      className="services-details-service-dot"
                                      aria-hidden="true"
                                    >
                                      •
                                    </span>

                                    <span className="services-details-service-name">
                                      {
                                        serviceItem
                                      }
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </section>
                        )}

                      {/* ------------------------------------------------ */}
                      {/* Recursive Children                                */}
                      {/* ------------------------------------------------ */}

                      {Array.isArray(
                        displayCategory.children,
                      ) &&
                      displayCategory
                        .children
                        .length > 0 ? (
                        <div
                          className="services-details-children"
                          role="list"
                        >
                          <h3 className="sr-only">
                            Sub-services
                          </h3>

                          <ServiceChildren
                            expandedItems={
                              expandedItems
                            }
                            expandedServices={
                              expandedServices
                            }
                            onToggleItem={
                              toggleExpand
                            }
                            onToggleService={
                              toggleServiceExpand
                            }
                          >
                            {
                              displayCategory.children
                            }
                          </ServiceChildren>
                        </div>
                      ) : (
                        <div className="services-details-no-content" />
                      )}
                    </>
                  )}
                </article>
              ) : (
                <div className="services-details-empty-state">
                  <UnderDevelopment
                    section={selectedSection}
                    category={null}
                    source="empty"
                  />
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}