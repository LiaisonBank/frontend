// app/our-services/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import "./ourservices.scss";
import { getImageUrl } from "../../lib/utils/getImagehelper";

// Fallback image
const FALLBACK_IMAGE = '/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png';
const HERO_BACKGROUND = '/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png';

export default function OurServices() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Define unique features for each service type
  const getFeaturesForCategory = (categoryName) => {
    const featuresMap = {
      'Licensing': ['Business License Applications',  'Renewal Services',  'Documentation Support'],
      'Liaisoning': ['Government Approvals',  'Regulatory Compliance', 'Department Coordination'],
      'Electrical': ['Electrical Audits', 'Safety Certifications', 'Energy Optimization'],
      'Piped Natural gas': ['Pipeline Installation', 'Maintenance', 'Safety Inspections'],
      'Fire': ['Fire Audits', 'Risk Assessments', 'Certification',],
      'AMC': ['Annual Maintenance', 'Compliance Support', 'Regular Inspections', ],
            'Real Estate': [
        'Property Registration', 
        'Legal Documentation', 
        'Stamp Duty & Registration',
      ],
            // Equipment Solution Department
      'Equipment Solution Department': [
        'Equipment Sourcing', 
        'Installation & Commissioning', 
        'Maintenance & Repairs', 
      ],
    };

    // Return features based on category name, or default if not found
    return featuresMap[categoryName] || ['Expert Consultation', 'Fast Turnaround', '100% Compliance',];
  };

  

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const result = await response.json();

        if (result.success && result.data) {
          const transformedData = result.data.map((category) => {
            const imagePath = category.image || category.imageUrl || category.image_path || null;
            
            let fullImageUrl = FALLBACK_IMAGE;
            if (imagePath) {
              try {
                fullImageUrl = getImageUrl(imagePath);
              } catch (err) {
                console.error(`Error generating URL for ${category.name}:`, err);
                fullImageUrl = FALLBACK_IMAGE;
              }
            }

            // Get features based on category name
            const features = category.features || getFeaturesForCategory(category.name);

            return {
              id: category.id,
              name: category.name,
              slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
              description: category.description || `Expert ${category.name} services for your business.`,
              image: fullImageUrl,
              features: features,
            };
          });
          
          setServicesData(transformedData);
        } else {
          console.warn('No data from backend, using mock data');
          const mockData = [
            {
              id: 1,
              name: "Licensing",
              slug: "licensing",
              description: "Expert Licensing services for your business. Get all your licenses and permits with our professional guidance.",
              image: getImageUrl('/images/licensing-ourservices.png'),
              features: ['Business License Applications', 'Permit Management', 'Renewal Services', 'Compliance Monitoring', 'Documentation Support'],
            },
            {
              id: 2,
              name: "Liaisoning",
              slug: "liaisoning",
              description: "Expert Liaisoning services for your business. Navigate government regulations with ease.",
              image: getImageUrl('/images/businessman-application-human-digital-business.jpg'),
              features: ['Government Approvals', 'NOC Services', 'Regulatory Compliance', 'Department Coordination', 'File Tracking'],
            },
            {
              id: 3,
              name: "Electrical",
              slug: "electrical",
              description: "Expert Electrical services for your business. Professional electrical audit and certification.",
              image: getImageUrl('/images/electric-ourservices.png'),
              features: ['Electrical Audits', 'Safety Certifications', 'Load Analysis', 'Compliance Reports', 'Energy Optimization'],
            },
            {
              id: 4,
              name: "PNG Services",
              slug: "png-services",
              description: "Expert PNG services for your business. Complete Piped Natural Gas solutions.",
              image: getImageUrl('/images/png-ourservices.png'),
              features: ['Site Survey', 'Pipeline Installation', 'Commissioning', 'Maintenance', 'Safety Inspections'],
            },
            {
              id: 5,
              name: "Fire Safety",
              slug: "fire-safety",
              description: "Expert Fire Safety services for your business. Comprehensive fire safety audits.",
              image: getImageUrl('/images/fire-ourservices.png'),
              features: ['Fire Audits', 'Risk Assessments', 'Safety Training', 'Certification', 'Equipment Inspection'],
            },
            {
              id: 6,
              name: "AMC Services",
              slug: "amc-services",
              description: "Expert AMC services for your business. Annual maintenance contracts for compliance.",
              image: getImageUrl('/images/expert.jpg'),
              features: ['Annual Maintenance', 'Compliance Support', 'Regular Inspections', 'Dedicated Support', 'Emergency Response'],
            },
          ];
          setServicesData(mockData);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="services-loading">
        <div className="container">
          <div className="loading-header">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-subtitle"></div>
          </div>
          <div className="services-grid">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-error">
        <div className="container">
          <div className="error-box">
            <h2>⚠️ Failed to Load Services</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* Hero Section */}
      <section className="services-hero"
       style={{
          backgroundImage: `url(${HERO_BACKGROUND})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge"></div>
            <h1 className="hero-title">
              Expert <span className="highlight">Solutions</span> for Your Business
            </h1>
            <p className="hero-subtitle">
              Professional liaisoning, licensing, and regulatory compliance services
              to help you navigate government requirements with ease.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-grid-section" id="services">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="grid-title">
              <span className="highlight">Services</span>
            </h2>
            <p className="grid-subtitle">
              Comprehensive professional services tailored to your business needs
            </p>
          </motion.div>

          <div className="services-grid">
            {servicesData.map((service, index) => {
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 + 0.3 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="service-card-wrapper"
                >
                  <Link href={`/our-services/${service.slug}`} className="service-card-link">
                    <div className="service-card-modern">
                      <div className="service-card-image-full">
                        <img
                          src={service.image || FALLBACK_IMAGE}
                          alt={service.name || "Service"}
                          onError={(e) => {
                            console.warn(
                              `Image failed to load for ${service?.name}:`,
                              service?.image
                            );
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="card-overlay-full">
                          <div className="card-content-overlay">
                            <h3 className="card-title-overlay">{service.name}</h3>
                            <p className="card-description-overlay"></p>

                            <div className="card-features-overlay">
                              {service.features && service.features.slice(0, 3).map((feature, idx) => (
                                <span key={idx} className="feature-chip-overlay">
                                  {feature}
                                </span>
                              ))}
                              {service.features && service.features.length > 3 && (
                                <span className="feature-chip-more-overlay">
                                  +{service.features.length - 3} more
                                </span>
                              )}
                            </div>

                            <div className="card-footer-overlay">
                              <span className="card-number-overlay">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <button className="card-btn-overlay">
                                Learn More
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14" />
                                  <path d="M12 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-gradient-bar-overlay" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats & Contact Section */}
      <section className="contact-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="stats-contact-wrapper">
              <div className="stats-grid">
                <div className="stat-item-simple">
                  <span className="stat-number">500+</span>
                  <span className="stat-label-simple">Projects Completed</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item-simple">
                  <span className="stat-number">300+</span>
                  <span className="stat-label-simple">Happy Clients</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item-simple">
                  <span className="stat-number">10+</span>
                  <span className="stat-label-simple">Years Experience</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item-simple">
                  <span className="stat-number">98%</span>
                  <span className="stat-label-simple">Success Rate</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}