"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";

import useBodyClass from "@/components/useBodyClass";
import { pplFaqData, licFaqData } from "@/lib/data/faqData";

export default function Page() {
  useBodyClass("phonographic-performance-licenses");

  const pathname = usePathname();

  const [activeIndex, setActiveIndex] = useState(null);

  const wrapperRef = useRef(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const selectedFaq =
    pathname === "/phonographic-performance-licenses"
      ? pplFaqData
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
                    <h1
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      Phonographic Performance Licenses
                    </h1>

                    <nav
                      aria-label="breadcrumb"
                      className="page-breadcrumb"
                    >
                      <ol
                        className="breadcrumb justify-content-center"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                      >
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
                          Phonographic Performance Licenses
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
                className="section-title"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <h2 className="fw-bold">
                  PPL Music License Services in India
                </h2>
                <h5 className="mt-3"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="200">
                  Professional Assistance for Commercial Music Licensing, Copyright Compliance & Public Performance Permissions
                </h5>
              </div>
                <p className="pt-3" data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="300">
                    From restaurants and cafés to hotels, retail outlets, gyms, salons, and large-scale events, music has become an essential part of creating engaging customer experiences. However, using copyrighted sound recordings in commercial spaces requires proper authorization under Indian copyright regulations. 
                    A PPL License ensures businesses can legally play recorded music for public performance while maintaining smooth operational compliance. 
                </p> 
                <p className="pt-3" data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="400">
                    At Liaison Bank, we simplify the complexities of music licensing through structured guidance, streamlined documentation support, and reliable licensing coordination tailored for modern businesses and entertainment spaces. Our goal is to help brands, venues, and commercial establishments navigate PPL licensing requirements with clarity, efficiency, and confidence. 
                </p>
              <div
                className="d-flex flex-wrap justify-content-center gap-3 mt-4"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="300"
              >
                <h2 className="mt-3"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="200">
                Need Help with PPL Music Licensing?                 
                </h2>
                <p className="pt-1" data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="400">
                    Ensure smooth and compliant music usage for your business, venue, or event with professional PPL licensing guidance tailored to your commercial requirements. 
                </p>
                <Link
                  href=""
                  className="themeht-btn primary-btn btn px-4 py-2"
                >
                  Ask Expert
                </Link>

                <Link
                  href=""
                  className="themeht-btn primary-btn btn px-4 py-2"
                >
                 Apply for PPL License  
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="ppl-license-section py-5">
            <div className="container">
                <div className="row">
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

                    <h2
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                    >
                    What is a PPL License?
                    </h2>

                    <p
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="200"
                    >
                    A PPL License (Phonographic Performance Limited License) is a
                    legal music license required for playing recorded music in
                    public or commercial spaces. It grants permission to use
                    copyrighted sound recordings owned by music labels and rights
                    holders represented by PPL India.
                    </p>

                    <p
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="300"
                    >
                    Any business or establishment that uses music for customer
                    entertainment, ambience, promotions, fitness sessions, live
                    screenings, public performances, or events may require a valid
                    PPL license under Indian copyright regulations.
                    </p>

                </div>
                <div>
                    
                    <p
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="400"
                    >
                    This includes:
                    </p>
                    
                </div>
                </div>
                <div className="row g-4">

      {/* Card 1 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="100"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white text-center">Restaurants & Cafés</h3>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="200"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">Hotels & Resorts</h3>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="300"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">
              Retail Stores & Shopping Malls
            </h3>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="400"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">Salons & Spas</h3>
          </div>
        </div>
      </div>

      {/* Card 5 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="500"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">Gyms & Fitness Studios</h3>
          </div>
        </div>
      </div>

    </div>

    <div className="row g-4 mt-1">

      {/* Card 6 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="600"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">Pubs, Lounges & Clubs</h3>
          </div>
        </div>
      </div>

      {/* Card 7 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="700"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">
              Event Venues & Exhibitions
            </h3>
          </div>
        </div>
      </div>

      {/* Card 8 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="800"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">
              Offices & Corporate Spaces
            </h3>
          </div>
        </div>
      </div>

      {/* Card 9 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="900"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">
              Banquet Halls & Wedding Events
            </h3>
          </div>
        </div>
      </div>

      {/* Card 10 */}
      <div
        className="col-12 col-sm-6 col-md-4 col-lg"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="1000"
      >
        <div
          className="card h-100 border-0 shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body text-center d-flex align-items-center bg-secondary rounded align-items-center justify-content-center">
            <h3 className="h6 mb-0 text-white">
              Cinemas & Entertainment Venues
            </h3>
          </div>
        </div>
      </div>

    </div>
            </div>
            
        </section>

        <section className="ppl-license-importance-section py-5">
            <div className="container">
                <div className="row">
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

                    <h2
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="600"
                    >
                    Why is a PPL Music License Important?
                    </h2>

                    <p
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="700"
                    >
                    Obtaining a PPL license is not only a legal requirement but
                    also an important step toward running a compliant and
                    professional business. Commercial use of copyrighted music
                    without authorization may lead to copyright infringement
                    claims, legal notices, penalties, or disruption of operations.
                    </p>

                    <p
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="800"
                    >
                    A valid PPL license helps businesses:
                    </p>

                    <ul
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="900"
                    >
                    <li>Legally play copyrighted music in commercial premises</li>
                    <li>Maintain compliance with Indian copyright laws</li>
                    <li>Avoid legal risks and penalties</li>
                    <li>
                        Enhance customer experience through licensed entertainment
                    </li>
                    <li>Build brand credibility and professionalism</li>
                    <li>
                        Ensure uninterrupted business operations during inspections
                        or events
                    </li>
                    </ul>

                    <p
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="1000"
                    >
                    As businesses increasingly use music to create engaging
                    customer environments, proper music licensing has become a
                    crucial operational requirement across multiple industries.
                    </p>

                </div>
                </div>
            </div>
        </section>

        <section className="ppl-services-section py-5">
            <div className="container">

                <div className="row mb-4">
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

                    <h2
                    className="mb-3"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                    >
                    Our PPL License Services
                    </h2>

                    <p
                    className="mb-0"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="200"
                    >
                    At Liaison Bank, we provide complete assistance for obtaining
                    and managing PPL music licenses for different commercial
                    requirements.
                    </p>

                </div>
                </div>

                <div className="row g-4">
                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="300"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">PPL License Consultation</h3>
                        <p className="mb-0">
                        We assess your business activity, music usage type,
                        establishment category, and licensing requirements to guide
                        you toward the correct music licensing solution.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="400"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Documentation Assistance</h3>
                        <p className="mb-0">
                        Our team helps organize and prepare the required documents
                        for a smooth application process while minimizing delays
                        and compliance issues.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="500"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Application Support</h3>
                        <p className="mb-0">
                        We provide end-to-end support for submitting PPL license
                        applications accurately and efficiently.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="600"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Commercial Music Compliance Guidance
                        </h3>
                        <p className="mb-0">
                        We help businesses understand where and how music licensing
                        applies to their operations, events, or commercial
                        premises.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="700"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Event & Temporary Music Licensing
                        </h3>
                        <p className="mb-0">
                        We assist organizers in obtaining temporary music licenses
                        for concerts, exhibitions, corporate events, weddings,
                        festivals, and public gatherings.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="800"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Multi-Location Licensing Support
                        </h3>
                        <p className="mb-0">
                        Businesses operating multiple outlets, franchises,
                        restaurants, or retail chains can receive centralized
                        licensing support for streamlined compliance management.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="900"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Renewal & Ongoing Assistance
                        </h3>
                        <p className="mb-0">
                        We also support businesses with license renewals, updates,
                        and continued compliance requirements.
                        </p>
                    </div>
                    </div>
                </div>

                </div>
            </div>
        </section>

        <section className="ppl-industries-section py-5">
            <div className="container">

                <div className="row mb-4">
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

                    <h2
                    className="mb-3"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                    >
                    Industries That Commonly Require PPL Licenses
                    </h2>

                </div>
                </div>

                <div className="row g-4">

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="200"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Restaurants & Cafés</h3>
                        <p className="mb-0">
                        Background music, live entertainment, and curated playlists
                        significantly improve dining experiences and customer
                        engagement.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="300"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Hotels & Hospitality Businesses
                        </h3>
                        <p className="mb-0">
                        Hotels, resorts, lounges, banquet halls, and hospitality
                        venues frequently require licensed music usage across guest
                        and event areas.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="400"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Retail Stores & Shopping Spaces
                        </h3>
                        <p className="mb-0">
                        Music enhances customer mood, shopping behaviour, and brand
                        atmosphere within commercial retail environments.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="500"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Fitness Centers & Gyms</h3>
                        <p className="mb-0">
                        Workout sessions, group fitness classes, and studio
                        training environments commonly use licensed music for
                        motivation and engagement.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="600"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Salons & Wellness Centers
                        </h3>
                        <p className="mb-0">
                        Beauty salons, spas, and wellness clinics use background
                        music to create relaxing customer experiences.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="700"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Events & Entertainment Venues
                        </h3>
                        <p className="mb-0">
                        Concerts, exhibitions, weddings, parties, public
                        screenings, and corporate events often require temporary or
                        event-based music licenses.
                        </p>
                    </div>
                    </div>
                </div>

                </div>

            </div>
        </section>

        <section className="why-choose-liaisonbank-section py-5">
            <div className="container">

                <div className="row mb-4">
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

                    <h2
                    className="mb-3"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="800"
                    >
                    Why Choose Liaison Bank for PPL Licensing?
                    </h2>

                </div>
                </div>

                <div className="row g-4">

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="900"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Industry-Focused Expertise</h3>
                        <p className="mb-0">
                        Our team understands commercial licensing procedures and
                        music compliance requirements across diverse industries.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="1000"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Simplified Process</h3>
                        <p className="mb-0">
                        We make the licensing journey smooth, organized, and
                        time-efficient for businesses of all sizes.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="1100"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">End-to-End Assistance</h3>
                        <p className="mb-0">
                        From consultation to documentation and application
                        coordination, we support every stage of the process.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="1200"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Reliable Compliance Support
                        </h3>
                        <p className="mb-0">
                        We help businesses reduce compliance risks by ensuring
                        licensing requirements are properly understood and
                        addressed.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="1300"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Tailored Licensing Guidance
                        </h3>
                        <p className="mb-0">
                        Every business has different operational needs. We provide
                        customized licensing assistance based on your industry and
                        music usage.
                        </p>
                    </div>
                    </div>
                </div>

                <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="1400"
                >
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h5 mb-3">
                        Professional & Transparent Approach
                        </h3>
                        <p className="mb-0">
                        We focus on accurate guidance, clear communication, and
                        dependable service throughout the licensing process.
                        </p>
                    </div>
                    </div>
                </div>

                </div>

            </div>
        </section>

        {/* FAQ */}
        <section className="py-5 bg-light lc-faqs">
            <div className="container">
            <div className="text-center mb-5 section-title">
                <h3 className="fw-bold">
                Frequently Asked Questions
                </h3>
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
                            activeIndex !== index
                                ? "collapsed"
                                : ""
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