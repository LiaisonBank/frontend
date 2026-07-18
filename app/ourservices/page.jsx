"use client";
import Link from "next/link";
import { useState } from "react";
import useBodyClass from '@/components/useBodyClass';

// Import your menu data

export default function OurServices() {
  useBodyClass('our-services');
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle function for accordion
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Recursive function to render menu items
  const renderMenuItems = (items, level = 0) => {
    if (!items || items.length === 0) return null;

    return (
      <ul className={`menu-level-${level}`}>
        {items.map((item, index) => (
          <li key={index} className="menu-item">
            {item.children || item.items ? (
              // Has children - render as accordion
              <div className="menu-accordion">
                <button 
                  className="menu-toggle"
                  onClick={() => toggleSection(`${level}-${index}`)}
                >
                  <span className="menu-name">{item.name}</span>
                  <span className="menu-arrow">
                    {expandedSections[`${level}-${index}`] ? '▼' : '▶'}
                  </span>
                </button>
                {expandedSections[`${level}-${index}`] && (
                  <div className="menu-children">
                    {renderMenuItems(item.children || item.items, level + 1)}
                  </div>
                )}
              </div>
            ) : (
              // Leaf node - render as link
              <Link href={item.href || '/contact-us-liaison-bank'} className="menu-link">
                {item.name}
                {item.pdf && <span className="pdf-badge">PDF</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Get the submenu data (assuming it's in importantLinks or wherever your data is)
  const servicesData = [
    {
      name: "AMC",
      items: [
        "Licenses Renewal",
        "PNG Audit and Certification",
        "Fire Audit and Certification",
        "Electric Audit and Certification",
        "Pest Control Service and Certification",
        "Water Tank Cleaning and Certification (Ongoing)"
      ]
    },
    {
      name: "Licensing",
      items: [
        {
          name: "F&B",
          children: [
            {
              name: "Resort, Banquet, Hotel",
              children: [
                "Lougging and boarding",
                "Traffic police permission",
                "Law and order approval"
              ]
            },
            {
              name: "Restaurant, Dhaba, Sweet mart, Dry Fruit",
              children: [
                "Shop & Establishment",
                "FSSAI",
                "Building & Factory NOC",
                "Fire Compliance certificate",
                "MOH License (Eating House)",
                "Sign Board License (Permit)",
                "Open space (Serving License)",
                "FL III License",
                "Premises License",
                "PPL License",
                "Novex License"
              ]
            }
          ]
        },
        {
          name: "Healthcare",
          children: [
            {
              name: "Hospital, Clinic, Nursing Home",
              children: [
                "SMS - Bio medical waste",
                "Clinic MPCB/BMW",
                "MPCB - Registration 1 - 25 beds",
                "MPCB - Registration 26 - 50 beds",
                "MPCB Autho/consent above 50 beds",
                "Fire NOC new with compliance",
                "FIRE - A form (alarm system) AMC with audit charges for every 6 months",
                "FIRE : Wiring for alarm etc",
                "Architect fees for compliance",
                "FIRE - B form",
                "PCPNDT",
                "MTP registration",
                "Electrical audit certificate yearly",
                "Structural audit",
                "Board sign",
                "Weather shed permission",
                "Change of user for clinics",
                "Change of user for nursing home",
                "NABH 0 - 25 beds"
              ]
            }
          ]
        },
        {
          name: "Industrial and Manufacturer",
          children: [
            {
              name: "Textile, Colour Coating, Laundry, Factory",
              children: [
                "Factory license",
                "Shop & establishment",
                "Building & factory NOC",
                "Fire compliance certificate",
                "MOH license (eating house)",
                "Sign board license (permit)"
              ]
            }
          ]
        },
        {
          name: "Real Estate",
          children: [
            {
              name: "Building and construction",
              children: [
                "Labour permit",
                "Contractor license",
                "Mathadi registration"
              ]
            }
          ]
        },
        {
          name: "Entertainment",
          children: [
            {
              name: "Gym, Club House, Events",
              children: [
                "Shop & establishment",
                "Building & factory NOC",
                "MOH license (eating house) / Trade license",
                "Police NOC",
                "Staff fitness certificate"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Liaisoning",
      items: [
        "Brihanmumbai Municipal Corporation (B.M.C)",
        "Vasai-Virar Municipal Corporation (V.V.M.C)",
        "Kalyan-Dombivli Municipal Corporation (K.D.M.C)",
        "Thane Municipal Corporation (T.M.C)",
        "Maharashtra Housing and Area Development Authority (MHADA)",
        "Slum Rehabilitation Authority (S.R.A)",
        "Mumbai Metropolitan Region Development Authority (M.M.R.D.A)",
        "Maharashtra Industrial Development Corporation (M.I.D.C)",
        "Maharashtra Pollution Control Board (M.P.C.B)",
        "Mumbai Port Trust (M.B.P.T)",
        "Navi Mumbai Municipal Corporation (N.M.M.C)",
        "Pune Mahanagar Co",
        "Collector",
        "S.L.R",
        "D.D.L.R",
        "Mumbai Fire Department",
        "Coastal Regulation Zone (CRZ)",
        "Mumbai Airport Authority of India (MAAI)",
        "R.&.F.M",
        "C.O.M",
        "N.V.M",
        "A.P.M",
        "M.I.D.C.M",
        "I.D.C",
        "P.W.D",
        "D.M",
        "Adani Power",
        "TATA Power",
        "M.S.E.D.C.L"
      ]
    },
    {
      name: "Electrical (SITC)",
      href: "/contact-us-liaison-bank"
    },
    {
      name: "Fire (SITC)",
      href: "/contact-us-liaison-bank"
    },
    {
      name: "PNG (SITC)",
      href: "/contact-us-liaison-bank"
    },
    {
      name: "Equipment Solution Department (ESD)",
      href: "/contact-us-liaison-bank"
    },
    {
      name: "Group Profile",
      href: "/group-profile"
    }
  ];

  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Our Services</h1>
                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" aria-hidden="true"></i>
                            Home
                          </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          Our Services
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-5">Our Services</h1>
            
            <div className="services-grid">
              {servicesData.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-header">
                    <h3>{service.name}</h3>
                    {service.href && (
                      <Link href={service.href} className="service-link-btn">
                        Learn More →
                      </Link>
                    )}
                  </div>
                  
                  {service.items && (
                    <div className="service-content">
                      {service.items.map((item, idx) => (
                        <div key={idx} className="service-sub-item">
                          {typeof item === 'string' ? (
                            <span className="service-item-name">{item}</span>
                          ) : (
                            <div className="service-item-with-children">
                              <strong>{item.name}</strong>
                              {item.children && (
                                <ul className="service-child-list">
                                  {item.children.map((child, childIdx) => (
                                    <li key={childIdx}>
                                      {typeof child === 'string' ? (
                                        <span>{child}</span>
                                      ) : (
                                        <div>
                                          <strong>{child.name}</strong>
                                          {child.children && (
                                            <ul className="service-grandchild-list">
                                              {child.children.map((grandchild, grandIdx) => (
                                                <li key={grandIdx}>{grandchild}</li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .service-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border-color: #e18c1d;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 16px;
        }

        .service-header h3 {
          margin: 0;
          color: #12307a;
          font-size: 20px;
          font-weight: 700;
        }

        .service-link-btn {
          color: #e18c1d;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .service-link-btn:hover {
          color: #be2a2a;
        }

        .service-content {
          max-height: 400px;
          overflow-y: auto;
        }

        .service-content::-webkit-scrollbar {
          width: 4px;
        }

        .service-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .service-content::-webkit-scrollbar-thumb {
          background: #e18c1d;
          border-radius: 10px;
        }

        .service-sub-item {
          padding: 6px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .service-sub-item:last-child {
          border-bottom: none;
        }

        .service-item-name {
          color: #475569;
          font-size: 14px;
        }

        .service-item-with-children strong {
          color: #12307a;
          font-size: 15px;
          display: block;
          margin: 8px 0 4px 0;
        }

        .service-child-list {
          list-style: none;
          padding: 0;
          margin: 4px 0 4px 16px;
        }

        .service-child-list li {
          padding: 3px 0;
          color: #475569;
          font-size: 13px;
          border-bottom: 1px solid #f8f8f8;
        }

        .service-child-list li:last-child {
          border-bottom: none;
        }

        .service-grandchild-list {
          list-style: none;
          padding: 0;
          margin: 2px 0 4px 20px;
        }

        .service-grandchild-list li {
          padding: 2px 0;
          color: #64748b;
          font-size: 12px;
          border-bottom: 1px solid #fafafa;
        }

        .service-grandchild-list li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            padding: 18px;
          }

          .service-header h3 {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}