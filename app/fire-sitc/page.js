
"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';

export default function CeosDeskPage() {
  useBodyClass('fire-sitc');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Fire (SITC)</h1>

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
                          Fire (SITC)
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
              Fire SITC (Supply, Installation, Testing, and Commissioning) services are essential for creating a safe and 
              compliant environment where fire risks are effectively managed. These services ensure that <b>fire protection 
              systems</b> are properly installed, fully functional, and aligned with required safety regulations.
            </p>
            <p className="pt-4"  data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
              Fire safety is not just a precaution, it is a critical requirement for any building or facility. 
              Our <b>Fire SITC services</b> focus on setting up robust fire protection systems, <b>fire alarm systems, fire fighting equipment, 
              and fire safety infrastructure</b> that comply with <b>government fire safety regulations and Fire NOC</b> requirements. 
              At <b>Liaison Bank</b>, we ensure that every system is carefully installed, thoroughly tested, and ready for emergency 
              situations. From fire detection to suppression systems, our approach ensures complete <b>fire safety compliance</b>, 
              certification support, and long-term reliability.
            </p>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="500">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2" data-aos="fade-up" data-aos-duration="600" data-aos-delay="600">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Fire SITC Components & Coverage</th>
                  <th scope="col">Importance of Fire SITC Implementation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Installation of <b>fire alarm systems</b>, sprinklers, hydrants, and extinguishers</td>
                  <td>Ensures early detection and quick response during fire incidents</td>
                </tr>
                <tr>
                  <td>Layout planning and positioning of fire safety equipment</td>
                  <td>Improves effectiveness of <b>fire control systems</b></td>
                </tr>
                <tr>
                  <td>Testing and commissioning of <b>fire protection systems</b></td>
                  <td>Confirms readiness and operational reliability</td>
                </tr>
                <tr>
                  <td>Support for <b>Fire NOC approvals</b> and compliance documentation</td>
                  <td>Helps meet legal and safety requirements</td>
                </tr>
                <tr>
                  <td>Integration of <b>safety checks</b> and preventive measures</td>
                  <td>Reduces fire risks and enhances overall protection</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
            <h3>Conclusion </h3>
          </div>
          <div >
            <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
              A well-implemented <b>Fire SITC system</b> is fundamental to safeguarding lives, property, and business continuity. 
              With <b>Liaison Bank’s Fire SITC services</b>, clients can ensure accurate installation, proper system validation, and 
              seamless compliance with fire safety norms. Our structured execution of <b>fire system installation, testing, 
              commissioning, and approval support</b> helps create secure environments while meeting all regulatory expectations 
              efficiently.
            </p>
          </div>
        </div>
    </section>
    </>
  );
}
