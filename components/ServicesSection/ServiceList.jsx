"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import rightTick from "@/assets/images/rightTick.svg";
import { services } from "@/lib/data/servicesData";
import ServiceContent from "./ServiceContent";

export default function ServiceList({ activeIndex, onChange }) {
  const itemRefs = useRef([]);
  const handleClick = (index) => {
    onChange(index);
  };
  // const handleClick = (index) => {
  //   // Scroll only on mobile/tablet
  //   if (window.innerWidth < 1200) {
  //    itemRefs.current[index]?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });

  //     window.scrollBy({
  //       top: -80, // Adjust to your header height
  //       behavior: "smooth",
  //     });
  //   }

  //   onChange(index);
  // };
  useEffect(() => {
  if (window.innerWidth >= 1200) return;

  const element = itemRefs.current[activeIndex];
  if (!element) return;

  const HEADER_HEIGHT = 80;

  const y =
    element.getBoundingClientRect().top +
    window.scrollY -
    HEADER_HEIGHT;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}, [activeIndex]);

  return (
    <ul className="service-list list-unstyled list-icon style-1">
      {services.map((item, index) => (
        <li
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          className={
            activeIndex === index
              ? "accordion-item active"
              : "accordion-item"
          }
          onClick={() => handleClick(index)}
        >
          <div className="service-title">
            <Image src={rightTick} alt="" />
            <span>{item.title}</span>
          </div>

          {/* Mobile Content */}
          {activeIndex === index && (
            <div className="d-block d-xl-none mobile-service-content">
              <ServiceContent activeIndex={index} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}