
"use client";

import React from "react";
import "./PropertyAcquisition.scss";

const propertyPortfolio = [
  {
    number: "01",
    icon: "◈",
    title: "Bank Auction Properties",
    description:
      "Strategic sourcing and facilitation of properties offered through public auctions by banks and financial institutions.",
    tag: "Institutional Assets",
  },
  {
    number: "02",
    icon: "⌘",
    title: "ARC & NPA Assets",
    description:
      "Identification and acquisition opportunities across Asset Reconstruction Company portfolios, non-performing loan assets and secured property assets.",
    tag: "Financial Assets",
  },
  {
    number: "03",
    icon: "◇",
    title: "Distressed Asset Acquisition",
    description:
      "Exploring undervalued and distressed real estate assets with potential for strategic investment and value creation.",
    tag: "Value Opportunities",
  },
  {
    number: "04",
    icon: "▦",
    title: "Commercial Real Estate",
    description:
      "Acquisition and disposal of office spaces, retail establishments, commercial buildings, business premises and investment properties.",
    tag: "Commercial",
  },
  {
    number: "05",
    icon: "▤",
    title: "Industrial Properties",
    description:
      "Strategic opportunities involving industrial plots, manufacturing facilities, factories, warehouses and industrial establishments.",
    tag: "Industrial",
  },
  {
    number: "06",
    icon: "⌂",
    title: "Residential Properties",
    description:
      "Acquisition and sale of residential apartments, independent houses, residential developments and land parcels.",
    tag: "Residential",
  },
  {
    number: "07",
    icon: "⇄",
    title: "Property Leasing & Rentals",
    description:
      "Facilitating commercial, industrial and residential leasing and rental opportunities for property owners, investors and prospective occupants.",
    tag: "Leasing & Rentals",
  },
  {
    number: "08",
    icon: "◎",
    title: "Investor-Led Transactions",
    description:
      "Connecting property investors, sellers and acquisition partners to facilitate structured purchase, resale and investment opportunities.",
    tag: "Investment",
  },
];

const acquisitionSteps = [
  {
    number: "01",
    title: "Opportunity Identification",
    description:
      "Sourcing properties through banks, NBFCs, ARCs, auctions, asset owners and investor networks.",
  },
  {
    number: "02",
    title: "Market Evaluation",
    description:
      "Assessing market valuations, location advantages and investment potential.",
  },
  {
    number: "03",
    title: "Due Diligence Coordination",
    description:
      "Facilitating title, ownership, legal and documentation verification through appropriate professionals.",
  },
  {
    number: "04",
    title: "Transaction Facilitation",
    description:
      "Coordinating with sellers, financial institutions, investors and prospective buyers.",
  },
  {
    number: "05",
    title: "Acquisition & Disposal Support",
    description:
      "Assisting with purchase, sale, transfer and other applicable transaction processes.",
  },
];

