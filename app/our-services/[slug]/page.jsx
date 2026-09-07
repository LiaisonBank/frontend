// app/our-services/[slug]/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./service-detail.scss";
import { getImageUrl } from "../../../lib/utils/getImagehelper";

// Fallback image
const FALLBACK_IMAGE = '/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png';

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  
  // Track flip state for each card
  const [flippedCards, setFlippedCards] = useState({});
  
  // Refs for timeout handling
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

  // Toggle flip state for a card
  const toggleFlip = (cardId, isFlipped) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: isFlipped
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
    if (container && container.dataset.isScrolling === 'true') {
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
      container.dataset.isScrolling = 'true';
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
          container.dataset.isScrolling = 'false';
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
      container.dataset.isScrolling = 'true';
      toggleFlip(cardId, true);
      
      // Clear existing timeout
      if (scrollTimeoutRefs.current[cardId]) {
        clearTimeout(scrollTimeoutRefs.current[cardId]);
      }
      
      // Set timeout to mark scrolling as ended
      scrollTimeoutRefs.current[cardId] = setTimeout(() => {
        if (container) {
          container.dataset.isScrolling = 'false';
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

  if (error || !service) {
    return (
      <div className="service-detail-error">
        <div className="container">
          <div className="error-box">
            <div className="error-icon">🔍</div>
            <h2>Service Not Found</h2>
            <p>{error || "The service you're looking for doesn't exist."}</p>
            <Link href="/our-services" className="back-btn">
              <span>←</span> Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Hero with Split Layout */}
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

      {/* Subcategories as Flip Cards - 2 columns */}
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
                <div 
                  key={subcategory.id} 
                  className={`subcategory-flip-container ${isFlipped ? 'flipped' : ''}`}
                  ref={(el) => {
                    if (el) {
                      containerRefs.current[cardId] = el;
                    }
                  }}
                  onMouseEnter={() => handleCardMouseEnter(cardId)}
                  onMouseLeave={() => handleCardMouseLeave(cardId)}
                >
                  <div className="subcategory-flip-card">
                    {/* FRONT - Image with name overlay at top */}
                    <div className="subcategory-flip-front">
                      {subcategory.hasImage && subcategory.imageUrl ? (
                        <img
                          src={subcategory.imageUrl}
                          alt={subcategory.name}
                          className="subcategory-flip-image"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = 'none';
                            const placeholder = e.currentTarget.parentElement.querySelector('.subcategory-no-image');
                            if (placeholder) {
                              placeholder.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <div className="subcategory-no-image">
                          <h3 className="subcategory-name-only">{subcategory.name}</h3>
                        </div>
                      )}
                      
                      {/* Name at TOP */}
                      <div className="subcategory-name-overlay-top">
                        <h3 className="subcategory-flip-name">{subcategory.name}</h3>
                      </div>

                    </div>

                    {/* BACK - Items list with scroll functionality */}
                    <div className="subcategory-flip-back">
                      <div className="flip-back-header">
                        <span className="flip-back-badge">Available Services</span>
                        <h4 className="flip-back-title">{subcategory.name}</h4>
                      </div>

                      <div 
                        className="flip-back-items-list"
                        ref={(el) => {
                          if (el) {
                            listRefs.current[cardId] = el;
                          }
                        }}
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
                              {/* Item name as header */}
                              <div className="back-item-header">
                                <span className="back-item-number">{String(idx + 1).padStart(2, '0')}</span>
                                <p className="back-item-name">{item.name}</p>
                              </div>
                              
                              {/* Item Services list - displayed as a vertical list */}
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
                        ) : (
                          <p className="no-services-message">
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
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
    </>
  );
}