"use client";

import Link from 'next/link'
import Image from 'next/image'
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import Waves from "@/components/waves";

// import smallLogo from "@/assets/images/shape-small-1-1.png"
import welcomeImg from "@/assets/images/mahadev_Rupali_Arvind.webp"
import devaImg from "@/assets/images/devaBirader.webp"
import ServicesSection from "@/components/ServicesSection";
import ClientScroller from "@/components/ClientScroller"
import useFancybox from '@/components/useFancybox';
import TestimonialSlider  from '@/components/TestimonialSlider';
// import CertificateScroller from '@/components/CertificateScroller';

import CertificateGallery from "@/components/awards/page";
import FAQAccordion from "@/components/Faqs/FAQAccordion";
import OurServices from "@/components/OurServices/page";
import HeroSection  from "@/components/HeroSection/HeroSection";
import HeroMarquee from "@/components/HeroMarquee/HeroMarquee";
import HeroSlider from '@/components/HeroSection/HeroSlider';
import OrbitServices from '@/components/HeroSection/OrbitServices';

const Home = () => {
  useBodyClass('home');
  const fancyboxRef = useFancybox({
    // This object disables the thumbnails entirely
    Thumbs: false,
  });

  return (
    <>
      <div className="hero-section page-header">
        <div className="inner-header">
          <HeroMarquee />
          {/* <HeroSection /> */}
          {/* <HeroSlider /> */}
          {/* <OrbitServices /> */}
        </div>
        {/* <Waves /> */}
        {/* <div className="smallObject">
          <Image
            src={smallLogo}
            alt=""
            width={257}
            height={257}
            className="auto-rotate"
            priority
          />
        </div> */}
      </div>
      <section className="pt-2 bg-aliceblue ceo-message">
        <div className="container mx-auto pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className='aling-items-center mx-auto image' data-aos="fade-right" data-aos-duration="600" data-aos-delay="100">
                  <Image
                    src={devaImg}
                    width={375}
                    height={375}
                    alt="Deva Birader"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    priority
                  />
              </div>
              <div className='p-4 mt-2 mesg'>
                <div className='quote'  data-aos="fade-left" data-aos-duration="600" data-aos-delay="200">
                  <p>
                    It&apos;s not about waiting for things to fall into place, it&lsquo;s about what you make of yourself.
                  </p>
                </div>
                <div className='col-auto ceo-name'  data-aos="fade-right" data-aos-duration="600" data-aos-delay="300">
                  <h1 className="author-title" aria-label="Deva Biradar">Deva Biradar</h1>
                  <p className="author-desc">Chief Executive Officer</p>
                </div>

              </div>
          </div>
        </div>
      </section>

      <section className="welcome">
        <div className="container mx-auto py-5 bg-white">
          {/* <div className="smallObject" data-aos="fade-right" data-aos-duration="600" data-aos-delay="100">
            <Image
              src={smallLogo}
              alt=""
              width={257}
              height={257}
              className="auto-rotate"
              priority
            />
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
            <div className="p-4 d-flex justify-content-end letbanner" data-aos="fade-right" data-aos-duration="600" data-aos-delay="100">
              <Image
                src={welcomeImg}
                alt="Welcome to Liaison Bank Digital Banking Platform"
                width={450}
                height={450}
                priority
                placeholder="blur"
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <div className=" p-4">
              <div className='section-title'>
                {/* <h6 data-aos="fade-left" data-aos-duration="600" data-aos-delay="100">Welcome to, Liaison Bank  </h6> */}
                <h3 data-aos="fade-left" data-aos-duration="600" data-aos-delay="200">Your Partner in Bank
                  <span className='theme-color'>Licensing</span> and
                  <span className='theme-color'>Liaisoning</span>
                </h3>
              </div>
              <div className='home-abt'>
                <p data-aos="fade-left" data-aos-duration="600" data-aos-delay="300">Bridging the gap between the complicated regulatory frameworks and your business goals, we act as an interface for all your statutory requirements. As your dedicated licensing and liaisoning partner, we specialize in managing the intricate legalities and bureaucratic uncertainties that often stall business momentum. Our expertise ensures smoother operations, allowing you to channelize your energy into core priorities and other important business objectives.</p>
                <p data-aos="fade-left" data-aos-duration="600" data-aos-delay="400">We commit to deliver a seamless, and reliable framework that offers absolute clarity and operational confidence. By taking care of the complexities of industrial licensing, permits, and government liaisoning, we transform a traditionally slow process into a smooth, efficient experience. While we handle the administrative hurdles, you stay empowered to focus on strategic growth and achieving your business milestones with the certainty that your legal standing is in expert hands.</p>
                {/* <p>By entrusting us with your regulatory approvals and government relations, you accelerate the transition between policy and progress.</p> */}
                {/* <h2 className="text-xl font-semibold mb-2">Column 2</h2> */}
                {/* <p>We take care of the intricacies and uncertainties, allowing you to redirect your energy towards your core priorities and business objectives. This ensures a smoother and more efficient experience, providing you with the peace of mind to concentrate on what matters most to your success.</p>
                <p>Our commitment is to deliver a seamless and reliable experience that brings clarity, confidence, and peace of mind. With our expertise supporting your operations, you can move forward with assurance—concentrating on strategic growth and achieving your business objectives while we handle the rest.</p> */}
                <hr />
              </div>
              <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div data-aos="zoom-in" data-aos-duration="600" data-aos-delay="900">
                  <Link href="/" className="themeht-btn primary-btn d-flex align-items-center mr-2 mt-4 d-none">
                    CEO&apos;s DESK&nbsp;
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ourservices">
        <div className="container mx-auto py-5 service-list">
          <div className="section-title">
            <h3 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Licensing and Liaisoning</h3>
            <h5 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">We bring our services to multiple sectors and create customised solutions for diverse set of business needs.</h5>
          </div>
          <div className='col-12 mx-auto' data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <OurServices/>
          </div>
        </div>
      </section>
      

      <section className="weprovide">
        <div className="container mx-auto  py-5 bg-white">
          <div className="section-title">
            <h3 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">What we Provide ?</h3>
          </div>
          <section className="services-section">
            <div className="services-grid">
              <ServicesSection />
            </div>
          </section>
        </div>
      </section>

      <section className="awardscertification">
        <div className="container-fluid mx-auto py-5">
          <div className="section-title">
            <h3 data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">Awards & Certifications</h3>
          </div>

          <div ref={fancyboxRef} className="row  py-5 d-flex align-items-center">
            {/* <div className="col-lg-2 col-md-2 col-sm-6 col-6"> */}
            <CertificateGallery />
            {/* <CertificateScroller /> */}
            {/* </div> */}
          </div>
        </div>
      </section>

      <section className="clientfeedback py-5">
        <div className="container-fluid mx-auto px-0 bg-white">
          <div className="section-title">
            <h3 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">What Clients Say</h3>
          </div>
          <TestimonialSlider  />
        </div>
      </section>

      <section className="ourclients">
        <div className="container-fluid mx-auto px-0 py-5 bg-white">
          <div className="section-title">
            <h3 data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">Our Latest Clients</h3>
          </div>
          <div>
            <ClientScroller />
          </div>
        </div>
      </section>


      <section className="faqs">
        <div className="container mx-auto  py-4 bg-white">
          <div className="section-title">
            <h3  data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">Frequently ask Questions</h3>
          </div>
          <div>
            <FAQAccordion />
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
