"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function PNGPage() {
  useBodyClass('water-tank-cleaning');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Water Tank Cleaning</h1>

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
                          Water Tank Cleaning and Certification
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
            <b>Clean water storage systems</b> are essential for maintaining hygiene, health, and uninterrupted daily operations. 
            <b>Water Tank Cleaning Certification</b> confirms that overhead tanks, underground tanks, and water storage systems have been 
            professionally cleaned, disinfected, and maintained according to required hygiene and safety standards.
            </p>
            <p  data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
            Over time, water tanks can accumulate sludge, bacteria, algae, rust, and harmful contaminants that affect water quality 
            and create health risks. Regular cleaning and certification help residential societies, offices, hotels, hospitals, 
            factories, schools, restaurants, and commercial buildings maintain safe water usage and regulatory compliance. 
            At Liaison Bank, we provide dependable <b>water tank cleaning certification services, tank hygiene inspections</b>, water 
            storage compliance support, cleaning documentation, and <b>renewal assistance</b> to ensure safe, clean, and certified water systems.
            </p>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="500">
            <h3>Overview </h3>
          </div>
          <div className="container table-responsive py-2" data-aos="fade-up" data-aos-duration="600" data-aos-delay="600">
            <table className="mx-auto table table-bordered table-hover mx-auto w-100 w-md-75" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">What the Certification Includes</th>
                  <th scope="col">Why Water Tank Cleaning Certification Matters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inspection of overhead tanks, underground tanks, pipelines, and storage units</td>
                  <td>Ensures clean and hygienic water for regular use</td>
                </tr>
                <tr>
                  <td>Removal of sludge, dirt, algae, rust, and microbial buildup</td>
                  <td>Reduces health risks caused by contaminated water</td>
                </tr>
                <tr>
                  <td>Disinfection using approved cleaning and sanitation methods</td>
                  <td>Supports safety standards and <b>water hygiene compliance</b></td>
                </tr>
                  <tr>
                  <td>Maintenance of cleaning reports, service records, and inspection logs</td>
                  <td>Helps during audits, inspections, and compliance checks</td>
                </tr>
                  <tr>
                  <td>Issuance of certification and timely renewal management</td>
                  <td>Builds trust, safety confidence, and operational readiness</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
            <h3>Conclusion </h3>
          </div>
          <div>
            <p  data-aos="fade-up" data-aos-duration="600" data-aos-delay="800">
            Reliable hygiene begins with clean and properly maintained water storage systems. With <b>Liaison Bank’s Water Tank Cleaning 
            Certification</b>, businesses and residential properties can improve water quality, meet compliance standards, and maintain
            healthier environments with confidence. Our expert support helps clients protect occupants, 
            uphold hygiene standards, and ensure long-term safety through <b>professional water tank cleaning and certification services.</b>
            </p>
            <p  data-aos="fade-up" data-aos-duration="600" data-aos-delay="900">

            </p>
          </div>
        </div>
      </section>
    </>
  );
}

