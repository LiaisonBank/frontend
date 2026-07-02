"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';
import MapSection from '@/components/MapSection'
import EnquiryForm from "@/components/EnquiryForm/form";
// import ContactForm from "@/components/ContactForm";


export default function ContactusLiaisonbankPage() {
   useBodyClass('contact-us-liaison-bank');
     const handleSubmit = (event) => {
      event.preventDefault(); // Prevents default form submission behavior

      // Perform your custom validation logic here
      console.log('Custom validation and form submission logic goes here.');
    };
  return (
    <>
     <div className="page-header">
        <div className="inner-header">
          {/* <PageTitleWave /> */}
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Contact Us</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" aria-hidden="true"></i>
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Contact Us
                        </li>
                      </ol>
                    </nav>

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <PageTitleWaveLeft /> */}
        </div>
      </div>
      <section className="container  pt-4">
        <div className="contact-section">
          <div className="row justify-content-center text-center">
             <div className="section-title pb-4 d-none">
                <h3>Feel free to reach out to us at any time if you have questions. constraints. </h3>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 pt-4 map">
                  <div><MapSection /></div>
                 <div className="col-lg-6 col-md-6 col-sm-12 pt-4">
                  <p><strong>Khar (HQ)</strong> <br/>
                  Plot 466, New Apollo CHSL,
                  Beside Blue Tokai Coffee, 14th Road,
                  Khar West, <br/>Mumbai-400052.<br/>
                  {/* <strong>Landmark</strong> - Domino’s Pizza,14th Road. */}
                  </p>
                  <p>
                    <strong>Phone</strong> <br/> 
                    <Link href="tel:+91 91364 43852" > (+91) &nbsp; 97694 58515</Link> &nbsp;
                    /&nbsp;<Link href="tel:+91 93245 77378" >  93245 77378</Link><br/>
                    <strong>Singapore Phone</strong><br/>
                    <Link href="tel:+65 9856 0609" >   (+65) 9856 0609 </Link>
                  </p>
                  <p className="pb-4"><strong>Email</strong> <br/> 
                  {/* <Link href="mailto:ceo.desk@liaisonbank.com" >ceo.desk@liaisonbank.com</Link> <br/> */}
                  <Link href="mailto:ceo.desk@liaisonbank.com" >ceo.desk@liaisonbank.com</Link>
                  </p>
                 </div>
                 {/* <div className="pattern-bg"></div> */}
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 pt-4">
                <div className="block-title">
                  <h3>Leave Us A Message</h3>
                  <h5>Get in touch! We look forward to hearing from you.</h5>
                </div>
                  <div className="contact-form py-2">
                    <EnquiryForm />
                    {/* <ContactForm /> */}
                    <form id="contact" className="d-none"  onSubmit={handleSubmit} noValidate>
                      <div className="form-group">
                        <label htmlFor="name" className="d-none">Your Name</label>
                        <input type="text" name="name" id="name" required="" placeholder="Your Name" title="Your Name" />
                        <span className="label-up">Your Name</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="d-none">Your E-mail</label>
                        <input type="text" name="email" id="email" required="" placeholder="Your E-mail" title="Your E-mail" />
                        <span className="label-up">Your E-mail</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject" className="d-none">Subject</label>
                        <input type="text" name="subject" id="subject" required="" placeholder="Subject" title="Subject" />
                        <span className="label-up">Subject</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="message" className="d-none">Your Message</label>
                        <textarea name="message" id="message" required="" placeholder="Your Message" title="Your Message"></textarea>
                        <span className="label-up">Your Message</span>
                      </div>
                      <div className="form-group">
                        <button id="submit" type="submit" name="submit">Submit</button>
                      </div>
                    </form>
                  </div>
              </div>
          </div>
        </div>
      </section>
    </>
  );
}

