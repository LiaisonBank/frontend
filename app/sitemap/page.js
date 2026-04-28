"use client";
// import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
import PageTitleWave from '@/components/PageTitleWave';
import {navLinks} from "@/lib/data/menus";
import SitemapDiagram from "@/components/SiteMap/page";
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';


// const AboutUsLiaisonPage = () => {
  export default function SitemapLiaisonPage() {
  useBodyClass('sitemaps');
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
                    <h1>Sitemap</h1>

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
                          Sitemap
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
          <SitemapDiagram navLinks={navLinks} />
        </div>
      </section>
    </>
  );
}

// export default AboutUsLiaisonPage;