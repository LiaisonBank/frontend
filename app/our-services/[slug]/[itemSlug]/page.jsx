// app/our-services/[slug]/[itemSlug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./item-detail.scss";
import { getImageUrl } from "../../../../lib/utils/getImagehelper";

const FALLBACK_IMAGE = '/images/expertisebg.png';

export default function ItemDetail() {
  const params = useParams();
  const slug = params?.slug; // Category slug
  const itemSlug = params?.itemSlug; // Item slug from URL
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug || !itemSlug) return;

    const fetchItemDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch item directly by slug
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/${itemSlug}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch item: ${response.status}`);
        }

        const result = await response.json();

        // Handle different response structures
        let itemData;
        if (result.data) {
          itemData = result.data;
        } else if (result.success && result.data) {
          itemData = result.data;
        } else {
          itemData = result;
        }

        if (!itemData || !itemData.id) {
          throw new Error("Invalid item data format");
        }

        // Process item image
        let itemImageUrl = FALLBACK_IMAGE;
        if (itemData.image) {
          try {
            itemImageUrl = getImageUrl(itemData.image);
          } catch (err) {
            itemImageUrl = FALLBACK_IMAGE;
          }
        }

        const processedItem = {
          ...itemData,
          imageUrl: itemImageUrl,
          categorySlug: slug,
          categoryName: slug?.replace(/-/g, ' ') || 'Services',
        };

        setItem(processedItem);

      } catch (err) {
        console.error("Error fetching item detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [slug, itemSlug]);

  if (loading) {
    return (
      <div className="item-detail-loading">
        <div className="container">
          <div className="skeleton-wrapper">
            <div className="skeleton-hero"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-error">
        <div className="container">
          <div className="error-box">
            <div className="error-icon">🔍</div>
            <h2>Item Not Found</h2>
            <p>{error || "The service item you're looking for doesn't exist."}</p>
            <Link href={`/our-services/${slug}`} className="back-btn">
              <span>←</span> Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get subcategory name from the item data
  const subcategoryName = item.subCategoryName || 'Service';

  return (
    <>
      {/* Hero Section */}
      <section className="item-hero">
        <div 
          className="item-hero-bg" 
          style={{ 
            backgroundImage: `url(${item.imageUrl || FALLBACK_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container">
          <div className="item-hero-content">
            <Link href={`/our-services/${slug}`} className="item-back-link">
              ← Back to {item.categoryName || 'Services'}
            </Link>
            <span className="item-breadcrumb">
              {item.categoryName || 'Services'} / {subcategoryName} / {item.name}
            </span>
            <h1 className="item-title">{item.name}</h1>
            {item.description && (
              <p className="item-desc">{item.description}</p>
            )}
         
          </div>
        </div>
      </section>

      {/* Item Detail Section */}
      <section className="item-detail-section">
        <div className="container">
          <div className="item-detail-grid">
            {item.imageUrl && (
              <div className="item-image-wrap">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="item-main-image"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                {subcategoryName && (
                  <div className="item-badge">{subcategoryName}</div>
                )}
              </div>
            )}
            <div className="item-info-wrap">
              <h2>About {item.name}</h2>
              {item.full_description ? (
                item.full_description.split('\r\n\r\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{item.description || `Professional ${item.name} services tailored to your needs.`}</p>
              )}
              {item.itemServices && item.itemServices.length > 0 && (
                <div className="item-features">
                  <h3>Services Offered</h3>
                  <ul>
                    {item.itemServices.map((service, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span>
                        {service.replace(/-/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="item-cta">
                <Link href="/contact-us-liaison-bank" className="item-cta-primary">
                  Get a Quote
                </Link>
                <Link href={`/our-services/${slug}`} className="item-cta-secondary">
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}