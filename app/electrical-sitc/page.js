
"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';

export default function CeosDeskPage() {
  useBodyClass('electrical-sitc');
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
                    <h1>Electrical (SITC)</h1>

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
                          Electrical (SITC)
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
            Electrical SITC (Supply, Installation, Testing, and Commissioning) services ensure that electrical systems are properly installed, tested, and made fully operational as per safety and regulatory standards. These services play a crucial role in building reliable and compliant electrical infrastructure across commercial, industrial, and residential projects.
            </p>
            <p className="pt-4">
            A well-executed electrical setup is not just about installation, it involves careful planning, precise execution, and strict adherence to &nbsp; 
            <b>electrical safety regulations and compliance standards</b>. At <b>Liaison Bank</b>, our Electrical SITC services focus on establishing 
            dependable electrical systems that support efficient operations while meeting <b>government approvals, electrical compliance 
            requirements, and statutory norms</b>. From initial setup to final system readiness, we ensure that every component is aligned 
            with performance expectations, safety guidelines, and long-term usability.
            </p>
          </div>
          <div className="section-title">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Scope of Electrical SITC Services</th>
                  <th scope="col">Why Electrical SITC is Essential</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Installation of wiring systems, panels, switchgear, and electrical infrastructure</td>
                  <td>Ensures safe and structured electrical system setup</td>
                </tr>
                <tr>
                  <td>Load assessment, distribution planning, and grounding solutions</td>
                  <td>Reduces risks of overload, short circuits, and system failures</td>
                </tr>
                <tr>
                  <td>Testing, inspection, and commissioning of electrical systems</td>
                  <td>Confirms system readiness and operational efficiency</td>
                </tr>
                <tr>
                  <td>Compliance documentation and <b>electrical approvals support</b></td>
                  <td>Helps meet regulatory requirements and obtain certifications</td>
                </tr>
                 <tr>
                  <td>Integration of safety measures and system checks</td>
                  <td>Enhances reliability and prevents electrical hazards</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title">
            <h3>Conclusion </h3>
          </div>
          <div >
            <p>
              Electrical SITC services form the foundation of a safe, efficient, and regulation-compliant infrastructure. 
              With expert support from <b>Liaison Bank</b>, businesses and developers can ensure accurate installation, proper system testing, 
              and seamless electrical approvals without delays. Our structured approach to <b>electrical installation, testing, 
              commissioning, and compliance management</b> helps deliver reliable performance, minimize risks, and support long-term operational stability.
            </p>
          </div>
        </div>
    </section>
    </>
  );
}
