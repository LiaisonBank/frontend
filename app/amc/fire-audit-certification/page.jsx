"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function FIREPage() {
  useBodyClass('fire-audit');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Fire Audit</h1>

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
                          Fire Audit and Certification
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
          <div>
            <p  data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                Creating a safe and regulation-compliant environment starts with a professional Fire Audit and Certification process. 
                Businesses, commercial spaces, residential buildings, factories, and institutions must regularly assess their fire safety systems 
                to meet government fire safety regulations and reduce operational risks. At Liaison Bank, we offer trusted fire audit services, 
                fire safety inspections, fire NOC assistance, and fire certification solutions that help identify hazards, 
                verify safety equipment, improve emergency preparedness, and ensure complete fire compliance for smooth and secure operations.
            </p>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2" data-aos="fade-up" data-aos-duration="500" data-aos-delay="500">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Fire Audit & Certification Process</th>
                  <th scope="col">Why Fire Audit & Certification is Important</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inspect fire extinguishers, alarms, hydrants, sprinklers, and emergency exits</td>
                  <td>Ensures compliance with fire safety laws and government regulations</td>
                </tr>
                <tr>
                  <td>Identify fire hazards, blocked exits, wiring risks, and safety gaps</td>
                  <td>Prevents accidents, property damage, and legal penalties</td>
                </tr>
                <tr>
                  <td>Verify installation standards, maintenance records, and evacuation readiness</td>
                  <td>Improves workplace safety and emergency preparedness</td>
                </tr>
                <tr>
                  <td>Prepare audit reports and obtain fire certification / Fire NOC approvals</td>
                  <td>Builds trust, compliance, and uninterrupted business operations</td>
                </tr>
              </tbody>
            </table>
          </div>
           <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="600">
            <h3>Conclusion </h3>
          </div>
          <div  data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
            <p>
              A timely fire audit and certification process is critical for every property and business to maintain fire safety 
              compliance and reduce operational risks. With expert support from Liaison Bank, clients can simplify fire inspections, 
              fire safety audits, certification approvals, and Fire NOC requirements while ensuring safe and regulation-compliant
               operations. Our reliable fire audit and certification services help businesses protect lives, assets, and long-term 
               continuity.
              </p>
          </div>
        </div>
      </section>
    </>
  );
}

