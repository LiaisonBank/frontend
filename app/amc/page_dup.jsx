"use client";
import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';
import AnimatedCounter from '@/components/AnimateCounter';
import Deva from "@/assets/images/amc/deva.png";
import dbre from "@/assets/images/amc/dbre.png";
import dbre_india from "@/assets/images/amc/dbre_india.png";
import liaison_bank from "@/assets/images/amc/liaison_bank.png";


export default function AMCPage() {
  useBodyClass('amcDup');
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
                    <h1>AMC</h1>

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
                          AMC
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
          <div className="section-title">
            <h3>We have evolved <AnimatedCounter endValue={16} /> Years </h3>
          </div>
          <div className="growthscale">
            <div className="cols-12 flow">

              <div className="col-2 flow-item">
                <table>
                  <tbody>
                    <tr>
                      <td className="image-cell">
                        <Image src={Deva} alt="Mahadev Biradar" className="item-icon" />
                      </td>
                      <td className="growthyear">2007</td>
                      <td className="desc">
                        Mr. Mahadev Biradar (Deva) launched his individual consultancy
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="draw-line"></div>
              </div>

              <div className="col-2 flow-item space-top">
                <table>
                  <tbody>
                    <tr>
                      <td className="image-cell">
                        <Image src={dbre} alt="" className="item-icon" />
                      </td>
                      <td className="growthyear">2017</td>
                      <td className="desc">Renamed Consultancy as DBRE India.</td>
                    </tr>
                  </tbody>
                </table>

                <div className="draw-line"></div>
              </div>

              <div className="col-2 flow-item space-top">
                <table >
                  <tbody>
                    <tr>
                      <td className="image-cell">
                        <Image src={dbre_india} alt="" className="item-icon" />
                      </td>
                      <td className="growthyear">2019</td>
                      <td className="desc">Registered Consultancy as DBRE. Ltd.</td>
                    </tr>
                  </tbody>
                </table>

                <div className="draw-line"></div>
              </div>

              <div className="col-2 flow-item space-top1">
                <table>
                  <tbody>
                    <tr>
                      <td className="image-cell">
                        <Image src={liaison_bank} alt="" className="item-icon" />
                      </td>
                      <td className="growthyear">2023</td>
                      <td className="desc">Relaunched as Liaison Bank</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
          <div className="document">
            <div className="doc-info">
              <p className="py-2 text-center">LB-001/11/2023</p>
              <p>DATE- 01-02-2024</p>
            </div>

            <div className="title">
              Scope Of Work Of Amc (LA LOCA MARIA) (BKC)
            </div>

            <div className="section">
              <p className="document-title">
                1. All License Renewal And Coordination - Correspondence With Authority.
              </p>
              <p className="py-2"><strong>*List Of Licenses.</strong></p>
              <ol>
                <li>Shop Establishment</li>
                <li>Fssai</li>
                <li>Fire Compliance</li>
                <li>Moh</li>
                <li>FL III</li>
                <li>Premises License</li>
                <li>Sign Board Licenses</li>
              </ol>
            </div>

            <div className="section">
              <p className="py-2 document-title">2. AUDIT & CERTIFICATION.</p>
              <ol>
                <li>Form A/B - Frd / Fire Alarm System / Hydrant System (Every 6 Months)</li>
                <li>Electric Audit Report (Annually)</li>
                <li>Water Test Report (3 Month Quarterly)</li>
                <li>Food Report (Fssai) (3 Month Quarterly)</li>
                <li>Pest Control Certificate (3 Month Quarterly)</li>
                <li>Abc/Co2 Refill Renewal (Half Yearly)</li>
                <li>Gld Inspection & Renewal</li>
                <li>Letter Submit To Fssai Dept. *Png Pipe Painting & Auditing (Every Year)</li>
              </ol>
            </div>

            <div className="section">
              <p className="py-2 document-title">
                3. Any Kind Of Correspondence For Above Mention Point.
              </p>

              <ol>
                <li>*2 Reply 2 Visit Is Included In Amc</li>
              </ol>
            </div>

            <div className="section">
              <p className="py-2 document-title">
                4. Mathadi Intimation Letter To Labour Commissioner / Police Station.
              </p>
            </div>

            <div className="section">
              <p className="py-2 document-title">*TERMS AND CONDITIONS APPLIED.</p>
              <ol >
                <li>100% Payment Before Start The Amc Contract</li>
                <li>Official Fees On Actual On All Above Licenses</li>
                <li>If Required Miscellaneous Expenses On Actual</li>
                <li>Replacement Of Material On Actual Cost</li>
                <li>The Warranty For New Material Is One Year</li>
                <li>Payment Credit To Dbre India Private Limited (Liaison Bank)</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

