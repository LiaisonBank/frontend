"use client";

import {
  useCallback,
  useEffect,
  useMemo,
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

/* ==========================================================================
   Constants
   ========================================================================== */

const CLOSE_ANIMATION_DURATION = 300;

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

/* ==========================================================================
   Utility Helpers
   ========================================================================== */

/**
 * Creates a safe comparison key for names.
 *
 * Example:
 * "Licenses Renewal" -> "licenses renewal"
 * "  AMC  "           -> "amc"
 */
const normalizeName = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

/**
 * Returns a stable ID for any service entity.
 */
const getEntityId = (entity, fallback = "") =>
  entity?.id ??
  entity?._id ??
  entity?.name ??
  fallback;

/* ==========================================================================
   Skeleton Loader
   ========================================================================== */

function SkeletonLoader({ hasSubcategories = true }) {
  return (
    <div
      className={`services-modal-body ${
        hasSubcategories ? "has-subcategories" : "no-subcategories"
      }`}
      aria-busy="true"
      aria-label="Loading services"
    >
      <div className="services-modal-skeleton">
        {/* LEFT */}
        <div className="services-left-panel skeleton-panel">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="skeleton-section-header"
              key={`section-skeleton-${index}`}
            >
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>

        {/* CENTER */}
        <div
          className="services-center-panel skeleton-panel"
          onWheel={(event) => {
            event.stopPropagation();

            const element = event.currentTarget;

            if (event.deltaY !== 0) {
              element.scrollTop += event.deltaY;
            }
          }}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="skeleton-category-item"
              key={`category-skeleton-${index}`}
            />
          ))}
        </div>

        {/* RIGHT */}
        <div className="services-right-panel skeleton-panel">
          <div className="skeleton-details-title" />
          <div className="skeleton-details-line" />
          <div className="skeleton-details-line" />
          <div className="skeleton-details-line short" />

          {Array.from({ length: 3 }, (_, index) => (
            <div
              className="skeleton-service-item"
              key={`service-skeleton-${index}`}
            />
          ))}

          <div className="skeleton-details-line" />
          <div className="skeleton-details-line" />
          <div className="skeleton-details-line short" />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Recursive Service Children
   ========================================================================== */

