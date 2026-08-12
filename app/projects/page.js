"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import useBodyClass from "@/components/useBodyClass";
import rightTick from "@/assets/images/rightTick.svg";
import { completedList } from "@/lib/data/completedList";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";

export default function ProjectsPage() {
  useBodyClass("completed");

  const listRef = useRef(null);
  const mobileListRef = useRef(null);

  // Infinite scroll for desktop table
  useEffect(() => {
    const list = listRef.current;
    if (!list || completedList.length <= 1) return;

    let animationFrame;
    let isTransitioning = false;

    const scroll = () => {
      if (isTransitioning) return;
      
      const first = list.firstElementChild;
      if (!first) return;

      const height = first.getBoundingClientRect().height;
      isTransitioning = true;

      list.style.transition = "transform 0.6s ease-in-out";
      list.style.transform = `translateY(-${height}px)`;

      const onTransitionEnd = () => {
        list.appendChild(first);
        list.style.transition = "none";
        list.style.transform = "translateY(0)";
        
        // Force reflow
        void list.offsetHeight;
        
        isTransitioning = false;
        list.removeEventListener("transitionend", onTransitionEnd);
      };

      list.addEventListener("transitionend", onTransitionEnd, { once: true });
    };

    const interval = setInterval(scroll, 30000000);

    return () => {
      clearInterval(interval);
      if (list) {
        list.style.transition = "none";
        list.style.transform = "translateY(0)";
      }
    };
  }, []);

  // Infinite scroll for mobile cards
  useEffect(() => {
    const list = mobileListRef.current;
    if (!list || completedList.length <= 1) return;

    let isTransitioning = false;

    const scroll = () => {
      if (isTransitioning) return;
      
      const first = list.firstElementChild;
      if (!first) return;

      const height = first.getBoundingClientRect().height;
      isTransitioning = true;

      list.style.transition = "transform 0.6s ease-in-out";
      list.style.transform = `translateY(-${height}px)`;

      const onTransitionEnd = () => {
        list.appendChild(first);
        list.style.transition = "none";
        list.style.transform = "translateY(0)";
        
        // Force reflow
        void list.offsetHeight;
        
        isTransitioning = false;
        list.removeEventListener("transitionend", onTransitionEnd);
      };

      list.addEventListener("transitionend", onTransitionEnd, { once: true });
    };

    const interval = setInterval(scroll, 3000);

    return () => {
      clearInterval(interval);
      if (list) {
        list.style.transition = "none";
        list.style.transform = "translateY(0)";
      }
    };
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Projects</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" />
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Projects
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

      <section className="container">
        <div className="auto-grid">
          {/* MAP */}

          <MumbaiMap />

          {/* CLIENT LIST */}

          <div className="grid-item">
            {/* Desktop Table View */}
            <div className="table-wrapper desktop-view">
              <table className="client-table">
                <thead>
                  <tr className="header-row">
                    <th className="item-name">Brand Name</th>
                    <th className="item-status">Status</th>
                    <th className="item-location">Location</th>
                  </tr>
                </thead>
                <tbody ref={listRef} className="scroll-body">
                  {[...completedList, ...completedList].map((item, index) => (
                    <tr key={`client-${index}`} className="client-row">
                      <td className="item-name">
                        <Image src={rightTick} alt="" className="item-icon" />
                        {item.clientName}
                      </td>
                      <td className="item-status">
                        <span
                          className={`status-badge status-${item.status?.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="item-location">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-view">
              <ul ref={mobileListRef} className="scroll-list">
                {[...completedList, ...completedList].map((item, index) => (
                  <li key={`client-mobile-${index}`} className="client-card">
                    <div className="card-header">
                      <Image src={rightTick} alt="" className="item-icon" />
                      <span className="item-name">{item.clientName}</span>
                    </div>
                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span
                          className={`status-badge status-${item.status?.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="item-location">{item.location}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}