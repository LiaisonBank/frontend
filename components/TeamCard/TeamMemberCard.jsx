import React, { useState } from "react";
import "./TeamMemberCard.scss";

const TeamMemberCard = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggle = () => {
    setIsFlipped(!isFlipped);
  };

  // Destructure member object with fallback values
  const {
    name = "Alexandra V. Chen",
    designation = "Lead Product Designer",
    email = "alex.chen@studio.com",
    phone = "+1 (415) 867-5309",
    image = "",
    frontLabel = "",
  } = member || {};

  // Construct image URLs
  const imageUrl = image
    ? `${process.env.NEXT_PUBLIC_LOCAL_API_URL}${image}`
    : "";

  // Generate inline styles for dynamic images
  const frontImageStyle = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
  };

  const circleImageStyle = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
  };
  console.log("TeamMemberCard member:", member);
  return (
    <section>
      
      <div className="scene" tabIndex={0} onClick={handleToggle}>
        <div className={`flip ${isFlipped ? "flipped" : ""}`}>
          {/* FRONT : image + name */}
          <div className="face front">
            <div className="front-image" style={frontImageStyle}></div>
            <div className="front-label">{frontLabel || name}</div>
          </div>

          {/* BACK : 50% circle (left) + 50% details (right) */}
          <div className="face back">
            {/* left column : circle image (50%) */}
            <div className="back-left">
              <div className="circle-image" style={circleImageStyle}></div>
            </div>

            {/* right column : name, designation, email, phone (50%) */}
            <div className="back-right">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value name">{name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Designation</span>
                <span className="info-value designation">{designation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default TeamMemberCard;