function ServiceChildren({
  children,
  level = 0,
  expandedItems,
  expandedServices,
  onToggleItem,
  onToggleService,
}) {
  if (!Array.isArray(children) || children.length === 0) {
    return null;
  }

  const expandedChildKey = useMemo(() => {
    for (const child of children) {
      const childId = getEntityId(child);
      if (!childId) continue;
      const itemKey = `${childId}-${level}`;
      if (expandedItems[itemKey]) {
        return itemKey;
      }
    }
    return null;
  }, [children, expandedItems, level]);

  return (
    <>
      {children.map((child, index) => {
        const childId = getEntityId(child, `child-${index}`);
        const itemKey = `${childId}-${level}`;
        const hasChildren = Array.isArray(child?.children) && child.children.length > 0;
        const hasServices = Array.isArray(child?.service) && child.service.length > 0;
        const isExpanded = Boolean(expandedItems[itemKey]);
        const isServicesExpanded = Boolean(expandedServices[itemKey]);
        const isExpandable = hasChildren || hasServices;
        const isOpen = isExpanded || isServicesExpanded;

        const isGrandchild = level >= 1;
        const hasExpandedSibling = isGrandchild && expandedChildKey !== null && expandedChildKey !== itemKey;

        if (hasExpandedSibling) {
          return null;
        }

        const isActive = hasServices && isServicesExpanded;

        const handleToggle = () => {
          if (hasChildren) {
            onToggleItem(itemKey);
            return;
          }
          if (hasServices) {
            onToggleService(itemKey);
          }
        };

        const handleKeyDown = (event) => {
          if (!isExpandable) return;
          if (event.key === "Enter" || event.key === " ") {
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
            {/* Header */}
            <div
              className={`service-child-header ${
                isExpandable ? "has-children" : ""
              } ${isActive ? "active" : ""}`}
              onClick={isExpandable ? handleToggle : undefined}
              onKeyDown={handleKeyDown}
              role={isExpandable ? "button" : undefined}
              tabIndex={isExpandable ? 0 : undefined}
              aria-expanded={isExpandable ? isOpen : undefined}
            >
              <span className="service-child-name">{child?.name}</span>

              {isExpandable && (
                <span
                  className={`service-child-toggle ${isExpandable ? "has-children" : ""} ${
                    isActive ? "active" : ""
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}

              {hasServices && (
                <span className="service-services-badge" aria-label={`${child.service.length} offerings`}>
                  <List size={12} aria-hidden="true" />
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
                  onClick={(event) => event.stopPropagation()}
                >
                  <FileText size={14} aria-hidden="true" />
                </a>
              )}
            </div>

            {/* Service Offerings - Scrollable */}
            {hasServices && isServicesExpanded && (
              <ul className="service-services-list" role="list"
                  style={{
                    overflowY: "auto",
                    maxHeight: "100%",
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      "#ef7f1a transparent",
                  }}
                  onWheel={(event) => {
                    event.stopPropagation();

                    const element =
                      event.currentTarget;

                    if (event.deltaY !== 0) {
                      element.scrollTop +=
                        event.deltaY;
                    }
                  }}>
                {child.service.map((serviceItem, serviceIndex) => {
                  const serviceSlug = String(serviceItem)
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  return (
                    <li key={`${itemKey}-service-${serviceIndex}`} className="service-service-item">
                      <span className="service-service-dot" aria-hidden="true">
                        •
                      </span>
                      <Link href={`/services/${serviceSlug}`} className="service-service-name">
                        {serviceItem}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Nested Children - Scrollable */}
            {hasChildren && isExpanded && (
              <div className="service-child-children" role="list">
                <ServiceChildren
                  level={level + 1}
                  expandedItems={expandedItems}
                  expandedServices={expandedServices}
                  onToggleItem={onToggleItem}
                  onToggleService={onToggleService}
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

/* ==========================================================================
   Main Component
   ========================================================================== */

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

  /* ==========================================================================
     Refs
     ========================================================================== */

  const modalRef = useRef(null);
  const closeTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const modalScrollRef = useRef(0);

  const isClosingRef = useRef(false);
  const isMountedRef = useRef(true);

  /* ==========================================================================
     State
     ========================================================================== */

  const [servicesData, setServicesData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [isClosing, setIsClosing] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [expandedItems, setExpandedItems] = useState({});

  const [expandedServices, setExpandedServices] = useState({});

  /* ==========================================================================
     Normalize API Data
     ========================================================================== */

  const normalizeServiceData = useCallback((categories) => {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories.map((category, categoryIndex) => {
      const categoryId = getEntityId(
        category,
        `category-${categoryIndex}`,
      );

      const subCategories = Array.isArray(category?.subCategories)
        ? category.subCategories
        : [];

      return {
        id: categoryId,

        name: category?.name ?? "Unnamed Category",

        pdf: category?.pdf ?? "",

        isUnderDevelopment: Boolean(
          category?.isUnderDevelopment,
        ),

        items: subCategories.map((sub, subIndex) => {
          const subId = getEntityId(
            sub,
            `subcategory-${categoryIndex}-${subIndex}`,
          );

          return {
            id: subId,

            name: sub?.name ?? "Unnamed Subcategory",

            pdf: sub?.pdf ?? "",

            href: sub?.href ?? "",

            isUnderDevelopment: Boolean(
              sub?.isUnderDevelopment,
            ),

            service: Array.isArray(sub?.service)
              ? sub.service
              : [],

            children: Array.isArray(sub?.items)
              ? sub.items
              : [],
          };
        }),
      };
    });
  }, []);

  /* ==========================================================================
     Fetch Services
     ========================================================================== */

  const fetchServices = useCallback(async () => {
    if (!API_BASE_URL) {
      const message =
        "NEXT_PUBLIC_LOCAL_API_URL is not configured.";

      console.error(message);

      setError(message);
      setLoading(false);

      return;
    }

    /* Cancel previous request */
    abortControllerRef.current?.abort();

    const controller = new AbortController();

    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories/our-services`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
          },

          cache: "no-store",

          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch services: ${response.status}`,
        );
      }

      const result = await response.json();

      if (
        !result?.success ||
        !Array.isArray(result?.data)
      ) {
        throw new Error(
          "Invalid services response from server.",
        );
      }

      if (controller.signal.aborted) {
        return;
      }

      const normalizedData =
        normalizeServiceData(result.data);

      setServicesData(normalizedData);

      /* --------------------------------------------------------------
         Initialize first section/category
         -------------------------------------------------------------- */

      const firstSection =
        normalizedData[0] ?? null;

      const firstCategory =
        firstSection?.items?.[0] ?? null;

      setSelectedSection(firstSection);

      setSelectedCategory(firstCategory);

      setExpandedItems({});

      setExpandedServices({});
    } catch (err) {
      if (
        err?.name === "AbortError" ||
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
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [normalizeServiceData]);

  /* ==========================================================================
     Find Licensing Category
     ========================================================================== */

  /**
   * Finds the top-level category whose name is "Licensing".
   *
   * API:
   *
   * {
   *   name: "Licensing",
   *   subCategories: [...]
   * }
   *
   * After normalization:
   *
   * {
   *   name: "Licensing",
   *   items: [...]
   * }
   */
  const licensingCategory = useMemo(() => {
    if (!Array.isArray(servicesData)) {
      return null;
    }

    return (
      servicesData.find(
        (section) =>
          normalizeName(section?.name) === "licensing",
      ) ?? null
    );
  }, [servicesData]);

  /* ==========================================================================
     Special AMC → Licenses Renewal Mapping
     ========================================================================== */

  /**
   * IMPORTANT:
   *
   * Normal flow:
   *
   * selectedSection
   *      ↓
   * selectedCategory
   *      ↓
   * displayCategory
   *
   *
   * Special flow:
   *
   * AMC
   *   ↓
   * Licenses Renewal
   *   ↓
   * find Licensing
   *   ↓
   * Licensing.items
   *   ↓
   * display as children
   */
  const displayCategory = useMemo(() => {
    if (!selectedCategory) {
      return null;
    }

    const isAMC =
      normalizeName(selectedSection?.name) === "amc";

    const isLicensesRenewal =
      normalizeName(selectedCategory?.name) ===
      "licenses renewal";

    /**
     * Normal category:
     * return exactly what API provided.
     */
    if (!isAMC || !isLicensesRenewal) {
      return selectedCategory;
    }

    /**
     * AMC → Licenses Renewal
     *
     * Use Licensing subcategories.
     */
    if (!licensingCategory) {
      return selectedCategory;
    }

    const licensingItems = Array.isArray(
      licensingCategory.items,
    )
      ? licensingCategory.items
      : [];

    /**
     * Do NOT mutate selectedCategory.
     *
     * Create a new object instead.
     */
    return {
      ...selectedCategory,

      children: licensingItems,
    };
  }, [
    selectedCategory,
    selectedSection,
    licensingCategory,
  ]);

  /* ==========================================================================
     Fetch When Modal Opens
     ========================================================================== */

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

      abortControllerRef.current = null;
    };
  }, [serviceModalOpen, fetchServices]);

  /* ==========================================================================
     Close Modal
     ========================================================================== */

  const closeModal = useCallback(() => {
    if (
      isClosingRef.current ||
      !isMountedRef.current
    ) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);

      closeTimerRef.current = null;
    }

    isClosingRef.current = true;

    setIsClosing(true);

    closeTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) {
        return;
      }

      setServiceModalOpen(false);

      setIsClosing(false);

      isClosingRef.current = false;

      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_DURATION);
  }, [setServiceModalOpen]);

  /* ==========================================================================
     Force Close
     ========================================================================== */

  const forceCloseModal = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);

      closeTimerRef.current = null;
    }

    isClosingRef.current = false;

    setIsClosing(false);

    setServiceModalOpen(false);
  }, [setServiceModalOpen]);

  /* ==========================================================================
     Parent Close Listener
     ========================================================================== */

  useEffect(() => {
    if (
      !serviceModalOpen &&
      isClosingRef.current
    ) {
      setIsClosing(false);

      isClosingRef.current = false;

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);

        closeTimerRef.current = null;
      }
    }
  }, [serviceModalOpen]);

  /* ==========================================================================
     Cleanup
     ========================================================================== */

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);

        closeTimerRef.current = null;
      }

      abortControllerRef.current?.abort();

      isClosingRef.current = false;
    };
  }, []);

  /* ==========================================================================
     Outside Click
     ========================================================================== */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      const modal = modalRef.current;

      if (
        modal &&
        !modal.contains(event.target) &&
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
  }, [serviceModalOpen, closeModal]);

  /* ==========================================================================
     ESC Key
     ========================================================================== */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !isClosingRef.current
      ) {
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
  }, [serviceModalOpen, closeModal]);

  /* ==========================================================================
     Lenis Scroll Lock
     ========================================================================== */

  useEffect(() => {
    if (!serviceModalOpen) {
      return undefined;
    }

    const savedPosition = getLenisScroll();

    modalScrollRef.current = savedPosition;

    stopLenis();

    return () => {
      const position =
        modalScrollRef.current;

      startLenis();

      requestAnimationFrame(() => {
        restoreLenisScroll(position);
      });
    };
  }, [
    serviceModalOpen,
    getLenisScroll,
    stopLenis,
    startLenis,
    restoreLenisScroll,
  ]);

  /* ==========================================================================
     Section Hover
     ========================================================================== */

  const handleSectionHover = useCallback(
    (section) => {
      if (!section) {
        return;
      }

      setSelectedSection((current) =>
        current?.id === section.id
          ? current
          : section,
      );

      setSelectedCategory(
        section.items?.[0] ?? null,
      );

      setExpandedItems({});

      setExpandedServices({});
    },
    [],
  );

  /* ==========================================================================
     Category Hover
     ========================================================================== */

  const handleCategoryHover = useCallback(
    (category) => {
      if (!category) {
        return;
      }

      setSelectedCategory((current) =>
        current?.id === category.id
          ? current
          : category,
      );

      /**
       * Reset nested expansion when switching
       * to another category.
       */
      setExpandedItems({});

      setExpandedServices({});
    },
    [],
  );

  /* ==========================================================================
     Section Click
     ========================================================================== */

  const handleSectionClick = useCallback(
    (section) => {
      if (!section) {
        return;
      }

      setSelectedSection(section);

      setSelectedCategory(
        section.items?.[0] ?? null,
      );

      setExpandedItems({});

      setExpandedServices({});
    },
    [],
  );

  /* ==========================================================================
     Category Click
     ========================================================================== */

  const handleCategoryClick = useCallback(
    (category) => {
      if (!category) {
        return;
      }

      setSelectedCategory(category);

      setExpandedItems({});

      setExpandedServices({});
    },
    [],
  );

  /* ==========================================================================
     Expand / Collapse Children
     ========================================================================== */

  const toggleExpand = useCallback((key) => {
    setExpandedItems((previous) => {
      const level = parseInt(
        key.split("-").pop(),
        10,
      );

      const isCurrentlyExpanded =
        Boolean(previous[key]);

      if (!isCurrentlyExpanded) {
        const nextState = {
          ...previous,
        };

        Object.keys(nextState).forEach(
          (existingKey) => {
            const existingLevel = parseInt(
              existingKey.split("-").pop(),
              10,
            );

            if (
              existingKey !== key &&
              existingLevel === level
            ) {
              delete nextState[existingKey];
            }
          },
        );

        nextState[key] = true;

        return nextState;
      }

      return {
        ...previous,
        [key]: false,
      };
    });
  }, []);

  /* ==========================================================================
     Expand / Collapse Services
     ========================================================================== */

  const toggleServiceExpand = useCallback(
    (key) => {
      setExpandedServices((previous) => {
        const level = parseInt(
          key.split("-").pop(),
          10,
        );

        const isCurrentlyExpanded =
          Boolean(previous[key]);

        if (!isCurrentlyExpanded) {
          const nextState = {
            ...previous,
          };

          Object.keys(nextState).forEach(
            (existingKey) => {
              const existingLevel = parseInt(
                existingKey.split("-").pop(),
                10,
              );

              if (
                existingKey !== key &&
                existingLevel === level
              ) {
                delete nextState[existingKey];
              }
            },
          );

          nextState[key] = true;

          return nextState;
        }

        return {
          ...previous,
          [key]: false,
        };
      });
    },
    [],
  );

  /* ==========================================================================
     Derived State
     ========================================================================== */

  const hasSubcategories = Boolean(
    selectedSection?.items?.length,
  );

  /* ==========================================================================
     Render Guard - MOVED TO THE END AFTER ALL HOOKS
     ========================================================================== */

  // All hooks must be called before any conditional returns
  // This ensures hooks are always called in the same order

  /* ==========================================================================
     Error State
     ========================================================================== */

  if (
    !serviceModalOpen && 
    !isClosing
  ) {
    return null;
  }

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
            isClosing ? "closing" : ""
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
                onClick={fetchServices}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     Main Render
     ========================================================================== */

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
          serviceModalOpen ? "active" : ""
        } ${isClosing ? "closing" : ""}`}
      >
        {loading ? (
          <SkeletonLoader
            hasSubcategories={hasSubcategories}
          />
        ) : (
          <div
            className={`services-modal-body ${
              hasSubcategories
                ? "has-subcategories"
                : "no-subcategories"
            }`}
          >
            {/* ==============================================================
                LEFT PANEL
                ============================================================== */}

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
                {servicesData.map((section) => {
                  const sectionId = getEntityId(
                    section,
                    `section-${section.name}`,
                  );

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
                            {section.name}
                          </span>
                        </button>

                        {section.pdf && (
                          <a
                            href={section.pdf}
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
                })}
              </div>
            </nav>

            {/* ==============================================================
                CENTER PANEL
                ============================================================== */}

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
                  style={{
                    overflowY: "auto",
                    maxHeight: "100%",
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      "#ef7f1a transparent",
                  }}
                  onWheel={(event) => {
                    event.stopPropagation();

                    const element =
                      event.currentTarget;

                    if (event.deltaY !== 0) {
                      element.scrollTop +=
                        event.deltaY;
                    }
                  }}
                >
                  {selectedSection.items.map(
                    (item) => {
                      const itemId = getEntityId(
                        item,
                        `category-${item.name}`,
                      );

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
                                {String(
                                  item.name ?? "",
                                )
                                  .split(/(\()/)
                                  .map(
                                    (
                                      part,
                                      index,
                                    ) =>
                                      part ===
                                      "(" ? (
                                        <span
                                          key={
                                            index
                                          }
                                        >
                                          &nbsp;
                                          {part}
                                        </span>
                                      ) : (
                                        <span
                                          key={
                                            index
                                          }
                                        >
                                          {part}
                                        </span>
                                      ),
                                  )}
                              </span>
                            </button>

                            {item.pdf && (
                              <a
                                href={item.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="services-category-pdf"
                                aria-label={`Open PDF for ${item.name}`}
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
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

            {/* ==============================================================
                RIGHT PANEL
                ============================================================== */}

            <section
              id="services-right-panel"
              className="services-right-panel"
              aria-label="Service details"
            >
              {displayCategory ? (
                <article className="services-details">
                  {/* Under Development */}
                  {displayCategory.isUnderDevelopment ? (
                    <div className="services-details-under-development">
                      <UnderDevelopment />
                    </div>
                  ) : (
                    <>
                      {/* Direct Service Offerings */}
                      {Array.isArray(displayCategory.service) &&
                        displayCategory.service.length > 0 && (
                        <section
                          className="services-details-services"
                          aria-label="Service offerings"
                        >
                          <h3 className="services-details-subtitle">
                            <List size={16} aria-hidden="true" />
                            Service Offerings
                          </h3>

                          <ul
                            className="services-details-services-list"
                            role="list"
                          >
                            {displayCategory.service.map((serviceItem, index) => (
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
                                  {serviceItem}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}

                      {/* Recursive Children */}
                      {Array.isArray(displayCategory.children) &&
                      displayCategory.children.length > 0 ? (
                        <div className="services-details-children" role="list">
                          <h3 className="sr-only">Sub-services</h3>
                          <ServiceChildren
                            expandedItems={expandedItems}
                            expandedServices={expandedServices}
                            onToggleItem={toggleExpand}
                            onToggleService={toggleServiceExpand}
                          >
                            {displayCategory.children}
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