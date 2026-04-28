"use client";

import { useState  } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { importantLinks } from "../lib/data/menus.js";
import logoScrolled from "@/assets/images/logo.png";
import Modal from "@/components/ModalDialog/Modal";
import NewLauncb from "@/components/NewLaunch";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import EnquiryForm from "@/components/EnquiryForm/page.jsx";

export default function Footer() {
  const pathname = usePathname();
   const [isActive, setIsActive] = useState(false);
    const closePopup = () => setIsActive(false);
   const [open, setOpen] = useState(false);

  const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
  // useEffect(() => {
  //   let ticking = false;
  //   const footer = document.querySelector("footer");

  //   if (!footer) return;

  //   const updateFooter = () => {
  //     // ❌ Disable footer reveal below 1023px
  //     if (window.innerWidth < 1024) {
  //       footer.style.marginBottom = "0px";
  //       ticking = false;
  //       return;
  //     }

  //     const scrolled = window.scrollY;
  //     footer.style.marginBottom = `-${Math.min(scrolled / 5, 600)}px`;
  //     ticking = false;
  //   };

  //   const onScroll = () => {
  //     if (!ticking) {
  //       requestAnimationFrame(updateFooter);
  //       ticking = true;
  //     }
  //   };

  //   const onResize = () => {
  //     if (window.innerWidth < 1024) {
  //       footer.style.marginBottom = "0px";
  //     }
  //   };

  //   // Initial check
  //   onResize();

  //   window.addEventListener("scroll", onScroll);
  //   window.addEventListener("resize", onResize);

  //   return () => {
  //     window.removeEventListener("scroll", onScroll);
  //     window.removeEventListener("resize", onResize);
  //   };
  // }, []);

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
              New Apollo CHSL,
              Beside Blue Tokai Coffee, <br/>14th Road,
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
              <a href="mailto:ceo.desk@liaisonbank.com" target="_blank">
                ceo.desk@liaisonbank.com
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

      {/* Marquee */}
      <div className="container-fluid theme-bg">
        <div className="row theme-bg">
          <div className="marquee-branch flex items-center bg-white justify-between">
            <div className="comingsoontitle pl-4 w-1/3">
              <p>Our new branch is opening soon
</p>
              <div className="arrow arrow-right"></div>
            </div>
            <div className="location">
              <NewLauncb />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky CTA */}
      <div className="sticky-icon" key={pathname}>
        <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="400">
          <a href="tel:+919769458515" className="callnow" >
            <i className="fi fi-sr-phone-flip" ></i> Call Now
          </a>
        </div>
       <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="600">
        <a href="#" target="_blank" className="whatsapp"  >
          <i className="fi fi-brands-whatsapp"></i> Whatsapp
        </a>
       </div>
       <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="800">
        <a className="enquire open-form" onClick={() => setOpen(true)}>
          <i className="fi fi-sr-attribution-pencil" ></i> Enquire Now
        </a>
       </div>
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Enquiry Form"
        width="600px"
      >
        <EnquiryForm />
        <form
          action="forms/propertyenquirenow"
          method="post"
          className="email-form d-none"
        >
          <div className="row g-3">

            {/* Name */}
            <div className="col-12">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name"
                required
              />
            </div>

            {/* Email */}
            <div className="col-12">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email"
                required
              />
            </div>

            {/* Phone */}
            <div className="col-12">
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Your Phone"
                maxLength="10"
                required
              />
            </div>

            {/* Required Services Type */}
            <div className="col-12">
              <label htmlFor="serviceType" className="mb-1 fw-semibold">
                Required Services Type
              </label>
              <select
                name="subject"
                id="serviceType"
                className="form-control"
                required
              >
                <option value="">Select Service</option>
                <option value="AMC">AMC</option>
                <option value="Licensing">Licensing</option>
                <option value="Liaisoning">Liaisoning</option>
                <option value="Electrical">Electrical</option>
                <option value="PNG (SITC)">PNG (SITC)</option>
                <option value="Fire (SITC)">Fire (SITC)</option>
              </select>
            </div>

            {/* Message */}
            <div className="col-12">
              <textarea
                className="form-control"
                name="message"
                rows="4"
                placeholder="Your Message"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary px-4">
                Submit
                <span
                  className="loader ms-2"
                  style={{
                    display: "none",
                    width: "16px",
                    height: "16px",
                    border: "2px solid #fff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    displayInlineBlock: "inline-block",
                    animation: "spin 1s linear infinite",
                  }}
                ></span>
              </button>

              <div className="error-message mt-2 text-danger"></div>
              <div className="sent-message alert alert-success mt-3 d-none">
                Your message has been sent. Thank you!
              </div>
            </div>
          </div>
        </form>

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .form-control {
            border-radius: 10px;
            padding: 12px;
          }

          .btn-primary {
            border-radius: 10px;
            padding: 10px 30px;
          }
        `}</style>
      </Modal>
    </>
  );
}