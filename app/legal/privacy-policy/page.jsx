"use client";
// import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';

export default function Page() {
  useBodyClass('privacy');
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
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
                    <h1>Privacy Policy</h1>

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
                          Privacy Policy
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


      <section className="privacy-content-section">
        <div className="container">
          <div className="policy-content">

            <div className="policy-section">
              <h2>Introduction</h2>
              <p>
                Welcome to Liaison Bank. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website.
              </p>
            </div>

            <div className="policy-section">
              <h2>Data We Collect</h2>
              <p>
                We may collect and process personal data about you such as your name, contact details, and information relating to your use of our website.
              </p>
            </div>
            <div className="policy-section">
  <h2>Candidate and Recruitment Information</h2>
  <p>
    When individuals apply for job openings through our website, Liaison Bank
    may collect personal and professional information necessary for
    recruitment and candidate evaluation.
  </p>
  <p>This information may include:</p>
  <ul>
    <li>
      <strong>Personal Details:</strong> Full name, date of birth and gender,
      where provided.
    </li>
    <li>
      <strong>Contact Information:</strong> Phone number, email address,
      residential address, city, state, country and postal code.
    </li>
    <li>
      <strong>Professional Information:</strong> Current company, current
      designation, total work experience, career summary and skills.
    </li>
    <li>
      <strong>Educational Information:</strong> Highest qualification,
      specialization, university or institution name and graduation year.
    </li>
    <li>
      <strong>Employment Information:</strong> Current compensation, expected
      compensation and notice period.
    </li>
    <li>
      <strong>Professional Profiles:</strong> LinkedIn, GitHub and portfolio
      links, where provided.
    </li>
    <li>
      <strong>Application Documents:</strong> Resumes, profile photographs and
      other supporting documents submitted during the application process.
    </li>
  </ul>
  <p>
    The information collected may vary depending on the requirements of the
    particular job opening and the details voluntarily provided by the
    candidate.
  </p>
</div>

            <div className="policy-section">
              <h2>How We Use Your Data</h2>
              <p>
                We use your personal data to provide and improve our services, respond to your inquiries, and manage our relationship with you.
              </p>
            </div>

            <div className="policy-section">
              <h2>Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal data to third parties. We may share your personal data with service providers who perform services on our behalf.
              </p>
            </div>

            <div className="policy-section">
              <h2>Data Security</h2>
              <p>
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
              </p>
            </div>

            <div className="policy-section">
              <h2>Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. You can also object to the processing of your personal data.
              </p>
            </div>

            <div className="policy-section">
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
              </p>
            </div>

            <div className="policy-section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at{" "}
                <a href="mailto:contact@liaisonbank.com">
                  contact@liaisonbank.com
                </a>.
              </p>
            </div>

          </div>
        </div>
      </section>


    </>
  );
}
