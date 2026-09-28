// app/our-services/[slug]/[itemSlug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./item-detail.scss";
import { getImageUrl } from "../../../../lib/utils/getImagehelper";
import ApiError from "@/components/ApiError/ApiError";

export default function SubServiceDetail() {
  const params = useParams();
  const slug = params?.slug;
  const itemSlug = params?.itemSlug;

  const [item, setItem] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug || !itemSlug) return;

    const fetchItemDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const itemResponse = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/${itemSlug}`
        );

        if (!itemResponse.ok) {
          if (itemResponse.status === 404) {
            throw Object.assign(new Error("Item not found"), { status: 404 });
          }
          throw new Error(
            `Failed to fetch item details: ${itemResponse.status}`
          );
        }

        const itemData = await itemResponse.json();

        if (!itemData || !itemData.id) {
          throw new Error("Invalid response format from API");
        }

        let servicesList = [];
        if (itemData.itemServices) {
          if (Array.isArray(itemData.itemServices)) {
            servicesList = itemData.itemServices;
          } else if (typeof itemData.itemServices === "string") {
            try {
              const parsed = JSON.parse(itemData.itemServices);
              servicesList = Array.isArray(parsed)
                ? parsed
                : [itemData.itemServices];
            } catch {
              servicesList = itemData.itemServices
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
          }
        }

        let sections = [];
        if (Array.isArray(itemData.contentSections)) {
          sections = itemData.contentSections;
        } else if (typeof itemData.contentSections === "string") {
          try {
            const parsed = JSON.parse(itemData.contentSections);
            sections = Array.isArray(parsed) ? parsed : [];
          } catch {
            sections = [];
          }
        }

        setItem({
          id: itemData.id,
          name: itemData.name,
          slug: itemData.slug,
          description: itemData.description || "",
          fullDescription:
            itemData.full_description || itemData.description || "",
          servicesList,
          contentSections: sections,
          subCategoryId: itemData.subCategoryId,
          subCategoryName: itemData.subCategoryName,
        });

        try {
          const categoryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/category/${slug}`
          );

          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();

            setParentCategory({
              id: categoryData.id,
              name: categoryData.name,
              slug: categoryData.slug,
            });

            const subcategories = categoryData.subcategories || [];
            let siblings = [];

            subcategories.forEach((sub) => {
              const items = sub.items || [];
              items.forEach((sibling) => {
                if (sibling.slug !== itemSlug) {
                  let siblingServices = [];
                  if (sibling.itemServices) {
                    if (Array.isArray(sibling.itemServices)) {
                      siblingServices = sibling.itemServices;
                    } else if (typeof sibling.itemServices === "string") {
                      try {
                        const parsed = JSON.parse(sibling.itemServices);
                        siblingServices = Array.isArray(parsed)
                          ? parsed
                          : [];
                      } catch {
                        siblingServices = sibling.itemServices
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                      }
                    }
                  }

                  siblings.push({
                    id: sibling.id,
                    name: sibling.name,
                    slug: sibling.slug,
                    description: sibling.description || "",
                    subcategorySlug: sub.slug,
                    subcategoryName: sub.name,
                    servicesList: siblingServices,
                  });
                }
              });
            });

            setRelatedItems(siblings.slice(0, 3));
          }
        } catch (relatedErr) {
          console.error("Error fetching related items:", relatedErr);
        }
      } catch (err) {
        console.error("Error fetching item detail:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [slug, itemSlug]);

  if (loading) {
    return (
      <div className="item-loading">
        <div className="container">
          <div className="skeleton-hero" />
          <div className="skeleton-body">
            <div className="skeleton-line long" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.status === 404;
    return (
      <ApiError
        title={
          isNotFound ? "Service Not Found" : "Service Temporarily Unavailable"
        }
        message={
          isNotFound
            ? "The service you're looking for doesn't exist or has been removed."
            : "Our service information is temporarily unavailable. Please try again shortly."
        }
        onRetry={() => window.location.reload()}
        statusCode={
          isNotFound
            ? "ERR · NOT FOUND"
            : error.status
            ? `ERR · ${error.status}`
            : "ERR · TIMEOUT"
        }
        statusTone={
          isNotFound ? "info" : error.status >= 500 ? "danger" : "warning"
        }
        backToHome={() => window.open("/", "_self")}
      />
    );
  }

  if (!item) return null;

  return (
    <div className="item-page">
      {/* =================== Breadcrumb =================== */}
      <div className="item-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/our-services">Services</Link>
            <span className="sep">/</span>
            {parentCategory && (
              <>
                <Link href={`/our-services/${parentCategory.slug}`}>
                  {parentCategory.name}
                </Link>
                <span className="sep">/</span>
              </>
            )}
            {item.subCategoryName && (
              <>
                <span className="crumb-muted">{item.subCategoryName}</span>
                <span className="sep">/</span>
              </>
            )}
            <span className="crumb-current">{item.name}</span>
          </nav>
        </div>
      </div>

      {/* =================== Hero =================== */}
      <div className="item-hero">
        <div className="container">
          <div className="item-hero-main">
            {item.subCategoryName && (
              <span className="item-hero-tag">{item.subCategoryName}</span>
            )}
            <h1 className="item-hero-title">{item.name}</h1>
            {item.description && (
              <p className="item-hero-desc">{item.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* =================== Body — full width =================== */}
      <div className="item-body" id="details">
        <div className="container">
          <main className="item-main">
            {/* servicesList as full-width chip strip */}
            {item.servicesList.length > 0 && (
              <section className="services-strip">
                <h2 className="services-strip-title">What&apos;s included</h2>
                <ul className="services-chips">
                  {item.servicesList.map((service, i) => (
                    <li key={i} className="service-chip">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {item.fullDescription && (
              <section className="content-block">
                <h2 className="content-title">Overview</h2>
                <p className="content-text">{item.fullDescription}</p>
              </section>
            )}

            {item.contentSections.length > 0 ? (
              item.contentSections.map((section, i) => (
                <section className="content-block" key={i}>
                  <h2 className="content-title">{section.title}</h2>
                  <div className="content-rich">{section.content}</div>
                </section>
              ))
            ) : (
              !item.fullDescription && (
                <section className="content-block">
                  <h2 className="content-title">Overview</h2>
                  <p className="content-text">
                    No additional details available for this service.
                  </p>
                </section>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}