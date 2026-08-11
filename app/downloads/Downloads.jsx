"use client";

import Link from "next/link";
import useBodyClass from '@/components/useBodyClass';

export default function Downloads() {
  useBodyClass('downloads');

  const downloads = [
    { name: "Liaisoning", file: "liaisoning" },
    { name: "Licensing", file: "licensing" },
    { name: "Fire", file: "fss" },
    { name: "Electrical", file: "electrical" },
    { name: "AMC", file: "amc" },
  ];

  return (
    <>
      <div className="page-header d-none">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Downloads</h1>
                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" aria-hidden="true"></i>
                            Home
                          </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          Downloads
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="companyprofile mt-5 pt-5 px-4">
        <div className="container-fluid py-4 px-5">
          <h1 className="section-title mb-4">Downloads</h1>

          <div className="download-list">
            {downloads.map((item, index) => (
              <div key={index} className="download-item d-flex align-items-center justify-content-between border-bottom">
                <span className="download-name fw-medium">{item.name}</span>
                <a
                  href={`/pdf/${item.file}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link text-primary fw-semibold text-decoration-none"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}