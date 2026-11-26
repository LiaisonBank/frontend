// app/our-services/[slug]/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./service-detail.scss";
import Image from "next/image";
import { getImageUrl } from "../../../lib/utils/getImagehelper";
import ApiError from "@/components/ApiError/ApiError";
import { motion, AnimatePresence } from "framer-motion";

// Fallback image
const FALLBACK_IMAGE =
  "/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png";

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Time between each child animating
      delayChildren: 0.15, // Delay before starting the children animations
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const searchParams = useSearchParams();

  const subQuery = searchParams.get("sub");

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  // Track flip state for each card
  const [flippedCards, setFlippedCards] = useState({});

  // Track which subservice link is currently opening
  const [loadingItemId, setLoadingItemId] = useState(null);

  // Refs for timeout handling
  const timeoutRefs = useRef({});
  const containerRefs = useRef({});
  const scrollTimeoutRefs = useRef({});
  const listRefs = useRef({});
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const [expandingId, setExpandingId] = useState(null);
  const accordionRefs = useRef({});
  const hasScrolledToTarget = useRef(false);

  // ADD THIS ENTIRE BLOCK
  useEffect(() => {
    if (activeSubcategoryId && accordionRefs.current[activeSubcategoryId]) {
      // A tiny timeout ensures Framer Motion has started expanding
      // the accordion before we calculate the scroll position.
      const timer = setTimeout(() => {
        accordionRefs.current[activeSubcategoryId].scrollIntoView({
          behavior: "smooth",
          block: "nearest", // Scrolls so the top of the accordion is at the top of the screen
        });
      }, 150); // 150ms delay

      return () => clearTimeout(timer);
    }
  }, [activeSubcategoryId]);

  // Set the first item as active when data loads
  // 1. Create a dictionary to map Homepage names to Database names
  const SUB_ALIASES = {
    mumbaiporttrust: "mumbaiportauthority",
    punemunicipalcorporation: "punemahanagarcorporation",
    mumbaiairportauthorityindia: "mumbaiairportathorityindia",
    maharashtrastateelectricitydistributioncolimited:
      "maharashtrastateelectricitydistributioncompanylimited",
    costalregionalzone: "costalreasonzone",
    mumbaifirebrigade: "mumbaifiredepartment",
    mumbaimetropolitanregiondevelopmentauthority: "mmrda",
    mahanagargaslimited: "mahanagargas",
  };

  useEffect(() => {
    if (!service?.subcategories || service.subcategories.length === 0) return;

    const createRobustSlug = (text) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\([^)]*\)/g, "")
        .replace(/\b(and|the|of)\b/g, "")
        .replace(/[^a-z0-9]+/g, "");
    };

    let targetId = null;

    console.log(
      `🔵 [ACCORDION] Page loaded. URL Query (?sub=): "${subQuery || "NONE"}"`,
    );

    if (subQuery) {
      const strictQuery = createRobustSlug(subQuery);
      const aliasedQuery = SUB_ALIASES[strictQuery] || strictQuery;

      const rawQuery = subQuery.toLowerCase().trim();
      const rawAliasedQuery = aliasedQuery.toLowerCase().trim();

      const matchedSub = service.subcategories.find((sub) => {
        const dbName = sub.name || "";
        const dbSlug = sub.slug || "";

        const rawDbName = dbName.toLowerCase().trim();
        const rawDbSlug = dbSlug.toLowerCase().trim();

        const strictDbName = createRobustSlug(dbName);
        const strictDbSlug = createRobustSlug(dbSlug);

        // 1. Exact strict match (e.g., "revenueforest" === "revenueforest")
        if (
          strictDbName === rawAliasedQuery ||
          strictDbSlug === rawAliasedQuery
        ) {
          console.log(`   ✅ Exact strict match: "${dbName}"`);
          return true;
        }

        // 2. Raw inclusion match (e.g., "revenue & forest(collector)" includes "collector")
        if (rawDbName.includes(rawQuery) || rawDbSlug.includes(rawQuery)) {
          console.log(
            `   ✅ Raw inclusion match: "${dbName}" includes "${rawQuery}"`,
          );
          return true;
        }

        // 3. Strict inclusion match (e.g., "revenueforestcollector" includes "collector")
        if (
          strictDbName.includes(rawAliasedQuery) ||
          strictDbSlug.includes(rawAliasedQuery)
        ) {
          console.log(
            `   ✅ Strict inclusion match: "${dbName}" includes "${rawAliasedQuery}"`,
          );
          return true;
        }

        return false;
      });

      if (matchedSub) {
        targetId = matchedSub.id;
        console.log(`✅ [ACCORDION] MATCH FOUND! Opening ID: ${targetId}`);
      } else {
        console.warn(
          `❌ [ACCORDION] NO MATCH FOUND for query: "${subQuery}". Defaulting to NO accordion open.`,
        );
      }
    }

    // Fallback: ONLY open the first item if there was NO query provided at all
    if (!targetId && !subQuery) {
      targetId = service.subcategories[0].id;
      console.log(
        `⚠️ [ACCORDION] No query provided. Opening first item ID: ${targetId}`,
      );
    }

    setActiveSubcategoryId(targetId);

    // Scroll ONLY if we actually found a match
    if (targetId) {
      const scrollTimer = setTimeout(() => {
        const element = accordionRefs.current[targetId];
        if (element) {
          console.log(`📜 [ACCORDION] Scrolling to element ID: ${targetId}`);
          const yOffset = -120;
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 600);

      return () => clearTimeout(scrollTimer);
    }
  }, [service, subQuery]);

  useEffect(() => {
    if (!slug) return;

    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/category/${slug}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch service details: ${response.status}`,
          );
        }

        const result = await response.json();

        if (!result || !result.id || !result.name) {
          throw new Error("Invalid response format from API");
        }

        const categoryData = result;

        const imagePath = categoryData.image || null;
        let fullImageUrl = FALLBACK_IMAGE;
        if (imagePath) {
          try {
            fullImageUrl = getImageUrl(imagePath);
          } catch (err) {
            fullImageUrl = FALLBACK_IMAGE;
          }
        }

        let bannerUrl = FALLBACK_IMAGE;
        if (categoryData.banner) {
          try {
            bannerUrl = getImageUrl(categoryData.banner);
          } catch (err) {
            bannerUrl = FALLBACK_IMAGE;
          }
        }

        const processedSubcategories = (categoryData.subcategories || []).map(
          (sub) => {
            let subImageUrl = null;
            if (sub.image) {
              try {
                subImageUrl = getImageUrl(sub.image);
              } catch (err) {
                console.error("Error loading subcategory image:", err);
              }
            }

            const processedItems = (sub.items || []).map((item) => {
              let servicesList = [];
              if (item.itemServices) {
                if (Array.isArray(item.itemServices)) {
                  servicesList = item.itemServices;
                } else if (typeof item.itemServices === "string") {
                  try {
                    const parsed = JSON.parse(item.itemServices);
                    servicesList = Array.isArray(parsed)
                      ? parsed
                      : [item.itemServices];
                  } catch {
                    servicesList = item.itemServices
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                  }
                }
              }

              let itemImageUrl = null;
              if (item.image) {
                try {
                  itemImageUrl = getImageUrl(item.image);
                } catch (err) {
                  console.error("Error loading item image:", err);
                }
              }

              return {
                ...item,
                imageUrl: itemImageUrl,
                hasImage: !!itemImageUrl,
                servicesList: servicesList,
              };
            });

            return {
              ...sub,
              imageUrl: subImageUrl,
              hasImage: !!subImageUrl,
              items: processedItems,
              itemCount: processedItems.length,
            };
          },
        );

        const transformedService = {
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          fullDescription:
            categoryData.full_description || categoryData.description,
          image: fullImageUrl,
          imageAlt: categoryData.image_alt || categoryData.name,
          banner: bannerUrl,
          bannerAlt: categoryData.banner_alt || categoryData.name,
          subcategories: processedSubcategories,
          totalSubcategories: processedSubcategories.length,
          totalItems: processedSubcategories.reduce(
            (acc, sub) => acc + sub.items.length,
            0,
          ),
        };

        setService(transformedService);

        // Fetch related services
        try {
          const allCategoriesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories`,
          );

          if (allCategoriesResponse.ok) {
            const allCategoriesResult = await allCategoriesResponse.json();
            let categories = [];
            if (Array.isArray(allCategoriesResult)) {
              categories = allCategoriesResult;
            } else if (
              allCategoriesResult.success &&
              allCategoriesResult.data
            ) {
              categories = allCategoriesResult.data;
            } else if (
              allCategoriesResult.data &&
              Array.isArray(allCategoriesResult.data)
            ) {
              categories = allCategoriesResult.data;
            }

            if (categories.length > 0) {
              const related = categories
                .filter(
                  (cat) => cat.id !== categoryData.id && cat.slug !== slug,
                )
                .slice(0, 3)
                .map((cat) => {
                  const imgPath = cat.image || null;
                  let imgUrl = FALLBACK_IMAGE;
                  if (imgPath) {
                    try {
                      imgUrl = getImageUrl(imgPath);
                    } catch {
                      imgUrl = FALLBACK_IMAGE;
                    }
                  }
                  return {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    description:
                      cat.description || `Expert ${cat.name} services`,
                    image: imgUrl,
                  };
                });
              setRelatedServices(related);
            }
          }
        } catch (relatedErr) {
          console.error("Error fetching related services:", relatedErr);
        }
      } catch (err) {
        console.error("Error fetching service detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [slug]);

  const handleAccordionToggle = (id) => {
    if (activeSubcategoryId === id) {
      // If it's already open, close it immediately
      setActiveSubcategoryId(null);
      setExpandingId(null);
    } else {
      // 1. Start the "grow" phase
      setExpandingId(id);

      // 2. Wait for it to grow (250ms), then open the accordion
      setTimeout(() => {
        setActiveSubcategoryId(id);
        setExpandingId(null); // Reset the grow phase
      }, 250);
    }
  };

  // Toggle flip state for a card
  const toggleFlip = (cardId, isFlipped) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: isFlipped,
    }));
  };

  // Handle mouse enter on card
  const handleCardMouseEnter = (cardId) => {
    // Clear any pending timeout
    if (timeoutRefs.current[cardId]) {
      clearTimeout(timeoutRefs.current[cardId]);
      delete timeoutRefs.current[cardId];
    }
    toggleFlip(cardId, true);
  };

  // Handle mouse leave on card
  const handleCardMouseLeave = (cardId) => {
    // Check if we're scrolling
    const container = containerRefs.current[cardId];
    if (container && container.dataset.isScrolling === "true") {
      return;
    }

    // Delay flipping back to prevent accidental flips
    timeoutRefs.current[cardId] = setTimeout(() => {
      toggleFlip(cardId, false);
      delete timeoutRefs.current[cardId];
    }, 200);
  };

  // Handle scroll start
  const handleScrollStart = (cardId) => {
    const container = containerRefs.current[cardId];
    if (container) {
      container.dataset.isScrolling = "true";
    }
    // Ensure card stays flipped during scroll
    toggleFlip(cardId, true);

    // Clear any existing scroll timeout
    if (scrollTimeoutRefs.current[cardId]) {
      clearTimeout(scrollTimeoutRefs.current[cardId]);
      delete scrollTimeoutRefs.current[cardId];
    }
  };

  // Handle scroll end
  const handleScrollEnd = (cardId) => {
    const container = containerRefs.current[cardId];
    if (container) {
      if (scrollTimeoutRefs.current[cardId]) {
        clearTimeout(scrollTimeoutRefs.current[cardId]);
      }
      scrollTimeoutRefs.current[cardId] = setTimeout(() => {
        if (container) {
          container.dataset.isScrolling = "false";
        }
        delete scrollTimeoutRefs.current[cardId];
      }, 300);
    }
  };

  // Handle wheel scroll event with boundary detection
  const handleWheelScroll = (e, cardId) => {
    const element = e.currentTarget;
    const delta = e.deltaY;

    // Get scroll boundaries
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    // Check if we're at the boundaries
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop >= maxScroll - 1;

    // If at top and scrolling up, or at bottom and scrolling down, let the event pass through
    if ((isAtTop && delta < 0) || (isAtBottom && delta > 0)) {
      // Allow the wheel event to pass through to the parent
      return;
    }

    // Otherwise, prevent default and handle the scroll
    e.preventDefault();
    e.stopPropagation();

    // Scroll the element
    element.scrollTop += delta;

    // Update scroll state
    const container = containerRefs.current[cardId];
    if (container) {
      container.dataset.isScrolling = "true";
      toggleFlip(cardId, true);

      // Clear existing timeout
      if (scrollTimeoutRefs.current[cardId]) {
        clearTimeout(scrollTimeoutRefs.current[cardId]);
      }

      // Set timeout to mark scrolling as ended
      scrollTimeoutRefs.current[cardId] = setTimeout(() => {
        if (container) {
          container.dataset.isScrolling = "false";
        }
        delete scrollTimeoutRefs.current[cardId];
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="container">
          <div className="skeleton-wrapper">
            <div className="skeleton-hero"></div>
            <div className="skeleton-grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if (error || !service) {
  //   return (
  //     <div className="service-detail-error">
  //       <div className="container">
  //         <div className="error-box">
  //           <div className="error-icon">🔍</div>
  //           <h2>Service Not Found</h2>
  //           <p>{error || "The service you're looking for doesn't exist."}</p>
  //           <Link href="/our-services" className="back-btn">
  //             <span>←</span> Back to Services
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <ApiError
        title="Service Information Temporarily Unavailable"
        message="Our service information is temporarily unavailable. Please try again shortly."
        onRetry={() => window.location.reload()}
        statusCode={error.status ? `ERR · ${error.status}` : "ERR · TIMEOUT"}
        statusTone={error.status >= 500 ? "danger" : "warning"}
        backToHome={() => window.open("/", "_self")}
      />
    );
  } else if (!service) {
    return (
      <ApiError
        title="Service Not Found"
        message="The service you're looking for doesn't exist or has been removed."
        onRetry={() => window.location.reload()}
        statusCode="ERR · NOT FOUND"
        statusTone="info"
        backToHome={() => window.open("/", "_self")}
      />
    );
  }

  return (
    <>
      {/* Modern Hero with Split Layout */}
      <section className="hero-modern">
        <div
          className="hero-modern-bg"
          style={{ backgroundImage: `url(${service.banner})` }}
        ></div>
        <div className="container">
          <div className="hero-modern-content">
            {/* LEFT: back link + title + description */}
            <div className="hero-modern-left">
              <Link href="/our-services" className="hero-back-link">
                ← Back to Services
              </Link>
              <h1 className="hero-title">{service.name}</h1>
              <p className="hero-desc">{service.description}</p>
            </div>

            {/* RIGHT: AMC-only CTA button */}
            {slug === "amc" && (
              <div className="hero-modern-right">
                <Link
                  href="https://amc.liaisonbank.com"
                  className="hero-amc-btn"
                >
                  Get AMC Quote
                  <span className="hero-amc-btn-arrow">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subcategories as Flip Cards */}
      {/* Subcategories as Dark Accordion */}
      <section className="services-accordion-section">
        <div className="container">
          <div className="services-header">
            <span className="services-badge">Services</span>
            <h2 className="services-title">Explore {service.name} Services</h2>
          </div>

          <div className="accordion-list">
            {service.subcategories.map((subcategory, index) => {
              const isActive = activeSubcategoryId === subcategory.id;

              return (
                <motion.div
                  key={subcategory.id}
                  layout // Animates the overall height of the accordion
                  initial={false}
                  ref={(el) => (accordionRefs.current[subcategory.id] = el)}
                  className={`accordion-item ${isActive ? "is-active" : ""}`}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* The Flex Container */}
                  <div
                    className="accordion-header"
                    onClick={() =>
                      setActiveSubcategoryId(isActive ? null : subcategory.id)
                    }
                  >
                    {/* 1. Image (Stays on the left, grows in place) */}
                    <motion.div
                      layout
                      className="acc-image-wrap"
                      animate={{
                        width: isActive ? 380 : 64,
                        height: isActive ? 380 : 64,
                        // borderRadius: isActive ? 12 : 8
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                    >
                      {subcategory.hasImage ? (
                        <Image
                          src={subcategory.imageUrl}
                          alt={subcategory.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="acc-thumb-placeholder" />
                      )}
                    </motion.div>

                    {/* 2. Text Content (Pushed to the right) */}
                    <motion.div layout className="acc-text-wrap">
                      {/* Title Row */}
                      <motion.div layout="position" className="acc-title-row">
                        <h3 className="acc-title">{subcategory.name}</h3>
                        <button
                          className="acc-toggle"
                          aria-label="Toggle section"
                        >
                          {isActive ? "−" : "+"}
                        </button>
                      </motion.div>

                      {/* Text that fades in after the image grows */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.4 }}
                          className="acc-body"
                        >
                          <p className="acc-desc">
                            {subcategory.description ||
                              `Comprehensive ${subcategory.name} services designed for your business needs.`}
                          </p>

                          {/* CONDITION: Check if items exist */}
                          {subcategory.items && subcategory.items.length > 0 ? (
                            <div className="acc-features">
                              <h4>Features:</h4>
                              <ul>
                                {subcategory.items.map((item) => (
                                  <li key={item.id}>
                                    <Link
                                      href={`/our-services/${slug}/${item.slug}`}
                                      className={`feature-link ${loadingItemId === item.id ? "is-loading" : ""}`}
                                      onClick={(e) => {
                                        if (
                                          e.defaultPrevented ||
                                          e.button !== 0 ||
                                          e.metaKey ||
                                          e.ctrlKey ||
                                          e.shiftKey ||
                                          e.altKey ||
                                          e.stopPropagation()
                                        )
                                          return;
                                        e.preventDefault();
                                        if (loadingItemId !== null) return;

                                        setLoadingItemId(item.id);
                                        const destination = `/our-services/${slug}/${item.slug}`;

                                        window.setTimeout(() => {
                                          router.push(destination);
                                        }, 120);
                                      }}
                                    >
                                      <span className="feature-text">
                                        {item.name}
                                      </span>
                                      {loadingItemId === item.id && (
                                        <span className="acc-spinner" />
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            // FALLBACK UI WHEN NO ITEMS EXIST
                            <div className="acc-no-items">
                              {/* <p>
                                Detailed service items are currently being
                                updated for this category.
                              </p> */}
                              <Link
                                // Using subcategory.slug if it exists, otherwise fallback to id
                                href={`/our-services/${slug}/${subcategory.slug}`}
                                className="explore-more-btn"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Discover More
                                <span>→</span>
                              </Link>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Services with Modern Cards */}
      {relatedServices.length > 0 && (
        <section className="related-modern">
          <div className="container">
            <div className="related-header">
              <span className="related-badge">Related</span>
              <h2 className="related-title">Other Services</h2>
              <p className="related-subtitle">
                Discover more solutions from our expertise
              </p>
            </div>
            <div className="related-modern-grid">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/our-services/${related.slug}`}
                  className="related-modern-card"
                >
                  <div className="related-modern-image">
                    <Image
                      src={related.image || FALLBACK_IMAGE}
                      alt={related.name || "Related service"}
                      width={400}
                      height={300}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="related-image"
                    />
                  </div>
                  <div className="related-modern-info">
                    <h3>{related.name}</h3>
                    <p>{related.description}</p>
                    <span className="related-modern-link">Explore →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
