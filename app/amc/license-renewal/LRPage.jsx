"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import useBodyClass from "@/components/useBodyClass";
import { faqData, licFaqData } from "@/lib/data/faqData";

export default function LRPage() {
  useBodyClass("license-renewal");
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(null);

  const wrapperRef = useRef(null);
    const toggleAccordion = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  
    /* Outside Click Close */
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target)
        ) {
          setActiveIndex(null);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener(
          "mousedown",
          handleClickOutside
        );
      };
    }, []);

  const processSteps = [
    {
      title: "Document Review",
      desc: "Assessment of existing licenses, validity status, and compliance requirements.",
    },
    {
      title: "Requirement Analysis",
      desc: "Identification of authority-specific renewal procedures and documentation.",
    },
    {
      title: "Documentation & Application Preparation",
      desc: "Preparation and verification of forms, declarations, and supporting documents.",
    },
    {
      title: "Submission & Department Coordination",
      desc: "Application filing and continuous follow-up with relevant authorities.",
    },
    {
      title: "Approval & Renewal Completion",
      desc: "Successful completion of renewal procedures and updated compliance records.",
    },
  ];

  const documents = [
    "Existing license copy",
    "PAN card of business/entity",
    "Aadhaar card of authorized person",
    "Address proof of establishment",
    "Electricity bill",
    "Tax receipts",
    "Previous compliance certificates",
    "Partnership deed or incorporation certificate",
    "Employee details (if applicable)",
    "Supporting NOC documents (if applicable)",
  ];

  const authorities = [
    "Municipal Corporation",
    "Fire Department",
    "Labour Department",
    "Pollution Control Board",
    "Factory Inspectorate",
    "Food Safety Department",
    "Electrical Department",
    "Industrial Development Authorities",
    "Local Civic Authorities",
  ];

  const industries = [
    "Manufacturing Units",
    "Warehouses",
    "Restaurants & Cafes",
    "Retail Stores",
    "Commercial Offices",
    "Hospitals & Clinics",
    "Educational Institutions",
    "Hotels & Hospitality",
    "Industrial Plants",
    "Residential Complexes",
    "Shopping Malls",
  ];

  const whyChoose = [
    {
      title: "End-to-End Assistance",
      desc: "From documentation to departmental coordination, we manage the complete renewal process.",
    },
    {
      title: "Timely Compliance Support",
      desc: "We help businesses avoid delays, penalties, and compliance lapses.",
    },
    {
      title: "Multi-Department Expertise",
      desc: "Assistance across fire, factory, labour, municipal, pollution, and commercial approvals.",
    },
    {
      title: "Experienced Team",
      desc: "Professional handling of regulatory procedures and compliance documentation.",
    },
    {
      title: "Customized Solutions",
      desc: "Renewal support tailored to different industries and operational requirements.",
    },
    {
      title: "Reliable Follow-Ups",
      desc: "Continuous coordination with authorities for smooth processing.",
    },
  ];

  const selectedFaq =
    pathname === "/amc/license-renewal"
      ? licFaqData
      : faqData;
  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>
                      License Renewal
                    </h1>

                    <nav
                      aria-label="breadcrumb"
                      className="page-breadcrumb"
                    >
                      <ol
                        className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i
                              className="bi bi-house-door me-1"
                              aria-hidden="true"
                            ></i>
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          License Renewal
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

      {/* HERO SECTION */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <div
                className="section-title">
                <h2 className="fw-bold">
                  License Extension Services
                </h2>
              </div>

              <h5
                className="lead mt-4">
                Avoid penalties, compliance delays, and operational interruptions with timely renewal of business licenses, registrations, and statutory approvals across multiple departments.
              </h5>

              <div
                className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <Link
                  href="/contact"
                  className="themeht-btn primary-btn btn px-4 py-2"
                >
                  Ask Expert
                </Link>

                <Link href="/contact-us-liaison-bank" className="themeht-btn primary-btn btn px-4 py-2">
                  Request Renewal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="container py-5">
        <div className="row justify-content-center text-center">

          <div
            className="section-title mt-4"
          >
            <h3>What is License Renewal?</h3>
          </div>

          <div>
            <p className="text-center"> 
              License renewal is the process of extending the validity of
              government-issued licenses, registrations, permits, and operational
              approvals required for businesses to continue functioning legally
              and smoothly. Many approvals require periodic renewal annually or as per
              departmental regulations. Failure to renew licenses on time may
              lead to penalties, legal notices, operational disruptions, or
              cancellation of approvals. At <strong>Liaison Bank</strong>, we provide smooth{" "}
              <strong>license renewal services</strong>, helping businesses renew
              licenses online, track expiry dates, and manage complete{" "}
              <strong>license compliance and documentation.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* OVERVIEW TABLE */}
      <section className="pb-5">
        <div className="container">
          <div
            className="section-title text-center">
            <h3>Overview</h3>
          </div>

          <div
            className="table-responsive mt-4">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">License Renewal Process</th>
                  <th className="text-center">Importance of License Renewal</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    Identify expiring licenses and track renewal deadlines
                    efficiently
                  </td>
                  <td>
                    Ensures full compliance with government rules and regulatory
                    authorities
                  </td>
                </tr>

                <tr>
                  <td>
                    Collect and verify required documents for license renewal
                    application
                  </td>
                  <td>
                    Prevents penalties, late fees, and legal complications
                  </td>
                </tr>

                <tr>
                  <td>
                    Submit online/offline renewal applications with accurate
                    details
                  </td>
                  <td>
                    Maintains business continuity without operational disruptions
                  </td>
                </tr>

                <tr>
                  <td>
                    Follow up with authorities for approvals and certification
                  </td>
                  <td>
                    Builds trust, credibility, and seamless business operations
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHY IMPORTANT */}
      <section className="py-5 bg-light lc-renewal">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">Why is License Renewal Important?</h3>
          </div>

          <div className="row g-4">
            {[
              "Avoid penalties and late fees",
              "Ensure uninterrupted business operations",
              "Maintain regulatory compliance",
              "Prevent legal complications and notices",
              "Support smooth inspections and audits",
              "Maintain operational credibility",
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body bg-secondary text-center p-4">
                    <h5>{item}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">Our License Renewal Process</h3>
          </div>

          <div className="row g-4">
            {processSteps.map((step, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div
                      className="count bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      {index + 1}
                    </div>

                    <h5>{step.title}</h5>
                    <p>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="py-5 bg-light lc-faqs">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">
              Documents Required for License Renewal
            </h3>
          </div>

          <div className="row g-4">
            {documents.map((doc, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="card border-1 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="mb-0">{doc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHORITIES */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">Authorities & Departments Involved</h3>
          </div>

          <div className="row g-4">
            {authorities.map((item, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body text-center">
                    <h6 className="mb-0">{item}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">Industries We Serve</h3>
          </div>

          <div className="row g-4">
            {industries.map((item, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body text-center">
                    <h6 className="mb-0">{item}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">
              Why Choose Liaisonbank for License Renewal Services?
            </h3>
          </div>

          <div className="row g-4">
            {whyChoose.map((item, index) => (
              <div className="col-md-6" key={index}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5 bg-light lc-faqs">
        <div className="container">
          <div className="text-center mb-5 section-title">
            <h3 className="fw-bold">Frequently Asked Questions</h3>
          </div>

          <div className="row" ref={wrapperRef}>
            {selectedFaq.map((faq, index) => (
            <div className="col-lg-6 mb-4" key={index}>
              <div className="accordion">
                <div className="accordion-item border-0 rounded-4 overflow-hidden shadow-sm">

                  {/* Accordion Header */}
                  <h2 className="accordion-header">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      className={`accordion-button ${
                        activeIndex !== index ? "collapsed" : ""
                      }`}
                    >
                      {faq.question}
                    </button>
                  </h2>

                  {/* Accordion Body */}
                  {activeIndex === index && (
                    <div className="accordion-collapse">
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}