"use client";

import { useState  } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { importantLinks } from "../lib/data/menus.js";
import logoScrolled from "@/assets/images/logo.png";
import hiring from "@/assets/images/hiring.png";
import Modal from "@/components/ModalDialog/Modal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import EnquiryForm from "@/components/EnquiryForm/page.jsx";
import HiringForm from "@/components/HiringForm/page.jsx";
import ChatBot from "./ChatBot/ChatBot.jsx";
import { PersonPlus, PersonPlusFill, Briefcase, PersonWorkspace } from 'react-bootstrap-icons';

export default function Footer() {
  const pathname = usePathname();
  const [showIcons, setShowIcons] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const closePopup = () => setIsActive(false);
  const [open, setOpen] = useState(false); // Enquiry
  const [hiringOpen, setHiringOpen] = useState(false); // Hiring

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
   // Hide ONLY on sitemap page
  const hideOnSitemap = pathname === "/sitemap";
  // if (hideOnSitemap) return null; // 🔥 clean unmount (best performance)
  
  return (
    <>
      <footer className="text-white px-2 py-2 font-sans text-md">
        <div className="foo-column max-w-7xl mx-auto px-4 py-10 flex flex-wrap items-center justify-between gap-10">
          
          {/* Logo & About */}
          <div className="flex flex-col max-w-xs flex-1 min-w-[200px]">
            <Link href="/"  onClick={scrollToTop}>
           <Image
            src={logoScrolled}
            alt="Liaisonbank"
            title="Liaisonbank"
            width={300}        // Numeric value only
            height={80}        // Best practice: provide an actual height to prevent layout shift
            className="h-auto w-auto" // Use CSS to maintain aspect ratio if needed
            
            // Performance Optimization
            priority={true}    // Logos in headers should load immediately, not lazy-load
            quality={75}       // Fine-tune compression
            
            // Animation (Ensure AOS is initialized in a useEffect)
          /></Link>
            <p className="mt-4 leading-relaxed">
              Liaison Bank, established in 2007 and headquartered in Mumbai, is a
              specialized consultancy firm providing end-to-end licensing,
              regulatory compliance, and project liaisoning services.
            </p>
          </div>

          {/* Important Links */}
          <div className="flex flex-col max-w-xs flex-1 min-w-[200px]">
            <h4 className="text-yellow-400 font-semibold mb-4 text-base">
              Important Links
            </h4>
            <ul className="space-y-2">
              {importantLinks.map((link, index) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col max-w-xs flex-1 min-w-[200px] q-uick">
            <h4 className="text-yellow-400 font-semibold mb-4 text-base">
              Quick Contacts
            </h4>

            <p className="mb-3 address">
              Plot 466, New Apollo CHSL,<br/>
              Beside Blue Tokai Coffee,<br/>  
              14th Road, Khar West, <br/>
              Mumbai-400052.
            </p>

            <div className="mb-3 flex items-center gap-2 tell">
              {/* <Image src="/phone.png" width={25} height={25} alt="Call" /> */}
              <Image src="/phone-call-white-icon.png" width={30} height={30} alt="Call" />
               <Link href="tel:+91 91364 43852" > (+91) &nbsp; 97694 58515</Link> &nbsp;
              /&nbsp;<Link href="tel:+91 93245 77378" >  93245 77378</Link>
            </div>

            <div className="mb-3 flex items-center gap-2 email">
              <Image 
              src="/Gmail_Logo_White_512px.png" 
              alt="Email" 
              width={0}   // Required prop, but overridden by style
              height={0}  // Required prop, but overridden by style
              sizes="100vw"
              style={{ width: '25px', height: '25px' }} 
            />&nbsp;
              <a href="mailto:ceo.desk@liaisonbank.com" target="_blank">
                ceo.desk@liaisonbank.com
              </a>
            </div>

            <div className="mb-3 flex items-center gap-1">
              <Image src="/clock.png" width={30} height={30} alt="Office Time" style={{"marginLeft": "-0.3rem"}} />&nbsp;&nbsp;
              <span>Mon – Sat : 8:00am to 5:00pm</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto border-t border-white-100 pt-4 pb-5 text-center text-md mb-5">
          © 2026 Liaison Bank | All Rights Reserved
        </div>
      </footer>

      {/* Utilities */}
      <ScrollToTopButton />
  
      {/* Sticky CTA */}
        <div key={pathname} id="sticky-icon"  className={`sticky-icon ${showIcons ? "show" : ""} ${
        hideOnSitemap ? "d-none" : ""
      }`}
      onMouseEnter={() => setShowIcons(true)}
      onMouseLeave={() => setShowIcons(false)}>
          <div>
            <a href="tel:+919769458515" target="_blank" className="callnow" >
              +91 97694 58515 <i className="fi fi-sr-phone-flip" ></i> &nbsp;
            </a>
          </div>
        <div>
          <a className="hiring open-form text-right" onClick={() => setHiringOpen(true)}>
             We are Hiring &nbsp;  &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
             <PersonPlusFill size={30} color="white" /> &nbsp;&nbsp;
          </a>
        </div>
        <div>
          <a className="enquire open-form" onClick={() => setOpen(true)}>
            Enquire Now <i className="fi fi-sr-attribution-pencil" ></i>
          </a>
        </div>
        </div>
              {/* {Sticky CTA from 1024 to below} */}
        <div className="sticky-icon-below-1024">
          <div className="container-fluid mx-auto">
            <div className="row">
              <div className="col-4 callnow p-2">
                <a href="tel:+919769458515" target="_blank">
                  <i className="fi fi-sr-phone-flip" ></i> Call Now
                </a>
              </div>
              <div className="col-4 enquire open-form p-2">
                <a onClick={() => setOpen(true)}>
                  <i className="fi fi-sr-attribution-pencil" ></i> Enquire Now
                </a>
              </div>
              <div className="col-4 whatsapp p-2 d-flex align-items-center justify-content-center">
                <a className="hiring open-form text-right" onClick={() => setHiringOpen(true)}>
                 <PersonPlusFill size={36} color="white" /> &nbsp;We are Hiring 
                </a>
                {/* <a>
                  <ChatBot/> Whats App 
                </a> */}
                {/* <a href="https://wa.me/919324577378" target="_blank" rel="noopener noreferrer">
                  <i className="fi fi-brands-whatsapp"></i> WhatsApp
                </a> */}
              </div>
            </div>
          </div>

          
          
        

        </div>
       {/* Enquiry Modal */}             
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Enquiry Form"
        width="600px"
      >
        <EnquiryForm  onClose={() => setOpen(false)} />
      </Modal>

      {/* Hiring Modal */}
      <Modal
        isOpen={hiringOpen}
        onClose={() => setHiringOpen(false)}
        title="We're Hiring"
        width="600px"
      >
        {/* Replace with your Hiring Form component */}
        <HiringForm />
      </Modal>
    </>
  );
}