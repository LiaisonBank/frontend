"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { importantLinks } from "../lib/data/menus.js";
import logoScrolled from "@/assets/images/logo_grey.png";
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
  ClockFill,
} from "react-bootstrap-icons";
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
                Established in 2017-2019 as DBRE Proprietary the firm became
                DBRE Private Limited in 2019 and rebranded as Liaison Bank in
                2023 Headquartered in Mumbai Liaison Bank provides end-to-end
                licensing, regulatory compliance, and project liaisoning
                services, helping businesses navigate regulatory requirements
                efficiently.
              </p>
            </div>
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                {importantLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="footer-link read-more-btn"
                    >
                      {link.name}
                    </Link>
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
                    Plot 466, New Apollo CHSL, Beside Blue Tokai Cafe, 14th
                    Road, Khar West, Mumbai-400052.
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
                  <a
                    href="mailto:ceo.desk@liaisonbank.com"
                    className="contact-text"
                  >
                    ceo.desk@liaisonbank.com
                  </a>
                </div>
                <div className="contact-item">
                  <ClockFill size={16} className="contact-icon" />
                  <span className="contact-text">
                    Mon – Sat : 8:00am – 5:00pm
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {currentYear} Liaison Bank. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="/legal/privacy-policy">Privacy</Link>
              <span>|</span>
              <Link href="/legal/terms-and-conditions">Terms</Link>
            </div>
          </div>
        </div>
        <ChatBot/>
      </footer>

      <ScrollToTopButton />
      <div id="sticky-icon" className="sticky-icon  ">
        <div>
          <a href="tel:+919769458515" target="_blank" className="callnow">
            +91 97694 58515 <i className="fi fi-sr-phone-flip"></i>&nbsp;
          </a>
        </div>
        <div>
          <a className="hiring open-form text-right" onClick={() => setHiringOpen(true)}>
            We are Hiring &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="30"
              height="30"
              fill="white"
              className="bi bi-person-plus-fill"
            >
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
              <path
                fillRule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
              ></path>
            </svg>
            &nbsp;&nbsp;
          </a>
        </div>
        <div>
          <a className="enquire open-form" onClick={() => setOpen(true)}>
            Enquire Now <i className="fi fi-sr-attribution-pencil"></i>
          </a>
        </div>
        </div>
              {/* {Sticky CTA from 1024 to below} */}
        <div className="sticky-icon-below-1024">
          <div className="container-fluid mx-auto">
            <div className="row">
              <div className="col-3 callnow p-2">
                <a href="tel:+919769458515" target="_blank">
                  <i className="fi fi-sr-phone-flip" ></i> Call Now
                </a>
              </div>
              <div className="col-3 enquire open-form p-2">
                <a onClick={() => setOpen(true)}>
                  <i className="fi fi-sr-attribution-pencil" ></i> Enquire Now
                </a>
              </div>
              <div className="col-3 whatsapp p-2 d-flex align-items-center justify-content-center">
                <a className="hiring open-form text-right" onClick={() => setHiringOpen(true)}>
                 <PersonPlusFill size={36} color="white" /> &nbsp;We are Hiring 
                </a>
                {/* <a href="https://wa.me/919324577378" target="_blank" rel="noopener noreferrer">
                  <i className="fi fi-brands-whatsapp"></i> WhatsApp
                </a> */}
              </div>
              <div className="col-3 whatsapp p-2 d-flex align-items-center justify-content-center">
                <a>
                  <ChatBot/>
                </a>
              </div>
            </div>
          </div>

          <button
            className={`float-pill float-edit ${activeButton === "enquire" ? "expanded" : ""}`}
            onMouseEnter={() => setActiveButton("enquire")}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => setOpen(true)}
          >
            <span className="float-text">Enquire Now</span>
            <PencilFill size={20} className="float-icon" />
          </button>
        </div>
      )}*/}

      {!hideOnSitemap && (
        <div className="mobile-bar">
          <a href="tel:+919769458515" className="mob-btn mob-call">
            <TelephoneFill size={18} />
            Call
          </a>
          <button onClick={() => setOpen(true)} className="mob-btn mob-enquire">
            <PencilFill size={18} />
            Enquire
          </button>
          <button
            onClick={() => setHiringOpen(true)}
            className="mob-btn mob-hiring"
          >
            <PersonPlusFill size={18} />
            Hiring
          </button>
        </div>
      )} 

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
    </>
  );
}
