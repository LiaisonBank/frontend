// app/our-services/[slug]/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./service-detail.scss";
import Image from "next/image";
import { getImageUrl } from "../../../lib/utils/getImagehelper";
import ApiError from "@/components/ApiError/ApiError";

const FALLBACK_IMAGE = '/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png';

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  // Flip card state
  const [flippedCards, setFlippedCards] = useState({});

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Refs
  const timeoutRefs = useRef({});
  const containerRefs = useRef({});
  const scrollTimeoutRefs = useRef({});
  const listRefs = useRef({});

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

        const processedSubcategories = (categoryData.subcategories || []).map((sub) => {
          let subImageUrl = null;
          if (sub.image) {
            try {
              subImageUrl = getImageUrl(sub.image);
            } catch (err) {
              console.error('Error loading subcategory image:', err);
            }
          }

          const processedItems = (sub.items || []).map((item) => {
            let servicesList = [];
            if (item.itemServices) {
              if (Array.isArray(item.itemServices)) {
                servicesList = item.itemServices;
              } else if (typeof item.itemServices === 'string') {
                try {
                  const parsed = JSON.parse(item.itemServices);
                  servicesList = Array.isArray(parsed) ? parsed : [item.itemServices];
                } catch {
                  servicesList = item.itemServices.split(',').map(s => s.trim()).filter(s => s);
                }
              }
            }

            let itemImageUrl = null;
            if (item.image) {
              try {
                itemImageUrl = getImageUrl(item.image);
              } catch (err) {
                console.error('Error loading item image:', err);
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
        });

        // ============================================
        // NORMALIZE FAQS from multiple possible keys
        // ============================================
        let rawFaqs = [];

        const possibleFaqSources = [
          categoryData.faq,
          categoryData.faqs,
          categoryData.FAQ,
          categoryData.FAQs,
        ];

        for (const source of possibleFaqSources) {
          if (Array.isArray(source) && source.length > 0) {
            rawFaqs = source;
            break;
          }
          if (typeof source === 'string' && source.trim()) {
            try {
              const parsed = JSON.parse(source);
              if (Array.isArray(parsed) && parsed.length > 0) {
                rawFaqs = parsed;
                break;
              }
            } catch {
              // ignore
            }
          }
        }

        const processedFaqs = rawFaqs
          .map((f) => {
            const question = (f?.question || f?.q || f?.title || "").trim();
            const answer = (f?.answer || f?.a || f?.content || f?.description || "")
              .replace(/\\"/g, '"')
              .trim();
            return { question, answer };
          })
          .filter((f) => f.question && f.answer);

        console.log('[FAQ] Raw from API:', rawFaqs);
        console.log('[FAQ] Processed:', processedFaqs);

        const transformedService = {
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          fullDescription: categoryData.full_description || categoryData.description,
          image: fullImageUrl,
          imageAlt: categoryData.image_alt || categoryData.name,
          banner: bannerUrl,
          bannerAlt: categoryData.banner_alt || categoryData.name,
          subcategories: processedSubcategories,
          totalSubcategories: processedSubcategories.length,
          totalItems: processedSubcategories.reduce((acc, sub) => acc + sub.items.length, 0),
          faqs: processedFaqs,
        };

        setService(transformedService);

        // Fetch related services
        try {
          const allCategoriesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories`
          );

          if (allCategoriesResponse.ok) {
            const allCategoriesResult = await allCategoriesResponse.json();
            let categories = [];
            if (Array.isArray(allCategoriesResult)) {
              categories = allCategoriesResult;
            } else if (allCategoriesResult.success && allCategoriesResult.data) {
              categories = allCategoriesResult.data;
            } else if (allCategoriesResult.data && Array.isArray(allCategoriesResult.data)) {
              categories = allCategoriesResult.data;
            }

            if (categories.length > 0) {
              const related = categories
                .filter((cat) => cat.id !== categoryData.id && cat.slug !== slug)
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
                    description: cat.description || `Expert ${cat.name} services`,
                    image: imgUrl,
                  };
                });
              setRelatedServices(related);
            }
          }
        } catch (relatedErr) {
          console.error('Error fetching related services:', relatedErr);
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

  // ============================================
  // Flip card handlers
  // ============================================
  const toggleFlip = (cardId, isFlipped) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: isFlipped }));
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
    if (container && container.dataset.isScrolling === 'true') return;

    timeoutRefs.current[cardId] = setTimeout(() => {
      toggleFlip(cardId, false);
      delete timeoutRefs.current[cardId];
    }, 200);
  };

  const handleScrollStart = (cardId) => {
    const container = containerRefs.current[cardId];
    if (container) container.dataset.isScrolling = 'true';
    toggleFlip(cardId, true);

    if (scrollTimeoutRefs.current[cardId]) {
      clearTimeout(scrollTimeoutRefs.current[cardId]);
      delete scrollTimeoutRefs.current[cardId];
    }
  };

  const handleScrollEnd = (cardId) => {
    const container = containerRefs.current[cardId];
    if (container) {
      if (scrollTimeoutRefs.current[cardId]) {
        clearTimeout(scrollTimeoutRefs.current[cardId]);
      }
      scrollTimeoutRefs.current[cardId] = setTimeout(() => {
        if (container) container.dataset.isScrolling = 'false';
        delete scrollTimeoutRefs.current[cardId];
      }, 300);
    }
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

    if ((isAtTop && delta < 0) || (isAtBottom && delta > 0)) return;

    e.preventDefault();
    e.stopPropagation();

    element.scrollTop += delta;

    const container = containerRefs.current[cardId];
    if (container) {
      container.dataset.isScrolling = 'true';
      toggleFlip(cardId, true);

      if (scrollTimeoutRefs.current[cardId]) {
        clearTimeout(scrollTimeoutRefs.current[cardId]);
      }

      scrollTimeoutRefs.current[cardId] = setTimeout(() => {
        if (container) container.dataset.isScrolling = 'false';
        delete scrollTimeoutRefs.current[cardId];
      }, 300);
    }
  };

  // ============================================
  // FAQ accordion handler
  // ============================================
  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
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
      {/* FAQ JSON-LD for SEO */}
      {service.faqs && service.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: service.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}

      {/* Modern Hero */}
      <section className="hero-modern">
        <div className="hero-modern-bg" style={{ backgroundImage: `url(${service.banner})` }}></div>
        <div className="container">
          <div className="hero-modern-content">
            <div className="hero-modern-left">
              <Link href="/our-services" className="hero-back-link">← Back to Services</Link>
              <h1 className="hero-title">{service.name}</h1>
              <p className="hero-desc">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories as Flip Cards */}
      <section className="services-modern">
        <div className="container">
          <div className="services-header">
            <span className="services-badge">Services</span>
            <h2 className="services-title">Explore {service.name} Services</h2>
          </div>

          <div className="subcategory-flip-grid">
            {service.subcategories.map((subcategory) => {
              const cardId = `card-${subcategory.id}`;
              const isFlipped = flippedCards[cardId] || false;

              return (
                <div key={subcategory.id} className="subcategory-flip-container">
                  <div
                    className={`subcategory-flip-card-wrapper ${isFlipped ? 'flipped' : ''}`}
                    ref={(el) => { if (el) containerRefs.current[cardId] = el; }}
                    onMouseEnter={() => handleCardMouseEnter(cardId)}
                    onMouseLeave={() => handleCardMouseLeave(cardId)}
                  >
                    <div className="subcategory-flip-card">
                      {/* FRONT */}
                      <div className="subcategory-flip-front">
                        <div className="subcategory-front-header">
                          <h3 className="subcategory-front-name">{subcategory.name}</h3>
                          <span className="subcategory-front-count">{subcategory.itemCount}</span>
                        </div>

                        <div className="subcategory-front-image-wrapper">
                          {subcategory.hasImage && subcategory.imageUrl ? (
                            <Image
                              src={subcategory.imageUrl}
                              alt={subcategory.name}
                              fill
                              unoptimized
                            />
                          ) : (
                            <div className="subcategory-no-image">
                              <h3 className="subcategory-name-only">{subcategory.name}</h3>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="subcategory-flip-back">
                        <div className="flip-back-header">
                          <div className="flip-back-title-wrapper">
                            <h4 className="flip-back-title">{subcategory.name}</h4>
                          </div>
                          <span className="flip-back-count">{subcategory.itemCount}</span>
                        </div>

                        <div
                          className="flip-back-items-list"
                          ref={(el) => { if (el) listRefs.current[cardId] = el; }}
                          onWheel={(e) => handleWheelScroll(e, cardId)}
                          onMouseDown={() => handleScrollStart(cardId)}
                          onMouseUp={() => handleScrollEnd(cardId)}
                          onMouseLeave={() => handleScrollEnd(cardId)}
                          onTouchStart={() => handleScrollStart(cardId)}
                          onTouchEnd={() => handleScrollEnd(cardId)}
                          onTouchCancel={() => handleScrollEnd(cardId)}
                        >
                          {subcategory.items && subcategory.items.length > 0 ? (
                            subcategory.items.map((item, idx) => (
                              <div key={item.id} className="back-item-wrapper">
                                <div className="back-item-header">
                                  <span className="back-item-number">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <Link href={`/our-services/${slug}/${item.slug}`}>
                                    <p className="back-item-name">{item.name}</p>
                                  </Link>
                                </div>

                                {item.servicesList && item.servicesList.length > 0 && (
                                  <ul className="back-item-services-list">
                                    {item.servicesList.map((serviceName, serviceIdx) => (
                                      <li key={serviceIdx} className="back-service-item">
                                        <span className="back-service-dot">•</span>
                                        <span className="back-service-name">{serviceName}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))
                          ) : null}
                        </div>
                      </div>
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
                <Link key={related.id} href={`/our-services/${related.slug}`} className="related-modern-card">
                  <div className="related-modern-image">
                    <img
                      src={related.image}
                      alt={related.name}
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

      {/* ============================================
          FAQ Section — Premium Two-Column
          ============================================ */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="faq-section">
          <div className="faq-bg-pattern" aria-hidden="true"></div>
          <div className="container">
            <div className="faq-header">
              <h2 className="faq-title">
                Frequently Asked <span className="faq-title-accent">Questions</span>
              </h2>
              <p className="faq-subtitle">
                Everything you need to know about {service.name} services
              </p>
            </div>

           {/* Split FAQs into two balanced columns */}
<div className="faq-columns">
  {(() => {
    const total = service.faqs.length;
    const mid = Math.ceil(total / 2);
    const columns = [
      service.faqs.slice(0, mid),
      service.faqs.slice(mid),
    ];

    return columns.map((columnFaqs, colIndex) => (
      <div className="faq-column" key={colIndex}>
        {columnFaqs.map((faq, idxInCol) => {
          const originalIndex = colIndex === 0 ? idxInCol : mid + idxInCol;
          const isOpen = openFaqIndex === originalIndex;
          return (
            <div
              key={originalIndex}
              className={`faq-item ${isOpen ? "open" : ""}`}
              style={{ '--faq-index': originalIndex }}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(originalIndex)}
                aria-expanded={isOpen}
              >
                {/* <span className="faq-number">
                  {String(originalIndex + 1).padStart(2, '0')}
                </span> */}
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <div className="faq-answer-wrapper">
                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  })()}
</div>
          </div>
        </section>
      )}
    </>
  );
}