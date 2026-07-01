"use client";
import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';
import AnimatedCounter from '@/components/AnimateCounter';
import {onGoingList} from '@/lib/data/onGoingList';
import rightTick from "@/assets/images/rightTick.svg";
// import OngoingList from "@/components/OngoingList/page";

export default function OngoingLiaisonbankPage() {
  useBodyClass('ongoing');
  // Helper function to split the array into chunks of 4
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };
  const chunks = chunkArray(onGoingList, 8);
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
                    <h1 data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">On Going</h1>

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
                        >On Going
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
            <h3>Ongoing <AnimatedCounter endValue={23} />+ Projects </h3>
          </div>
        </div>
        <div className="project-grid">
          {chunks.map((chunk, index) => (
            <div className="grid-item" key={index}
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay={250 * (index + 1)}>
              <ul className="item-list">
                <li className="header-row">
                  <strong className="item-name">Client Name</strong>
                  <strong className="item-price">Location</strong>
                </li>
                {chunk.map((item, i) => (
                  <li key={i}>
                    <Image src={rightTick} alt="Checkmark" className="item-icon" />
                    <span className="item-name">{item.clientName}</span>
                    <span className="item-price">{item.location}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

