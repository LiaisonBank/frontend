// app/ceo-profile/page.js
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useBodyClass from '@/components/useBodyClass';
import devaImg from "@/assets/images/finalCeoPage.png";
import "./ceoPage.scss";

const CeoProfile = () => {
  useBodyClass('ceo-profile');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <section id="about" className="ceo-profile-about-section" ref={sectionRef}>
        <div className="ceo-profile-about-container">
          <div className="ceo-profile-about-grid">
            
            {/* Left - Image */}
            <div className="ceo-profile-about-left">
              <div className="ceo-profile-about-image-wrapper">
                <div className="ceo-profile-image-border">
                  <Image
                    src={devaImg}
                    width={700}
                    height={850}
                    alt="Mahadev Biradar - Founder & CEO"
                    className="ceo-profile-about-image"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="ceo-profile-about-right">
              <div className="ceo-profile-content-inner">
                {/* <span className="ceo-profile-section-label">Founder & CEO</span> */}
                <h1 className="ceo-profile-about-title">Mahadev Biradar</h1>
                <p className="ceo-profile-about-title-sub">Founder & CEO</p>
                <div className="ceo-profile-about-divider"></div>
                
                <div className="ceo-profile-about-text-wrapper">
                  <p className="ceo-profile-about-text">
                    Mahadev Biradar is the Founder and Chief Executive Officer of Liaison Bank, 
                    providing strategic leadership in government liaisoning, licensing, and 
                    regulatory compliance.
                  </p>
                  
                  <p className="ceo-profile-about-text">
                    Born and brought up in Wagalgaon, Karnataka, he faced numerous failures and 
                    rejections across various cities. He came to Bombay in 2005 to make his 
                    parents proud. He started as a waiter, guided by one motto: to always give 
                    his best. Later entering real estate, he gained valuable property knowledge, 
                    built strong relationships, and entered liaisoning.
                  </p>
                  
                  <p className="ceo-profile-about-text">
                    In 2017, he founded DBRE India to deliver innovative solutions and sustainable 
                    value. DBRE expanded his expertise into PNG fabrication, firefighting system 
                    installation, testing, certification, electrical audits, and government 
                    regulatory licensing.
                  </p>
                  
                  <p className="ceo-profile-about-text">
                    Mahadev's journey reflects resilience and continuous learning. Though educated 
                    primarily through practical experience rather than traditional higher studies, 
                    he transformed determination, discipline, and hands-on knowledge into a thriving 
                    enterprise built on trust.
                  </p>
                  
                  <p className="ceo-profile-about-text">
                    Known as Deva Biradar, he leaves his mark wherever he goes. Under his leadership, 
                    the company expanded across India and registered in Singapore to connect 
                    international markets.
                  </p>
                </div>

                <div className="ceo-profile-about-stats">
                  <div className="ceo-profile-about-stat">
                    <span className="stat-number">2005</span>
                    <span className="stat-label">Started in Mumbai</span>
                  </div>
                  <div className="ceo-profile-about-stat">
                    <span className="stat-number">2017</span>
                    <span className="stat-label">Founded DBRE India</span>
                  </div>
                  <div className="ceo-profile-about-stat">
                    <span className="stat-number">2021</span>
                    <span className="stat-label">Liaison Bank</span>
                  </div>
                </div>

                <Link href="/" className="ceo-profile-back-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default CeoProfile;