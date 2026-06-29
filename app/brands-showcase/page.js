"use client";

import Link from 'next/link'
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed

export default function BrandsShowcasePage() {
  useBodyClass('browse-ourbrand');
  return <>
    <div className="page-header">
      <div className="inner-header">
        {/* <PageTitleWave /> */}
        <div className="page-title">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10">
                <div className="theme-breadcrumb-box">
                  <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Brands Showcase</h1>

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
                        Brands Showcase
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
    <section
      className="bowseourbrand-section py-5"
      aria-labelledby="certificates-heading"
    >
      <div className="container">
        <div className="row">
          <div className="col-12 text-center py-3">
            <h1 className="display-6 display-md-4">We are Updating...</h1>
          </div>
        </div>
      </div>
    </section>
  </>
}