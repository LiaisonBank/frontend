"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useBodyClass from '@/components/useBodyClass';
import TeamSwiper from "@/components/TeamSwiper";

// Import your images here - update paths as needed
import liaisoningImg from "@/assets/images/liaisoning-in-real-estate.webp";
import licensingImg from "@/assets/images/licensing-services.png";
import pngImg from "@/assets/images/PNG.png";
import fireImg from "@/assets/images/fire4.png";
import electricalImg from "@/assets/images/Electrical.png";
import amcImg from "@/assets/images/dummyAMC.png";

export default function AboutUsLiaisonPage() {
  useBodyClass('about-us');
  
  // State for image loading errors
  const [fireImageError, setFireImageError] = useState(false);

  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>About Us</h1>
                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" aria-hidden="true"></i>
                            Home
                          </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          About Us
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

      <div className="about-page-wrapper">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10">
                <div className="hero-badge">
                  <span>✦ Trusted Partner Since 2007</span>
                </div>
                <h1 className="about-hero-title">
                  Your Trusted Partner for <br />
                  <span className="about-hero-highlight">Liaisoning &amp; Licensing</span>
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="about-intro">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-intro-box">
                  <p className="about-intro-text">
                    <span className="about-brand">Liaison Bank </span> provides end-to-end liaisoning, licensing,
                    regulatory compliance, helping businesses and individuals efficiently navigate government
                    requirements and regulatory processes. We act as a professional interface between our clients
                    and government departments, regulatory authorities, and statutory bodies, supporting them with
                    approvals, permissions, NOCs, and compliance requirements. Our services cover PNG (Natural Gas),
                    Fire &amp; Electrical, and other regulatory and statutory requirements, ensuring a smooth and
                    efficient process from initiation to completion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liaisoning Services */}
        <section className="about-service">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-service-card">
                  <div className="about-service-header">
                    <div className="service-number">01</div>
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">Liaisoning Services</h2>
                  </div>
                  <div className="about-service-body">
                    <div className="row align-items-center g-4">
                      <div className="col-lg-6">
                        <div className="about-service-image">
                          <Image
                            src={liaisoningImg}
                            alt="Liaisoning Services"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="about-service-text">
                          <p className="service-description">
                            We provide comprehensive liaisoning services helping businesses navigate complex
                            government regulations and statutory requirements. Our team acts as a bridge between
                            clients and regulatory authorities, ensuring smooth approvals, permissions, and
                            compliance with all legal formalities.
                          </p>
                          <div className="service-features">
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Government Approvals &amp; Permissions</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Regulatory Compliance Management</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Statutory Body Coordination</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Documentation &amp; Formalities</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Licensing Services */}
        <section className="about-service alt-bg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-service-card">
                  <div className="about-service-header">
                    <div className="service-number">02</div>
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">Licensing Services</h2>
                  </div>
                  <div className="about-service-body">
                    <div className="row align-items-center g-4">
                      <div className="col-lg-6 order-lg-2">
                        <div className="about-service-image">
                          <Image
                            src={licensingImg}
                            alt="Licensing Services"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 order-lg-1">
                        <div className="about-service-text">
                          <p className="service-description">
                            We assist businesses in obtaining and managing various licenses required for their
                            operations. Our expertise covers a wide range of licenses across different sectors,
                            ensuring your business remains compliant and operational.
                          </p>
                          <div className="service-features">
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Business Licenses &amp; Registrations</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>NOC &amp; Certificate Procurements</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Industry-Specific Permits</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>License Renewal &amp; Management</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Compliance Documentation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PNG Services */}
        <section className="about-service">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-service-card">
                  <div className="about-service-header">
                    <div className="service-number">03</div>
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">PNG (Piped Natural Gas) Services</h2>
                  </div>
                  <div className="about-service-body">
                    <div className="row align-items-center g-4">
                      <div className="col-lg-6">
                        <div className="about-service-image">
                          <Image
                            src={pngImg}
                            alt="PNG Services"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="about-service-text">
                          <p className="service-description">
                            We provide comprehensive end-to-end PNG Services for commercial, residential,
                            industrial, hospitality, healthcare, food &amp; beverage, restaurants, and other eligible
                            establishments. Our services include site survey, documentation, installation, testing,
                            and commissioning.
                          </p>
                          <div className="service-features two-col">
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Site Survey &amp; Assessment</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>MGL Documentation &amp; Approvals</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Pipeline Installation</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Pressure &amp; Leak Testing</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Commissioning &amp; Gas Charging</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Compliance &amp; Certification</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fire Services - Fixed with proper fallback */}
        <section className="about-service alt-bg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-service-card">
                  <div className="about-service-header">
                    <div className="service-number">04</div>
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">Fire Services</h2>
                  </div>
                  <div className="about-service-body">
                    <div className="row align-items-center g-4">
                      <div className="col-lg-6 order-lg-2">
                        <div className="about-service-image">
                          {!fireImageError ? (
                            <Image
                              src={fireImg}
                              alt="Fire Services"
                              width={0}
                              height={0}
                              sizes="100vw"
                              style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                              priority
                              onError={() => setFireImageError(true)}
                            />
                          ) : (
                            <div className="image-fallback">
                              <span className="fallback-icon">🔥</span>
                              <span className="fallback-text">Fire Services</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 order-lg-1">
                        <div className="about-service-text">
                          <p className="service-description">
                            We provide comprehensive Fire Safety Services including audits, risk assessments,
                            compliance verification, and certification. Our team ensures your establishment meets
                            all fire safety regulations and statutory requirements.
                          </p>
                          <div className="service-features two-col">
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Fire Safety Audits</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Fire NOC &amp; Approvals</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Fire Certification</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Risk Assessment</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Equipment Installation</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Fire Drill &amp; Training</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Electrical Services */}
        <section className="about-service">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-service-card">
                  <div className="about-service-header">
                    <div className="service-number">05</div>
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">Electrical Services</h2>
                  </div>
                  <div className="about-service-body">
                    <div className="row align-items-center g-4">
                      <div className="col-lg-6">
                        <div className="about-service-image">
                          <Image
                            src={electricalImg}
                            alt="Electrical Services"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="about-service-text">
                          <p className="service-description">
                            We provide comprehensive Electrical Audit &amp; Certification Services ensuring your
                            electrical systems are safe, compliant, and efficient. Our services help businesses
                            meet all regulatory requirements and safety standards.
                          </p>
                          <div className="service-features two-col">
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Electrical Safety Audits</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Compliance Verification</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Electrical NOC &amp; Approvals</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Risk Assessment</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Electrical Certification</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>System Upgradation Support</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AMC Services */}
        <section className="about-service alt-bg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-service-card">
                  <div className="about-service-header">
                    <div className="service-number">06</div>
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">AMC (Annual Maintenance Contract) Services</h2>
                  </div>
                  <div className="about-service-body">
                    <div className="row align-items-center g-4">
                      <div className="col-lg-6 order-lg-2">
                        <div className="about-service-image">
                          <Image
                            src={amcImg}
                            alt="AMC Services"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 order-lg-1">
                        <div className="about-service-text">
                          <p className="service-description">
                            We offer comprehensive Annual Maintenance Contracts for all your liaisoning, licensing,
                            and compliance needs. Our AMC services ensure your business remains compliant throughout
                            the year with regular monitoring and support.
                          </p>
                          <div className="service-features two-col">
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Compliance Monitoring</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>License Renewal Management</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Documentation &amp; Record Keeping</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Regulatory Update Tracking</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>Periodic Audits &amp; Inspections</span>
                            </div>
                            <div className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>24/7 Support &amp; Assistance</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sectors We Serve */}
        <section className="about-sectors">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-sectors-card">
                  <div className="about-service-header">
                    <div className="about-service-line"></div>
                    <h2 className="about-service-title">Sectors We Serve</h2>
                  </div>
                  <p className="sectors-intro">
                    We provide Fire, Electrical, and PNG services across diverse sectors including:
                  </p>
                  <div className="about-sectors-grid">
                    <div className="about-sector-item">
                      <span className="sector-emoji">🏗️</span>
                      <span className="sector-name">Construction</span>
                    </div>
                    <div className="about-sector-item">
                      <span className="sector-emoji">🏥</span>
                      <span className="sector-name">Healthcare</span>
                    </div>
                    <div className="about-sector-item">
                      <span className="sector-emoji">🍽️</span>
                      <span className="sector-name">Food &amp; Beverages</span>
                    </div>
                    <div className="about-sector-item">
                      <span className="sector-emoji">🏨</span>
                      <span className="sector-name">Hospitality</span>
                    </div>
                    <div className="about-sector-item">
                      <span className="sector-emoji">🏪</span>
                      <span className="sector-name">Commercial</span>
                    </div>
                    <div className="about-sector-item">
                      <span className="sector-emoji">⚙️</span>
                      <span className="sector-name">Industrial</span>
                    </div>
                  </div>
                  <div className="about-sectors-footer">
                    <p>
                      <span className="footer-icon">🌍</span>
                      With our commitment to expanding our reach across India and internationally, we aim to
                      support businesses with reliable liaisoning, compliance, audit, certification, and regulatory
                      services across diverse markets and industries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="about-team">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="about-team-header">
                  <div className="about-service-line"></div>
                  <h2 className="about-team-title">Our Team</h2>
                </div>
                <TeamSwiper />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800;900&display=swap');

        .about-page-wrapper {
          font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a202c;
          padding: 10px 0 40px;
        }

        /* Hero */
        .about-hero {
          padding: 40px 0 30px;
          background: linear-gradient(180deg, #fef9f4 0%, #ffffff 100%);
        }
        .hero-badge {
          display: inline-block;
          background: rgba(230, 126, 34, 0.1);
          color: #e67e22;
          padding: 6px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        .about-hero-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: #1a202c;
          line-height: 1.2;
          margin: 0;
          font-family: 'Barlow', sans-serif;
        }
        .about-hero-highlight {
          color: #e67e22;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: #718096;
          margin-top: 12px;
          font-weight: 400;
          font-family: 'Barlow', sans-serif;
        }

        /* Intro */
        .about-intro {
          padding: 30px 0 40px;
          background: #ffffff;
        }
        .about-intro-box {
          background: #fef9f4;
          border-left: 5px solid #e67e22;
          padding: 35px 40px;
          border-radius: 12px;
        }
        .about-intro-text {
          font-size: 1.08rem;
          line-height: 1.9;
          color: #2d3748;
          margin: 0;
          font-weight: 400;
          font-family: 'Barlow', sans-serif;
        }
        .about-brand {
          color: #e67e22;
          font-weight: 800;
          font-family: 'Barlow', sans-serif;
        }

        /* Service Section */
        .about-service {
          padding: 40px 0;
          background: #ffffff;
        }
        .about-service.alt-bg {
          background: #f8fafc;
        }

        .about-service-card {
          background: #ffffff;
          border: 1px solid #edf2f7;
          border-radius: 16px;
          padding: 40px 45px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }
        .about-service-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .about-service.alt-bg .about-service-card {
          background: #ffffff;
        }

        .about-service-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }
        .service-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: #e67e22;
          opacity: 0.3;
          line-height: 1;
          letter-spacing: -1px;
          font-family: 'Barlow', sans-serif;
        }
        .about-service-line {
          width: 4px;
          height: 36px;
          background: #e67e22;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .about-service-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #e67e22;
          margin: 0;
          font-family: 'Barlow', sans-serif;
        }

        .about-service-body {
          padding: 0;
        }
        .about-service-image {
          border-radius: 12px;
          overflow: hidden;
        }
        .about-service-image img {
          transition: transform 0.3s ease;
          width: 100%;
          height: auto;
        }
        .about-service-image:hover img {
          transform: scale(1.02);
        }

        .service-description {
          font-size: 1rem;
          line-height: 1.9;
          color: #4a5568;
          margin-bottom: 20px;
          font-weight: 400;
          font-family: 'Barlow', sans-serif;
        }

        .service-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .service-features.two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 16px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 0;
        }
        .feature-icon {
          color: #e67e22;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
          font-family: 'Barlow', sans-serif;
        }
        .feature-item span:last-child {
          font-size: 0.95rem;
          color: #4a5568;
          line-height: 1.5;
          font-weight: 400;
          font-family: 'Barlow', sans-serif;
        }

        /* Image Fallback */
        .image-fallback {
          width: 100%;
          min-height: 250px;
          background: linear-gradient(135deg, #fef9f4, #fde8d0);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #e67e22;
          padding: 20px;
        }
        .fallback-icon {
          font-size: 4rem;
          display: block;
        }
        .fallback-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e67e22;
          margin-top: 8px;
          font-family: 'Barlow', sans-serif;
        }

        /* Sectors */
        .about-sectors {
          padding: 40px 0;
          background: #ffffff;
        }
        .about-sectors-card {
          background: #fef9f4;
          border: 1px solid #fde8d0;
          border-radius: 16px;
          padding: 40px 45px;
        }
        .sectors-intro {
          font-size: 1.05rem;
          color: #4a5568;
          margin-bottom: 24px;
          text-align: center;
          font-weight: 400;
          font-family: 'Barlow', sans-serif;
        }
        .about-sectors-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .about-sector-item {
          background: #ffffff;
          border: 1px solid #fde8d0;
          border-radius: 10px;
          padding: 16px 10px;
          text-align: center;
          transition: all 0.25s ease;
          cursor: default;
        }
        .about-sector-item:hover {
          border-color: #e67e22;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(230, 126, 34, 0.12);
        }
        .sector-emoji {
          display: block;
          font-size: 2.2rem;
          margin-bottom: 6px;
        }
        .sector-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1a202c;
          font-family: 'Barlow', sans-serif;
        }
        .about-sectors-footer {
          background: #ffffff;
          border: 1px solid #fde8d0;
          border-radius: 10px;
          padding: 20px 28px;
          text-align: center;
        }
        .about-sectors-footer p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.8;
          color: #4a5568;
          font-weight: 400;
          font-family: 'Barlow', sans-serif;
        }
        .footer-icon {
          margin-right: 8px;
        }

        /* Team */
        .about-team {
          padding: 40px 0 10px;
          background: #ffffff;
        }
        .about-team-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        .about-team-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #e67e22;
          margin: 0;
          font-family: 'Barlow', sans-serif;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .about-hero-title { font-size: 2.2rem; }
          .about-service-card { padding: 30px; }
          .about-sectors-card { padding: 30px; }
          .about-intro-box { padding: 28px 30px; }
          .about-sectors-grid { grid-template-columns: repeat(3, 1fr); }
          .service-features.two-col { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .about-hero-title { font-size: 1.8rem; }
          .about-intro-box { 
            padding: 20px 24px;
          }
          .about-intro-text { font-size: 1rem; }
          .about-service-card { padding: 24px; }
          .about-sectors-card { padding: 24px; }
          .about-service-title { font-size: 1.2rem; }
          .about-sectors-grid { grid-template-columns: repeat(3, 1fr); }
          .about-service-header { gap: 12px; flex-wrap: wrap; }
          .about-service-line { height: 28px; }
          .about-service-image { margin-bottom: 16px; }
          .service-number { font-size: 1.4rem; }
          .about-service { padding: 30px 0; }
          .about-sectors { padding: 30px 0; }
          .about-team { padding: 30px 0 10px; }
          .image-fallback { min-height: 180px; }
          .fallback-icon { font-size: 3rem; }
        }

        @media (max-width: 480px) {
          .about-hero-title { font-size: 1.5rem; }
          .about-sectors-grid { grid-template-columns: repeat(2, 1fr); }
          .about-sectors-footer { padding: 14px 16px; }
          .about-sector-item { padding: 12px 8px; }
          .sector-emoji { font-size: 1.8rem; }
          .about-service-card { padding: 18px; }
          .about-sectors-card { padding: 18px; }
          .service-number { font-size: 1.2rem; }
          .image-fallback { min-height: 150px; }
          .fallback-icon { font-size: 2.5rem; }
          .fallback-text { font-size: 0.9rem; }
        }
      `}</style>
    </>
  );
}