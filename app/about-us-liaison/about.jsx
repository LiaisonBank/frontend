"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import useBodyClass from "@/components/useBodyClass";
import TeamSwiper from "@/components/TeamSwiper";
import {
  Building2,
  HeartPulse,
  Utensils,
  Hotel,
  Store,
  Factory,
  ArrowRight,
  Landmark,
  FileCheck,
  Fuel,
  ShieldCheck,
  Zap,
  Wrench,
} from "lucide-react";
import "./aboutUs.scss";
import { motion } from "framer-motion";
// Add these imports at the top of your file
import targetImg from "@/assets/images/target_icon.png";
import arrowImg from "@/assets/images/arrow-1.png";
import bulbImg from "@/assets/images/bulb.png";
// Note: Make sure you have saved the stickman image in this folder!
import stickmanLeaningImg from "@/assets/images/stickman.png";
import stickmanStandingImg from "@/assets/images/stickMan_standing-1.jpg";
import WhatWeOffer from "./whatWeOffer";
import SectionDivider from "@/components/SectionDivider/SectionDivider";

export default function AboutUsLiaisonPage() {
  useBodyClass("about-us");

  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY;
        const translateY = scrollY * 0.4;
        imageRef.current.style.transform = `translateY(${translateY}px) scale(1.02)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      id: 1,
      title: "Liaisoning Services",
      icon: Landmark,
      tag: "Government Relations",
      description:
        "End-to-end liaisoning services helping businesses navigate complex government regulations and statutory requirements with ease.",
      href: "/our-services/liaisoning",
    },
    {
      id: 2,
      title: "Licensing Services",
      tag: "Compliance",
      icon: FileCheck,
      description:
        "Comprehensive licensing solutions across various sectors, ensuring your business remains compliant and fully operational.",
      features: [
        "Business Licenses & Registrations",
        "NOC & Certificate Procurements",
        "Industry-Specific Permits",
        "License Renewal & Management",
      ],
      href: "our-services/licensing",
    },
    {
      id: 3,
      title: "PNG Services",
      tag: "Infrastructure",
      icon: Fuel,
      description:
        "Complete Piped Natural Gas solutions from site survey to commissioning for commercial, residential, and industrial establishments.",
      features: [
        "Site Survey & Assessment",
        "MGL Documentation & Approvals",
        "Pipeline Installation",
        "Commissioning & Gas Charging",
      ],
      href: "/our-services/piped-natural-gas",
    },
    {
      id: 4,
      title: "Fire Safety Services",
      tag: "Risk Audit",
      icon: ShieldCheck,
      description:
        "Comprehensive fire safety audits, risk assessments, and certification services ensuring your establishment meets all safety regulations.",
      features: [
        "Fire Safety Audits",
        "Fire NOC & Approvals",
        "Fire Certification",
        "Risk Assessment & Training",
      ],
      href: "/our-services/fire",
    },
    {
      id: 5,
      title: "Electrical Services",
      tag: "Engineering",
      icon: Zap,
      description:
        "Professional electrical audit and certification services ensuring your electrical systems are safe, compliant, and efficient.",
      features: [
        "Electrical Safety Audits",
        "Compliance Verification",
        "Electrical NOC & Approvals",
        "System Upgradation Support",
      ],
      href: "/our-services/electrical",
    },
    {
      id: 6,
      title: "AMC Services",
      tag: "Maintenance",
      icon: Wrench,
      description:
        "Comprehensive annual maintenance contracts ensuring your business remains compliant throughout the year with dedicated support.",
      features: [
        "Compliance Monitoring",
        "License Renewal Management",
        "Documentation & Record Keeping",
        "24/7 Support & Assistance",
      ],
      href: "/our-services/amc",
    },
    {
      id: 7,
      title: "Property Acquisition Services",
      tag: "Real Estate",
      icon: Building2,
      description:
        "End-to-end property acquisition services for commercial, residential, and industrial establishments ensuring smooth transactions and compliance.",
      propertyPortfolio: [
        "Bank Auction Properties",
        "ARC & NPA Assets",
        "Distressed Properties",
        "Commercial Real Estate",
        "Industrial Properties",
        "Residential Properties",
        "Property Leasing & Rentals",
        "Investor-Led Transactions",
        "Our Licensee - Amazon (Mahape) , Lagoona London Spa (Juhu)",
      ],
      href: "/our-services/property-acquisition",
    },
  ];

  const sectors = [
    { name: "Construction", icon: Building2 },
    { name: "Healthcare", icon: HeartPulse },
    { name: "Food & Beverages", icon: Utensils },
    { name: "Hospitality", icon: Hotel },
    { name: "Commercial", icon: Store },
    { name: "Industrial", icon: Factory },
  ];

  // --- Image Animation Variants ---

  const arrowVariants = {
    rest: {
      x: 160, // Start far to the right
      y: -10, // Start slightly high
      z: 10, // Start closer to the camera (3D pop out)
      rotateY: -60, // Angled in 3D space
      rotateZ: -20,
      opacity: 0,
      scale: 1.4,
    },
    hover: {
      x: -20, // Land on the target
      y: 10,
      z: 0, // Land flat against the card
      rotateY: 2,
      rotateZ: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 },
    },
  };

  const targetVariants = {
    rest: { rotate: 0, scale: 1, z: 0 },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0], // Shake on impact
      scale: 1.05,
      z: -30, // Push back in 3D space when hit
      transition: { duration: 0.5, delay: 0.15 },
    },
  };

  const standingVariants = {
    rest: { opacity: 1, scale: 1, z: 0 },
    hover: { opacity: 0, scale: 0.8, z: -50, transition: { duration: 0.3 } },
  };

  const leaningVariants = {
    rest: { opacity: 0, scale: 0.8, z: 50 },
    hover: {
      opacity: 1,
      scale: 1,
      z: 20,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  const bulbVariants = {
    rest: {
      scale: 1,
      filter: "drop-shadow(0px 0px 0px rgba(249,115,22,0))",
      z: 0,
    },
    hover: {
      scale: 1.1,
      filter: "drop-shadow(0px 0px 20px rgba(249,115,22,0.8))",
      z: -20, // Bulb pushes slightly back
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  };

  return (
    <>
      {/* Full Screen Hero */}
      <div className="hero-fullscreen">
        <div className="hero-image-container" ref={imageRef}>
          <Image
            src="/about_us.png"
            alt="Liaison Bank - Business Compliance Services"
            fill
            className="hero-fullscreen-image"
            priority
            style={{ objectFit: "cover" }}
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
        {/* Introduction */}
        <section className="welcome-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="welcome-box">
                  <div className="section-header">
                    <h3 className="section-title">About Us</h3>
                  </div>
                  <p className="welcome-text">
                    <span className="welcome-brand">Liaison Bank </span>{" "}
                    provides end-to-end liaisoning, licensing, and regulatory
                    compliance services to help businesses and individuals
                    navigate complex government procedures and statutory
                    requirements with greater clarity and efficiency. We serve
                    as a professional interface between our clients and
                    government departments, regulatory authorities, and
                    statutory bodies, helping coordinate the processes involved
                    in obtaining necessary approvals, permissions, No Objection
                    Certificates (NOCs), licenses, and other regulatory
                    clearances. Our approach focuses on simplifying
                    administrative procedures, facilitating coordination, and
                    supporting clients throughout the regulatory process, from
                    initial consultation and documentation to application
                    coordination and approval follow-ups. We understand that
                    navigating regulatory requirements can involve multiple
                    stages, documentation requirements, and interactions with
                    various authorities. Our objective is to make these
                    processes more organized, transparent, and manageable for
                    our clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <SectionDivider />

        {/* --- VISION & MISSION SECTION --- */}
        <section className="vision-mission-section">
          <div className="section-header">
            <h3 className="section-title">Our Mission & Vision</h3>
          </div>
          <div className="vm-custom-wrapper">
            {/* Left Column: Mission */}
            <motion.div
              className="vm-custom-card vm-mission"
              // initial="rest"
              whileHover="hover"
              animate="rest"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: "1000px" }} // Enable 3D
            >
              <div className="vm-title-wrapper">
                <span className="vm-title-line"></span>
                <h3 className="vm-custom-title">MISSION</h3>
                <span className="vm-title-line"></span>
              </div>

              <div className="vm-pin vm-pin-top-right"></div>

              {/* 3D Animation Stage */}
              <div
                className="vm-animation-stage"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={targetImg.src}
                  alt="Target"
                  className="img-target"
                  variants={targetVariants}
                  style={{ transformOrigin: "center center" }}
                />
                <motion.img
                  src={arrowImg.src}
                  alt="Arrow"
                  className="img-arrow"
                  variants={arrowVariants}
                  style={{ transformOrigin: "bottom left" }}
                />
              </div>

              <div className="vm-custom-content">
                <p>
                  Our mission is to transform complex business challenges into
                  seamless experiences. From documentation and government
                  approvals to licensing, permissions, certifications, and
                  essential business requirements, we simplify every step
                  through expert guidance, strategic coordination, and
                  end-to-end support. At Liaison Bank, we believe every business
                  deserves a smoother path to success. We are committed to
                  breaking procedural barriers, bridging the gap between
                  requirements and approvals, and empowering business owners to
                  focus on what matters most — building, growing, and leading
                  their businesses.
                </p>
              </div>

              {/* <div className="vm-indicator">
                <span className="vm-dash"></span>
                <span className="vm-dot"></span>
                <span className="vm-dot"></span>
              </div> */}
            </motion.div>

            {/* Right Column: Vision */}
            <motion.div
              className="vm-custom-card vm-vision"
              // initial="rest"
              whileHover="hover"
              animate="rest"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              initial={{ opacity: 0, y: 40 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              style={{ perspective: "1000px" }}
            >
              <div className="vm-title-wrapper">
                <span className="vm-title-line"></span>
                <h3 className="vm-custom-title">VISION</h3>
                <span className="vm-title-line"></span>
              </div>

              <div className="vm-pin vm-pin-bottom-right"></div>

              {/* 3D Animation Stage */}
              <div
                className="vm-animation-stage"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={bulbImg.src}
                  alt="Bulb"
                  className="img-bulb"
                  variants={bulbVariants}
                />

                <motion.img
                  src={stickmanStandingImg.src}
                  alt="Standing Stickman"
                  className="img-stickman"
                  variants={standingVariants}
                />

                <motion.img
                  src={stickmanLeaningImg.src}
                  alt="Leaning Stickman"
                  className="img-stickman"
                  variants={leaningVariants}
                />
              </div>

              <div className="vm-custom-content">
                <p>
                  To become a trusted global leader in comprehensive business
                  support solutions, with an ambitious vision of establishing a
                  presence across every PIN code in India and expanding our
                  reach internationally. We aspire to empower businesses,
                  entrepreneurs, developers, professionals, and individuals
                  through accessible, integrated, and reliable services. By
                  simplifying complexities and bringing diverse solutions under
                  one roof, we aim to make professional support convenient and
                  accessible to everyone, everywhere, while building a strong
                  network of branches that brings Liaison Bank closer to every
                  customer.
                </p>
              </div>

              {/* <div className="vm-indicator">
                <span className="vm-dash"></span>
                <span className="vm-dot"></span>
                <span className="vm-dot"></span>
              </div> */}
            </motion.div>
          </div>
        </section>
        <SectionDivider />

        {/* Services */}
        <section className="services-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 pb-2">
                <div className="section-header">
                  <h3 className="section-title">What We Offer</h3>
                </div>
              </div>
            </div>
            <div className="row">
              {/* {services.map((service) => {
                const Icon = service.icon;
                const isPropertyAcquisition = service.id === 7;

                if (isPropertyAcquisition) {
                  return (
                    <div
                      key={service.id}
                      className="col-lg-4 col-md-6 p-3 service-card-wrapper"
                    >
                      <div className="service-card property-service-card w-100">
                        <div className="service-card-header">
                          <div className="service-card-icon">
                            <Icon size={27} strokeWidth={1.8} />
                          </div>
                          <div className="service-card-title-group">
                            <h3 className="service-card-title">
                              {service.title}
                            </h3>
                          </div>
                        </div>
                        <p className="service-card-description">
                          {service.description}
                        </p>
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

                return (
                  <div
                    key={service.id}
                    className="col-lg-4 col-md-6 p-3 service-card-wrapper"
                  >
                    <Link href={service.href} className="service-card-link">
                      <div className="service-card">
                        <div className="service-card-header">
                          <div className="service-card-icon">
                            <Icon size={27} strokeWidth={1.8} />
                          </div>
                          <div className="service-card-title-group">
                            <h3 className="service-card-title">
                              {service.title}
                            </h3>
                          </div>
                        </div>
                        <p className="service-card-description">
                          {service.description}
                        </p>
                        <div className="service-card-cta">
                          <span>View Details</span>
                          <ArrowRight size={17} />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })} */}
              <WhatWeOffer services={services} />
            </div>
          </div>
        </section>
        <SectionDivider />

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
        <SectionDivider />

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
