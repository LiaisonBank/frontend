"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function PNGPage() {
  useBodyClass('png-audit');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">PNG Audit</h1>

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
                          PNG Audit and Certification
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
<strong>PNG Audit and Certification</strong> is a vital service for businesses, commercial properties, residential complexes,
and industrial units using <strong>Piped Natural Gas (PNG)</strong> systems. At <strong>Liaison Bank</strong>, we provide <strong>PNG audit services, 
PNG inspection services, gas safety audit, and PNG certification solutions</strong> to help clients meet <strong>government gas compliance 
standards</strong> and maintain safe operations. Our professional <strong>PNG audits and certifications</strong> help identify gas leaks, pressure issues, 
installation risks, and compliance gaps while ensuring efficient gas system performance, legal compliance, and uninterrupted operations.
            </p>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2" data-aos="fade-up" data-aos-duration="600" data-aos-delay="500">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">PNG Audit & Certification Process</th>
                  <th scope="col">Ensures compliance with gas safety regulations and government standards</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Detect gas leaks, pressure imbalance, and technical faults</td>
                  <td>Prevents accidents, hazards, and costly repairs</td>
                </tr>
                <tr>
                  <td>Verify PNG installation quality, documentation, and safety measures</td>
                  <td>Improves energy efficiency and safe gas consumption</td>
                </tr>
                <tr>
                  <td>Prepare audit reports and obtain PNG certification approvals</td>
                  <td>Builds trust, legal compliance, and uninterrupted operations</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div  data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
            <p>
              A timely <strong>PNG audit and certification</strong> process is essential for every property and business using <strong>Piped Natural Gas</strong> systems. 
              With expert support from <strong>Liaison Bank</strong>, clients can simplify <strong>PNG inspections, gas safety audits, 
              compliance certification, and PNG renewal</strong> requirements while ensuring safe, efficient, and regulation-compliant operations. 
              Our reliable <strong>PNG audit and certification services</strong> help businesses reduce risks, maintain compliance, 
              and achieve long-term operational peace of mind.
              </p>
          </div>
        </div>
      </section>
    </>
  );
}

