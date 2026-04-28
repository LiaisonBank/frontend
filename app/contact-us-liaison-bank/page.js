"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';
import MapSection from '@/components/MapSection'
import ContactForm from "@/components/ContactForm";


export default function ContactusLiaisonbankPage() {
   useBodyClass('contactus');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Contact Us</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
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
             <div className="section-title pb-4"  data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
                <h3>Feel free to reach out to us at any time if you have questions. constraints. </h3>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                <div className="p-3 bg-light card"  data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
                  <p><strong>Khar (HQ)</strong> <br/>
                  Plot 466, New Apollo CHSL,
                  Beside Blue Tokai Coffee, <br/>14th Road,
                  Khar West, Mumbai-400052.<br/>
                  <strong>Landmark</strong> - Domino’s Pizza,14th Road.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 mb-4 d-none">
                <div className="p-3 bg-light card"  data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                  <p><strong>Bandra </strong> <br/>
                  1103/ 1104, 11th Floor,
                  Com. Building Esperanza, Plot No. 198,
                  Bandra West, Mumbai – 400050.</p>

                  <p><strong>Juhu </strong> <br/>A-1 Asha Colony, Juhu Road, Near Sea Princess Hotel,
                  Santacruz (W), Mumbai-400054</p>
                </div>
              </div>
               <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                <div className="p-3 bg-light card"  data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
                  <p>
                    <strong>Phone</strong> <br/> 
                    <Link href="tel:+91 91364 43852" >  (+91) 97694 58515</Link> / &nbsp; 
                    <Link href="tel:+91 91364 43852" >  (+91) 91371 28401</Link> <br/>
                    <strong>Singapore Phone</strong><br/>
                    <Link href="tel:+65 9856 0609" >   (+65) 9856 0609 </Link>
                  </p>
                  </div>
                  </div>

              <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                <div className="p-3 bg-light card"  data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
                  <p className="pb-4"><strong>Email</strong> <br/> 
                  <Link href="mailto:ceo.desk@liaisonbank.com" >ceo.desk@liaisonbank.com</Link> <br/>
                  <Link href="mailto:info@liaisonbank.com" >info@liaisonbank.com</Link>
                  </p>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 pt-4 map" data-aos="fade-right" data-aos-duration="600" data-aos-delay="500">
                 <div className="pattern-bg"></div>
                <div className="p-4"><MapSection /></div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 pt-4"  data-aos="fade-left" data-aos-duration="600" data-aos-delay="600">
                <div className="block-title">
                  <h3>Leave Us A Message</h3>
                  <h5>Get in touch! We look forward to hearing from you.</h5>
                </div>
                  <div className="contact-form py-4">
                    <ContactForm />
                    <form id="contact" className="d-none"  onSubmit={handleSubmit} noValidate>
                      <div className="form-group">
                        <label htmlFor="name" className="d-none">Your name</label>
                        <input type="text" name="name" id="name" required="" placeholder="Your name" title="Your name" />
                        <span className="label-up">Your name</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="d-none">Your e-mail</label>
                        <input type="text" name="email" id="email" required="" placeholder="Your e-mail" title="Your e-mail" />
                        <span className="label-up">Your e-mail</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject" className="d-none">Subject</label>
                        <input type="text" name="subject" id="subject" required="" placeholder="Subject" title="Subject" />
                        <span className="label-up">Subject</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="message" className="d-none">Your message</label>
                        <textarea name="message" id="message" required="" placeholder="Your message" title="Your message"></textarea>
                        <span className="label-up">Your message</span>
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

