"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { importantLinks } from "../lib/data/menus";
import logoScrolled from "@/assets/images/logo_grey.png";

import Modal from "@/components/ModalDialog/Modal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import EnquiryForm from "@/components/EnquiryForm/page";
import HiringForm from "@/components/HiringForm/page";

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

  const hideOnSitemap = pathname === "/sitemap";
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="footer">
        {/* Footer Top */}
        <div className="footer-sort">
          <div className="footer-connect-box">
            <h1>Connect, Comply &amp; Grow!</h1>
          </div>
        </div>

        {/* Footer Content */}
        <div className="footer-container-fluid px-5">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link href="/" onClick={scrollToTop}>
                <Image
                  src={logoScrolled}
                  alt="Liaison Bank"
                  title="Liaison Bank"
                  width={200}
                  height={56}
                  priority
                  className="footer-logo"
                />
              </Link>

              <p className="footer-text">
                Established in 2017–2019 as DBRE Proprietary, the firm became
                DBRE Private Limited in 2019 and rebranded as Liaison Bank in
                2023. Headquartered in Mumbai, Liaison Bank provides end-to-end
                licensing, regulatory compliance and project liaisoning
                services, helping businesses navigate regulatory requirements
                efficiently.
              </p>
            </div>

            {/* Quick Links */}
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

            {/* Contact */}
            <div>
              <h4 className="footer-title-for-contact"><Link href="/contact-us-liaison-bank">Contact</Link></h4>

              <div className="footer-contact">
                <div className="contact-item">
                  <GeoAltFill size={16} className="contact-icon" />
                  <span className="contact-text">
                    Plot 466, New Apollo CHSL, Beside Blue Tokai Cafe, 14th
                    Road, Khar West, Mumbai - 400052.
                  </span>
                </div>

                <div className="contact-item">
                  <TelephoneFill size={16} className="contact-icon" />

                  <span className="contact-text">
                    <a href="tel:+919769458515">+91 97694 58515</a>

                    <span className="footer-sep"> / </span>

                    <a href="tel:+919136066910">+91 91360 66910</a>
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
                    Mon – Sat : 8:00 AM – 5:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p>© {currentYear} Liaison Bank. All rights reserved.</p>

            <div className="footer-legal">
              <Link href="/legal/privacy-policy">Privacy</Link>

              <span>|</span>

              <Link href="/legal/terms-and-conditions">Terms</Link>
            </div>
          </div>
        </div>

      </footer>

      <ScrollToTopButton />

      {/* Desktop Sticky Buttons */}
      <div id="sticky-icon" className="sticky-icon">
        <a href="tel:+919769458515" target="_blank" className="callnow">
          +91 97694 58515
          <i className="fi fi-sr-phone-flip"></i>
        </a>

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

        <a className="enquire open-form" onClick={() => setOpen(true)}>
          Enquire Now <i className="fi fi-sr-attribution-pencil"></i>
        </a>
      </div>

      {/* Tablet Sticky CTA */}
      <div className="sticky-icon-below-1024">
        <div className="container-fluid">
          <div className="row">
            <div className="col-3 callnow p-2">
              <a href="tel:+919769458515" target="_blank">
                <i className="fi fi-sr-phone-flip"></i>
                Call
              </a>
            </div>

            <div className="col-3 enquire p-2">
              <button type="button" onClick={() => setOpen(true)}>
                <i className="fi fi-sr-attribution-pencil"></i>
                Enquire
              </button>
            </div>

            <div className="col-3 hiring p-2">
              <button type="button" onClick={() => setHiringOpen(true)}>
                <PersonPlusFill size={22} />
                Hiring
              </button>
            </div>

            <div className="col-3 chatbot p-2">
              {/* <ChatBot /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {!hideOnSitemap && (
        <div className="mobile-bar">
          <a href="tel:+919769458515" className="mob-btn mob-call">
            <TelephoneFill size={18} />
            Call
          </a>

          <button
            type="button"
            className="mob-btn mob-enquire"
            onClick={() => setOpen(true)}
          >
            <PencilFill size={18} />
            Enquire
          </button>

          <button
            type="button"
            className="mob-btn mob-hiring"
            onClick={() => setHiringOpen(true)}
          >
            <PersonPlusFill size={18} />
            Hiring
          </button>
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
    </>
  );
}
