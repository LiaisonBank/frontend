"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import useBodyClass from '@/components/useBodyClass';
import TeamSwiper from "@/components/TeamSwiper";
import {
  Building2,
  HeartPulse,
  Utensils,
  Hotel,
  Store,
  Factory,
  ChevronRight,
  Briefcase,
  FileCheck,
  Flame,
  Shield,
  Plug,
  Clock,
  ArrowRight,
  Award,
  Star,
  ThumbsUp,
} from "lucide-react";

export default function AboutUsLiaisonPage() {
  useBodyClass('about-us');

  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY;
        const translateY = scrollY * 0.4;
        imageRef.current.style.transform = `translateY(${translateY}px) scale(1.02)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 1,
      title: "Liaisoning Services",
      icon: Briefcase,
      description: "End-to-end liaisoning services helping businesses navigate complex government regulations and statutory requirements with ease.",
      // features: [
      //   "Government Approvals & Permissions",
      //   "Regulatory Compliance Management",
      //   "Statutory Body Coordination",
      //   "Documentation & Formalities"
      // ]
    },
    {
      id: 2,
      title: "Licensing Services",
      icon: FileCheck,
      description: "Comprehensive licensing solutions across various sectors, ensuring your business remains compliant and fully operational.",
      features: [
        "Business Licenses & Registrations",
        "NOC & Certificate Procurements",
        "Industry-Specific Permits",
        "License Renewal & Management"
      ]
    },
    {
      id: 3,
      title: "PNG Services",
      icon: Flame,
      description: "Complete Piped Natural Gas solutions from site survey to commissioning for commercial, residential, and industrial establishments.",
      features: [
        "Site Survey & Assessment",
        "MGL Documentation & Approvals",
        "Pipeline Installation",
        "Commissioning & Gas Charging"
      ]
    },
    {
      id: 4,
      title: "Fire Safety Services",
      icon: Shield,
      description: "Comprehensive fire safety audits, risk assessments, and certification services ensuring your establishment meets all safety regulations.",
      features: [
        "Fire Safety Audits",
        "Fire NOC & Approvals",
        "Fire Certification",
        "Risk Assessment & Training"
      ]
    },
    {
      id: 5,
      title: "Electrical Services",
      icon: Plug,
      description: "Professional electrical audit and certification services ensuring your electrical systems are safe, compliant, and efficient.",
      features: [
        "Electrical Safety Audits",
        "Compliance Verification",
        "Electrical NOC & Approvals",
        "System Upgradation Support"
      ]
    },
    {
      id: 6,
      title: "AMC Services",
      icon: Clock,
      description: "Comprehensive annual maintenance contracts ensuring your business remains compliant throughout the year with dedicated support.",
      features: [
        "Compliance Monitoring",
        "License Renewal Management",
        "Documentation & Record Keeping",
        "24/7 Support & Assistance"
      ]
    }
  ];

  const sectors = [
    { name: "Construction", icon: Building2 },
    { name: "Healthcare", icon: HeartPulse },
    { name: "Food & Beverages", icon: Utensils },
    { name: "Hospitality", icon: Hotel },
    { name: "Commercial", icon: Store },
    { name: "Industrial", icon: Factory },
  ];

  return (
    <>
      {/* Full Screen Hero with Moving Image */}
      <div className="hero-fullscreen">
        <div className="hero-image-container" ref={imageRef}>
          <Image
            src="/about_us.png"
            alt="Liaison Bank - Business Compliance Services"
            fill
            className="hero-fullscreen-image"
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content-full">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="hero-text-wrapper">
                  <div className="hero-top-bar">
                   
                  
                  </div>

                  <div className="hero-main-content">
                    <div className="welcome-badge-full motion-text">
                      WELCOME TO LIAISON BANK
                    </div>
                    <div className="welcome-header">Your Trusted Partner for Liaisoning & Licensing</div>
                    <h1 className="hero-title-full motion-text-delay">
                      Your Trusted Partner for <br />
                      <span className="title-highlight-full">Liaisoning &amp; Licensing</span>
                    </h1>
                 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-page-wrapper">
        {/* Introduction / Welcome Message */}
        <section className="welcome-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="welcome-box">
                  <span className="welcome-label">About Us</span>
                  <p className="welcome-text">
                    <span className="welcome-brand">Liaison Bank </span> provides end-to-end liaisoning, licensing,
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

        {/* Services */}
        <section className="services-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-header">
                  <h2 className="section-title">What We Offer</h2>
                 
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div className="service-card">
                      <div className="service-card-icon">
                        <Icon size={28} />
                      </div>
                      <h3 className="service-card-title">{service.title}</h3>
                      <p className="service-card-description">{service.description}</p>
                      <ul className="service-card-features">
                        {/* {service.features.map((feature, idx) => (
                          <li key={idx}>
                            <ChevronRight size={14} />
                            {feature}
                          </li>
                        ))} */}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sectors */}
        <section className="sectors-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-header">
                  <h2 className="section-title">Sectors We Serve</h2>
                 
                </div>
                <div className="sectors-grid">
                  {sectors.map((sector, idx) => {
                    const Icon = sector.icon;
                    return (
                      <div key={idx} className="sector-item">
                        <Icon className="sector-icon" />
                        <span className="sector-name">{sector.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="sectors-footer">
                  <p>
                    We are committed to expanding our reach across India and internationally, 
                    supporting businesses with reliable liaisoning, compliance, and regulatory services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-header">
                  <h2 className="section-title">Meet Our Team</h2>
                 
                </div>
                <TeamSwiper />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        /* Full Screen Hero */
        .hero-fullscreen {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .hero-image-container {
          position: absolute;
          top: -5%;
          left: -5%;
          width: 110%;
          height: 110%;
          z-index: 0;
          transition: transform 0.1s ease-out;
        }

        .hero-fullscreen-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(10, 22, 40, 0.85) 0%, rgba(26, 42, 74, 0.7) 50%, rgba(13, 27, 42, 0.85) 100%);
          z-index: 1;
        }

        .hero-content-full {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 40px 0;
        }

        .hero-text-wrapper {
          animation: fadeInUp 1s ease forwards;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px rgba(201, 168, 76, 0.1); }
          50% { text-shadow: 0 0 40px rgba(201, 168, 76, 0.2); }
        }

        .motion-text {
          animation: fadeInUp 0.8s ease 0.3s forwards;
          opacity: 0;
        }

        .motion-text-delay {
          animation: fadeInUp 0.8s ease 0.6s forwards;
          opacity: 0;
        }

        .motion-text-delay-2 {
          animation: fadeInUp 0.8s ease 0.9s forwards;
          opacity: 0;
        }

        .motion-text-delay-3 {
          animation: fadeInUp 0.8s ease 1.2s forwards;
          opacity: 0;
        }

        .motion-text-delay-4 {
          animation: fadeInUp 0.8s ease 1.5s forwards;
          opacity: 0;
        }

        /* Top Bar */
        .hero-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 40px;
          animation: fadeInDown 0.8s ease forwards;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand-logo-full {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon-full {
          font-size: 2rem;
          color: #f97316;
          animation: pulse 2s ease-in-out infinite;
        }

        .brand-name-full {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 2px;
          font-family: 'Inter', sans-serif;
        }

        .brand-highlight-full {
          color: #f97316;
        }

        .hero-breadcrumb-full {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .hero-breadcrumb-full a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .hero-breadcrumb-full a:hover {
          color: #f97316;
        }

        .breadcrumb-sep {
          color: rgba(255, 255, 255, 0.3);
        }

        .breadcrumb-current-full {
          color: #f97316;
          font-weight: 500;
        }

        /* Hero Main Content */
        .hero-main-content {
          max-width: 700px;
        }

      

        .welcome-badge-full {
          display: inline-block;
          font-size: 2.75rem;
          font-weight: 800;
          color: #f97316;
          letter-spacing: 3px;
          text-transform: uppercase;
          // background: rgba(201, 168, 76, 0.1);
          // border: 1px solid rgba(201, 168, 76, 0.2);
          padding: 8px 0px;
          border-radius: 4px;
          margin-bottom: 20px;
        }



        .welcome-header {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.2;
}

   

        .hero-title-full {
          font-size: 3.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin: 0 0 16px;
          font-family: 'Inter', sans-serif;
          letter-spacing: -1px;
          animation: glowPulse 4s ease-in-out infinite;
        }

        .title-highlight-full {
          color: #f97316;
          position: relative;
        }

        .title-highlight-full::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(201, 168, 76, 0.3);
          border-radius: 2px;
        }

        .hero-desc-full {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.75);
          margin: 0 0 28px;
          font-weight: 400;
          max-width: 550px;
        }

        .hero-ratings-full {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .rating-item-full {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .rating-item-full svg {
          color: #f97316;
        }

        .rating-divider-full {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.15);
        }

        .hero-cta-full {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f97316;
          color: #0a1628;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }

        .hero-cta-full:hover {
          background: #f0d060;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 168, 76, 0.3);
          color: #0a1628;
        }

        /* Rest of the styles remain same */
        .about-page-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a202c;
          padding: 0 0 40px;
        }

        .welcome-section {
          padding: 60px 0;
          background: #ffffff;
        }

        .welcome-box {
          background: #faf9f8;
          border-radius: 12px;
          padding: 40px 45px;
          text-align: center;
          border: 1px solid #f0ede8;
          transition: all 0.3s ease;
        }

        .welcome-box:hover {
          border-color: #f97316;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .welcome-label {
          display: inline-block;
          font-size: 2rem;
          font-weight: 600;
          color: #f97316;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: rgba(201, 168, 76, 0.1);
          padding: 4px 16px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .welcome-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 16px;
          font-family: 'Inter', sans-serif;
        }

        .welcome-text {
          font-size: 1.05rem;
          line-height: 1.9;
          color: #4b5563;
          margin: 0;
          font-weight: 400;
          max-width: 800px;
          margin: 0 auto;
        }

        .welcome-brand {
          color: #f97316;
          font-weight: 700;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-label {
          display: inline-block;
          font-size: 1rem;
          font-weight: 600;
          color: #f97316;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: rgba(201, 168, 76, 0.08);
          padding: 4px 16px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #f97316;
          margin: 0 0 8px;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.5px;
        }

        .section-subtitle {
          font-size: 1rem;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }

        .services-section {
          padding: 50px 0;
          background: #ffffff;
        }

        .service-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 30px 28px;
          transition: all 0.3s ease;
          height: 100%;
          position: relative;
        }

        .service-card:hover {
          border-color: #f97316;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          transform: translateY(-4px);
        }

        .service-card-icon {
          width: 52px;
          height: 52px;
          background: rgba(201, 168, 76, 0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f97316;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .service-card:hover .service-card-icon {
          background: #f97316;
          color: #ffffff;
        }

        .service-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 10px;
          font-family: 'Inter', sans-serif;
        }

        .service-card-description {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #6b7280;
          margin: 0 0 16px;
          font-weight: 400;
        }

        .service-card-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .service-card-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #374151;
          padding: 4px 0;
          font-weight: 400;
        }

        .service-card-features li svg {
          color: #f97316;
          flex-shrink: 0;
        }

        .sectors-section {
          padding: 50px 0;
          background: #faf9f8;
        }

        .sectors-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }

        .sector-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 24px 12px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.3s ease;
          min-height: 100px;
        }

        .sector-item:hover {
          border-color: #f97316;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .sector-icon {
          width: 32px;
          height: 32px;
          color: #f97316;
          stroke-width: 1.8;
          transition: all 0.3s ease;
        }

        .sector-item:hover .sector-icon {
          transform: scale(1.1);
        }

        .sector-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #1a202c;
          text-align: center;
        }

        .sectors-footer {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px 28px;
          text-align: center;
        }

        .sectors-footer p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.8;
          color: #6b7280;
          font-weight: 400;
        }

        .team-section {
          padding: 50px 0 10px;
          background: #ffffff;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .hero-title-full { font-size: 2.8rem; }
          .hero-fullscreen { min-height: 600px; }
          .sectors-grid { grid-template-columns: repeat(3, 1fr); }
          .hero-top-bar { flex-direction: column; gap: 12px; align-items: flex-start; }
          .hero-main-content { max-width: 100%; }
        }

        @media (max-width: 768px) {
          .hero-fullscreen { min-height: 500px; height: auto; padding: 60px 0; }
          .hero-title-full { font-size: 2.2rem; }
          .hero-desc-full { font-size: 0.95rem; }
          .hero-ratings-full { gap: 12px; flex-wrap: wrap; }
          .rating-divider-full { display: none; }
          .brand-name-full { font-size: 1.2rem; }
          .hero-breadcrumb-full { font-size: 0.8rem; }
          .hero-cta-full { padding: 12px 24px; font-size: 0.9rem; }
          .section-title { font-size: 1.6rem; }
          .services-section { padding: 40px 0; }
          .sectors-section { padding: 40px 0; }
          .team-section { padding: 40px 0 10px; }
          .sectors-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .service-card { padding: 24px; }
          .sector-item { padding: 16px 10px; min-height: 85px; }
          .sector-icon { width: 28px; height: 28px; }
          .sector-name { font-size: 0.8rem; }
          .welcome-box { padding: 24px 28px; }
          .welcome-title { font-size: 1.3rem; }
          .welcome-text { font-size: 0.95rem; }
          .hero-top-bar { margin-bottom: 24px; }
        }

        @media (max-width: 480px) {
          .hero-fullscreen { min-height: 400px; padding: 40px 0; }
          .hero-title-full { font-size: 1.8rem; }
          .welcome-badge-full { font-size: 0.6rem; padding: 4px 14px; }
          .hero-desc-full { font-size: 0.88rem; }
          .sectors-grid { grid-template-columns: repeat(2, 1fr); }
          .sectors-footer { padding: 16px 18px; }
          .sector-item { padding: 14px 8px; min-height: 75px; }
          .welcome-box { padding: 18px 20px; }
          .welcome-title { font-size: 1.1rem; }
          .welcome-text { font-size: 0.9rem; }
          .section-title { font-size: 1.4rem; }
          .section-subtitle { font-size: 0.9rem; }
          .service-card { padding: 18px 20px; }
          .service-card-icon { width: 44px; height: 44px; }
          .service-card-title { font-size: 1rem; }
          .service-card-description { font-size: 0.88rem; }
          .service-card-features li { font-size: 0.82rem; }
          .sector-icon { width: 24px; height: 24px; }
          .sector-name { font-size: 0.75rem; }
          .sectors-footer p { font-size: 0.88rem; }
          .hero-ratings-full { flex-direction: column; align-items: flex-start; gap: 6px; }
          .brand-name-full { font-size: 1rem; letter-spacing: 1px; }
          .brand-icon-full { font-size: 1.5rem; }
          .hero-breadcrumb-full { font-size: 0.7rem; }
          .hero-cta-full { width: 100%; justify-content: center; }
          .hero-top-bar { padding-bottom: 14px; margin-bottom: 20px; }
          .title-highlight-full::after { height: 3px; }
        }
      `}</style>
    </>
  );
}