"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ChevronDown, ChevronRight, X } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import "./ServicesModal.css";

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

const findSection = (name) =>
  servicesData.find((section) => section.name.trim() === name.trim()) ??
  servicesData[0] ??
  null;

const firstItem = (section) => section?.items?.[0] ?? null;

export default function ServicesModal() {
  const router = useRouter();
  const { serviceModalOpen, setServiceModalOpen } = useModal();

  const modalRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // The recording opens on "Liaisoning".
  const initialSection = useMemo(() => findSection("Liaisoning"), []);

  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [selectedCategory, setSelectedCategory] = useState(firstItem(initialSection));
  const [expandedItems, setExpandedItems] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = useCallback(() => {
    setIsClosing(true);

    window.setTimeout(() => {
      setServiceModalOpen(false);
      setIsClosing(false);
    }, 160);
  }, [setServiceModalOpen]);

  useEffect(() => {
    if (!serviceModalOpen) return undefined;

    lastFocusedRef.current = document.activeElement;
    document.body.classList.add("services-modal-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("services-modal-open");

      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus();
      }
    };
  }, [serviceModalOpen, closeModal]);

  useEffect(() => {
    if (!serviceModalOpen) return;

    const firstFocusable = modalRef.current?.querySelector(
      "button:not([disabled]), a[href]"
    );

    firstFocusable?.focus();
  }, [serviceModalOpen]);

  const selectSection = (section) => {
    setSelectedSection(section);
    setSelectedCategory(firstItem(section));
    setExpandedItems({});
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setExpandedItems({});
  };

  const toggleExpand = (key) => {
    setExpandedItems((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleItemClick = (item) => {
    if (!item?.href) return;

    closeModal();
    router.push(item.href);
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const renderTree = (children, level = 0, parentKey = "root") => {
    if (!children?.length) return null;

    return (
      <div className={`services-tree services-tree-level-${level}`}>
        {children.map((child, index) => {
          const key = `${parentKey}-${child.name}-${index}`;
          const hasChildren = Boolean(child.children?.length);
          const expanded = Boolean(expandedItems[key]);

          return (
            <div className="services-tree-item" key={key}>
              <div
                className={[
                  "services-tree-row",
                  hasChildren ? "is-parent" : "",
                  child.href ? "is-link" : "",
                  expanded ? "is-expanded" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ "--tree-level": level }}
                role={hasChildren ? "button" : child.href ? "link" : undefined}
                tabIndex={hasChildren || child.href ? 0 : undefined}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(key);
                  } else if (child.href) {
                    handleItemClick(child);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();

                  if (hasChildren) {
                    toggleExpand(key);
                  } else if (child.href) {
                    handleItemClick(child);
                  }
                }}
              >
                <span className="services-tree-name">{child.name}</span>

                <span className="services-tree-actions">
                  {hasChildren &&
                    (expanded ? (
                      <ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
                    ) : (
                      <ChevronRight size={15} strokeWidth={1.8} aria-hidden="true" />
                    ))}

                  {child.pdf && (
                    <a
                      href={child.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="services-pdf-link"
                      aria-label={`Open PDF for ${child.name}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <FileText size={14} strokeWidth={1.8} />
                    </a>
                  )}
                </span>
              </div>

              {hasChildren && expanded && (
                <div className="services-tree-children">
                  {renderTree(child.children, level + 1, key)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!serviceModalOpen) return null;

  return (
    <div
      className={`services-modal-overlay${isClosing ? " is-closing" : ""}`}
      onMouseDown={handleOverlayMouseDown}
      aria-hidden="false"
    >
      <section
        ref={modalRef}
        className="services-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Our Services"
      >
        <button
          type="button"
          className="services-modal-close"
          onClick={closeModal}
          aria-label="Close services menu"
        >
          <X size={19} strokeWidth={2} />
        </button>

        <div className="services-modal-grid">
          <aside className="services-left-panel">
            <div className="services-panel-scroll">
              {servicesData.map((section) => {
                const active =
                  selectedSection?.name.trim() === section.name.trim();

                return (
                  <div
                    key={section.name}
                    className={`services-section-btn${active ? " active" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => selectSection(section)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectSection(section);
                      }
                    }}
                  >
                    <span className="services-section-name">
                      {section.name.trim()}
                    </span>

                    {section.pdf && (
                      <a
                        href={section.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="services-section-pdf"
                        aria-label={`Open PDF for ${section.name.trim()}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <FileText size={14} strokeWidth={1.8} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="services-center-panel">
            <div className="services-panel-scroll">
              {selectedSection?.items?.length ? (
                selectedSection.items.map((item) => {
                  const active = selectedCategory?.name === item.name;
                  const hasChildren = Boolean(item.children?.length);

                  return (
                    <div
                      key={item.name}
                      className={`services-category-btn${active ? " active" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={active}
                      onClick={() => selectCategory(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectCategory(item);
                        }
                      }}
                    >
                      <span className="services-category-name">{item.name}</span>

                      <span className="services-category-actions">
                        {item.pdf && (
                          <a
                            href={item.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="services-category-pdf"
                            aria-label={`Open PDF for ${item.name}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <FileText size={14} strokeWidth={1.8} />
                          </a>
                        )}

                        {hasChildren &&
                          (active ? (
                            <ChevronDown size={15} aria-hidden="true" />
                          ) : (
                            <ChevronRight size={15} aria-hidden="true" />
                          ))}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="services-panel-empty">No services available.</div>
              )}
            </div>
          </div>

          <main className="services-right-panel">
            <div className="services-details">
              {selectedCategory ? (
                <>
                  <div className="services-details-heading">
                    <h2>{selectedCategory.name}</h2>

                    {selectedCategory.pdf && (
                      <a
                        href={selectedCategory.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="services-details-pdf"
                        aria-label={`Open PDF for ${selectedCategory.name}`}
                      >
                        <FileText size={15} />
                      </a>
                    )}
                  </div>

                  {selectedCategory.description && (
                    <p className="services-details-description">
                      {selectedCategory.description}
                    </p>
                  )}

                  {selectedCategory.children?.length ? (
                    <div className="services-details-list">
                      {renderTree(selectedCategory.children)}
                    </div>
                  ) : (
                    <div className="services-details-empty">
                      <p>No sub-services available for this category.</p>

                      {selectedCategory.href && (
                        <button
                          type="button"
                          className="services-details-cta"
                          onClick={() => handleItemClick(selectedCategory)}
                        >
                          Learn More
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="services-details-empty-state">
                  <p>Select a category to view details.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
