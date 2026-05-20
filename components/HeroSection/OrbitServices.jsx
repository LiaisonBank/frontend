"use client";

import "./OrbitServices.scss";

const orbitItems = [
  {
    id: 1,
    className: "item-1",
    icon: "/icons/icon1.svg",
    title: "ABC",
  },
  {
    id: 2,
    className: "item-2",
    icon: "/icons/icon2.svg",
    title: "DEF",
  },
  {
    id: 3,
    className: "item-3",
    icon: "/icons/icon3.svg",
    title: "GHI",
  },
  {
    id: 4,
    className: "item-4",
    icon: "/icons/icon4.svg",
    title: "JKL",
  },
  {
    id: 5,
    className: "item-5",
    icon: "/icons/icon5.svg",
    title: "MNO",
  },
  {
    id: 6,
    className: "item-6",
    icon: "/icons/icon6.svg",
    title: "PQR",
  },
];

export default function OrbitServices() {
  return (
    <section className="orbit-services">
      <div className="orbit-wrapper">

        {/* OUTER RING */}
        <div className="orbit-ring" />

        {/* CENTER */}
        <div className="center-wrapper">
          <div className="center-glow" />
          <div className="center-gradient-ring" />
        </div>

        {/* ORBIT ITEMS */}
        {orbitItems.map((item) => (
          <div
            key={item.id}
            className={`orbit-item ${item.className}`}
          >
            <div className="orbit-item-content">
              <img src={item.icon} alt={item.title} />

              <span>{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}