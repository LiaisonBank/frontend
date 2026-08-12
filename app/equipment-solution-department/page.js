
"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';

export default function CeosDeskPage() {
  useBodyClass('esd');
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
                    <h1    >Equipment Solutions Department</h1>

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
                          Equipment Solutions Department
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
              Modern projects require more than just installation, they need the right equipment, selected, configured, and 
              integrated to perform reliably over time. The Equipment Solutions Department (ESD) focuses on sourcing, supplying,
              and aligning technical equipment with project requirements while ensuring compliance, compatibility, and operational efficiency. 
              From utility systems to safety equipment, ESD plays a key role in supporting infrastructure readiness across commercial, 
              industrial, and residential developments.
            </p>
            <p className="pt-4">
              At Liaison Bank, our ESD services are designed to simplify the process of equipment procurement, system 
              integration, and compliance alignment. We assist clients with selecting suitable equipment, coordinating with 
              vendors, and ensuring that all components meet regulatory standards, certification requirements, and project 
              specifications. Our approach combines technical understanding with practical execution, helping businesses avoid 
              delays, reduce risks, and ensure that every system is supported by the right equipment from the start.
            </p>
          </div>
          <div className="section-title">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">What ESD Covers</th>
                  <th scope="col">Why ESD is Important</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identification and sourcing of project-specific equipment and systems</td>
                  <td>Ensures correct equipment selection for operational needs</td>
                </tr>
                <tr>
                  <td>Vendor coordination and procurement support</td>
                  <td>Reduces delays and improves project execution timelines</td>
                </tr>
                <tr>
                  <td>Integration of equipment with existing infrastructure</td>
                  <td>Enhances system compatibility and performance</td>
                </tr>
                <tr>
                  <td>Compliance checks and certification support for equipment</td>
                  <td>Meets regulatory standards and approval requirements</td>
                </tr>
                <tr>
                  <td>Documentation, tracking, and lifecycle management</td>
                  <td>Ensures accountability and long-term usability</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title">
            <h3>Conclusion </h3>
          </div>
          <div >
            <p>
             A structured approach to <b>equipment planning and execution</b> is essential for any successful project. 
             With <b>Liaison Bank’s Equipment Solutions Department (ESD)</b>, clients gain access to reliable <b>equipment sourcing, 
             integration support, and compliance-ready solutions</b> that align with project goals and regulatory expectations. 
             Our focus on accuracy, coordination, and quality ensures that every system is equipped for performance, scalability, and long-term efficiency.
            </p>
          </div>
        </div>
    </section>
    </>
  );
}
