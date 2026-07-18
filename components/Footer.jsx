"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { importantLinks } from "../lib/data/menus.js";
import logoScrolled from "@/assets/images/logo_grey.webp";
import Modal from "@/components/ModalDialog/Modal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import EnquiryForm from "@/components/EnquiryForm/page.jsx";
import HiringForm from "@/components/HiringForm/page.jsx";
import { 
  PersonPlusFill, 
  TelephoneFill, 
  PencilFill,
  GeoAltFill,
  EnvelopeFill,
  ClockFill
} from 'react-bootstrap-icons';
import "@/styles/_footer.scss";

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
        <div className="footer-sort">
          <div className="footer-connect-box">
            <h1>Connect, Comply & Grow ! </h1>
          </div>
        </div>
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
              <h4 className="footer-title-for-contact">Contact</h4>
             <div className="footer-contact">
  <div className="contact-item">
    <GeoAltFill size={16} className="contact-icon" />
    <span className="contact-text">
     Plot 466, New Apollo CHSL, Beside Blue Tokai Cafe, 14th Road, Khar West, Mumbai-400052.
    </span>
  </div>
  <div className="contact-item">
    <TelephoneFill size={16} className="contact-icon" />
    <span className="contact-text">
      <a href="tel:+919769458515"> +91 97694 58515</a>
      <span className="footer-sep">/</span>
      <a href="tel:+919324577378">9136066910</a>
    </span>
  </div>
  <div className="contact-item">
    <EnvelopeFill size={16} className="contact-icon" />
    <a href="mailto:ceo.desk@liaisonbank.com" className="contact-text">
      ceo.desk@liaisonbank.com
    </a>
  </div>
  <div className="contact-item">
    <ClockFill size={16} className="contact-icon" />
    <span className="contact-text">Mon – Sat : 8:00am – 5:00pm</span>
  </div>
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
            <span className="float-text">We&apos;re Hiring</span>
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

    </>
  );
}