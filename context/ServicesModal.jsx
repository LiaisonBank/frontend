"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { ChevronRight, ChevronDown, FileText, X } from "lucide-react";
import "./ServicesModal.css";

export default function ServicesModal() {
  const router = useRouter();
  const { serviceModalOpen, setServiceModalOpen } = useModal();
  const modalRef = useRef(null);

  const servicesData = [
    {
      name: "AMC",
      title: "AMC",
      alt: "AMC Liaisonbank",
      pdf: "/pdf/amc.pdf",
      items: [
        {
          name: "Licenses Renewal",
          href: "",
          title: "",
          alt: "",
          pdf: "/pdf/licenses-renewal.pdf",
          children: [
            {
              name: "PNG Audit And Certifications",
              href: "/contact-us-liaison-bank",
              title: "",
              alt: "",
              pdf: "/pdf/licenses-renewal.pdf"
            },
            {
              name: "Fire Audit and Certification",
              href: "/contact-us-liaison-bank",
              title: "",
              alt: "",
              pdf: "/pdf/licenses-renewal.pdf"
            },
            {
              name: "Electric Audit and Certification",
              href: "/contact-us-liaison-bank",
              title: "",
              alt: "",
              pdf: "/pdf/licenses-renewal.pdf"
            },
            {
              name: "Pest Control Service and Certification",
              href: "/contact-us-liaison-bank",
              title: "",
              alt: "",
              pdf: "/pdf/licenses-renewal.pdf"
            },
            {
              name: "Water Tank Cleaning and Certification",
              href: "/contact-us-liaison-bank",
              title: "",
              alt: "",
              pdf: "/pdf/licenses-renewal.pdf"
            },
            {
              name: "F&B",
              href: "",
              title: "",
              alt: "",
              children: [
                {
                  name: "Resort, Banquet, Hotel",
                  href: "",
                  title: "",
                  alt: "",
                  pdf: "/pdf/licenses-renewal.pdf",
                  children: [
                    {
                      name: "Lounging and boarding",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Traffic police permission",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Law and order approval",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    }
                  ]
                },
                {
                  name: "Restaurant, Dhaba, Sweet mart, Dry Fruit",
                  href: "/contact-us-liaison-bank",
                  title: "",
                  alt: "",
                  pdf: "/pdf/licenses-renewal.pdf",
                  children: [
                    {
                      name: "Shop & Establishment",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "FSSAI",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Building & Factory NOC",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Fire Compliance certificate",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MOH License (Eating House)",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Sign Board License (Permit)",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Open space (Serving License)",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "FL III License",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Premises License",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "PPL License",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Novex License",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Healthcare",
              href: "",
              title: "",
              alt: "",
              children: [
                {
                  name: "Hospital, Clinic, Nursing Home",
                  href: "/contact-us-liaison-bank",
                  title: "",
                  alt: "",
                  pdf: "",
                  children: [
                    {
                      name: "SMS - Bio medical waste",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Clinic MPCB/BMW",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MPCB - Registration 1 - 25 beds",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MPCB - Registration 26 - 50 beds",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MPCB Autho/consent above 50 beds",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Fire NOC new with compliance",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "FIRE - A form (alarm system) AMC with audit charges for every 6 months",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "FIRE : Wiring for alarm etc",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Architect fees for compliance",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "FIRE - B form",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "PCPNDT",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MTP registration",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Electrical audit certificate yearly",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Structural audit",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Board sign",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Weather shed permission",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Change of user for clinics",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Change of user for nursing home",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "NABH 0 - 25 beds",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Industrial and Manufacturer",
              href: "",
              title: "",
              alt: "",
              children: [
                {
                  name: "Textile, Colour Coating, Laundry, Factory",
                  href: "/contact-us-liaison-bank",
                  title: "",
                  alt: "",
                  pdf: "",
                  children: [
                    {
                      name: "Factory license",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Shop & establishment",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Building & factory NOC",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Fire compliance certificate",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MOH license (eating house)",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Sign board license (permit)",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Real Estate",
              href: "",
              title: "",
              alt: "",
              children: [
                {
                  name: "Building and construction",
                  href: "/contact-us-liaison-bank",
                  title: "",
                  alt: "",
                  pdf: "",
                  children: [
                    {
                      name: "Labour permit",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Contractor license",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Mathadi registration",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Entertainment",
              href: "",
              title: "",
              alt: "",
              children: [
                {
                  name: "Gym, Club House, Events",
                  href: "/contact-us-liaison-bank",
                  title: "",
                  alt: "",
                  pdf: "",
                  children: [
                    {
                      name: "Shop & establishment",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Building & factory NOC",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "MOH license (eating house) / Trade license",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Police NOC",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    },
                    {
                      name: "Staff fitness certificate",
                      href: "/contact-us-liaison-bank",
                      title: "",
                      alt: "",
                      pdf: ""
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Licensing",
      title: "Licensing",
      alt: "Licensing",
      pdf: "/pdf/licensing.pdf",
      items: [
        {
          name: "Piped Natural Gas",
          href: "/contact-us-liaison-bank",
          title: "",
          alt: "",
          pdf: ""
        },
        {
          name: "Fire",
          href: "/contact-us-liaison-bank",
          title: "",
          alt: "",
          pdf: ""
        },
        {
          name: "Electrical",
          href: "/contact-us-liaison-bank",
          title: "",
          alt: "",
          pdf: ""
        },
        {
          name: "AMC",
          href: "/contact-us-liaison-bank",
          title: "",
          alt: "",
          pdf: ""
        },
        {
          name: "Real Estate",
          href: "/contact-us-liaison-bank",
          title: "",
          alt: "",
          pdf: ""
        },
        {
          name: "Equipment Solution Department",
          href: "/contact-us-liaison-bank",
          title: "",
          alt: "",
          pdf: ""
        }
      ]
    },
    {
      name: "Liaisoning",
      title: "Liaisoning",
      alt: "Liaisoning",
      pdf: "/pdf/liaisoning.pdf",
      items: [
        {
          name: "Brihanmumbai Municipal Corporation (B.M.C)",
          title: "Brihanmumbai municipal corporation approvals and licensing services",
          alt: "brihanmumbai municipal corporation approvals and licensing services",
          children: [
            {
              name: "Building Proposal (342)",
              href: "/contact-us-liaison-bank",
              title: "Building Proposal (342)",
              alt: "Building Proposal (342)",
              pdf: "/pdf/"
            },
            {
              name: "Building Proposal – Miscellaneous",
              href: "/contact-us-liaison-bank",
              title: "Building Proposal – Miscellaneous",
              alt: "Building Proposal – Miscellaneous",
              pdf: "/pdf/"
            },
            {
              name: "Retail Unit Approval",
              href: "/contact-us-liaison-bank",
              title: "Retail Unit Approval",
              alt: "Retail Unit Approval",
              pdf: "/pdf/"
            },
            {
              name: "Building Proposal (337)",
              href: "/contact-us-liaison-bank",
              title: "Building Proposal (337)",
              alt: "Building Proposal (337)",
              pdf: "/pdf/"
            },
            {
              name: "Shop to Restaurant Conversion",
              href: "/contact-us-liaison-bank",
              title: "Shop to Restaurant Conversion",
              alt: "Shop to Restaurant Conversion",
              pdf: "/pdf/"
            },
            {
              name: "Floor Mill to Restaurant Conversion",
              href: "/contact-us-liaison-bank",
              title: "Floor Mill to Restaurant Conversion",
              alt: "Floor Mill to Restaurant Conversion",
              pdf: "/pdf/"
            },
            {
              name: "Shop to Clinic Conversion",
              href: "/contact-us-liaison-bank",
              title: "Shop to Clinic Conversion",
              alt: "Shop to Clinic Conversion",
              pdf: "/pdf/"
            }
          ]
        }
      ]
    },
    {
      name: "Electrical ",
      href: "/contact-us-liaison-bank",
      title: "Electrical Execution, Compliance & Maintenance Services",
      alt: "Electrical ( SITC )",
      pdf: "/pdf/electrical-sitc.pdf"
    },
    {
      name: "Fire & FAPA",
      href: "/contact-us-liaison-bank",
      title: "Fire & Safety Systems and Compliance Solutions",
      alt: "Fire ( SITC )",
      pdf: "/pdf/fss.pdf"
    },
    {
      name: "Piped Natural Gas ",
      href: "/contact-us-liaison-bank",
      title: "Piped Natural Gas (Png) Services & Regulatory Compliance",
      alt: "PNG ( SITC )",
      pdf: "/pdf/png.pdf"
    },
    {
      name: "Equipment Solution Department",
      href: "/contact-us-liaison-bank",
      title: "Equipment Solution Department",
      alt: "( ESD )",
      pdf: "/pdf/EEBP.pdf"
    },
    {
      name: "Group Profile",
      href: "/group-profile",
      title: "Group Profile",
      alt: "( ESD )",
      pdf: ""
    }
  ];

  const [selectedSection, setSelectedSection] = useState(servicesData[0]);
  const [selectedCategory, setSelectedCategory] = useState(servicesData[0]?.items?.[0] || null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setServiceModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setServiceModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setServiceModalOpen(false);
      }
    };
    if (serviceModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [serviceModalOpen, setServiceModalOpen]);

  if (!serviceModalOpen) return null;

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleItemClick = (item) => {
    if (item.href) {
      setServiceModalOpen(false);
      router.push(item.href);
    }
  };

  const renderChildren = (children, level = 0) => {
    if (!children || children.length === 0) return null;

    return children.map((child, index) => {
      const hasChildren = child.children && child.children.length > 0;
      const key = `${child.name}-${level}-${index}`;
      const isExpanded = expandedItems[key];

      return (
        <div key={key} className={`service-child level-${level}`}>
          <div
            className={`service-child-header ${hasChildren ? 'has-children' : ''}`}
            onClick={() => {
              if (hasChildren) {
                toggleExpand(key);
              } else if (child.href) {
                handleItemClick(child);
              }
            }}
            style={{
              paddingLeft: `${level * 20 + 10}px`,
              cursor: hasChildren || child.href ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingRight: '10px',
              borderBottom: '1px solid #f0f0f0',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (hasChildren || child.href) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="service-child-name" style={{ flex: 1, fontSize: '14px' }}>
              {child.name}
            </span>
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {hasChildren && (
                <span className="service-child-toggle" style={{ color: '#666' }}>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}
              {child.pdf && (
                <a
                  href={child.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-pdf-link"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: '#666', textDecoration: 'none' }}
                >
                  <FileText size={14} />
                </a>
              )}
            </div> */}
          </div>
          {hasChildren && isExpanded && (
            <div className="service-child-children">
              {renderChildren(child.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="services-modal-overlay">
      <div className="services-modal" ref={modalRef}>
        <div className="services-modal-body">
          <button
            className="services-modal-close"
            onClick={() => setServiceModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Left Panel - Sections */}
          <div className="services-left-panel">
            <div className="services-section-list">
              {servicesData.map((section) => (
                <button
                  key={section.name}
                  className={`services-section-btn ${selectedSection?.name === section.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSection(section);
                    setSelectedCategory(section.items?.[0] || null);
                    setExpandedItems({});
                  }}
                >
                  <span className="services-section-name">{section.name}</span>
                  {section.pdf && (
                    <a
                      href={section.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="services-section-pdf"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText size={14} />
                    </a>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Center Panel - Categories */}
          <div className="services-center-panel">
            <div className="services-category-list">
              {selectedSection?.items?.map((item) => (
                <button
                  key={item.name}
                  className={`services-category-btn ${selectedCategory?.name === item.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(item);
                    setExpandedItems({});
                  }}
                >
                  <span className="services-category-name">{item.name}</span>
                  
                  {item.pdf && (
                    <a
                      href={item.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="services-category-pdf"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText size={14} />
                    </a>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="services-right-panel">
            {selectedCategory ? (
              <div className="services-details">
                <h3 className="services-details-title" style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #e0e0e0',
                  color: '#333'
                }}>
                  {selectedCategory.name}
                </h3>
                {selectedCategory.description && (
                  <p className="services-details-description">{selectedCategory.description}</p>
                )}
                {selectedCategory.children && selectedCategory.children.length > 0 ? (
                  <div className="services-details-children">
                    {renderChildren(selectedCategory.children)}
                  </div>
                ) : (
                  <div className="services-details-empty">
                    <p>No sub-services available for this category.</p>
                    {selectedCategory.href && (
                      <button
                        className="services-details-cta"
                        onClick={() => handleItemClick(selectedCategory)}
                      >
                        Learn More
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="services-details-empty-state">
                <p>Select a category to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}