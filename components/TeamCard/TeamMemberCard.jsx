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

  const imageUrl = image
    ? `${process.env.NEXT_PUBLIC_LOCAL_API_URL}${image}`
    : "";

  const imageStyle = imageUrl
    ? { backgroundImage: `url("${imageUrl}")` }
    : undefined;

  const handleToggle = () => setIsFlipped((prev) => !prev);

  /* -------------------- Email -------------------- */
  const handleEmailClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!email) return;
    window.location.href = `mailto:${email}`;
  };

  /* -------------------- Phone -------------------- */
  const handlePhoneClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!phone) return;
    const sanitized = String(phone).replace(/[^\d+]/g, "");
    window.location.href = `tel:${sanitized}`;
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
          <div className="face front" aria-hidden={isFlipped}>
            <div
              className="front-image"
              style={imageStyle}
              aria-label={`${name} profile`}
            />
            <div className="front-label">{frontLabel || name}</div>
          </div>

          {/* Back */}
          <div className="face back" aria-hidden={!isFlipped}>
            <div className="back-left">
              <div
                className="circle-image"
                style={imageStyle}
                aria-label={`${name} profile`}
              />
            </div>

            <div className="back-right">
              <div className="info-item">
                <span className="info-value name">{name}</span>
              </div>

              <div className="info-item">
                <span className="info-value">{designation}</span>
              </div>

              <div className="info-item">
                <span className="info-label">
                  <EmailIcon width={20} height={20} />
                </span>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="email-link"
                    onClick={handleEmailClick}
                  >
                    <span className="info-value">{email}</span>
                  </a>
                )}
              </div>

              <div className="info-item">
                <span className="info-label">
                  <PhoneIcon
                    width={20}
                    height={20}
                    color={phone ? undefined : "white"}
                  />
                </span>
                {phone && (
                  <a
                    className="call-link"
                    href={`tel:${String(phone).replace(/[^\d+]/g, "")}`}
                    onClick={handlePhoneClick}
                  >
                    <span className="info-value">{phone}</span>
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