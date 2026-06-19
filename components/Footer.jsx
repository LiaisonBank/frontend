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

export default function Footer() {
  const pathname = usePathname();
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
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100"
          /></Link>
            <p className="mt-4 leading-relaxed"  data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              Liaison Bank, established in 2007 and headquartered in Mumbai, is a
              specialized consultancy firm providing end-to-end licensing,
              regulatory compliance, and project liaisoning services.
            </p>
          </div>

          {/* Important Links */}
          <div className="flex flex-col max-w-xs flex-1 min-w-[200px]">
            <h4 className="text-yellow-400 font-semibold mb-4 text-base" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              Important Links
            </h4>
            <ul className="space-y-2">
              {importantLinks.map((link, index) => (
                <li key={link.name} data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col max-w-xs flex-1 min-w-[200px]">
            <h4 className="text-yellow-400 font-semibold mb-4 text-base"  data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              Quick Contacts
            </h4>

            <p className="mb-3"  data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              Plot 466, New Apollo CHSL,<br/>
              Beside Blue Tokai Coffee, 14th Road,<br/>
              Khar West, Mumbai-400052.
            </p>

            <div className="mb-3 flex items-center gap-2"  data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              {/* <Image src="/phone.png" width={25} height={25} alt="Call" /> */}
              <Image src="/phone-call-white-icon.png" width={30} height={30} alt="Call" />
              <Link href="tel:+91 91364 43852" >  97694 58515</Link> / &nbsp; 
              <Link href="tel:+91 91364 43852" >  91371 28401</Link> 
            </div>

            <div className="mb-3 flex items-center gap-2" data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              <Image 
              src="/Gmail_Logo_White_512px.png" 
              alt="Email" 
              width={0}   // Required prop, but overridden by style
              height={0}  // Required prop, but overridden by style
              sizes="100vw"
              style={{ width: '25px', height: '25px' }} 
            />&nbsp;
              <a href="mailto:info@liaisonbank.com" target="_blank">
                info@liaisonbank.com
              </a>
            </div>

            <div className="mb-3 flex items-center gap-1"  data-aos="fade-up" data-aos-duration="800" data-aos-delay="500">
              <Image src="/clock.png" width={30} height={30} alt="Office Time" style={{"marginLeft": "-0.3rem"}} />&nbsp;&nbsp;
              <span>Mon – Sat : 8:00am to 5:00pm</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto border-t border-white-100 py-4 text-center text-md mb-5"  data-aos="zoom-in" data-aos-duration="800" data-aos-delay="600">
          © 2026 Liaison Bank | All Rights Reserved
        </div>
      </footer>

      {/* Utilities */}
      <ScrollToTopButton />
  
      {/* Sticky CTA */}
      <div className="sticky-icon" key={pathname}>
        <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="400">
          <a href="tel:+919769458515" target="_blank" className="callnow" >
            <i className="fi fi-sr-phone-flip" ></i> 97694 58515
          </a>
        </div>
       <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="600">
        <a className="hiring open-form" onClick={() => setHiringOpen(true)}>
          &nbsp;<Image src={hiring} alt="WhatsApp" width={30} height={30} />&nbsp;  &nbsp; We are Hiring
        </a>
       </div>
       <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="800">
        <a className="enquire open-form" onClick={() => setOpen(true)}>
          <i className="fi fi-sr-attribution-pencil" ></i> Enquire Now
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
            <div className="col-4 whatsapp p-2">
              <a href="https://wa.me/919324577378" target="_blank" rel="noopener noreferrer">
                <i className="fi fi-brands-whatsapp"></i> WhatsApp
              </a>
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
        <EnquiryForm />
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