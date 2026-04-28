"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
import PageTitleWave from '@/components/PageTitleWave';
import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';
// import JobsPage from "@/components/JobPage";


export default function CareersLiaisonPage() {
  useBodyClass('careers');
  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <PageTitleWave />
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Careers</h1>

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
                          Careers
                        </li>
                      </ol>
                    </nav>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <PageTitleWaveLeft />
        </div>
      </div>
      <section className="container py-5">
        <div className="row justify-content-center text-center">
            <div className="col-12 col-md-6">
              <h5>Join Liaison Bank</h5>
              <p className="py-2 text-gray"><strong>Thrive in an innovative, collaborative career environment.</strong></p>
              <p>At Liaison Bank we believe in fostering a dynamic, collaborative, and innovative work environment and 
              we’re on the lookout for talented individuals who share our passion for business.</p>

              <address className="themeht-btn primary-btn">
                <p>Contact HR</p>
                <p>Email: <Link href="mailto:hr@liaisonbank.com">hr@liaisonbank.com</Link></p>
                <p>Phone: <Link href="tel:+91 82684 32177">+91 82684 32177</Link> / <Link href="tel:+91 93217 09265">+91 93217 09265</Link></p>
              </address>
            </div>
            <div className="col-12 col-md-6">
              <h5>Positions Available</h5>
              <div className="py-2">
                <p>Explore exciting career opportunities with us and become part of a dynamic and growing organization.
                We are looking for talented and motivated individuals who are eager to contribute their skills and grow professionally.</p>
                <p className="py-2">Our team is currently expanding, and we are actively seeking candidates for multiple positions across various departments.
                Please note that all roles are open for recruitment.</p>
                {/* We are currently expanding our team and are looking to fill all positions (barring Accounts & Admin roles). 
                If you’re ready to embark on a rewarding career journey, join us and be part of something extraordinary. 
                 */}
                </div>  
              <div className="mt-2 col-4 text-start">
                <Link className="themeht-btn primary-btn px-4 py-2 " href="https://liaisonbank.frappe.cloud/jobs" target="_blank">
                Careers List</Link>
              </div>
                     
            </div>


          {/* <Link href="https://liaisonbank.frappe.cloud/jobs" target="_blank">
            Careers
            </Link> */}
          {/* <div style={{ width: "100%", height: "100vh" }}>
            <iframe
              src="https://liaisonbank.frappe.cloud/jobs"
              style={{
                border: "none",
                width: "100%",
                height: "100%",
              }}
              loading="lazy"
            />
          </div> */}
        </div>
      </section>
    </>
  );
}

// export default AboutUsLiaisonPage;