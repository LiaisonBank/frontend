"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function LRPage() {
  useBodyClass('license-renewal');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">License Renewal</h1>

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
                          License Renewal
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
          {/* <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
              <h3>We have evolved <AnimatedCounter endValue={16} /> Years </h3>
            </div> */}
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <h5>Annual Maintenance Contract (AMC) services streamline business compliance by managing license renewals, government
              licensing, certifications, and regulatory requirements under one platform. With Liaison Bank U+2019 s AMC solutions,
              businesses benefit from proactive compliance management, timely approvals, and uninterrupted operations.</h5>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
            <h3>License Renewal </h3>
          </div>
          <div>
            <p  data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">License renewal is a critical process that ensures businesses remain compliant with &nbsp;
              <strong>government licensing and regulatory requirements</strong> while continuing operations without interruption.
              At <strong>Liaison Bank</strong>, we provide smooth <strong>license renewal services,</strong> helping businesses renew licenses online,
              track expiry dates, and manage complete <strong>license compliance and documentation.</strong> Timely renewal of business
              licenses not only avoids penalties and legal risks but also ensures smooth operations, improved <strong>license management</strong>,
              and long-term business credibility.</p>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2" data-aos="fade-up" data-aos-duration="600" data-aos-delay="500">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">License Renewal Process</th>
                  <th scope="col">Importance of License Renewal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identify expiring licenses and track renewal deadlines efficiently</td>
                  <td>Ensures full compliance with government rules and regulatory authorities</td>
                </tr>
                <tr>
                  <td>Collect and verify required documents for license renewal application</td>
                  <td>Prevents penalties, late fees, and legal complications</td>
                </tr>
                <tr>
                  <td>Submit online/offline renewal applications with accurate details</td>
                  <td>Maintains business continuity without operational disruptions</td>
                </tr>
                <tr>
                  <td>Follow up with authorities for approvals and certification</td>
                  <td>Builds trust, credibility, and seamless business operations</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="600">
            <h3>Conclusion </h3>
          </div>
          <div  data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
            <p>A streamlined and proactive <strong>license renewal</strong> process is essential for every business to maintain compliance and avoid unnecessary risks.
              With expert support from <strong>Liaison Bank</strong>, businesses can simplify <strong>license renewal online</strong> , ensure timely approvals, and benefit
              from efficient <strong>compliance services</strong> while focusing on growth and staying aligned with evolving <strong>government licensing</strong> regulations.</p>
          </div>
        </div>
      </section>
    </>
  );
}

