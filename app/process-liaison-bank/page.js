"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';


export default function ProcessLiaisonbankPage() {
  useBodyClass('process');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Process</h1>

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
                          Process
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
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <h3>Comprehensive Licensing Solutions</h3>
            <h5>From evaluation to handover, we’re here every step of the way.</h5>
            <h6>Trust us to navigate the intricacies of your project, ensuring a seamless and successful journey from start to finish</h6>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <h3>What we Do</h3>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="section-title" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <h3>Our Brands</h3>
          </div>
        </div>
      </section>
    </>
  );
}