const PropertyAcquisition = () => {
  return (
    <section className="property-acquisition">

      {/* INTRODUCTION */}
      <div className="pa-container">
        <div className="pa-intro-heading">
              Property Acquisition
              {/* <span> & ASSET INVESTMENT</span> */}
            </div>

        <div className="pa-intro">

          <div className="pa-intro-content">
            {/* <span className="pa-eyebrow">
              <span className="pa-eyebrow-line" />
              OUR SPECIALIZED SERVICES
            </span> */}

            

            <h2>
              Strategic Acquisitions. Exceptional Property Opportunities.
            </h2>

            <p>
              At Liaison Bank, our Property Acquisition division focuses
              on identifying, evaluating and facilitating strategic real
              estate transactions across residential, commercial and
              industrial sectors.We specialize in sourcing high-potential property assets
              through bank auctions, financial institutions, NBFCs,
              Asset Reconstruction Companies (ARCs), Non-Performing
              Asset (NPA) portfolios and distressed asset opportunities. By combining market intelligence, strategic evaluation
              and industry connections, we help investors and businesses
              explore properties at competitive valuations, including
              opportunities below prevailing market rates.  From institutional asset acquisitions and distressed
              property investments to outright purchases, property
              disposals, leasing and rental transactions, we facilitate
              opportunities that align with our clients' investment
              objectives. Our expertise extends beyond conventional property
              transactions, connecting financial institutions, asset
              owners, investors and buyers through a structured and
              opportunity-driven acquisition process.
            </p>

            {/* <p>
              We specialize in sourcing high-potential property assets
              through bank auctions, financial institutions, NBFCs,
              Asset Reconstruction Companies (ARCs), Non-Performing
              Asset (NPA) portfolios and distressed asset opportunities.
            </p> */}

            {/* <p>
              By combining market intelligence, strategic evaluation
              and industry connections, we help investors and businesses
              explore properties at competitive valuations, including
              opportunities below prevailing market rates.
            </p> */}
{/* 
            <p>
              From institutional asset acquisitions and distressed
              property investments to outright purchases, property
              disposals, leasing and rental transactions, we facilitate
              opportunities that align with our clients' investment
              objectives.
            </p> */}

            {/* <p>
              Our expertise extends beyond conventional property
              transactions, connecting financial institutions, asset
              owners, investors and buyers through a structured and
              opportunity-driven acquisition process.
            </p> */}
          </div>

          <div className="pa-intro-visual">
            <div className="pa-visual-main">
              <div className="pa-visual-overlay" />
{/* 
              <div className="pa-visual-top">
                <span>PROPERTY</span>
                <span>01 / 03</span>
              </div> */}

              {/* <div className="pa-visual-bottom">
                <span>STRATEGIC REAL ESTATE</span>
                <h3>
                  Unlocking
                  <br />
                  Property Value.
                </h3>
                <p>
                  Identifying assets. Connecting opportunities.
                </p>
              </div> */}
            </div>

            {/* <div className="pa-visual-caption">
              <span className="pa-caption-icon">↗</span>
              <div>
                <strong>Beyond Conventional Transactions</strong>
                <small>
                  A strategic approach to property acquisition.
                </small>
              </div>
            </div> */}
          </div>

        </div>
      </div>

      {/* PROPERTY PORTFOLIO */}
      <div className="pa-portfolio-section">
        <div className="pa-container">

          <div className="pa-section-heading">
            <div>
              {/* <span className="pa-eyebrow">
                <span className="pa-eyebrow-line" />
                EXPLORE OUR EXPERTISE
              </span> */}

              <h3>
                Our Property Portfolio
              </h3>
            </div>

            {/* <p>
              Diverse property opportunities across asset classes,
              financial institutions and investment channels.
            </p> */}
          </div>

          <div className="pa-portfolio-grid">
            {propertyPortfolio.map((item) => (
              <article className="pa-portfolio-card" key={item.number}>
                <div className="pa-card-top">
  <span className="pa-card-number">
                    {item.number}
                  </span>

                  <span className="pa-card-icon">
                    {item.icon}
                  </span>
                </div>

                <div className="pa-card-content">
                  <span className="pa-card-tag">{item.tag}</span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>

                <div className="pa-card-footer">
                  {/* <span>PROPERTY ACQUISITION</span> */}
                  {/* <span className="pa-card-arrow">↗</span> */}
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>

      {/* ACQUISITION APPROACH */}
      <div className="pa-approach-section">
        <div className="pa-container">

          <div className="pa-approach-heading">
            {/* <span className="pa-eyebrow">
              <span className="pa-eyebrow-line" />
              HOW WE WORK
            </span> */}

            <h3>
              Our Acquisition Approach
            </h3>

            <p>
              We follow an opportunity-driven approach to property
              acquisition, focusing on identifying the right assets,
              understanding their market potential and facilitating
              transactions with professional diligence.
            </p>
          </div>

          <div className="pa-timeline">
            {acquisitionSteps.map((step, index) => (
              <div className="pa-step" key={step.number}>
                <div className="pa-step-marker">
                  <span>{step.number}</span>
                </div>

                <div className="pa-step-content">
                  <span className="pa-step-label">
                    PHASE {step.number}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>

                {index !== acquisitionSteps.length - 1 && (
                  <div className="pa-step-connector" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* VALUE PROPOSITION
      <div className="pa-value-section">
        <div className="pa-container">

          <div className="pa-value-inner">

            <div className="pa-value-left">
              <span className="pa-eyebrow">
                <span className="pa-eyebrow-line" />
                THE LIAISON BANK ADVANTAGE
              </span>

              <h2>
                OUR VALUE
                <span> PROPOSITION</span>
              </h2>

              <p>
                We believe exceptional real estate opportunities are
                created through the right connections, market
                understanding and strategic execution.
              </p>

              <p>
                At Liaison Bank, we aim to bridge the gap between
                available property assets and qualified investment
                opportunities, helping clients explore competitive
                acquisitions, unlock asset value and pursue informed
                real estate investment decisions.
              </p>
            </div>

            <div className="pa-value-right">
              <div className="pa-value-decoration">LB</div>

              <span>OUR COMMITMENT</span>

              <h3>
                Identifying Assets.
                <br />
                Creating Opportunities.
                <br />
                <strong>Building Value.</strong>
              </h3>

              <div className="pa-value-bottom">
                <span />
                LIAISON BANK
              </div>
            </div>

          </div>
        </div>
      </div> */}

    </section>
  );
};

export default PropertyAcquisition;
