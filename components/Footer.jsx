"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { importantLinks } from "../lib/data/menus.js";
import logoScrolled from "@/assets/images/logo_grey2.png";
import Modal from "@/components/ModalDialog/Modal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import EnquiryForm from "@/components/EnquiryForm/page.jsx";
import HiringForm from "@/components/HiringForm/page.jsx";
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hiringOpen, setHiringOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hideOnSitemap = pathname === "/sitemap";
  const currentYear = new Date().getFullYear();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">

          {/* Main Footer */}
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <Link href="/" onClick={scrollToTop}>
                <Image
                  src={logoScrolled}
                  alt="Liaisonbank"
                  title="Liaisonbank"
                  width={200}
                  height={56}
                  priority
                  className="footer-logo"
                />
              </Link>
              <p className="footer-text">
                Established in 2017-2019 as DBRE Proprietary the firm became DBRE Private Limited in 2019 and  rebranded as Liaison Bank in 2023 Headquartered in  Mumbai Liaison Bank provides end-to-end licensing, regulatory compliance, and project liaisoning services, helping businesses navigate regulatory requirements efficiently.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                {importantLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="footer-title">Contact</h4>
              <div className="footer-contact">
                <p className="footer-address">
                  Plot 466, New Apollo CHSL,<br />
                  Khar West, Mumbai-400052
                </p>
                <p className="footer-phone">
                  <a href="tel:+919769458515">+91 97694 58515</a>
                  <span className="footer-sep">/</span>
                  <a href="tel:+919324577378">9136066910</a>
                </p>
                <a href="mailto:ceo.desk@liaisonbank.com" className="footer-email">
                  ceo.desk@liaisonbank.com
                </a>
                <p className="footer-time">Mon – Sat : 8:00am – 5:00pm</p>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="footer-title">Connect</h4>
              <div className="footer-buttons">
                <button
                  onClick={() => setOpen(true)}
                  className="btn-enquire"
                >
                  Enquire Now
                </button>
                <button
                  onClick={() => setHiringOpen(true)}
                  className="btn-hiring"
                >
                  We're Hiring
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p>© {currentYear} Liaison Bank. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="/privacy">Privacy</Link>
              <span>|</span>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <ScrollToTopButton />

      {/* Floating Buttons - Left Side Slide */}
      {!hideOnSitemap && (
        <div className={`floating-slide ${isOpen ? 'open' : ''}`}>
          <button
            className="toggle-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <ChevronLeft size={24} color="white" />
            ) : (
              <ChevronRight size={24} color="white" />
            )}
          </button>

          <div className="slide-content">
            <button
              onClick={() => setOpen(true)}
              className="float-btn float-enquire"
            >
              Enquire
            </button>
            <button
              onClick={() => setHiringOpen(true)}
              className="float-btn float-hiring"
            >
              Hiring
            </button>
            <a
              href="tel:+919769458515"
              className="float-btn float-call"
            >
              Call
            </a>
          </div>
        </div>
      )}

      {/* Mobile Bar */}
      {!hideOnSitemap && (
        <div className="mobile-bar">
          <a href="tel:+919769458515" className="mob-btn">Call</a>
          <button onClick={() => setOpen(true)} className="mob-btn">Enquire</button>
          <button onClick={() => setHiringOpen(true)} className="mob-btn">Hiring</button>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Enquiry Form"
        width="600px"
      >
        <EnquiryForm onClose={() => setOpen(false)} />
      </Modal>

      <Modal
        isOpen={hiringOpen}
        onClose={() => setHiringOpen(false)}
        title="We're Hiring"
        width="600px"
      >
        <HiringForm />
      </Modal>

      <style jsx>{`
        /* ===== FOOTER ===== */
        .footer {
          background: #f8fafc78;
          color: #0f172a;
          padding: 50px 20px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          border-top: 1px solid #e2e8f0;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1.2fr;
          gap: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e2e8f0;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-logo {
          height: auto;
          width: 200px;
          display: block;
        }

        .footer-text {
          color: #334155;
          font-size: 14px;
          line-height: 1.8;
          margin: 0;
          max-width: 400px;
        }

        .footer-title {
          color: #e18c1d;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 0 0 20px 0;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 3px;
          background: #e18c1d;
          border-radius: 2px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
          display: inline-block;
        }

        .footer-link:hover {
          color: #e18c1d;
          transform: translateX(4px);
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
          margin-top: 4px;
        }

        .footer-address {
          margin: 0;
          line-height: 1.8;
          color: #475569;
        }

        .footer-phone {
          margin: 0;
        }

        .footer-phone a {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-phone a:hover {
          color: #e18c1d;
        }

        .footer-sep {
          color: #cbd5e1;
          margin: 0 6px;
        }

        .footer-email {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
        }

        .footer-email:hover {
          color: #e18c1d;
        }

        .footer-time {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
        }

        .footer-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }

        .btn-enquire,
        .btn-hiring {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          width: 100%;
          font-family: inherit;
          letter-spacing: 0.3px;
        }

        .btn-enquire {
          background: #e18c1d;
          color: #ffffff;
        }

        .btn-enquire:hover {
          background: #be123c;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(225, 29, 72, 0.25);
        }

        .btn-hiring {
          background: transparent;
          color: #e11d48;
          border: 2px solid #e11d48;
        }

        .btn-hiring:hover {
          background: #e11d48;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          font-size: 13px;
          color: #94a3b8;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-bottom p {
          margin: 0;
        }

        .footer-legal {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-legal a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal a:hover {
          color: #e11d48;
        }

        .footer-legal span {
          color: #cbd5e1;
        }

        /* ===== FLOATING SLIDE MENU - LEFT SIDE ===== */
        .floating-slide {
          position: fixed;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-btn {
          width: 45px;
          height: 45px;
          border-radius: 0 50px 50px 0;
          border: none;
          background: #e18c1d;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(225, 140, 29, 0.3);
          flex-shrink: 0;
          z-index: 2;
        }

        .toggle-btn:hover {
          background: #c97a18;
          transform: scale(1.05);
        }

        .slide-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 15px 10px 15px 15px;
          backdrop-filter: blur(10px);
          border-radius: 0 12px 12px 0;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          transform: translateX(-120%);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(225, 140, 29, 0.1);
          border-left: none;
        }

        .floating-slide.open .slide-content {
          transform: translateX(0);
          opacity: 1;
        }

        .floating-slide.open .toggle-btn {
          border-radius: 0;
        }

        .float-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          text-decoration: none;
          text-align: center;
          min-width: 90px;
          font-family: inherit;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .float-btn:hover {
          transform: translateX(4px) scale(1.02);
        }

        .float-enquire {
          background: #e18c1d;
          color: #ffffff;
        }

        .float-enquire:hover {
          background: #c97a18;
        }

        .float-hiring {
          background: #f1f5f9;
          color: #0f172a;
        }

        .float-hiring:hover {
          background: #e2e8f0;
        }

        .float-call {
          background: #22c55e;
          color: #ffffff;
        }

        .float-call:hover {
          background: #16a34a;
        }

        /* ===== MOBILE BAR ===== */
        .mobile-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 8px 0;
          grid-template-columns: repeat(3, 1fr);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04);
        }

        .mob-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          color: #475569;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.3px;
        }

        .mob-btn:hover {
          color: #e11d48;
        }

        /* ===== RESPONSIVE ===== */

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 35px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-text {
            max-width: 100%;
          }

          .floating-slide {
            display: none;
          }

          .mobile-bar {
            display: grid;
          }
        }

        @media (max-width: 640px) {
          .footer {
            padding: 30px 16px 80px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-bottom: 25px;
          }

          .footer-logo {
            width: 160px;
          }

          .footer-title::after {
            bottom: 0;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-legal {
            justify-content: center;
          }

          .btn-enquire,
          .btn-hiring {
            padding: 14px;
          }
        }

        /* Desktop hover effect - auto open */
        @media (min-width: 1025px) {
          .floating-slide:not(.open):hover .slide-content {
            transform: translateX(0);
            opacity: 1;
          }

          .floating-slide:not(.open):hover .toggle-btn {
            border-radius: 0;
          }

          .floating-slide:not(.open):hover {
            .slide-content {
              transform: translateX(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </>
  );
}