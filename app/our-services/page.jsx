// app/our-services/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "./ourservices.scss";
import { getImageUrl } from "../../lib/utils/getImagehelper";
import ApiError from "@/components/ApiError/ApiError";
import useBodyClass from "@/components/useBodyClass";

const FALLBACK_IMAGE =
  "/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png";
const HERO_BANNER =
  "/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png";

const getFeaturesForCategory = (categoryName) => {
  const featuresMap = {
    Licensing: [
      "Trade license registration",
      "GST & statutory registration",
      "License renewals",
      "Documentation & filings",
    ],
    Liaisoning: [
      "NOC coordination",
      "Department follow-ups",
      "Regulatory filings",
      "Approval tracking",
    ],
    Electrical: [
      "Safety audits",
      "Load certification",
      "CEIG approval support",
      "Panel & earthing checks",
    ],
    "Piped Natural Gas": [
      "Pipeline installation",
      "Maintenance schedules",
      "Safety inspections",
      "Commercial & industrial sites",
    ],
    Fire: [
      "Fire safety audits",
      "Fire NOC services",
      "Risk assessments",
      "Inspection coordination",
    ],
    AMC: [
      "Annual maintenance contracts",
      "Scheduled inspections",
      "Compliance documentation",
      "Dedicated support",
    ],
    "Real Estate": [
      "Property registration",
      "Legal documentation",
      "Stamp duty registration",
      "Title verification",
    ],
    "Equipment Solution Department": [
      "Industrial equipment sourcing",
      "Installation services",
      "Maintenance support",
      "Vendor coordination",
    ],
  };
  return (
    featuresMap[categoryName] || [
      "Regulatory consultation",
      "Compliance advisory",
      "Documentation support",
      "Department coordination",
    ]
  );
};

const getTagForCategory = (name) => {
  const tags = {
    Licensing: "Registrations & permits",
    Liaisoning: "Government approvals",
    Electrical: "Safety & certification",
    "Piped Natural Gas": "Piped natural gas",
    Fire: "Audits & NOC",
    AMC: "Annual maintenance",
    "Real Estate": "Property documentation",
    "Equipment Solution Department": "Industrial equipment",
  };
  return tags[name] || "Compliance service";
};

const getMockData = () => [
  {
    id: 1,
    name: "Licensing",
    slug: "licensing",
    tag: "Registrations & permits",
    description:
      "Business license registration, trade license applications, GST registration, and statutory permit filings — handled end-to-end with documented department follow-ups.",
    image: getImageUrl("/images/licensing-ourservices.png"),
    features: getFeaturesForCategory("Licensing"),
  },
  {
    id: 2,
    name: "Liaisoning",
    slug: "liaisoning",
    tag: "Government approvals",
    description:
      "NOC coordination, departmental liaisoning, and regulatory filings that keep your project timeline intact — with direct working relationships across departments.",
    image: getImageUrl(
      "/images/businessman-application-human-digital-business.jpg",
    ),
    features: getFeaturesForCategory("Liaisoning"),
  },
  {
    id: 3,
    name: "Electrical",
    slug: "electrical",
    tag: "Safety & certification",
    description:
      "Electrical safety audits, load certification, and CEIG approval support for commercial and industrial facilities — covering panels, earthing, and wiring compliance.",
    image: getImageUrl("/images/electric-ourservices.png"),
    features: getFeaturesForCategory("Electrical"),
  },
  {
    id: 4,
    name: "PNG Services",
    slug: "png-services",
    tag: "Piped natural gas",
    description:
      "End-to-end piped natural gas services — pipeline installation, scheduled maintenance, and safety inspection for commercial and industrial connections.",
    image: getImageUrl("/images/png-ourservices.png"),
    features: getFeaturesForCategory("Piped Natural Gas"),
  },
  {
    id: 5,
    name: "Fire Safety",
    slug: "fire-safety",
    tag: "Audits & NOC",
    description:
      "Fire safety audits, risk assessments, and fire NOC services that meet statutory requirements for your premises category.",
    image: getImageUrl("/images/fire-ourservices.png"),
    features: getFeaturesForCategory("Fire"),
  },
  {
    id: 6,
    name: "AMC Services",
    slug: "amc-services",
    tag: "Annual maintenance",
    description:
      "Annual maintenance contracts across electrical, fire, and PNG systems — with scheduled inspections, documentation, and dedicated compliance support throughout.",
    image: getImageUrl("/images/expert.jpg"),
    features: getFeaturesForCategory("AMC"),
  },
];

