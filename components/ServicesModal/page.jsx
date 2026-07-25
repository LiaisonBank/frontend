"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { ChevronRight, ChevronDown, FileText, X, List } from "lucide-react";
import Head from "next/head";
import "./ServicesModal.css";

export default function ServicesModal() {
  const router = useRouter();
  const { serviceModalOpen, setServiceModalOpen } = useModal();
  const modalRef = useRef(null);
  const leftPanelRef = useRef(null);
  const centerPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  // State for API data
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  
  // State for selected items
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedServices, setExpandedServices] = useState({});

  // ✅ FETCH DATA IMMEDIATELY when component mounts
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories/our-services`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const transformedData = result.data.map(category => ({
          id: category.id || category._id,
          name: category.name || 'Unnamed Category',
          title: category.name || 'Unnamed Category',
          alt: category.name || 'Unnamed Category',
          pdf: category.pdf || "",
          items: (category.subCategories || []).map(sub => ({
            id: sub.id || sub._id,
            name: sub.name || 'Unnamed Subcategory',
            title: sub.name || 'Unnamed Subcategory',
            alt: sub.name || 'Unnamed Subcategory',
            pdf: sub.pdf || "",
            href: sub.href || "",
            service: sub.service || [],
            children: (sub.items || []).map(item => ({
              id: item.id || item._id,
              name: item.name || 'Unnamed Item',
              title: item.name || 'Unnamed Item',
              alt: item.name || 'Unnamed Item',
              pdf: item.pdf || "",
              href: item.href || "",
              service: item.service || [],
              children: item.children || []
            }))
          }))
        }));
        
        setServicesData(transformedData);
        
        if (transformedData.length > 0) {
          const firstSection = transformedData[0];
          setSelectedSection(firstSection);
          
          if (firstSection.items && firstSection.items.length > 0) {
            setSelectedCategory(firstSection.items[0]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal with animation
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setServiceModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (serviceModalOpen) {
      const scrollY = window.scrollY;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [serviceModalOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    if (serviceModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [serviceModalOpen]);

  // Ensure mouse wheel scrolling works on all panels
  useEffect(() => {
    if (!serviceModalOpen) return;

    const handleWheel = (e) => {
      e.stopPropagation();
    };

    const panels = [leftPanelRef.current, centerPanelRef.current, rightPanelRef.current];
    
    panels.forEach(panel => {
      if (panel) {
        panel.addEventListener('wheel', handleWheel, { passive: true });
        panel.style.overflowY = 'auto';
        panel.style.overflowX = 'hidden';
      }
    });

    return () => {
      panels.forEach(panel => {
        if (panel) {
          panel.removeEventListener('wheel', handleWheel);
        }
      });
    };
  }, [serviceModalOpen]);

  if (!serviceModalOpen && !isClosing) return null;

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleServiceExpand = (key) => {
    setExpandedServices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // ✅ Navigate to contact page if no href or children/services
  const handleItemClick = (item) => {
    closeModal();
    router.push(item.href || '/contact-us-liaison-bank');
  };

  // ✅ Handle category click - navigate if no children/services
  const handleCategoryClick = (category) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasServices = category.service && category.service.length > 0;
    
    if (hasChildren || hasServices) {
      setSelectedCategory(category);
    } else {
      closeModal();
      router.push('/contact-us-liaison-bank');
    }
  };

  // ✅ Handle section click - COMPLETE RESET
  const handleSectionClick = (section) => {
    // Reset ALL expanded states
    setExpandedItems({});
    setExpandedServices({});
    
    // Set the new section
    setSelectedSection(section);
    
    // Reset selected category to null first, then set the first one
    setSelectedCategory(null);
    
    // Use setTimeout to ensure state updates properly
    setTimeout(() => {
      if (section.items && section.items.length > 0) {
        // ✅ Always select the FIRST category
        setSelectedCategory(section.items[0]);
      } else {
        closeModal();
        router.push('/contact-us-liaison-bank');
      }
    }, 0);
  };

  // Render children with semantic HTML
  const renderChildren = (children, level = 0) => {
    if (!children || children.length === 0) return null;
    
    return children.map((child, index) => {
      const hasChildren = child.children && child.children.length > 0;
      const hasServices = child.service && child.service.length > 0;
      const key = `${child.name}-${level}-${index}`;
      const isExpanded = expandedItems[key];
      const isServicesExpanded = expandedServices[key];

      return (
        <div key={key} className={`service-child level-${level}`} role="listitem">
          <div 
            className={`service-child-header ${hasChildren || hasServices ? 'has-children' : ''}`}
            onClick={() => {
              if (hasChildren) {
                toggleExpand(key);
              } else if (hasServices) {
                toggleServiceExpand(key);
              } else {
                closeModal();
                router.push(child.href || '/contact-us-liaison-bank');
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded || isServicesExpanded}
            aria-label={`${child.name} ${hasChildren ? 'has sub-services' : ''} ${hasServices ? `has ${child.service.length} offerings` : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (hasChildren) {
                  toggleExpand(key);
                } else if (hasServices) {
                  toggleServiceExpand(key);
                } else {
                  closeModal();
                  router.push(child.href || '/contact-us-liaison-bank');
                }
              }
            }}
          >
            <span className="service-child-name">{child.name}</span>
            {(hasChildren || hasServices) && (
              <span className="service-child-toggle" aria-hidden="true">
                {(hasChildren && isExpanded) || (hasServices && isServicesExpanded) ? 
                  <ChevronDown size={16} /> : 
                  <ChevronRight size={16} />
                }
              </span>
            )}
            {hasServices && (
              <span className="service-services-badge" aria-label={`${child.service.length} offerings`}>
                <List size={12} aria-hidden="true" />
                {child.service.length}
              </span>
            )}
            {child.pdf && (
              <a 
                href={child.pdf} 
                target="_blank" 
                rel="noopener noreferrer"
                className="service-pdf-link"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Download PDF for ${child.name}`}
              >
                <FileText size={14} aria-hidden="true" />
              </a>
            )}
          </div>
          
          {hasServices && isServicesExpanded && (
            <ul className="service-services-list" role="list">
              {child.service.map((serviceItem, idx) => (
                <li key={idx} className="service-service-item" role="listitem">
                  <span className="service-service-dot" aria-hidden="true">•</span>
                  <span className="service-service-name">{serviceItem}</span>
                </li>
              ))}
            </ul>
          )}
          
          {hasChildren && isExpanded && (
            <div className="service-child-children" role="list">
              {renderChildren(child.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!servicesData || servicesData.length === 0) return null;

    const items = servicesData.flatMap(category => 
      category.items?.flatMap(sub => 
        sub.children?.map(child => ({
          "@type": "Service",
          "name": child.name,
          "provider": {
            "@type": "Organization",
            "name": category.name
          },
          "description": child.description || `${child.name} service offered by ${category.name}`
        })) || []
      ) || []
    );

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": item
      }))
    };
  };

  // Get current page URL for canonical
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // Generate breadcrumb structured data
  const generateBreadcrumbData = () => {
    if (!selectedCategory || !selectedSection) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Services",
          "item": getCurrentUrl()
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": selectedSection.name,
          "item": getCurrentUrl()
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": selectedCategory.name,
          "item": getCurrentUrl()
        }
      ]
    };
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="services-modal-body skeleton-loading">
      <button 
        className="services-modal-close"
        onClick={closeModal}
        aria-label="Close modal"
      >
        <X size={24} aria-hidden="true" />
      </button>
      
      <div className="services-modal-skeleton">
        <div className="services-left-panel skeleton-panel">
          <div className="skeleton-section-header">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-section-header">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-section-header">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-section-header">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-section-header">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>

        <div className="services-center-panel skeleton-panel">
          <div className="skeleton-category-item"></div>
          <div className="skeleton-category-item"></div>
          <div className="skeleton-category-item"></div>
          <div className="skeleton-category-item"></div>
          <div className="skeleton-category-item"></div>
        </div>

        <div className="services-right-panel skeleton-panel">
          <div className="skeleton-details-title"></div>
          <div className="skeleton-details-line"></div>
          <div className="skeleton-details-line"></div>
          <div className="skeleton-details-line short"></div>
          
          <div className="skeleton-service-item"></div>
          <div className="skeleton-service-item"></div>
          <div className="skeleton-service-item"></div>
          
          <div className="skeleton-details-line"></div>
          <div className="skeleton-details-line"></div>
          <div className="skeleton-details-line short"></div>
        </div>
      </div>
    </div>
  );

  // Error state
  if (error && !servicesData.length) {
    return (
      <div className="services-modal-overlay" role="dialog" aria-modal="true" aria-label="Error loading services">
        <div className={`services-modal ${isClosing ? 'closing' : ''}`} ref={modalRef}>
          <div className="services-modal-body error-state">
            <button 
              className="services-modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={24} aria-hidden="true" />
            </button>
            <div className="error-container">
              <p className="error-icon" aria-hidden="true">⚠️</p>
              <p className="error-message">{error}</p>
              <button 
                className="error-retry-btn"
                onClick={() => {
                  setIsInitialLoad(true);
                  fetchServices();
                }}
                aria-label="Retry loading services"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();
  const breadcrumbData = generateBreadcrumbData();
  const currentUrl = getCurrentUrl();

  return (
    <>
      <Head>
        <title>{`${selectedCategory?.name || 'Our Services'} | ${selectedSection?.name || 'Professional Services'}`}</title>
        <meta name="description" content={`Explore our ${selectedSection?.name || 'comprehensive'} services including ${selectedCategory?.name || ''}. Professional services available.`} />
        <meta name="keywords" content={`${selectedCategory?.name || ''}, ${selectedSection?.name || ''}, ${servicesData.map(s => s.name).join(', ')}`} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={`${selectedCategory?.name || 'Our Services'} | ${selectedSection?.name || 'Professional Services'}`} />
        <meta property="og:description" content={`Explore our ${selectedSection?.name || 'comprehensive'} services. Professional services available.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Our Services" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${selectedCategory?.name || 'Our Services'} | ${selectedSection?.name || 'Professional Services'}`} />
        <meta name="twitter:description" content={`Explore our ${selectedSection?.name || 'comprehensive'} services.`} />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}
        
        {breadcrumbData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbData)
            }}
          />
        )}
      </Head>

      <div className="services-modal-overlay" role="dialog" aria-modal="true" aria-label="Services menu">
        <div className={`services-modal ${serviceModalOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`} ref={modalRef}>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="services-modal-body">
              <button 
                className="services-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={24} aria-hidden="true" />
              </button>

              {/* LEFT PANEL - Main Sections */}
              <nav className="services-left-panel" ref={leftPanelRef} aria-label="Service categories">
                <h2 className="sr-only">Service Categories</h2>
                <div className="services-section-list" role="list">
                  {servicesData.map((section) => (
                    <button
                      key={section.id || section.name}
                      className={`services-section-btn ${selectedSection?.id === section.id ? 'active' : ''}`}
                      onClick={() => handleSectionClick(section)}
                      role="listitem"
                      aria-current={selectedSection?.id === section.id ? 'page' : undefined}
                    >
                      <span className="services-section-name">{section.name}</span>
                      {section.pdf && (
                        <a 
                          href={section.pdf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="services-section-pdf"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Download PDF for ${section.name}`}
                        >
                          <FileText size={14} aria-hidden="true" />
                        </a>
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              {/* CENTER PANEL - Subcategories */}
              <nav className="services-center-panel" ref={centerPanelRef} aria-label="Service subcategories">
                <h2 className="sr-only">Service Subcategories</h2>
                <div className="services-category-list" role="list">
                  {selectedSection?.items?.map((item) => {
                    // Check if this is the selected category
                    const isActive = selectedCategory?.id === item.id;
                    
                    return (
                      <button
                        key={item.id || item.name}
                        className={`services-category-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(item)}
                        role="listitem"
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="services-category-name">{item.name}</span>
                        {item.pdf && (
                          <a 
                            href={item.pdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="services-category-pdf"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Download PDF for ${item.name}`}
                          >
                            <FileText size={14} aria-hidden="true" />
                          </a>
                        )}
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* RIGHT PANEL - Details */}
              <section className="services-right-panel" ref={rightPanelRef} aria-label="Service details">
                {selectedCategory ? (
                  <article className="services-details">
                    <h1 className="services-details-title">{selectedCategory.name}</h1>
                    {selectedCategory.description && (
                      <p className="services-details-description">{selectedCategory.description}</p>
                    )}
                    
                    {selectedCategory.service && selectedCategory.service.length > 0 && (
                      <section className="services-details-services" aria-label="Service offerings">
                        <h2 className="services-details-subtitle">
                          <List size={16} aria-hidden="true" />
                          Service Offerings
                        </h2>
                        <ul className="services-details-services-list" role="list">
                          {selectedCategory.service.map((serviceItem, idx) => (
                            <li key={idx} className="services-details-service-item" role="listitem">
                              <span className="services-details-service-dot" aria-hidden="true">•</span>
                              <span className="services-details-service-name">{serviceItem}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    
                    {selectedCategory.children && selectedCategory.children.length > 0 ? (
                      <div className="services-details-children" role="list">
                        <h2 className="sr-only">Sub-services</h2>
                        {renderChildren(selectedCategory.children)}
                      </div>
                    ) : (
                      <div className="services-details-no-content">
                        <div className="services-details-contact-cta">
                          <p>No specific sub-services listed for this category.</p>
                          <button 
                            className="services-details-contact-btn"
                            onClick={() => {
                              closeModal();
                              router.push('/contact-us-liaison-bank');
                            }}
                          >
                            Contact Us for More Information
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ) : (
                  <div className="services-details-empty-state">
                    <p>Select a category to view details</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}