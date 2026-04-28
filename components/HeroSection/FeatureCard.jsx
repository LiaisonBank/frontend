import React from "react";

export default function FeatureCard({ title, description, icon, delay }) {
  return (
    <div
      className="feature-card"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}