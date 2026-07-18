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
import { PersonPlusFill, TelephoneFill, PencilFill } from 'react-bootstrap-icons';

export default function Footer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hiringOpen, setHiringOpen] = useState(false);
  
  const [activeButton, setActiveButton] = useState(null);

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
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" onClick={scrollToTop}>
                <Image src={logoScrolled} alt="Liaisonbank" title="Liaisonbank" width={200} height={56} priority className="footer-logo" />
              </Link>
              <p className="footer-text">
                Established in 2017-2019 as DBRE Proprietary the firm became DBRE Private Limited in 2019 and rebranded as Liaison Bank in 2023 Headquartered in Mumbai Liaison Bank provides end-to-end licensing, regulatory compliance, and project liaisoning services, helping businesses navigate regulatory requirements efficiently.
              </p>
            </div>
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                {importantLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Contact</h4>
              <div className="footer-contact">
                <p className="footer-address">Plot 466, New Apollo CHSL,<br />Khar West, Mumbai-400052</p>
                <p className="footer-phone">
                  <a href="tel:+919769458515">+91 97694 58515</a>
                  <span className="footer-sep">/</span>
                  <a href="tel:+919324577378">9136066910</a>
                </p>
                <a href="mailto:ceo.desk@liaisonbank.com" className="footer-email">ceo.desk@liaisonbank.com</a>
                <p className="footer-time">Mon – Sat : 8:00am – 5:00pm</p>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Connect</h4>
              <div className="footer-buttons">
                <button onClick={() => setOpen(true)} className="btn-enquire">Enquire Now</button>
                <button onClick={() => setHiringOpen(true)} className="btn-hiring">We're Hiring</button>
              </div>
            </div>
          </div>
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

      <ScrollToTopButton />

      {!hideOnSitemap && (
        <div className="floating-wrapper">
          <button 
            className={`float-pill float-call ${activeButton === 'call' ? 'expanded' : ''}`}
            onMouseEnter={() => setActiveButton('call')}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => window.location.href = 'tel:+919769458515'}
          >
            <span className="float-text">+91 97694 58515</span>
            <TelephoneFill size={20} className="float-icon" />
          </button>

          <button 
            className={`float-pill float-add ${activeButton === 'hiring' ? 'expanded' : ''}`}
            onMouseEnter={() => setActiveButton('hiring')}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => setHiringOpen(true)}
          >
            <span className="float-text">We're Hiring</span>
            <PersonPlusFill size={24} className="float-icon" />
          </button>

          <button 
            className={`float-pill float-edit ${activeButton === 'enquire' ? 'expanded' : ''}`}
            onMouseEnter={() => setActiveButton('enquire')}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => setOpen(true)}
          >
            <span className="float-text">Enquire Now</span>
            <PencilFill size={20} className="float-icon" />
          </button>
        </div>
      )}

      {!hideOnSitemap && (
        <div className="mobile-bar">
          <a href="tel:+919769458515" className="mob-btn mob-call">
            <TelephoneFill size={18} />Call
          </a>
          <button onClick={() => setOpen(true)} className="mob-btn mob-enquire">
            <PencilFill size={18} />Enquire
          </button>
          <button onClick={() => setHiringOpen(true)} className="mob-btn mob-hiring">
            <PersonPlusFill size={18} />Hiring
          </button>
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Enquiry Form" width="600px">
        <EnquiryForm onClose={() => setOpen(false)} />
      </Modal>
      <Modal isOpen={hiringOpen} onClose={() => setHiringOpen(false)} title="We're Hiring" width="600px">
        <HiringForm />
      </Modal>

      <style jsx>{`
        .footer { background: #f8fafc78; color: #0f172a; padding: 50px 20px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #e2e8f0; }
        .footer-container { max-width: 1200px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1.5fr 1.2fr; gap: 40px; padding-bottom: 30px; border-bottom: 1px solid #e2e8f0; }
        .footer-brand { display: flex; flex-direction: column; gap: 14px; }
        .footer-logo { height: auto; width: 200px; display: block; }
        .footer-text { color: #334155; font-size: 14px; line-height: 1.8; margin: 0; max-width: 400px; }
        .footer-title { color: #e18c1d; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 20px 0; position: relative; padding-bottom: 10px; }
        .footer-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 30px; height: 3px; background: #e18c1d; border-radius: 2px; }
        .footer-links { list-style: none; padding: 0; margin: 8px 0 0 0; display: flex; flex-direction: column; gap: 10px; }
        .footer-link { color: #475569; text-decoration: none; font-size: 14px; transition: all 0.2s; display: inline-block; }
        .footer-link:hover { color: #e18c1d; transform: translateX(4px); }
        .footer-contact { display: flex; flex-direction: column; gap: 8px; color: #475569; font-size: 14px; line-height: 1.6; margin-top: 4px; }
        .footer-address { margin: 0; line-height: 1.8; color: #475569; }
        .footer-phone { margin: 0; }
        .footer-phone a { color: #475569; text-decoration: none; transition: color 0.2s; }
        .footer-phone a:hover { color: #e18c1d; }
        .footer-sep { color: #cbd5e1; margin: 0 6px; }
        .footer-email { color: #475569; text-decoration: none; transition: color 0.2s; display: inline-block; }
        .footer-email:hover { color: #e18c1d; }
        .footer-time { margin: 0; color: #94a3b8; font-size: 13px; }
        .footer-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
        .btn-enquire, .btn-hiring { padding: 12px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; width: 100%; font-family: inherit; letter-spacing: 0.3px; }
        .btn-enquire { background: #e18c1d; color: #ffffff; }
        .btn-enquire:hover { background: #be123c; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(225, 29, 72, 0.25); }
        .btn-hiring { background: transparent; color: #e11d48; border: 2px solid #e11d48; }
        .btn-hiring:hover { background: #e11d48; color: #ffffff; transform: translateY(-2px); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; font-size: 13px; color: #94a3b8; flex-wrap: wrap; gap: 10px; }
        .footer-bottom p { margin: 0; }
        .footer-legal { display: flex; align-items: center; gap: 10px; }
        .footer-legal a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
        .footer-legal a:hover { color: #e11d48; }
        .footer-legal span { color: #cbd5e1; }

        /* ===== FLOATING BUTTONS ===== */
        .floating-wrapper { position: fixed; bottom: 120px; left: -10px; z-index: 50; display: flex; flex-direction: column; gap: 12px; }
        .float-pill { display: flex; align-items: center; justify-content: flex-end; flex-direction: row; gap: 0px; background: #1a1a1a; color: #ffffff; border: none; border-radius: 50px; padding: 14px; width: 52px; height: 52px; text-decoration: none; font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer; transition: box-shadow 0.3s ease, transform 0.3s ease; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25); overflow: hidden; position: relative; }
        .float-pill:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35); }
        .float-icon { flex-shrink: 0; }
        .float-text { opacity: 0; white-space: nowrap; width: 0; overflow: hidden; transform: translateX(20px); margin-right: 0; }

        /* ===== THE ROLLING TIRE ANIMATION (FIXED TEXT DIRECTION) ===== */
        @keyframes rollOut {
          0% { opacity: 0; width: 0; transform: translateX(20px) rotateY(0deg); }
          50% { opacity: 0.5; width: auto; transform: translateX(10px) rotateY(-90deg); }
          100% { opacity: 1; width: auto; transform: translateX(0) rotateY(-360deg); } /* Changed to -360deg to fix the reversal */
        }

        .float-pill.expanded { width: auto; padding: 14px 24px 14px 18px; }
        .float-pill.expanded .float-text { margin-right: 14px; animation: rollOut 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

        /* ===== MOBILE BAR ===== */
        .mobile-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: #ffffff; border-top: 1px solid #e2e8f0; padding: 8px 0; grid-template-columns: repeat(3, 1fr); box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04); }
        .mob-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; color: #475569; text-decoration: none; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 500; transition: all 0.2s; letter-spacing: 0.3px; gap: 4px; }
        .mob-call { color: #22c55e; }
        .mob-enquire { color: #e18c1d; }
        .mob-hiring { color: #e11d48; }
        .mob-btn:hover { transform: scale(1.05); }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 35px; }
          .footer-brand { grid-column: 1 / -1; }
          .footer-text { max-width: 100%; }
          .floating-wrapper { display: none; }
          .mobile-bar { display: grid; }
        }
        @media (max-width: 640px) {
          .footer { padding: 30px 16px 80px; }
          .footer-grid { grid-template-columns: 1fr; gap: 30px; padding-bottom: 25px; }
          .footer-logo { width: 160px; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .footer-legal { justify-content: center; }
          .btn-enquire, .btn-hiring { padding: 14px; }
        }
      `}</style>
    </>
  );
}