
import React, { useState } from "react";
import PhoneIcon from "components/phoneicon";
import EmailIcon from "components/EmailIcon";

import "./TeamMemberCard.scss";

const TeamMemberCard = ({ member = {} }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    name = "Alexandra V. Chen",
    designation = "Lead Product Designer",
    email = "alex.chen@studio.com",
    phone = "+1 (415) 867-5309",
    image = "",
    frontLabel = "",
  } = member;

  // Construct image URL
  const imageUrl = image
    ? `${process.env.NEXT_PUBLIC_LOCAL_API_URL}${image}`
    : "";

  const imageStyle = imageUrl
    ? { backgroundImage: `url("${imageUrl}")` }
    : undefined;

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <section className="team-member-card">
      <div
        className="scene"
        tabIndex={0}
        role="button"
        aria-label={`View details for ${name}`}
        aria-pressed={isFlipped}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className={`flip ${isFlipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="face front">
            <div
              className="front-image"
              style={imageStyle}
              aria-label={`${name} profile`}
            />

            <div className="front-label">
              {frontLabel || name}
            </div>
          </div>

          {/* Back */}
          <div className="face back">
            {/* Left - Profile Image */}
            <div className="back-left">
              <div
                className="circle-image"
                style={imageStyle}
                aria-label={`${name} profile`}
              />
            </div>

            {/* Right - Member Information */}
            <div className="back-right">
              <div className="info-item">
                <span className="info-value name">
                  {name}
                </span>
              </div>

              <div className="info-item">
                <span className="info-value designation">
                  {designation}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">
                  <EmailIcon width={20} height={20} />
                </span>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span className="info-value">
                      Email
                    </span>
                  </a>
                )}
              </div>

              <div className="info-item">
                <span className="info-label">
                  <PhoneIcon width={20} height={20} />
                </span>

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span className="info-value">
                      Call Mobile
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamMemberCard;

