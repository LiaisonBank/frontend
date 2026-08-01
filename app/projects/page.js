"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import useBodyClass from "@/components/useBodyClass";
import rightTick from "@/assets/images/rightTick.svg";
import { completedList } from "@/lib/data/completedList";
import MumbaiMap from "./MumbaiMap";

export default function OurExpertise() {
  useBodyClass("completed");

  const leftListRef = useRef(null);
  const rightListRef = useRef(null);

  const middleIndex = Math.ceil(completedList.length / 2);

  const leftList = completedList.slice(0, middleIndex);
  const rightList = completedList.slice(middleIndex);

  useEffect(() => {
    const intervals = [];

    const startScroll = (list) => {
      if (!list) return;

      const scroll = () => {
        const first = list.firstElementChild;

        if (!first) return;

        const height = first.getBoundingClientRect().height;

        list.style.transition = "transform .6s linear";
        list.style.transform = `translateY(-${height}px)`;

        const onTransitionEnd = () => {
          list.appendChild(first);

          list.style.transition = "none";
          list.style.transform = "translateY(0)";

          // Force reflow
          list.offsetHeight;

          list.removeEventListener("transitionend", onTransitionEnd);
        };

        list.addEventListener("transitionend", onTransitionEnd, {
          once: true,
        });
      };

      const id = setInterval(scroll, 2000);

      intervals.push(id);
    };

    startScroll(leftListRef.current);
    startScroll(rightListRef.current);

    return () => {
      intervals.forEach(clearInterval);
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
                    <h1>Completed</h1>

                    <nav
                      aria-label="breadcrumb"
                      className="page-breadcrumb"
                    >
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
                          Completed Projects
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

      <section className="container py-5">
        <div className="auto-grid">

          {/* LEFT COLUMN */}

          <div className="grid-item">

            <ul className="scroll-wrapper">
              <li className="header-row">
                <strong className="item-name">
                  Client Name
                </strong>

                <strong className="item-price">
                  Location
                </strong>
              </li>
            </ul>

            <div className="listItem">

              <ul
                ref={leftListRef}
                className="scroll-list"
              >
                {[...leftList, ...leftList].map((item, index) => (
                  <li key={`left-${index}`}>
                    <Image
                      src={rightTick}
                      alt=""
                      className="item-icon"
                    />

                    <span className="item-name">
                      {item.clientName}
                    </span>

                    <span className="item-price">
                      {item.location}
                    </span>
                  </li>
                ))}
              </ul>

            </div>
          </div>

          {/* MAP */}

          <MumbaiMap />

          {/* RIGHT COLUMN */}

          <div className="grid-item">

            <ul className="scroll-wrapper">
              <li className="header-row">
                <strong className="item-name">
                  Client Name
                </strong>

                <strong className="item-price">
                  Location
                </strong>
              </li>
            </ul>

            <div className="listItem">

              <ul
                ref={rightListRef}
                className="scroll-list"
              >
                {[...rightList, ...rightList].map((item, index) => (
                  <li key={`right-${index}`}>
                    <Image
                      src={rightTick}
                      alt=""
                      className="item-icon"
                    />

                    <span className="item-name">
                      {item.clientName}
                    </span>

                    <span className="item-price">
                      {item.location}
                    </span>
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