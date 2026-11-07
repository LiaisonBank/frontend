"use client";
import React from "react";
import Link from "next/link";
import "./SitemapDiagram.css";

const NAV_LINKS = [
  { name: "Home", href: "/",
    submenu: [
      {
        name: "Ceo Profile",
        href: "/ceo-profile",
      }
    ]

   },
   
  { name: "About Us", href: "/about-us-liaison",
    submenu:[
      {name : "liaisoning", href: "our-services/liaisoning"},
          {name : "licensing", href: "our-services/licensing"},
          {name: "png", href: "our-services/piped-natural-gas"},
          {name: "fire", href: "our-services/fire"},
          {name: "electrical", href: "our-services/electrical"},
          {name: "amc", href: "our-services/amc"}
    ]
   },
  { name: "Our Clients", href: "/client-liaison" },
  { name: "Projects", href: "/projects" },
  // { 
  //   name: "Projects",
  //   projects: [
  //     { name: "Completed", href: "/completed-liaison-bank" },
  //     { name: "On Going", href: "/ongoing-liaison-bank" },
  //   ]
  // },
  { 
    name: "Our Services",
    href: "/our-services",
    submenu: [
      {
        name: "Liaisoning Services",
        href : "/our-services/liaisoning",
        items: [
          { 
            name: "Brihanmumbai Municipal Corporation (BMC)",
            children: [
              { 
                name: "Shop to Clinic Conversion", href:"/our-services/liaisoning/bmc-shop-to-clinic-conversion"
              },
              { 
                name: "Building Proposal – Miscellaneous", href:"/our-services/liaisoning/bmc-building-proposal-miscellaneous"
              },
              {name:"Retail Unit Approval", href:"/our-services/liaisoning/bmc-retail-unit-approval"},
              {
                name: "Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342"
              },
              {
                name : "Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337"
              },
              {name : "Shop to Restaurant Conversion", href:"/our-services/liaisoning/bmc-shop-to-restaurant-conversion"},
              {name : "Floor Mill to Restaurant Conversion", href:"/our-services/liaisoning/bmc-floor-mill-to-restaurant-conversion"},
            ]
          },
          {
            name: "Vasai-Virar Municipal Corporation (VVMC)",
            children: [
              {
                name: "Building Proposal – Miscellaneous",
                href: "/our-services/liaisoning/building-proposal-miscellaneous-vvmc"
              },
              {name : "Shop to Clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-vvmc"},
              {name : "Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-vvmc"},
              {name: "Retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-vvmc"},
              {name: "Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-vvmc"},
              {namr: "Shop to Restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-vvmc"},
              {name: "Floor Mill to Restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-vvmc"},
            ]
          },
          {
            name: "Kalyan-Dombivli Municipal Corporation (KDMC)",
            children: [
              {name:"Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-kdmc"},
              {name:"Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-kdmc"},
              {name:"Building Proposal – Miscellaneous", href:"/our-services/liaisoning/building-proposal-miscellaneous-kdmc"},
              {name:"retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-kdmc"},
              {name:"Shop to restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-kdmc"},
              {name:"Floor mill to restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-kdmc"},
              {name:"Shop to clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-kdmc"},
            ]
          },
          {
            name: "Thane Municipal Corporation (TMC)",
            children: [
              {name:"Floor mill to restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-tmc"},
              {name:"Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-tmc"},
              {name:"Building Proposal – Miscellaneous", href:"/our-services/liaisoning/building-proposal-miscellaneous-tmc"},
              {name:"retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-tmc"},
              {name:"Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-tmc"},
              {name:"Shop to restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-tmc"},
              {name:"Shop to clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-tmc"},
            ]
          },
          {
            name: "Maharashtra Housing and Area Development Authority (MHADA)",
            children: [
              {name:"Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-mhada"},
              {name:"Building Proposal – Miscellaneous", href:"/our-services/liaisoning/building-proposal-miscellaneous-mhada"},
              {name:"retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-mhada"},
              {name:"Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-mhada"},
              {name:"Shop to restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-mhada"},
              {name:"Floor mill to restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-mhada"},
              {name:"Shop to clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-mhada"},
            ]
          },
          {
            name: "Slum Rehabilitation Authority (SRA)",
            children: [
              {name:"Floor mill to restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-sra"},
              {name:"Shop to clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-sra"},
              {name:"Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-sra"},
              {name:"Shop to restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-sra"},
              {name:"Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-sra"},
              {name:"retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-sra"},
              {name:"Building Proposal – Miscellaneous", href:"/our-services/liaisoning/building-proposal-miscellaneous-sra"},
            ]
          },
          {
            name: "Mumbai Metropolitan Region Development Authority (MMRDA)",
            children: [
              {name:"Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-mmda"},
              {name:"Building Proposal – Miscellaneous", href:"/our-services/liaisoning/building-proposal-miscellaneous-mmda"},
              {name:"retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-mmda"},
              {name:"Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-mmda"},
              {name:"Shop to restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-mmda"},
              {name:"Floor mill to restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-mmda"},
              {name:"Shop to clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-mmda"},
            ]
          },
          {
            name: "Maharashtra Industrial Development Corporation (MIDC)",
            children: [
              {name:"Building Proposal (342)", href:"/our-services/liaisoning/building-proposal-342-midc"},
              {name:"Building Proposal – Miscellaneous", href:"/our-services/liaisoning/building-proposal-miscellaneous-midc"},
              {name:"retail Unit Approval", href:"/our-services/liaisoning/retail-unit-approval-midc"},
              {name:"Building Proposal (337)", href:"/our-services/liaisoning/building-proposal-337-midc"},
              {name:"Shop to restaurant Conversion", href:"/our-services/liaisoning/shop-to-restaurant-conversion-midc"},
              {name:"Floor mill to restaurant Conversion", href:"/our-services/liaisoning/floor-mill-to-restaurant-conversion-midc"},
              {name:"Shop to clinic Conversion", href:"/our-services/liaisoning/shop-to-clinic-conversion-midc"},
            ]
          },
          {
            name: "Maharashtra Pollution Control Board (MPCB)",
            children: [
              {name:"Maharashtra Pollution Control Board (NOC) for Consent", href:"/our-services/liaisoning/maharashtra-pollution-control-board-noc-for-consent"},
            ]
          },
          {
            name:"Revenue & Forest(Collector)",
            children:[
              {name :"Superintendent of Land Records (SLR)", href:"/our-services/liaisoning/superintendent-of-land-records-slr"},
              {name : "Collector NOC for Approval and Completion (Commercial to Nursing Home)", href:"/our-services/liaisoning/collector-noc-for-approval-and-completion-commercial-to-nursing-home"},
              {name:"Collector Office Mumbai City Land Lease Renewal Approval", href : "/our-services/liaisoning/collector-office-mumbai-city-land-lease-renewal-approval"},
              {name:"Collector Office Mumbai City Adjudication" , href:"/our-services/liaisoning/collector-office-mumbai-city-adjudication"},
              {name:"Collector NOC for Approval and Completion (Residential to Commercial)", href:"/our-services/liaisoning/collector-noc-for-approval-and-completion-residential-to-commercial"},
              {name:"Directorate of District Land Records (D.D.L.R)", href:"/our-services/liaisoning/directorate-of-district-land-records-d-d-l-r"},
              {name: "District Magistrate (DM)", href :"/our-services/liaisoning/district-magistrate-dm"}

            ]
          },
          {
            name:"Adanin Power",
            children:[
              {name:"KW Load Increase", href:"/our-services/liaisoning/kw-load-increase-adani"},
              {name:"New Meter Connection (Construction / Industry / Temporary Meter)", href:"/our-services/liaisoning/new-meter-connection-construction-industry-temporary-meter-adani"},  
              {name:"Name Change", href:"/our-services/liaisoning/name-change-adani"},
              {name:"Residential to Commercial", href:"/our-services/liaisoning/residential-to-commercial-adani"},
              {NAME:"Changeover Adani to Tata", href:"/our-services/liaisoning/changeover-adani-to-tata-adani"},
            ]
          },
          {
            name:"Mumbai Fire Department",
            children:[
              {name:"Fire NOC Approval and Completion Amalgamation (342)", href:"/our-services/liaisoning/fire-noc-approval-and-completion-amalgamation-342"},
              {name:"Fire NOC Approval and Completion for Regularization (342) for Lodging (Hotel Rooms)", href:"/our-services/liaisoning/fire-noc-approval-and-completion-for-regularization-342-for-lodging-hotel-rooms"},
              {name:"Fire NOC Approval and Completion for Additional Alteration and Regularization (Commercial to Nursing Home)", href:"/our-services/liaisoning/fire-noc-approval-and-completion-for-additional-alteration-and-regularization-commercial-to-nursing-home"},
            ]
          },
          {
            name:"TATA Power",
            children:[
              {name:"Changeover Adani to Tata", href:"/our-services/liaisoning/changeover-adani-to-tata-power"},
              {name:"Name Change", href:"/our-services/liaisoning/name-change-tata-power"},
              {name:"Residential to Commercial", href:"/our-services/liaisoning/residential-to-commercial-tata-power"},
              {name:"New Meter Connection (Construction / Industry / Temporary Meter)", href:"/our-services/liaisoning/new-meter-connection-construction-industry-temporary-meter-tata-power"},
              {name:"KW Load Increase", href:"/our-services/liaisoning/kw-load-increase-tata-power"},
            ]
          },
          {
            name:"Maharashtra State Electricity Distribution Co. Ltd (MSEDCL)",
            children:[
              {name:"KW Load Increase", href:"/our-services/liaisoning/kw-load-increase"},
              {name:"Name Change", href:"/our-services/liaisoning/name-change-msedcl"},
              {name:"Residential to Commercial", href:"/our-services/liaisoning/residential-to-commercial"},
              {name:"New Meter Connection (Construction / Industry / Temporary Meter)", href:"/our-services/liaisoning/new-meter-connection-construction-industry-temporary-meter"},
              {name:"Changeover Adani to Tata", href:"/our-services/liaisoning/changeover-adani-to-tata"},
            ]
          },
          {
            name:"Mumbai Port Trust (MBPT)",
            href:"/contact-us-liaison-bank"
          },
          {
            name:"Navi Mumbai Municipal Corporation (NMMC)",
            href:"/contact-us-liaison-bank"
          },
          {
            name:"Pune Mahanagar Co",
            href:"/contact-us-liaison-bank"
          },
          {
            name:"Coastal Regulation Zone (CRZ)",
            href:"/contact-us-liaison-bank"
          },
          {
            name:"Public Works Department (PWD)",
            href:"/contact-us-liaison-bank"
          },
          {
            name:"Mumbai Airport Authority of India (MAAI)",
            href:"/contact-us-liaison-bank"
          }
        ]
      },
      {
        name: "Licensing Services",
        href : "/our-services/licensing",
        items: [
          { 
            name: "Entertainment",
            children: [
              { name: "Gym, Club House,Events", href: "/our-services/licensing/gym-club-house-events" }
            ]
          },
          {
            name: "Industrial and Manufacturer",
            children: [
              { name: "Textile, Colour Coating, Laundry, Factory", href: "/our-services/licensing/textile-colour-coating-laundry-factory" }
            ]
          },
          {
            name: "Real Estate",
            children: [
              { name: "Building and Construction", href: "/our-services/licensing/building-and-construction" }
            ]
          },
          {
            name : "Food and Beverage",
            children: [
              { name: "Resort, Banquet, Hotel", href: "/our-services/licensing/resort-banquet-hotel" },
              {name: "Restaurant, Dhaba, Sweet mart, Dry Fruit", href: "/our-services/licensing/restaurant-dhaba-sweet-mart-dry-fruit" },
            ]
          },
          {
            name: "Healthcare",
            children: [
              { name: "Hospital, Clinic, Nursing Home", href: "/our-services/licensing/hospital-clinic-nursing-home" },
            ]
          },
          // { name: "Vasai-Virar Municipal Corporation (V.V.M.C)", href: "/contact-us-liaison-bank" },
          // { name: "Kalyan-Dombivli Municipal Corporation (K.D.M.C)", href: "/contact-us-liaison-bank" },
          // { name: "Thane Municipal Corporation (T.M.C)", href: "/contact-us-liaison-bank" },
          // { name: "Maharashtra Housing and Area Development Authority (MHADA)", href: "/contact-us-liaison-bank" },
          // { name: "Slum Rehabilitation Authority (S.R.A)", href: "/contact-us-liaison-bank" },
          // { name: "Mumbai Metropolitan Region Development Authority (M.M.R.D.A)", href: "/contact-us-liaison-bank" },
          // { 
          //   name: "Maharashtra Industrial Development Corporation (M.I.D.C)",
          //   children: [
          //     { name: "Building Proposal (342)", href: "/contact-us-liaison-bank" },
          //     { name: "Building Proposal - Miscellaneous", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // {
          //   name: "Maharashtra Pollution Control Board (M.P.C.B)",
          //   children: [
          //     { name: "Consent for Establishment", href: "/contact-us-liaison-bank" },
          //     { name: "Consent for Operate", href: "/contact-us-liaison-bank" },
          //     { name: "Consent for Renewal", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // { name: "Mumbai Port Trust (M.B.P.T)", href: "/contact-us-liaison-bank" },
          // { name: "Navi Mumbai Municipal Corporation (N.M.M.C)", href: "/contact-us-liaison-bank" },
          // { name: "Pune Mahanagar Co", href: "/contact-us-liaison-bank" },
          // {
          //   name: "Collector",
          //   children: [
          //     { name: "Land Lease Renewal Approval", href: "/contact-us-liaison-bank" },
          //     { name: "Adjudication", href: "/contact-us-liaison-bank" },
          //     { name: "NOC for Approval and Completion", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // {
          //   name: "S.L.R",
          //   children: [
          //     { name: "Property Card Area Name Change", href: "/contact-us-liaison-bank" },
          //     { name: "Property Card Area Correction", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // { name: "D.D.L.R", href: "/contact-us-liaison-bank" },
          // {
          //   name: "Mumbai Fire Department",
          //   children: [
          //     { name: "Fire NOC Approval and Completion", href: "/contact-us-liaison-bank" },
          //     { name: "Fire NOC for Regularization", href: "/contact-us-liaison-bank" },
          //     { name: "Fire NOC for Additional Alteration", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // { name: "Coastal Regulation Zone (CRZ)", href: "/contact-us-liaison-bank" },
          // { name: "Mumbai Airport Authority of India (MAAI)", href: "/contact-us-liaison-bank" },
          // { name: "R.&.F.M", href: "/contact-us-liaison-bank" },
          // { name: "C.O.M", href: "/contact-us-liaison-bank" },
          // { name: "N.V.M", href: "/contact-us-liaison-bank" },
          // { name: "A.P.M", href: "/contact-us-liaison-bank" },
          // { name: "M.I.D.C.M", href: "/contact-us-liaison-bank" },
          // { name: "I.D.C", href: "/contact-us-liaison-bank" },
          // { name: "P.W.D", href: "/contact-us-liaison-bank" },
          // { name: "D.M", href: "/contact-us-liaison-bank" },
          // {
          //   name: "Adani Power",
          //   children: [
          //     { name: "Name Change", href: "/contact-us-liaison-bank" },
          //     { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
          //     { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
          //     { name: "Changeover TATA to Adani", href: "/contact-us-liaison-bank" },
          //     { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // {
          //   name: "TATA Power",
          //   children: [
          //     { name: "Name Change", href: "/contact-us-liaison-bank" },
          //     { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
          //     { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
          //     { name: "Changeover Adani to TATA", href: "/contact-us-liaison-bank" },
          //     { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
          //   ]
          // },
          // {
          //   name: "M.S.E.D.C.L",
          //   children: [
          //     { name: "Name Change", href: "/contact-us-liaison-bank" },
          //     { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
          //     { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
          //     { name: "Changeover Adani to Tata", href: "/contact-us-liaison-bank" },
          //     { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
          //   ]
          // }
        ]
      },
      {
        name: "Piped Natural Gas (PNG) Services",
        href : "/our-services/piped-natural-gas",
        items: [
          { name: "Residential Connection",
            children: [
              { name: "Gas Charge & Completion", href: "/our-services/piped-natural-gas/gas-charge-completion-residential" },
              { name: "MGL Liaisoning & Agreement", href: "/our-services/piped-natural-gas/mgl-liaisoning-agreement-residential" },
              {name: "Fabrication & Pipeline Service", href: "/our-services/piped-natural-gas/fabrication-pipeline-service-residential" },
            ]

          },
          {
            name: "Industrial Connection",
            children: [
              { name: "MGL Liaisoning & Agreement", href: "/our-services/piped-natural-gas/mgl-liaisoning-agreement-industrial-mumbai" },
              {name: "Gas Charge & Completion", href: "/our-services/piped-natural-gas/gas-charge-completion-industrial-connection" },
              {name:"Pipeline Service", href: "/our-services/piped-natural-gas/pipeline-service" },
              { name: "Fit to use Certificate", href: "/our-services/piped-natural-gas/fit-to-use-certificate-industrial-connection" },
            ]
          },
          {
            name: "Commercial Connection",
            children: [
              { name: "MGL Liaisoning & Agreement", href: "/our-services/piped-natural-gas/mgl-liaisoning-agreement-commercial" },
              { name: "Fit to use Certificate", href: "/our-services/piped-natural-gas/fit-to-use-certificate-commercial-connection" },
              {name: "Gas Charge & Completion", href: "/our-services/piped-natural-gas/gas-charge-completion-commercial" },
              {name:"Pipeline Service", href: "/our-services/piped-natural-gas/pipeline-service-png-commercial" },
            ]
          },
        ]
      },
      {
        name: "Fire Services",
        href : "/our-services/fire",
        items: [
          {name : "Hydrant Supply, Installation, Testing & Certification", href:"/contact-us-liaison-bank"},
          {name:"Approval For Cheif Fire Officer Noc", href: "/contact-us-liaison-bank"},
          {name: "Detection Supply, Installation, Testing & Certification" , href:"/contact-us-liaison-bank"},
          {name:"Suppresion Supply, Installation, Testing & Certification" ,href:"/contact-us-liaison-bank"},
        ]
      },
      {
        name : "Electrical Services",
        href : "/our-services/electrical",
        items:[
          {name : "Electrical System Supply, Installation, Testing & Certification", href:"/contact-us-liaison-bank"},
          {name:"Electric audit Certification", href:"/contact-us-liaison-bank"},
          {name:"Load Increase",  href:"/contact-us-liaison-bank"},
          {name : "Electricty Bill Name Change (Adani & Tata)", href:"/contact-us-liaison-bank"},
        ]
      },
      {
        name: "AMC Services",
        href : "/our-services/amc",
        items: [
          { name: "PNG Audit and Certification", href: "/contact-us-liaison-bank" },
          { name: "Fire Audit and Certification", href: "/contact-us-liaison-bank" },
          { name: "Water Tank Cleaning and Certification", href: "/contact-us-liaison-bank" },
          { name: "Licenses Renewal",
            children:[
              {name:"F&B", href:"/our-services/amc/f-b"},
              {name:"Healthcare", href:"/our-services/amc/healthcare"},
              {name:"Industrial & Manufacturer", href:"/our-services/amc/industrial-manufacturer"},
              {name:"Real Estate", href:"/our-services/amc/real-estate"},
              {name:"Entertainment", href:"/our-services/amc/entertainment"}
            ]
           },
          { name: "Electric Audit and Certification", href: "/contact-us-liaison-bank" },
          { name: "Pest Control Service and Certification", href: "/contact-us-liaison-bank" },
        ]
      },
      {name : "Liaisoning Services",href : "/our-services/liaisoning"},
      {name : "Licensing Services", href:"/our-services/licensing"},
      {name:"Piped Natural gas Services", href:"/our-services/piped-natural-gas"},
      {name:"Fire Services", href:"/our-services/fire"},
      {name:"Electrical Services", href:"/our-services/electrical"},
      {name:"AMC Services", href:"/our-services/amc"},
      {name: "Real Estate Services", href: "/our-services/real-estate"},
      { name: "Equipment Solution Department Services", href: "/our-services/equipment-solution-department" },
          // {
          //   name: "Industrial and Manufacturer",
          //   children: [
          //     {
          //       name: "Textile, Colour Coating, Laundry, Factory",
          //       children: [
          //         { name: "Factory license", href: "/contact-us-liaison-bank" },
          //         { name: "Shop & establishment", href: "/contact-us-liaison-bank" },
          //         { name: "Building & factory NOC", href: "/contact-us-liaison-bank" },
          //         { name: "Fire compliance certificate", href: "/contact-us-liaison-bank" },
          //         { name: "MOH license eating house", href: "/contact-us-liaison-bank" },
          //         { name: "Sign board license", href: "/contact-us-liaison-bank" },
          //       ]
          //     }
          //   ]
          // },
          // {
          //   name: "Real Estate",
          //   children: [
          //     {
          //       name: "Building and construction",
          //       children: [
          //         { name: "Labour permit", href: "/contact-us-liaison-bank" },
          //         { name: "Contractor license", href: "/contact-us-liaison-bank" },
          //         { name: "Mathadi registration", href: "/contact-us-liaison-bank" },
          //       ]
          //     }
          //   ]
          // },
          // {
          //   name: "Entertainment",
          //   children: [
          //     {
          //       name: "Gym, Club House, Events",
          //       children: [
          //         { name: "Shop & establishment", href: "/contact-us-liaison-bank" },
          //         { name: "Building & factory NOC", href: "/contact-us-liaison-bank" },
          //         { name: "MOH license / Trade license", href: "/contact-us-liaison-bank" },
          //         { name: "Police NOC", href: "/contact-us-liaison-bank" },
          //         { name: "Staff fitness certificate", href: "/contact-us-liaison-bank" },
          //       ]
          //     }
          //   ]
          // },
        ]
      },
      {
    name : "AMC", href:"https://amc-99kh.onrender.com/"
   },

      { name: "Careers", href: "/careers-liaison-bank/" ,
    submenu: [
      {name: "Liasoning Careers", href: "/careers-liaison-bank/jobs?service=Liaisoning"},
      {name: "Licensing Careers", href: "/careers-liaison-bank/jobs?service=Licensing"},
      {name:"PNG Careers", href: "/careers-liaison-bank/jobs?service=PNG"},
      {name: "Fire Careers", href: "/careers-liaison-bank/jobs?service=Fire%20Safety"},
      {name: "Electrical Careers", href: "/careers-liaison-bank/jobs?service=Electrical"},
      {name: "AMC Careers", href: "/careers-liaison-bank/jobs?service=AMC"},
      {name:"Accounts Careers", href: "/careers-liaison-bank/jobs?department=ACCOUNTS%20DEPARTMENT%20-%20DBRE"},
      {name : "Administration Careers", href: "/careers-liaison-bank/jobs?department=Administration%20%26%20Facilities%20-%20DBRE"},
      {name : "Architecture Careers", href: "/careers-liaison-bank/jobs?department=ARCHITECTURE%20DEPARTMENT%20-%20DBRE"},
      {name: "Human Resources Careers", href: "/careers-liaison-bank/jobs?department=HUMAN%20RESOURCE%20-%20DBRE"},
      {name: "Information Technology Careers", href: "/careers-liaison-bank/jobs?department=IT%20DEPARTMENT%20-%20DBRE"},
      {name : "Sales Careers", href: "/careers-liaison-bank/jobs?department=SALES%20DEPARTMENT%20-%20DBRE"},
      { name: "Job Openings", href: "/careers-liaison-bank/jobs" },
      // { name: "Internship Opportunities", href: "/careers-liaison-bank/internship-opportunities" },
      // { name: "Employee Testimonials", href: "/careers-liaison-bank/employee-testimonials" },
    ]
  },
  { name: "Press Release", href: "/press-release-liaison-bank" },
  { name: "Contact Us", href: "/contact-us-liaison-bank" },
      
      
      
      // {name: "Licensing Services", href: "/our-services/licensing"},
      // { name: "Liaisoning Services", href: "/our-services/liaisoning" },
      // { name: "PNG Services", href: "/our-services/piped-natural-gas" },
      // { name: "Fire Services", href: "/our-services/fire" },
      // { name: "Electrical Services", href: "/our-services/electrical" },
      // { name: "AMC Services", href: "/our-services/amc" },
      // { name: "Group Profile", href: "/group-profile" },
      // { name: "Integrated Licensing & Compliance Solutions (ILCS)", href: "/our-services/integrated-licensing" },
      // { name: "Integrated Liaisoning, Approvals & Compliance Solutions (ILACS)", href: "/our-services/integrated-liaisoning" },
    ]