const APPROACH = [
  {
    title: "Direct department access",
    text: "Working relationships with licensing and regulatory departments mean faster approvals and fewer returned files.",
  },
  {
    title: "Full process ownership",
    text: "From documentation and filings to final certification — we own every step so nothing stalls in the middle.",
  },
  {
    title: "Transparent pricing",
    text: "Fixed quotes agreed upfront, documented in writing. No hidden charges, no surprise invoices.",
  },
  {
    title: "Dedicated account manager",
    text: "One named point of contact who knows your business, your files, and your deadlines — reachable throughout.",
  },
];

const FAQS = [
  {
    q: "What services does Liaison Bank provide?",
    a: "Liaison Bank provides a range of business support services, including licensing, government liaisoning, regulatory compliance, electrical services, fire safety, piped natural gas (PNG) solutions, and annual maintenance contracts (AMC). We help businesses manage their regulatory and technical requirements through coordinated service support.",
  },
  {
    q: "How can Liaison Bank help my business with government approvals and compliance?",
    a: "We support businesses throughout the approval and compliance process, from understanding requirements and preparing documentation to coordinating applications, communicating with relevant government departments, and following up on approval status. Our aim is to make complex administrative processes more organized and manageable.",
  },
  {
    q: "Which industries and business sectors do you serve?",
    a: "We support businesses across multiple sectors, including construction, healthcare, food and beverages, hospitality, commercial establishments, and industrial facilities. Our services are tailored to the regulatory, licensing, and technical requirements of each business and project.",
  },
  {
    q: "Can Liaison Bank manage multiple services and approvals for a single project?",
    a: "Yes. We can coordinate multiple service requirements under a single project, including licensing, government liaisoning, fire safety, electrical compliance, and PNG-related services. Our integrated approach helps streamline documentation, departmental coordination, and project-related follow-ups.",
  },
  {
    q: "Do you provide technical services in addition to licensing and liaisoning?",
    a: "Yes. Along with licensing and government liaisoning, our service portfolio includes fire safety systems, electrical audits and certification support, piped natural gas (PNG) solutions, and related technical services. These services help businesses address both regulatory and operational requirements.",
  },
  {
    q: "How does Liaison Bank handle the documentation and application process?",
    a: "We help identify the documentation and procedural requirements relevant to your service or project, assist with preparing and organizing the necessary paperwork, coordinate application submissions, and follow up with the concerned authorities. The exact documentation requirements depend on the type of service and applicable regulations.",
  },
  {
    q: "How long does it take to complete a licensing or approval process?",
    a: "The timeline depends on the type of license or approval, the applicable regulatory authority, document completeness, inspection requirements, and departmental processing time. Once we understand your requirement, our team can help explain the expected process and relevant stages.",
  },
  {
    q: "Does Liaison Bank provide ongoing maintenance and compliance support?",
    a: "Yes. Our Annual Maintenance Contract (AMC) services provide scheduled maintenance and support for applicable systems, including electrical, fire safety, and PNG installations. The scope and maintenance schedule are determined according to the facility's requirements and agreed service arrangement.",
  },
  {
    q: "How will I receive updates about my applications and project progress?",
    a: "Our team coordinates departmental follow-ups and tracks relevant application and approval stages. We keep clients informed about progress, pending documentation, required actions, and the next steps throughout the engagement.",
  },
  {
    q: "How can I get started with Liaison Bank's services?",
    a: "Getting started is simple. Contact our team through the enquiry form, phone, or email and share your business details and service requirements. Our team will understand your needs, discuss the relevant service options, and guide you through the appropriate next steps.",
  },
];

