// app/our-services/[slug]/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./service-detail.scss";
import { getImageUrl } from "../../../lib/utils/getImagehelper";

// Constants
const FALLBACK_IMAGE = "/images/fallback-service.jpg";

// Helper: Process item services
const processItemServices = (itemServices) => {
  if (!itemServices) return [];
  if (Array.isArray(itemServices)) return itemServices;
  if (typeof itemServices === "string") {
    try {
      const parsed = JSON.parse(itemServices);
      return Array.isArray(parsed) ? parsed : [itemServices];
    } catch {
      return itemServices.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

// Helper: Get image URL with fallback
const getImageWithFallback = (path, fallback = FALLBACK_IMAGE) => {
  if (!path) return fallback;
  try {
    return getImageUrl(path);
  } catch {
    return fallback;
  }
};

// Helper: Process subcategories
const processSubcategories = (subcategories = []) => {
  return subcategories.map((sub) => {
    const subImageUrl = getImageWithFallback(sub.image, null);

    const processedItems = (sub.items || []).map((item) => ({
      ...item,
      imageUrl: getImageWithFallback(item.image, null),
      itemServices: processItemServices(item.itemServices),
    }));

    return {
      ...sub,
      imageUrl: subImageUrl,
      items: processedItems,
      itemCount: processedItems.length,
      hasImage: !!subImageUrl,
    };
  });
};

// Helper: Fetch related services
const fetchRelatedServices = async (currentCategoryId, currentSlug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories`
    );

    if (!response.ok) return [];

    const result = await response.json();
    let categories = [];

    if (Array.isArray(result)) {
      categories = result;
    } else if (result.success && result.data) {
      categories = result.data;
    } else if (result.data && Array.isArray(result.data)) {
      categories = result.data;
    }

    return categories
      .filter((cat) => cat.id !== currentCategoryId && cat.slug !== currentSlug)
      .slice(0, 3)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || `Expert ${cat.name} services`,
        image: getImageWithFallback(cat.image),
      }));
  } catch (error) {
    console.error("Error fetching related services:", error);
    return [];
  }
};

// Custom hook for flip card logic
const useFlipCard = () => {
  const [flippedCards, setFlippedCards] = useState({});
  const timeoutRefs = useRef({});
  const scrollTimeoutRefs = useRef({});
  const containerRefs = useRef({});

  const toggleFlip = (cardId, isFlipped) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: isFlipped,
    }));
  };

  const handleCardMouseEnter = (cardId) => {
    if (timeoutRefs.current[cardId]) {
      clearTimeout(timeoutRefs.current[cardId]);
      delete timeoutRefs.current[cardId];
    }
    toggleFlip(cardId, true);
  };

  const handleCardMouseLeave = (cardId) => {
    const container = containerRefs.current[cardId];
    if (container && container.dataset.isScrolling === "true") return;

    timeoutRefs.current[cardId] = setTimeout(() => {
      toggleFlip(cardId, false);
      delete timeoutRefs.current[cardId];
    }, 200);
  };

  const handleScrollStart = (cardId) => {
    const container = containerRefs.current[cardId];
    if (container) {
      container.dataset.isScrolling = "true";
    }
    toggleFlip(cardId, true);

    if (scrollTimeoutRefs.current[cardId]) {
      clearTimeout(scrollTimeoutRefs.current[cardId]);
      delete scrollTimeoutRefs.current[cardId];
    }
  };

  const handleScrollEnd = (cardId) => {
    const container = containerRefs.current[cardId];
    if (!container) return;

    if (scrollTimeoutRefs.current[cardId]) {
      clearTimeout(scrollTimeoutRefs.current[cardId]);
    }

    scrollTimeoutRefs.current[cardId] = setTimeout(() => {
      if (container) {
        container.dataset.isScrolling = "false";
      }
      delete scrollTimeoutRefs.current[cardId];
    }, 300);
  };

  const handleWheelScroll = (e, cardId) => {
    const element = e.currentTarget;
    const delta = e.deltaY;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop >= maxScroll - 1;

    if ((isAtTop && delta < 0) || (isAtBottom && delta > 0)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    element.scrollTop += delta;

    const container = containerRefs.current[cardId];
    if (container) {
      container.dataset.isScrolling = "true";
      toggleFlip(cardId, true);

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

  return {
    flippedCards,
    containerRefs,
    handleCardMouseEnter,
    handleCardMouseLeave,
    handleScrollStart,
    handleScrollEnd,
    handleWheelScroll,
  };
};

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  const {
    flippedCards,
    containerRefs,
    handleCardMouseEnter,
    handleCardMouseLeave,
    handleScrollStart,
    handleScrollEnd,
    handleWheelScroll,
  } = useFlipCard();

  useEffect(() => {
    if (!slug) return;

    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/category/${slug}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch service details: ${response.status}`);
        }

        const result = await response.json();

        if (!result?.id || !result?.name) {
          throw new Error("Invalid response format from API");
        }

        const categoryData = result;

        const transformedService = {
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          fullDescription: categoryData.full_description || categoryData.description,
          image: getImageWithFallback(categoryData.image),
          imageAlt: categoryData.image_alt || categoryData.name,
          banner: getImageWithFallback(categoryData.banner),
          bannerAlt: categoryData.banner_alt || categoryData.name,
          subcategories: processSubcategories(categoryData.subcategories),
          totalSubcategories: categoryData.subcategories?.length || 0,
          totalItems: categoryData.subcategories?.reduce(
            (acc, sub) => acc + (sub.items?.length || 0),
            0
          ) || 0,
        };

        setService(transformedService);

        // Fetch related services
        const related = await fetchRelatedServices(categoryData.id, slug);
        setRelatedServices(related);
      } catch (err) {
        console.error("Error fetching service detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="container">
          <div className="skeleton-wrapper">
            <div className="skeleton-hero" />
            <div className="skeleton-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="service-detail-error">
        <div className="container">
          <div className="error-box">
            <div className="error-icon">🔍</div>
            <h2>Service Not Found</h2>
            <p>{error || "The service you're looking for doesn't exist."}</p>
            <Link href="/our-services" className="back-btn">
              ← Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-modern">
        <div
          className="hero-modern-bg"
          style={{ backgroundImage: `url(${service.banner})` }}
        />
        <div className="container">
          <div className="hero-modern-content">
            <div className="hero-modern-left">
              <Link href="/our-services" className="hero-back-link">
                ← Back to Services
              </Link>
              <h1 className="hero-title">{service.name}</h1>
              <p className="hero-desc">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-wrapper">
            <div className="about-image-wrap">
              <Image
                src={service.image}
                alt={service.imageAlt || service.name}
                className="about-image"
                width={800}
                height={500}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="about-image-overlay">
                <span className="about-badge">About</span>
                <h2 className="about-title">{service.name}</h2>
              </div>
            </div>
            <div className="about-text">
              {service.fullDescription &&
                service.fullDescription.split("\r\n\r\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      <section className="services-modern">
        <div className="container">
          <div className="services-header">
            <h2 className="services-title">Explore {service.name} Services</h2>
          </div>

          <div className="subcategory-flip-grid">
            {service.subcategories.map((subcategory, index) => {
              const cardId = `card-${subcategory.id || index}`;
              const isFlipped = flippedCards[cardId] || false;

              return (
                <div key={cardId} className="subcategory-flip-container">
                  <div
                    className={`subcategory-flip-card ${isFlipped ? "flipped" : ""}`}
                    onMouseEnter={() => handleCardMouseEnter(cardId)}
                    onMouseLeave={() => handleCardMouseLeave(cardId)}
                  >
                    {/* Front Side */}
                    <div className="subcategory-flip-front">
                      {subcategory.hasImage && subcategory.imageUrl ? (
                        <Image
                          src={subcategory.imageUrl}
                          alt={subcategory.name}
                          className="subcategory-flip-image"
                          width={400}
                          height={300}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                            const placeholder = e.currentTarget.parentElement?.querySelector(
                              ".subcategory-no-image"
                            );
                            if (placeholder) {
                              placeholder.style.display = "flex";
                            }
                          }}
                        />
                      ) : (
                        <div className="subcategory-no-image">
                          <h3 className="subcategory-name-only">{subcategory.name}</h3>
                        </div>
                      )}

                      <div className="subcategory-name-overlay-top">
                        <h3 className="subcategory-flip-name">{subcategory.name}</h3>
                        <span className="subcategory-item-count">
                          {subcategory.itemCount} services
                        </span>
                      </div>

                      <div className="subcategory-hover-hint">Hover to view services →</div>
                    </div>

                    {/* Back Side */}
                    <div className="subcategory-flip-back">
                      {subcategory.hasImage && subcategory.imageUrl && (
                        <div className="subcategory-image-wrap">
                          <Image
                            src={subcategory.imageUrl}
                            alt={subcategory.name}
                            className="subcategory-image"
                            width={400}
                            height={300}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {subcategory.description && (
                        <p className="subcategory-desc">{subcategory.description}</p>
                      )}

                      {subcategory.items?.length > 0 && (
                        <div
                          className="items-modern-grid"
                          ref={(el) => {
                            if (el) containerRefs.current[cardId] = el;
                          }}
                          onScroll={() => handleScrollStart(cardId)}
                          onScrollEnd={() => handleScrollEnd(cardId)}
                          onWheel={(e) => handleWheelScroll(e, cardId)}
                        >
                          {subcategory.items.map((item, idx) => (
                            <Link
                              key={item.id}
                              href={`/our-services/${service.slug}/${item.slug}`}
                              className="item-modern-link"
                            >
                              <div className="item-modern-card">
                                <div className="item-modern-number">
                                  {String(idx + 1).padStart(2, "0")}
                                </div>
                                <div className="item-modern-content">
                                  <h4 className="item-modern-name">{item.name}</h4>
                                  {item.description && (
                                    <p className="item-modern-desc">{item.description}</p>
                                  )}
                                  {item.imageUrl && (
                                    <div className="item-modern-image">
                                      <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = FALLBACK_IMAGE;
                                        }}
                                      />
                                    </div>
                                  )}
                                  {item.itemServices?.length > 0 && (
                                    <div className="item-modern-tags">
                                      {item.itemServices.map((tag, idx) => (
                                        <span key={idx} className="item-modern-tag">
                                          {tag.replace(/-/g, " ")}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="related-modern">
          <div className="container">
            <div className="related-header">
              <span className="related-badge">Related</span>
              <h2 className="related-title">Other Services</h2>
              <p className="related-subtitle">Discover more solutions from our expertise</p>
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
                      src={related.image}
                      alt={related.name}
                      width={400}
                      height={250}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
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