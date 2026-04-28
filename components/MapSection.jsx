import React from "react";

const MapSection = () => {
  return (
    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7541.898064984938!2d72.82667133832211!3d19.065978378545925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c911edcd8b37%3A0x737cf6ced39c7c02!2sDBRE%20INDIA%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1774350323121!5m2!1sen!2sin"
        width="100%"
        height="575"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
    </div>
  );
};

export default MapSection;