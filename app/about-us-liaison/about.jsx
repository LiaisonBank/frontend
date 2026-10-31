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
  Landmark,
  Fuel,
  ShieldCheck,
  Zap,
  Wrench,
} from "lucide-react";
import "./aboutUs.scss"
import PropertyAcquisition from "./PropertyAcquisition";

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
      icon: Landmark,
      tag: "Government Relations",
      description: "End-to-end liaisoning services helping businesses navigate complex government regulations and statutory requirements with ease.",
      href: "/our-services/liaisoning"
    },
    {
      id: 2,
      title: "Licensing Services",
      tag: "Compliance",
      icon: FileCheck,
      description: "Comprehensive licensing solutions across various sectors, ensuring your business remains compliant and fully operational.",
      features: [
        "Business Licenses & Registrations",
        "NOC & Certificate Procurements",
        "Industry-Specific Permits",
        "License Renewal & Management",
      ],
      href: "our-services/licensing"
    },
    {
      id: 3,
      title: "PNG Services",
      tag: "Infrastructure",
      icon: Fuel,
      description: "Complete Piped Natural Gas solutions from site survey to commissioning for commercial, residential, and industrial establishments.",
      features: [
        "Site Survey & Assessment",
        "MGL Documentation & Approvals",
        "Pipeline Installation",
        "Commissioning & Gas Charging"
      ],
      href: "/our-services/piped-natural-gas"
    },
    {
      id: 4,
      title: "Fire Safety Services",
      tag: "Risk Audit",
      icon: ShieldCheck,
      description: "Comprehensive fire safety audits, risk assessments, and certification services ensuring your establishment meets all safety regulations.",
      features: [
        "Fire Safety Audits",
        "Fire NOC & Approvals",
        "Fire Certification",
        "Risk Assessment & Training"
      ],
      href: "/our-services/fire"
    },
    {
      id: 5,
      title: "Electrical Services",
      tag: "Engeneering",
      icon: Zap,
      description: "Professional electrical audit and certification services ensuring your electrical systems are safe, compliant, and efficient.",
      features: [
        "Electrical Safety Audits",
        "Compliance Verification",
        "Electrical NOC & Approvals",
        "System Upgradation Support",
      ],
      href: "/our-services/electrical"
    },
    {
      id: 6,
      title: "AMC Services",
      tag: "Maintanence",
      icon: Wrench,
      description: "Comprehensive annual maintenance contracts ensuring your business remains compliant throughout the year with dedicated support.",
      features: [
        "Compliance Monitoring",
        "License Renewal Management",
        "Documentation & Record Keeping",
        "24/7 Support & Assistance"
      ],
      href: "/our-services/amc"
    },
    {
      id: 7,
      title: "Property Acquisition Services",
      tag: "Real Estate",
      icon: Building2,
      description: "End-to-end property acquisition services for commercial, residential, and industrial establishments ensuring smooth transactions and compliance.",
      propertyPortfolio: [
         "Bank Auction Properties",
        "ARC & NPA Assets",
        "Distressed Properties",
        "Commercial Real Estate",
        "Industrial Properties",
        "Residential Properties",
        "Property Leasing & Rentals",
        "Investor-Led Transactions"
      ],
      href: "/our-services/property-acquisition"
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
                      <h2>Your Trusted Partner for Liaisoning & Licensing</h2>
                    </div>
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
                    <span className="welcome-brand">Liaison Bank </span> provides end-to-end liaisoning, licensing, and regulatory compliance services to help businesses and individuals navigate complex government procedures and statutory requirements with greater clarity and efficiency. We serve as a professional interface between our clients and government departments, regulatory authorities, and statutory bodies, helping coordinate the processes involved in obtaining necessary approvals, permissions, No Objection Certificates (NOCs), licenses, and other regulatory clearances.

                    Our approach focuses on simplifying administrative procedures, facilitating coordination, and supporting clients throughout the regulatory process, from initial consultation and documentation to application coordination and approval follow-ups. We understand that navigating regulatory requirements can involve multiple stages, documentation requirements, and interactions with various authorities. Our objective is to make these processes more organized, transparent, and manageable for our clients.
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
              <div className="col-lg-10 pb-5">
                <div className="section-header">
                  <h3 className="section-title">What We Offer</h3>
                </div>
              </div>
            </div>
            <div className="row">

           {services.map((service) => {
  const Icon = service.icon;
  const isPropertyAcquisition = service.id === 7;

  // Render the 7th card (No Link, just a div)
  if (isPropertyAcquisition) {
    return (
      <div key={service.id} className="col-lg-4 col-md-6 p-3 service-card-wrapper">
        <div className="service-card property-service-card w-100">
          <div className="service-card-header">
            <div className="service-card-icon">
              <Icon size={27} strokeWidth={1.8} />
            </div>
            <div className="service-card-title-group">
              <h3 className="service-card-title">{service.title}</h3>
            </div>
          </div>
          <p className="service-card-description">{service.description}</p>
          <div className="property-portfolio-content">
            <h4>Property Opportunities We Handle</h4>
            <ul>
              {service.propertyPortfolio.map((item, index) => (
                <li key={index}>
                  <span className="property-check">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render the first 6 cards (With Link)
  return (
    <div key={service.id} className="col-lg-4 col-md-6 p-3 service-card-wrapper">
      <Link href={service.href} className="service-card-link">
        <div className="service-card">
          <div className="service-card-header">
            <div className="service-card-icon">
              <Icon size={27} strokeWidth={1.8} />
            </div>
            <div className="service-card-title-group">
              <h3 className="service-card-title">{service.title}</h3>
            </div>
          </div>
          <p className="service-card-description">{service.description}</p>
          <div className="service-card-cta">
            <span>View Details</span>
            <ArrowRight size={17} />
          </div>
        </div>
      </Link>
    </div>
  );
})}

            </div>
          </div>
        </section>

        {/* ---property acquisition */}
        {/* <section className="property-acquisition-section">
          <PropertyAcquisition />
        </section> */}

        {/* Sectors */}
        <section className="sectors-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-header">
                  <h3 className="section-title">Sectors We Serve</h3>
                </div>
                <div className="sectors-grid ">
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
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <TeamSwiper />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}