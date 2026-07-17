"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { importantLinks } from "../lib/data/menus.js";
import logoScrolled from "@/assets/images/logo.png";
import Modal from "@/components/ModalDialog/Modal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import EnquiryForm from "@/components/EnquiryForm/page.jsx";
import HiringForm from "@/components/HiringForm/page.jsx";

export default function Footer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hiringOpen, setHiringOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hideOnSitemap = pathname === "/sitemap";
  const currentYear = new Date().getFullYear();

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
                  width={180}
                  height={50}
                  priority
                  className="footer-logo"
                />
              </Link>
              <p className="footer-text">
                Liaison Bank, established in 2007 and headquartered in Mumbai, is a
                specialized consultancy firm providing end-to-end licensing,
                regulatory compliance, and project liaisoning services.
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
                  <a href="tel:+919324577378">93245 77378</a>
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
              <span>|</span>
              <Link href="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <ScrollToTopButton />

      {/* Floating Buttons */}
      {!hideOnSitemap && (
        <div className="floating-buttons">
          <button onClick={() => setOpen(true)} className="float-enquire">
            Enquire
          </button>
          <button onClick={() => setHiringOpen(true)} className="float-hiring">
            Hiring
          </button>
          <a href="tel:+919769458515" className="float-call">
            Call
          </a>
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
          background: #0f172a;
          color: #ffffff;
          padding: 50px 20px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== GRID ===== */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1.2fr;
          gap: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ===== BRAND ===== */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-logo {
          height: auto;
          width: 180px;
          filter: brightness(0) invert(1);
        }

        .footer-text {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.8;
          margin: 0;
          max-width: 400px;
        }

        /* ===== TITLE ===== */
        .footer-title {
          color: #facc15;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 16px 0;
        }

        /* ===== LINKS ===== */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
          display: inline-block;
        }

        .footer-link:hover {
          color: #facc15;
        }

        /* ===== CONTACT ===== */
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }

        .footer-address {
          margin: 0 0 4px 0;
          line-height: 1.8;
        }

        .footer-phone {
          margin: 0;
        }

        .footer-phone a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-phone a:hover {
          color: #facc15;
        }

        .footer-sep {
          color: #334155;
          margin: 0 6px;
        }

        .footer-email {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-email:hover {
          color: #facc15;
        }

        .footer-time {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        /* ===== BUTTONS ===== */
        .footer-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-enquire,
        .btn-hiring {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          font-family: inherit;
        }

        .btn-enquire {
          background: #facc15;
          color: #0f172a;
        }

        .btn-enquire:hover {
          background: #eab308;
          transform: translateY(-1px);
        }

        .btn-hiring {
          background: transparent;
          color: #facc15;
          border: 1px solid rgba(250, 204, 21, 0.3);
        }

        .btn-hiring:hover {
          background: rgba(250, 204, 21, 0.05);
          border-color: #facc15;
        }

        /* ===== BOTTOM ===== */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          font-size: 13px;
          color: #64748b;
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
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal a:hover {
          color: #facc15;
        }

        .footer-legal span {
          color: #334155;
        }

        /* ===== FLOATING BUTTONS ===== */
        .floating-buttons {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .float-enquire,
        .float-hiring,
        .float-call {
          padding: 10px 20px;
          border: none;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          text-align: center;
          min-width: 100px;
          font-family: inherit;
          box-shadow: 0 2px 15px rgba(0,0,0,0.2);
        }

        .float-enquire {
          background: #facc15;
          color: #0f172a;
        }

        .float-enquire:hover {
          background: #eab308;
          transform: scale(1.05);
        }

        .float-hiring {
          background: #1e293b;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .float-hiring:hover {
          background: #334155;
          transform: scale(1.05);
        }

        .float-call {
          background: #22c55e;
          color: white;
        }

        .float-call:hover {
          background: #16a34a;
          transform: scale(1.05);
        }

        /* ===== MOBILE BAR ===== */
        .mobile-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #0f172a;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 8px 0;
          grid-template-columns: repeat(3, 1fr);
        }

        .mob-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          color: #94a3b8;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .mob-btn:hover {
          color: #facc15;
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

          .floating-buttons {
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
            width: 150px;
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
      `}</style>
    </>
  );
}