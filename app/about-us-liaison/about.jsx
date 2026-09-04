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
import "./aboutUs.scss"

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
                

                  <div className="hero-main-content">
                    <div className="welcome-badge-full motion-text">
                      Your Trusted Partner for Liaisoning & Licensing
                    </div>
                    {/* <div className="welcome-header">Your Trusted Partner for Liaisoning & Licensing</div> */}
                    {/* <h1 className="hero-title-full motion-text-delay">
                      Your Trusted Partner for <br />
                      <span className="title-highlight-full">Liaisoning &amp; Licensing</span>
                    </h1>
                  */}
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
                    We are committed to expanding our reach across India, 
                    supporting businesses with reliable liaisoning, compliance, and regulatory services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="container-fluid">
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

   
    </>
  );
}