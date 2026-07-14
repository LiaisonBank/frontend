"use client";
import Image from "next/image";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass'; // Adjust path as needed
// import PageTitleWave from '@/components/PageTitleWave';
// import PageTitleWaveLeft from '@/components/PageTitleWaveLeft';
import AnimatedCounter from '@/components/AnimateCounter';
import rightTick from "@/assets/images/rightTick.svg";
import {completedList} from '@/lib/data/completedList';


export default function CompletedLiaisonbankPage() {
  useBodyClass('completed');
  // Helper function to split the array into chunks of 4
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };
  const chunks = chunkArray(completedList, 8);
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
                    <h1>Completed</h1>

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
                          Completed Projects
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
              <h3>Completed  
                {/* <AnimatedCounter endValue={125} /> */}
                 Projects </h3>
            </div>
          <div className="project-grid">
            {chunks.map((chunk, index) => (
                <div className="grid-item" key={index}>
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
        </div>
      </section>
    </>
  );
}