// ===== Helpers =====
const getChildren = (node) =>
  node?.children || node?.submenu || node?.items || node?.projects || [];

// some hrefs in the data have no leading slash — normalise so links never resolve relatively
const fixHref = (href) => (href && !href.startsWith("/") ? `/${href}` : href);

const countLeaves = (nodes) =>
  nodes.reduce((n, node) => {
    const kids = getChildren(node);
    return n + (kids.length ? countLeaves(kids) : 1);
  }, 0);

// Groups of a section: direct leaf children form one untitled group,
// children that have their own children each become a titled group.
const buildGroups = (section) => {
  const children = getChildren(section);
  const groups = [];
  const leaves = children.filter((c) => getChildren(c).length === 0);
  if (leaves.length) groups.push({ title: null, items: leaves });
  children
    .filter((c) => getChildren(c).length > 0)
    .forEach((c) => groups.push({ title: c, items: getChildren(c) }));
  return groups;
};

// First block (no big heading, like Apple's opening block): every main page as a quick overview.
// (flattened to name + href only, so nested children are not repeated here)
const OVERVIEW_GROUP = {
  title: { name: "Main Pages" },
  items: NAV_LINKS.map(({ name, href }) => ({ name, href })),
};

// Sections that have sub-pages get their own heading + groups.
// (Childless pages like Our Clients / Projects are already in the overview.)
const SECTIONS = NAV_LINKS.filter((s) => getChildren(s).length > 0);

