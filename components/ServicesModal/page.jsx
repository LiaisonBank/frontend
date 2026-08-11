"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { ChevronRight, ChevronDown, FileText, X, List } from "lucide-react";
import { useLenis } from "@/components/LenisProvider";
import Head from "next/head";
import UnderDevelopment from "@/components/UnderDevelopment/page";
import "./ServicesModal.css";

// Skeleton Loader Component
const SkeletonLoader = ({ hasSubcategories }) => (
  <div
    className={`services-modal-body ${
      hasSubcategories ? "has-subcategories" : "no-subcategories"
    }`}
  >
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

export default function ServicesModal() {
  const {
    stopLenis,
    startLenis,
    getLenisScroll,
    restoreLenisScroll,
  } = useLenis();
  const router = useRouter();
  const modalRef = useRef(null);
  const leftPanelRef = useRef(null);
  const centerPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const modalScrollRef = useRef(0);
  const closeTimerRef = useRef(null);
  const { serviceModalOpen, setServiceModalOpen } = useModal();

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
  
  // State for hovered category
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Category content mapping for hover/display
  const categoryContent = {
    "Licensing": {
      title: "Licensing Services",
      description: "Comprehensive licensing solutions for your business needs. We handle all aspects of business licensing and compliance.",
      features: [
        "Business license application and renewal",
        "Regulatory compliance consulting",
        "License documentation and filing",
        "Renewal tracking and alerts",
        "Multi-jurisdiction licensing support"
      ]
    },
    "PNG Audit And Certifications": {
      title: "PNG Audit and Certifications",
      description: "Professional PNG (Piped Natural Gas) audit and certification services ensuring safety and compliance.",
      features: [
        "PNG system safety audits",
        "Compliance certification",
        "Risk assessment and mitigation",
        "Documentation and reporting",
        "Regulatory compliance verification"
      ]
    },
    "Piped Natural Gas": {
      title: "Piped Natural Gas Services",
      description: "Complete Piped Natural Gas solutions including installation, maintenance, and safety services.",
      features: [
        "PNG pipeline installation",
        "Gas system maintenance",
        "Safety inspections",
        "Leak detection and repair",
        "Emergency response services"
      ]
    },
    "Fire": {
      title: "Fire Safety Services",
      description: "Comprehensive fire safety solutions including audits, certification, and system maintenance.",
      features: [
        "Fire safety audits",
        "Fire system certification",
        "Fire extinguisher maintenance",
        "Fire alarm system testing",
        "Emergency evacuation planning"
      ]
    },
    "Fire Audit and Certification": {
      title: "Fire Audit and Certification",
      description: "Professional fire audit and certification services to ensure your premises meet all safety standards.",
      features: [
        "Fire safety compliance audits",
        "Fire system certification",
        "Fire risk assessments",
        "Safety documentation",
        "Regulatory compliance verification"
      ]
    },
    "Electrical": {
      title: "Electrical Services",
      description: "Complete electrical services including audits, maintenance, and safety certification.",
      features: [
        "Electrical system audits",
        "Safety inspections",
        "Maintenance services",
        "Compliance certification",
        "System upgrades and repairs"
      ]
    },
    "Electric Audit and Certification": {
      title: "Electric Audit and Certification",
      description: "Professional electrical audit and certification services for safety and compliance.",
      features: [
        "Electrical safety audits",
        "System compliance certification",
        "Risk assessment",
        "Documentation and reporting",
        "Safety recommendations"
      ]
    },
    "Pest Control Service and Certification": {
      title: "Pest Control Services",
      description: "Comprehensive pest control services with certification and ongoing monitoring.",
      features: [
        "Pest inspection and assessment",
        "Treatment and control solutions",
        "Preventive maintenance",
        "Certification services",
        "Regular monitoring and reporting"
      ]
    },
    "AMC": {
      title: "Annual Maintenance Contract (AMC)",
      description: "Comprehensive Annual Maintenance Contract services for all your equipment and systems.",
      features: [
        "Preventive maintenance scheduling",
        "Priority service response",
        "Fixed annual pricing",
        "Comprehensive coverage for all equipment",
        "Dedicated support team",
        "Regular inspections and reporting"
      ]
    },
    "Water Tank Cleaning and Certification": {
      title: "Water Tank Cleaning and Certification",
      description: "Our Water Tank Cleaning service is getting a fresh update, but our services are running as usual. Thank you for your patience!",
      features: [
        "Professional tank cleaning",
        "Water quality testing",
        "Sanitization services",
        "Certification and documentation",
        "Regular maintenance schedules"
      ],
      isUnderDevelopment: true
    },
    "Real Estate": {
      title: "Real Estate Services",
      description: "Our Real Estate services are currently under development. Our team is working to bring you an enhanced experience soon.",
      features: [
        "Property consulting",
        "Market analysis",
        "Investment advisory",
        "Property management",
        "Legal compliance"
      ],
      isUnderDevelopment: true
    },
    "Equipment Solution Department": {
      title: "Equipment Solutions",
      description: "Complete equipment solutions including procurement, maintenance, and support services.",
      features: [
        "Equipment procurement",
        "Installation services",
        "Maintenance and repairs",
        "Equipment certification",
        "Technical support"
      ]
    }
  };

  // Get content for a category
  const getCategoryContent = (category) => {
    if (!category) return null;
    
    // Try exact match first
    if (categoryContent[category.name]) {
      return categoryContent[category.name];
    }
    
    // Try case-insensitive match
    const lowerName = category.name.toLowerCase();
    for (const [key, value] of Object.entries(categoryContent)) {
      if (key.toLowerCase() === lowerName) {
        return value;
      }
    }
    
    // Return default content
    return {
      title: category.name,
      description: `${category.name} services available. Contact us for more information.`,
      features: ["Professional services", "Quality assurance", "Compliance certified", "Expert team"]
    };
  };

  // ✅ FETCH DATA IMMEDIATELY when component mounts
  useEffect(() => {
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
    fetchServices();
  }, []);

  // Close modal with animation
  const closeModal = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setIsClosing(true);

    closeTimerRef.current = setTimeout(() => {
      setServiceModalOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 300);
  }, [setServiceModalOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!serviceModalOpen) {
      return;
    }

    modalScrollRef.current = getLenisScroll();
    stopLenis();

    return () => {
      const savedPosition = modalScrollRef.current;
      startLenis();
      requestAnimationFrame(() => {
        restoreLenisScroll(savedPosition);
      });
    };
  }, [
    serviceModalOpen,
    getLenisScroll,
    stopLenis,
    startLenis,
    restoreLenisScroll,
  ]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, []);

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

  // ✅ Handle category click - navigate if no children/services
  const handleCategoryClick = (category) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasServices = category.service && category.service.length > 0;
    
    if (hasChildren || hasServices) {
      setSelectedCategory(category);
    }
    // Removed: else redirect to contact page
  };

  // ✅ Handle section click - COMPLETE RESET
  const handleSectionClick = (section) => {
    setExpandedItems({});
    setExpandedServices({});
    setSelectedSection(section);
    setSelectedCategory(null);
    setHoveredCategory(null);

    const hasItems = Array.isArray(section?.items) && section.items.length > 0;

    if (hasItems) {
      setSelectedCategory(section.items[0]);
    }
  };

  const hasSubcategories = Array.isArray(selectedSection?.items) && selectedSection.items.length > 0;

  // Get the category to display (hover takes priority over selected)
  const displayCategory = hoveredCategory || selectedCategory;

  // Get content for the display category
  const displayContent = getCategoryContent(displayCategory);

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
              }
              // Removed: else redirect to contact page
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
                }
                // Removed: else redirect to contact page
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

  // Error state
  if (error && !servicesData.length) {
    return (
      <div className="services-modal-overlay" role="dialog" aria-modal="true" aria-label="Error loading services">
        <div className={`services-modal ${isClosing ? 'closing' : ''}`} ref={modalRef}>
          <div className="services-modal-body error-state">
            <button 
              type="button"
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
        <title>{`${displayCategory?.name || 'Our Services'} | ${selectedSection?.name || 'Professional Services'}`}</title>
        <meta name="description" content={`Explore our ${selectedSection?.name || 'comprehensive'} services including ${displayCategory?.name || ''}. Professional services available.`} />
        <meta name="keywords" content={`${displayCategory?.name || ''}, ${selectedSection?.name || ''}, ${servicesData.map(s => s.name).join(', ')}`} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={`${displayCategory?.name || 'Our Services'} | ${selectedSection?.name || 'Professional Services'}`} />
        <meta property="og:description" content={`Explore our ${selectedSection?.name || 'comprehensive'} services. Professional services available.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Our Services" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${displayCategory?.name || 'Our Services'} | ${selectedSection?.name || 'Professional Services'}`} />
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
            <SkeletonLoader hasSubcategories={hasSubcategories} />
          ) : (
            <div
              className={`services-modal-body ${
                hasSubcategories ? "has-subcategories" : "no-subcategories"
              }`}
            >
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
                      className={`services-section-btn ${
                        selectedSection?.id === section.id ? "active" : ""
                      }`}
                      onClick={() => handleSectionClick(section)}
                      role="listitem"
                      aria-current={
                        selectedSection?.id === section.id ? "page" : undefined
                      }
                    >
                      <span className="services-section-name">
                        {section.name}
                      </span>

                      {section.pdf && (
                        <a
                          href={section.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="services-section-pdf"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Download PDF for ${section.name}`}
                        >
                          PDF
                        </a>
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              {/* CENTER PANEL - Subcategories */}
              {hasSubcategories && (
                <nav
                  className="services-center-panel"
                  ref={centerPanelRef}
                  aria-label="Service subcategories"
                >
                  <h2 className="sr-only">Service Subcategories</h2>
                  <div className="services-category-list" role="list">
                    {selectedSection.items.map((item) => {
                      const isActive = selectedCategory?.id === item.id;

                      return (
                        <button
                          key={item.id || item.name}
                          className={`services-category-btn ${
                            isActive ? "active" : ""
                          }`}
                          onClick={() => handleCategoryClick(item)}
                          onMouseEnter={() => setHoveredCategory(item)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          role="listitem"
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span className="services-category-name">
                            {item.name}
                          </span>

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
              )}

              {/* RIGHT PANEL - Details */}
              <section className="services-right-panel" ref={rightPanelRef} aria-label="Service details">
                {displayCategory && displayContent ? (
                  <article className="services-details">
                    <h2 className="services-details-title">{displayContent.title}</h2>
                    
                    {displayContent.isUnderDevelopment ? (
                      <div className="services-details-under-development">
                        <p className="under-development__description">{displayContent.description}</p>
                      </div>
                    ) : (
                      <>
                        <p className="services-details-description">{displayContent.description}</p>
                        
                        {displayContent.features && displayContent.features.length > 0 && (
                          <section className="services-details-features" aria-label="Service features">
                            <h3 className="services-details-subtitle">Key Features</h3>
                            {/* <ul className="services-details-features-list" role="list">
                              {displayContent.features.map((feature, idx) => (
                                <li key={idx} className="services-details-feature-item" role="listitem">
                                  <span className="services-details-feature-icon" aria-hidden="true">✓</span>
                                  <span className="services-details-feature-name">{feature}</span>
                                </li>
                              ))}
                            </ul> */}
                          </section>
                        )}
                        
                        {displayCategory.service && displayCategory.service.length > 0 && (
                          <section className="services-details-services" aria-label="Service offerings">
                            <h3 className="services-details-subtitle">
                              <List size={16} aria-hidden="true" />
                              Service Offerings
                            </h3>
                            <ul className="services-details-services-list" role="list">
                              {displayCategory.service.map((serviceItem, idx) => (
                                <li key={idx} className="services-details-service-item" role="listitem">
                                  <span className="services-details-service-dot" aria-hidden="true">•</span>
                                  <span className="services-details-service-name">{serviceItem}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}
                        
                        {displayCategory.children && displayCategory.children.length > 0 ? (
                          <div className="services-details-children" role="list">
                            <h3 className="sr-only">Sub-services</h3>
                            {renderChildren(displayCategory.children)}
                          </div>
                        ) : (
                          <div className="services-details-no-content">
                            <div className="services-details-contact-cta">
                              <p>No specific sub-services listed for this category.</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </article>
                ) : (
                  <div className="services-details-empty-state">
                    <UnderDevelopment />
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