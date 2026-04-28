"use client";
import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
import license from "@/assets/images/liaisoning-in-real-estate.jpg"
import licenseService from "@/assets/images/licensing-services.png"
import commitment from "@/assets/images/commitment.jpg"

import TeamSwiper from "@/components/TeamSwiper";
// import { teamData } from "@/lib/data/teamData";
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';

export default function AboutUsLiaisonPage() {
  useBodyClass('about-us');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">About Us</h1>

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
                          About Us
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
      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <h3>We help you navigate the complexities of licence acquisitions and <br/>
            take away the burden of uncertainty and time constraints. </h3>
          </div>
         <div className="content-text p-4">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-6 col-sm-12">
              <h4 data-aos="fade-right" data-aos-duration="600" data-aos-delay="300">
                From Consultation to Corporate Leadership: Two Decades of Regulatory Excellence
              </h4>
              <p data-aos="fade-right" data-aos-duration="600" data-aos-delay="400">
                At Liaison Bank, we believe that regulatory hurdles should never stand in the way of innovation. 
                Our primary mission is to simplify the complex world of government permits and licensing, enabling you to direct 
                your attention solely to your core business endeavors. Whether you are a budding startup or an established 
                corporation, we take the administrative weight off your shoulders, ensuring that your compliance requirements 
                are met with precision and speed. By streamlining the licensing process, we allow your team to focus on growth 
                and strategy rather than paperwork.
              </p>
              <p data-aos="fade-right" data-aos-duration="600" data-aos-delay="400">
                Our foundation is built on nearly two decades of industry expertise. What began in 2007 as 
                Mr. Mahadev Biradar Consulting has evolved through years of dedicated service into the versatile and experienced
                entity known today as Liaison Bank. By 2026, we have cemented our reputation as a leading organization in the 
                licensing and liaison services sector. We take immense pride in our extensive workforce, a team of high-quality 
                professionals who bring deep technical knowledge and a results-driven approach to every project. 
                When you partner with us, you aren&apos;t just hiring a consultant, you are gaining a dedicated extension of your 
                own professional team.
              </p>


              {/* <h4 data-aos="fade-right" data-aos-duration="600" data-aos-delay="300">
                This enables you to direct your attention solely to your business endeavours.</h4>  
              <p  data-aos="fade-right" data-aos-duration="600" data-aos-delay="500">
                Liaison Bank was founded in 2007 as Mr. Mahadev Biradar Consulting. Cut to 2024, we have evolved into a versatile 
                and experienced entity as Liaison Bank. In the realm of licensing and liaison services, 
                we stand out as a leading organization, boasting an extensive workforce of highly quality.</p> */}
            </div>
            <div className="col-lg-6 col-sm-12 license-doc">
              <Image
                src={license}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
                data-aos="fade-left" data-aos-duration="600" data-aos-delay="600"
              />
            </div>
          </div>

          <div className="row justify-content-center align-items-center second">
            <div className="col-lg-6 col-sm-12 licensing-doc mx-auto">
              <Image
                src={licenseService}
                alt=""
                width={0}
                height={0}
                sizes="75vw"
                style={{ width: "75%", height: "auto" }}
                priority
                data-aos="fade-right" data-aos-duration="600" data-aos-delay="600"
              />
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="our-story-text" data-aos="fade-left" data-aos-duration="600" data-aos-delay="300">
                
                <h3>Our Story</h3>  
                <p >
                Founded in 2017 as DBRE India and officially established as Liaison Bank in 2019, our journey began with a clear vision - to simplify business licensing services, regulatory approvals, and compliance management in India. Headquartered in Mumbai, Liaison Bank office is strategically located at Plot 466, New Apollo CHSL, 14th Road, Khar West, beside Blue Tokai Cafe, enabling us to stay closely connected with key regulatory authorities and business hubs.
                </p>
                <p >
                Over the years, Liaison Bank has evolved into a trusted partner for companies seeking seamless support with licenses, permits, and government liaison services across India. Our team comprises experienced architects, interior designers, project managers, and safety supervisors who work collaboratively to manage complex business licensing, documentation, and compliance requirements.
                </p>
                <p>
                  With round-the-clock operations and strong coordination with local authorities, we ensure faster approvals, reduced delays, and smooth execution of projects, helping businesses stay compliant and operational without hassle.
                </p>
              </div>
              
            </div>           
          </div>
          <div className="row justify-content-center align-items-center py-4 third">
            <div className="col-lg-6 col-sm-12"  data-aos="fade-right" data-aos-duration="600" data-aos-delay="300">
              <div className="our-commitment-text" >
                <h3>Our Commitment</h3>  
                <p >
                With over 16+ years of proven industry experience in licensing, liaisoning, and regulatory compliance services, Liaison Bank has successfully managed and executed a diverse portfolio of projects across multiple sectors. Our expertise spreads starting from educational institutions, healthcare facilities, food and beverage establishments, commercial spaces to residential developments, ensuring seamless approvals, documentation, and end-to-end licensing support. 
                </p>
                <p >
                Our projects are primarily concentrated in Mumbai where we have built a strong reputation for delivering efficient licensing solutions, government approvals, and compliance management services. Liaison Bank is proud to be associated with prestigious organizations and well-known establishments, including Jaslok Hospital, Saifee Hospital, Podar Education Network, Domino’s Pizza, Pizza Hut, Social, Smoke House Deli, Wine Villa Café, Persian Darbar, 5 Spice, and leading real estate developers such as Piramal Realty, Godrej Properties (Godrej Trees & Godrej Two), Supreme Art Veda, Anand Apartment, Pooja Casa, and Orchid Enclave.
                </p>
                <p>
                  Our commitment lies in providing reliable, timely, and hassle-free licensing and liaison services, helping businesses navigate complex regulatory frameworks while ensuring full compliance with local authorities. By combining industry expertise, strong government relations, and a client-centric approach, we continue to deliver results that support business growth and operational excellence.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12 commitment-doc">
               <Image
                src={commitment}
                alt=""
                width={0}
                height={0}
                sizes="75vw"
                style={{ width: "75%", height: "500px" }}
                priority
                data-aos="fade-left" data-aos-duration="600" data-aos-delay="600"
              />
            </div>
          </div>

        </div>
        <div className="team-content pt-4">
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <h3>Our Team </h3>
          </div>
            <TeamSwiper />
          <div>
            
          </div>
        </div>      
        </div>
      </section>
    </>
  );
}
