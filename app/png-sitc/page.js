
"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';

export default function CeosDeskPage() {
  useBodyClass('png-sitc');
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
                    <h1>PNG (SITC)</h1>

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
                          Piped Natural Gas (SITC)
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
            <p>
             Energy systems demand precision, safety, and strict compliance, especially when it comes to gas distribution. 
             <b>PNG SITC</b> (Supply, Installation, Testing, and Commissioning) services ensure that <b>Piped Natural Gas (PNG)</b> 
             networks are correctly installed, pressure-tested, and made operational in line with <b>gas safety standards and regulatory guidelines</b>. 
             These services are critical for residential societies, commercial establishments, hotels, hospitals, and industrial units that rely on safe and continuous gas supply.
            </p>
            <p>
              Our PNG SITC services focus on establishing dependable gas infrastructure with careful planning and controlled execution. 
              At Liaison Bank, we manage PNG pipeline installation, meter setup, regulator systems, pressure testing, leak detection, 
              and commissioning, along with support for gas approvals and compliance documentation. 
              Every system is evaluated for safety, performance, and adherence to government gas regulations, ensuring efficient 
              distribution while minimizing risks such as leaks, pressure failures, or compliance gaps.
            </p>
          </div>
          <div className="section-title">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Scope of PNG SITC Services</th>
                  <th scope="col">Why PNG SITC is Important</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Installation of PNG pipelines,</b> meters, valves, and regulator systems</td>
                  <td>Ensures safe and structured gas distribution infrastructure</td>
                </tr>
                <tr>
                  <td>Pressure testing, leak detection, and system validation</td>
                  <td>Prevents gas leakage, hazards, and operational risks</td>
                </tr>
                <tr>
                  <td>System commissioning and readiness checks</td>
                  <td>Confirms reliable and uninterrupted gas supply</td>
                </tr>
                <tr>
                  <td>Support for gas approvals, documentation, and compliance</td>
                  <td>Helps meet regulatory requirements and obtain necessary certifications</td>
                </tr>
                <tr>
                  <td>Integration of safety standards and monitoring systems</td>
                  <td>Reduces fire risks and enhances overall protection</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title">
            <h3>Conclusion </h3>
          </div>
          <div >
            <p>
              A well-implemented <b> PNG SITC</b> system is essential for maintaining safe, efficient, and regulation-compliant gas distribution. 
              With Liaison Bank’s PNG SITC services, clients can ensure accurate installation, thorough system testing, and smooth 
              approval processes without delays. Our structured approach to PNG installation, testing, commissioning,
              and compliance management supports reliable gas supply, minimizes risks, and ensures long-term operational stability.
            </p>
          </div>
        </div>
    </section>
    </>
  );
}
