"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';


export default function Page() {
  useBodyClass('termscondition');
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
                    <h1>Terms and Condition</h1>

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
                          Terms and Condition
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
      
<section className="terms-content-section">
  <div className="container">
    <div className="tc-content">

      <div className="tc-section">
        <h2>Introduction</h2>
        <p>
          Welcome to Liaison Bank. These terms and conditions outline the rules and regulations for the use of our website.
        </p>
      </div>

      <div className="tc-section">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing this website, you accept these terms and conditions in full. If you disagree with these terms or any part of them, you must not use this website.
        </p>
      </div>

      <div className="tc-section">
        <h2>Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, Liaison Bank and/or its licensors own the intellectual property rights for all material on the website. All intellectual property rights are reserved.
        </p>
      </div>

      <div className="tc-section">
        <h2>Restrictions</h2>
        <p>
          You are specifically restricted from all the following: publishing any website material in any other media, selling, sublicensing and/or otherwise commercializing any website material, publicly performing and/or showing any website material, using this website in any way that is or may be damaging to this website, or using this website in any way that impacts user access to this website.
        </p>
      </div>

      <div className="tc-section">
        <h2>Your Content</h2>
        <p>
          In these terms and conditions, “Your Content” shall mean any audio, video, text, images, or other material you choose to display on this website. Your Content must be your own and must not be invading any third-party’s rights.
        </p>
      </div>

      <div className="tc-section">
        <h2>No Warranties</h2>
        <p>
          This website is provided “as is,” with all faults, and Liaison Bank expresses no representations or warranties of any kind related to this website or the materials contained on this website.
        </p>
      </div>

      <div className="tc-section">
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall Liaison Bank, nor any of its officers, directors, or employees, be held liable for anything arising out of or in any way connected with your use of this website.
        </p>
      </div>

      <div className="tc-section">
        <h2>Changes to These Terms</h2>
        <p>
          We may update our terms and conditions from time to time. We will notify you of any changes by posting the new terms and conditions on this page.
        </p>
      </div>

      <div className="tc-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these terms and conditions, please contact us at{" "}
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