const NavText = ({ item, className }) =>
  item.href ? (
    <Link href={fixHref(item.href)} className={className}>
      {item.name}
    </Link>
  ) : (
    <span className={className}>{item.name}</span>
  );

// Links; deeper groups get a small label with indented links beneath
const renderLinks = (items, depth = 0) =>
  items.map((item, i) => {
    const children = getChildren(item);
    if (children.length === 0) {
      return (
        <li key={`${depth}-${i}`} className="sitemap-link-item">
          <NavText item={item} className="sitemap-link" />
        </li>
      );
    }
    return (
      <li key={`${depth}-${i}`} className="sitemap-link-item sitemap-subgroup">
        <NavText item={item} className="sitemap-sublabel" />
        <ul className="sitemap-links nested">{renderLinks(children, depth + 1)}</ul>
      </li>
    );
  });

// Long groups (e.g. Liaisoning) and untitled link lists (e.g. About Us, Careers)
// run across the full width in 3 columns of their own, so sections don't look empty.
const isBig = (group) =>
  countLeaves(group.items) > 16 || (!group.title && group.items.length > 4);

const Group = ({ group }) => (
  <div className={`sitemap-group${isBig(group) ? " is-big" : ""}`}>
    {group.title && (
      <h3 className="sitemap-group-title">
        <NavText item={group.title} className="sitemap-group-link" />
      </h3>
    )}
    <ul className="sitemap-links">{renderLinks(group.items)}</ul>
  </div>
);
const filterSitemapNodes = (nodes, query) => {
  if (!query.trim()) return nodes;

  return nodes.reduce((results, node) => {
    const children = getChildren(node);
    const filteredChildren = filterSitemapNodes(children, query);

    if (node.name?.toLowerCase().includes(query.toLowerCase())) {
      results.push(node);
    } else if (filteredChildren.length > 0) {
      const childKey = ["children", "submenu", "items", "projects"].find(
        (key) => Array.isArray(node[key])
      );

      results.push(
        childKey
          ? { ...node, [childKey]: filteredChildren }
          : node
      );
    }

    return results;
  }, []);
};

