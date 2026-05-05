"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function electricPage() {
  useBodyClass('electric-audit');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Electric Audit</h1>

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
                          Electric Audit and Certification
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
              Safe and efficient electrical infrastructure is essential for the uninterrupted performance of any property or business. 
              <b>Electrical Audit and Certification</b>evaluates wiring systems, panels, load capacity, grounding, and overall electrical 
              safety to ensure systems operate reliably and meet <b>government electrical compliance standards</b>. At Liaison Bank, we provide 
              professional <b>electrical audit services,</b> safety inspections, certification support, and compliance approvals for offices, 
              factories, commercial spaces, retail outlets, and residential properties.    
            </p>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2" data-aos="fade-up" data-aos-duration="500" data-aos-delay="500">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Electrical Audit & Certification Process</th>
                  <th scope="col">Why Electrical Audit & Certification is Important</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inspect wiring systems, panels, meters, circuits, and electrical equipment</td>
                  <td>Ensures compliance with electrical safety laws and statutory standards</td>
                </tr>
                <tr>
                  <td>Detect overloads, short circuits, faulty wiring, and voltage loss issues</td>
                  <td>Prevents fire hazards, accidents, and costly downtime</td>
                </tr>
                <tr>
                  <td>Verify load distribution, grounding systems, and maintenance records</td>
                  <td>Improves energy efficiency and system reliability</td>
                </tr>
                <tr>
                  <td>Prepare audit reports and obtain <b>electrical safety certification approvals</b></td>
                  <td>Builds trust, legal compliance, and uninterrupted operations</td>
                </tr>
              </tbody>
            </table>
          </div>
           <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="600">
            <h3>Conclusion </h3>
          </div>
          <div  data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
            <p>
              A timely <b>Electrical Audit and Certification</b> process is essential for maintaining safe, efficient, and <b>regulation-compliant 
              electrical systems</b> in every business or property. With professional support from Liaison Bank, clients can simplify &nbsp; 
               <b>electrical inspections</b>, safety audits, certification approvals, and compliance requirements while reducing operational risks. 
              Our dependable <b>electrical audit services</b> help businesses ensure safety, efficiency, and long-term continuity.
              </p>
          </div>
        </div>
      </section>
    </>
  );
}

