// app/our-services/[slug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./service-detail.scss";
import { getImageUrl } from "../../../lib/utils/getImagehelper";

// Fallback image
const FALLBACK_IMAGE = '/images/fallback-service.jpg';

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

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
            } catch (err) {}
          }

          const processedItems = (sub.items || []).map((item) => {
            let itemImageUrl = null;
            if (item.image) {
              try {
                itemImageUrl = getImageUrl(item.image);
              } catch (err) {}
            }
            return {
              ...item,
              imageUrl: itemImageUrl,
            };
          });

          return {
            ...sub,
            imageUrl: subImageUrl,
            items: processedItems,
            itemCount: processedItems.length,
            hasImage: !!subImageUrl,
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

      {/* About Section - Full width image with text overlay */}
      <section className="about-section">
        <div className="container">
          <div className="about-wrapper">
            <div className="about-image-wrap">
              <img
                src={service.image}
                alt={service.imageAlt || service.name}
                className="about-image"
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
              {service.fullDescription && service.fullDescription.split('\r\n\r\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories with Modern Accordion Style */}
      <section className="services-modern">
        <div className="container">
          <div className="services-header">
            <h2 className="services-title">Explore {service.name} Services</h2>
          </div>

          {service.subcategories.map((subcategory, index) => (
            <div key={subcategory.id} className="subcategory-modern">
              <div className="subcategory-header">
                <div className="subcategory-number">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="subcategory-name">{subcategory.name}</h3>
                <span className="subcategory-count">{subcategory.itemCount} items</span>
              </div>

              {subcategory.hasImage && subcategory.imageUrl && (
                <div className="subcategory-image-wrap">
                  <img
                    src={subcategory.imageUrl}
                    alt={subcategory.name}
                    className="subcategory-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {subcategory.description && (
                <p className="subcategory-desc">{subcategory.description}</p>
              )}

             {subcategory.items && subcategory.items.length > 0 && (
  <div className="items-modern-grid">
    {subcategory.items.map((item, idx) => (
      <Link 
        key={item.id} 
        href={`/our-services/${service.slug}/${item.slug}`}
        className="item-modern-link"
      >
        <div className="item-modern-card">
          <div className="item-modern-number">{String(idx + 1).padStart(2, '0')}</div>
          <div className="item-modern-content">
            <h4 className="item-modern-name">{item.name}</h4>
            {item.description && <p className="item-modern-desc">{item.description}</p>}
            {item.imageUrl && (
              <div className="item-modern-image">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
            )}
            {item.itemServices && item.itemServices.length > 0 && (
              <div className="item-modern-tags">
                {item.itemServices.map((tag, idx) => (
                  <span key={idx} className="item-modern-tag">
                    {tag.replace(/-/g, ' ')}
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
          ))}
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

      {/* <section className="cta-modern">
        <div className="container">
          <div className="cta-modern-box">
            <div className="cta-modern-content">
              <h2>Let's Work Together</h2>
              <p>Get professional {service.name} solutions tailored to your needs</p>
              <div className="cta-modern-buttons">
                <Link href="/contact" className="cta-modern-primary">Start a Project</Link>
                <Link href="/our-services" className="cta-modern-secondary">All Services</Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}