// ===== Page =====
export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredLinks = filterSitemapNodes(NAV_LINKS, searchQuery);

const filteredOverview = filteredLinks.map(({ name, href }) => ({
  name,
  href,
}));

const filteredSections = filteredLinks.filter(
  (section) => getChildren(section).length > 0
);
  return (
    <div className="sitemap-container">
      <header className="sitemap-header">
  <h1 className="sitemap-title">Site Map</h1>

  <div className="sitemap-search">
    <svg
      className="sitemap-search-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>

    <input
      type="search"
      className="sitemap-search-input"
      placeholder="Search pages and services..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />

    {/* {searchQuery && (
      <button
        type="button"
        className="sitemap-search-clear"
        onClick={() => setSearchQuery("")}
      >
        ×
      </button>
    )} */}
  </div>
</header>

      {/* Opening block */}
      {filteredOverview.length > 0 && (
  <section className="sitemap-section">
    <div className="sitemap-columns">
      <Group
        group={{
          title: { name: "Main Pages" },
          items: filteredOverview,
        }}
      />
    </div>
  </section>
)}

{filteredSections.map((section, si) => (
  <section key={`section-${si}`} className="sitemap-section">
    <h2 className="sitemap-section-title">
      <NavText item={section} className="sitemap-section-link" />
    </h2>

    <div className="sitemap-columns">
      {buildGroups(section).map((group, gi) => (
        <Group key={`group-${si}-${gi}`} group={group} />
      ))}
    </div>
  </section>
))}

{searchQuery && filteredLinks.length === 0 && (
  <div className="sitemap-empty-state">
    <h3>No results found</h3>
    <p>Try another page or service name.</p>
  </div>
)}
    </div>
  );
}