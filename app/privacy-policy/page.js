"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';


export default function PrivacyPolicyLiaisonPage() {
  useBodyClass('privacy');
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">Privacy Policy</h1>

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
      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <ol className="policy">
            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Introduction:</strong> Welcome to Liaison Bank. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Data We Collect:</strong> We may collect and process personal data about you such as your name, contact details, and information relating to your use of our website.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>How We Use Your Data:</strong> We use your personal data to provide and improve our services, respond to your inquiries, and manage our relationship with you.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Data Sharing and Disclosure:</strong> We do not sell your personal data to third parties. We may share your personal data with service providers who perform services on our behalf.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Data Security:</strong> We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Your Rights:</strong> You have the right to access, correct, or delete your personal data. You can also object to the processing of your personal data.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Changes to This Privacy Policy:</strong> We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</li>

            <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"><strong>Contact Us:</strong> If you have any questions about this privacy policy, please contact us at <a href="mailto:contact@liaisonbank.com">contact@liaisonbank.com</a>.</li>
          </ol>
        </div>
      </section>
    </>
  );
}

// export default AboutUsLiaisonPage;