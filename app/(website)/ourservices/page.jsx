"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import useBodyClass from '@/components/useBodyClass';

export default function OurServices() {
  useBodyClass('our-services');
  const [expandedSections, setExpandedSections] = useState({});
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories/our-services`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        
        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.success && result.data) {
          // Transform API data to match the component structure
          const transformedData = result.data.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            pdf: category.pdf,
            items: category.subCategories?.map((sub) => ({
              id: sub.id,
              name: sub.name,
              pdf: sub.pdf,
              href: sub.href,
              service: sub.service || [],
              children: sub.items?.map((item) => ({
                id: item.id,
                name: item.name,
                pdf: item.pdf,
                href: item.href,
                service: item.service || [],
                children: item.children || []
              })) || []
            })) || []
          }));
          
          setServicesData(transformedData);
        } else {
          setServicesData([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
        setServicesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Toggle function for accordion
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Recursive function to render menu items
  const renderMenuItems = (items, level = 0, parentIndex = '') => {
    if (!items || items.length === 0) return null;

    return (
      <ul className={`menu-level-${level}`}>
        {items.map((item, index) => {
          const itemKey = `${parentIndex}-${index}`;
          const hasChildren = item.children && item.children.length > 0;
          const hasServices = item.service && item.service.length > 0;

          return (
            <li key={itemKey} className="menu-item">
              {hasChildren || hasServices ? (
                // Has children or services - render as accordion
                <div className="menu-accordion">
                  <button 
                    className="menu-toggle"
                    onClick={() => toggleSection(itemKey)}
                  >
                    <span className="menu-name">{item.name}</span>
                    <span className="menu-arrow">
                      {expandedSections[itemKey] ? '▼' : '▶'}
                    </span>
                  </button>
                  {expandedSections[itemKey] && (
                    <div className="menu-children">
                      {/* Render services if available */}
                      {hasServices && (
                        <ul className="service-list">
                          {item.service.map((service, idx) => (
                            <li key={idx} className="service-item">
                              <span className="service-name">{service}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Render children */}
                      {hasChildren && renderMenuItems(item.children, level + 1, itemKey)}
                    </div>
                  )}
                </div>
              ) : (
                // Leaf node - render as link or item
                item.href ? (
                  <Link href={item.href} className="menu-link">
                    {item.name}
                    {item.pdf && <span className="pdf-badge">PDF</span>}
                  </Link>
                ) : (
                  <span className="menu-item-name">{item.name}</span>
                )
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Loading state
  if (loading) {
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
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading services...</p>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (error) {
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
          <div className="alert alert-danger text-center">
            <h4>Failed to load services</h4>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </section>
      </>
    );
  }

  // Empty state
  if (servicesData.length === 0) {
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
          <div className="text-center">
            <p>No services available at the moment.</p>
          </div>
        </section>
      </>
    );
  }

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
                <div key={service.id || index} className="service-card">
                  <div className="service-header">
                    <h3>{service.name}</h3>
                    {service.href && (
                      <Link href={service.href} className="service-link-btn">
                        Learn More →
                      </Link>
                    )}
                    {service.pdf && (
                      <a 
                        href={service.pdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="pdf-download-btn"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                  
                  {service.items && service.items.length > 0 && (
                    <div className="service-content">
                      {service.items.map((item, idx) => (
                        <div key={item.id || idx} className="service-sub-item">
                          <div className="service-item-with-children">
                            <strong>{item.name}</strong>
                            
                            {/* Render services if available */}
                            {item.service && item.service.length > 0 && (
                              <ul className="service-child-list">
                                {item.service.map((serviceItem, si) => (
                                  <li key={si} className="service-item-name">
                                    {serviceItem}
                                  </li>
                                ))}
                              </ul>
                            )}
                            
                            {/* Render children recursively */}
                            {item.children && item.children.length > 0 && (
                              <div className="service-children">
                                {renderMenuItems(item.children, 1, `${index}-${idx}`)}
                              </div>
                            )}
                          </div>
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
          flex-wrap: wrap;
          gap: 10px;
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

        .pdf-download-btn {
          background: #e18c1d;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .pdf-download-btn:hover {
          background: #be2a2a;
          color: white;
        }

        .service-content {
          max-height: 500px;
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
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .service-sub-item:last-child {
          border-bottom: none;
        }

        .service-item-with-children strong {
          color: #12307a;
          font-size: 15px;
          display: block;
          margin: 4px 0;
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

        .service-item-name {
          color: #475569;
          font-size: 13px;
        }

        .service-children {
          margin-left: 16px;
          margin-top: 4px;
        }

        /* Menu styles for recursive rendering */
        .menu-level-0,
        .menu-level-1,
        .menu-level-2 {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu-item {
          padding: 2px 0;
        }

        .menu-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 6px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #12307a;
          font-weight: 500;
          transition: background 0.2s ease;
          border-radius: 4px;
        }

        .menu-toggle:hover {
          background: #f0f4ff;
        }

        .menu-name {
          flex: 1;
          text-align: left;
        }

        .menu-arrow {
          font-size: 12px;
          color: #e18c1d;
        }

        .menu-children {
          padding-left: 16px;
          border-left: 2px solid #e2e8f0;
          margin: 2px 0 4px 8px;
        }

        .menu-link {
          display: block;
          padding: 4px 8px;
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
          border-radius: 4px;
        }

        .menu-link:hover {
          color: #e18c1d;
          background: #f8fafc;
        }

        .menu-item-name {
          display: block;
          padding: 4px 8px;
          color: #475569;
          font-size: 14px;
        }

        .pdf-badge {
          background: #e18c1d;
          color: white;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 8px;
        }

        .service-list {
          list-style: none;
          padding: 0;
          margin: 4px 0 4px 16px;
        }

        .service-item {
          padding: 2px 0;
        }

        .service-name {
          color: #475569;
          font-size: 13px;
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

          .service-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}