export default function OurServices() {
  useBodyClass("ourservices");
  const router = useRouter();
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqs, setOpenFaqs] = useState({});
  const [loadingService, setLoadingService] = useState(null);

  const toggleFaq = (question) => {
    setOpenFaqs((previous) => ({
      ...previous,
      [question]: !previous[question],
    }));
  };
  const handleExploreMore = (slug) => {
    setLoadingService(slug);
    // Small delay ensures the UI updates and the loader is visible before navigation
    setTimeout(() => {
      router.push(`/our-services/${slug}`);
    }, 400);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/categories`,
        );
        if (!response.ok) throw new Error("Failed to fetch services");
        const result = await response.json();

        if (result.success && result.data) {
          const transformedData = result.data.map((category) => {
            const imagePath =
              category.image ||
              category.imageUrl ||
              category.image_path ||
              null;
            let fullImageUrl = FALLBACK_IMAGE;
            if (imagePath) {
              try {
                fullImageUrl = getImageUrl(imagePath);
              } catch (err) {
                console.error(
                  `Error generating URL for ${category.name}:`,
                  err,
                );
                fullImageUrl = FALLBACK_IMAGE;
              }
            }
            return {
              id: category.id,
              name: category.name,
              slug:
                category.slug ||
                category.name.toLowerCase().replace(/\s+/g, "-"),
              tag: category.tag || getTagForCategory(category.name),
              description:
                category.description ||
                `${category.name} services for businesses — trusted by 300+ clients across India.`,
              image: fullImageUrl,
              features:
                category.features || getFeaturesForCategory(category.name),
            };
          });
          setServicesData(transformedData);
        } else {
          setServicesData(getMockData());
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
      <div className="ec-loading">
        <div className="container">
          <div className="ec-skeleton ec-skeleton-overline" />
          <div className="ec-skeleton ec-skeleton-title" />
          <div className="ec-skeleton ec-skeleton-lede" />
          <div className="ec-skeleton ec-skeleton-lede short" />
          <div className="ec-skeleton-row" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ec-skeleton-entry">
              <div className="ec-skeleton ec-skeleton-media" />
              <div className="ec-skeleton-entry-body">
                <div className="ec-skeleton ec-skeleton-entry-tag" />
                <div className="ec-skeleton ec-skeleton-entry-title" />
                <div className="ec-skeleton ec-skeleton-entry-desc" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ApiError
        title="Services Temporarily Unavailable"
        message="Our service information is temporarily unavailable. Please try again shortly."
        onRetry={() => window.location.reload()}
        statusCode={error.status ? `ERR · ${error.status}` : "ERR · TIMEOUT"}
        statusTone={error.status >= 500 ? "danger" : "warning"}
        backToHome={() => window.open("/", "_self")}
      />
    );
  }

  return (
    <>
      <Head>
        <title>
          Our Services | Licensing, Liaisoning &amp; Compliance Solutions
        </title>
        <meta
          name="description"
          content="Professional licensing, liaisoning, electrical safety, fire NOC, PNG, AMC, and compliance services for businesses. 500+ projects delivered, 98% success rate."
        />
        <meta
          name="keywords"
          content="licensing services, liaisoning services, electrical safety audit, fire NOC services, PNG services, AMC services, compliance services India, business license consultant"
        />
        <link rel="canonical" href="https://yourdomain.com/our-services" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Barlow+Condensed:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ============ HERO BANNER ============ */}
      <section className="ec-hero">
        <div className="ec-hero-bg">
          <Image
            src={HERO_BANNER}
            alt="Compliance specialists reviewing regulatory documentation"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="ec-hero-overlay" />

        <div className="ec-hero-inner">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="ec-hero-copy"
            >
              <h1 className="ec-hero-title">
                Licensing, liaisoning &amp; compliance — without the delays.
              </h1>
              <p className="ec-hero-lede">
                We handle every approval, license, and regulatory requirement on
                your behalf — from business license registration to fire NOC
                services and electrical safety audits. Each service is led by a
                specialist with direct department experience.
              </p>
              <div className="ec-hero-actions">
                <Link href="#services" className="ec-btn ec-btn--light">
                  Explore Services
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link href="/contact" className="ec-btn ec-btn--light">
                  Request a Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="ec-hero-stats">
          <div className="container">
            <div className="ec-hero-stats-inner">
              {[
                { v: "500+", l: "Projects delivered" },
                { v: "300+", l: "Businesses served" },
                { v: "10+", l: "Years of experience" },
                { v: "98%", l: "Compliance success" },
              ].map((s, i) => (
                <div key={i} className="ec-hero-stat">
                  <span className="ec-hero-stat-value">{s.v}</span>
                  <span className="ec-hero-stat-label">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="ec-services" id="services">
        <div className="container">
          <div className="ec-services-head">
            <div>
              <span className="ec-overline">Our expertise</span>
              {/* Replaced em with a span for specific coloring */}
              <h2 className="ec-services-title">
                Six services. <br />
                <span className="accent-text">One standard.</span>
              </h2>
            </div>
            <p className="ec-services-intro">
              Licensing, liaisoning, electrical safety, fire NOC, PNG, and
              maintenance contracts — each led by a named specialist with direct
              working relationships across government departments.
            </p>
          </div>

          <div className="ec-entries">
            {servicesData.map((service, i) => (
              <motion.article
                key={service.id}
                id={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i * 0.04, 0.2),
                }}
                className="ec-entry"
              >
                <div className="ec-entry-grid">
                  <div className="ec-entry-media">
                    <Image
                      src={service.image || FALLBACK_IMAGE}
                      alt={`${service.name} services`}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      unoptimized
                    />
                  </div>

                  <div className="ec-entry-body">
                    <div className="ec-entry-meta">
                      <span className="ec-entry-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="ec-entry-tag">{service.tag}</span>
                    </div>
                    <h3 className="ec-entry-title">{service.name} Services</h3>
                    <p className="ec-entry-desc">{service.description}</p>
                    <div className="ec-entry-deliverables">
                      {service.features.slice(0, 4).map((f, idx) => (
                        <span key={idx} className="ec-deliverable">
                          {f}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleExploreMore(service.slug)}
                      className="ec-entry-link"
                      title={`${service.name} services — learn more`}
                      disabled={loadingService === service.slug}
                    >
                      {loadingService === service.slug ? (
                        <>
                          <svg
                            className="ec-loader-spinner"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ width: "25px", height: "25px" }} // <-- CHANGED FROM 14px TO 18px
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              strokeOpacity="0.25"
                            />
                            <path
                              d="M12 2a10 10 0 0 1 10 10"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          Explore More
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path
                              d="M5 12h14M12 5l7 7-7 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPROACH ============ */}
      <section className="ec-approach">
        <div className="container">
          <div className="ec-approach-grid">
            <div>
              <span className="ec-overline">How we work</span>
              <h2 className="ec-approach-title">
                Handled by specialists, not generalists.
              </h2>
              <p className="ec-approach-lede">
                We don't outsource your file. Every engagement is led by a named
                specialist who owns the process from first document to final
                certification.
              </p>
            </div>
            <ul className="ec-approach-list">
              {APPROACH.map((item, i) => (
                <li key={i} className="ec-approach-item">
                  <span className="ec-approach-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="ec-approach-item-title">{item.title}</h4>
                    <p className="ec-approach-item-text">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="ec-cta">
        <div className="container">
          <div className="ec-cta-block">
            <div>
              <span className="ec-overline">Next step</span>
              <h2 className="ec-cta-title">
                Not sure which compliance service you need? Start here.
              </h2>
              <p className="ec-cta-text">
                Tell us about your business and we'll recommend the right
                licensing, liaisoning, or compliance pathway — free of charge,
                no obligation.
              </p>
            </div>
            <div className="ec-cta-actions">
              <Link
                href="/contact-us-liaison-bank"
                className="ec-btn ec-btn--solid"
              >
                Request a Free Consultation
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <a href="tel:+919769458515" className="ec-btn-phone">
                or call +91 97694 58515
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="ec-faq">
        <div className="container">
          <div className="ec-faq-grid">
            <div className="ec-faq-heading">
              <span className="ec-overline">Common questions</span>
              <h2 className="ec-faq-title">Questions, answered.</h2>
              <p className="ec-faq-lede">
                Can't find what you're looking for? Our compliance specialists
                are happy to answer questions about your specific requirement.
              </p>
            </div>

            <div className="ec-faq-columns">
              {[
                FAQS.slice(0, Math.ceil(FAQS.length / 2)),
                FAQS.slice(Math.ceil(FAQS.length / 2)),
              ].map((faqColumn, columnIndex) => (
                <div className="ec-faq-list" key={`faq-column-${columnIndex}`}>
                  {faqColumn.map((item, itemIndex) => {
                    const isOpen = Boolean(openFaqs[item.q]);
                    const answerId = `faq-answer-${columnIndex}-${itemIndex}`;

                    return (
                      <div
                        key={`${columnIndex}-${itemIndex}`}
                        className={`ec-faq-item ${isOpen ? "is-open" : ""}`}
                      >
                        <button
                          type="button"
                          className={`ec-faq-q ${isOpen ? "is-open" : ""}`}
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => toggleFaq(item.q)}
                        >
                          <span>{item.q}</span>
                          <span className="ec-faq-icon" aria-hidden="true">
                            {isOpen ? "×" : "+"}
                          </span>
                        </button>

                        <div
                          id={answerId}
                          className={`ec-faq-answer ${isOpen ? "is-open" : ""}`}
                          aria-hidden={!isOpen}
                        >
                          <div className="ec-faq-answer-inner">
                            <p className="ec-faq-a">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
