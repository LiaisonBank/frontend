// static/menus.jsx
 const searchPhrases = [
    "Search for \"AMC\"",
    "Search for Licensing",
    "Search for Liaisoning",
    "Search for Electrical (SITC)",
    "Search for PNG (SITC)",
    "Search for Fire (SITC)",
    "Search for License Renewal",
    "Search for PNG Audit",
    "Search for Equipment Solution Department ( ESD )"
];
const suggestions = [
  "Senior Citizen Savings Account",
  "Saving Accounts",
  "Campus Power",
  "Car Loan",
  "Personal Loan",
  "Home Loan",
  "Credit Card",
  "Educational Loan",
  "Forex & Remittance",
  "Pay Bill",
  "Recharge",
  "Track your Applications",
  "Demat Account",
  "3-in-1 Account",
  "Gift City",
  "Capital Gains Account Scheme",
  "Gold Loan",
  "Family Banking",
  "Retirement Planning"
];

// Header navigation links
const navLinks = [
  { name: "Home", href: "/", title: "" },
  { name: "About Us", href: "/about-us-liaison", title: "About Liaisonbank", alt: "" },
  { name: "Our Clients", href: "/client-liaison", title: "Our Clients Liaisonbank", alt: ""  },
  { name: "Completed", href: "/completed-liaison-bank", title: "Completed Liaisonbank", alt: ""  },
  { name: "On Going", href: "/ongoing-liaison-bank", title: "On Going Liaisonbank", alt: ""  },
  { 
    name: "Our Services", 
    title: "Liaisonbank Services",
    alt: "",
    submenu: [
      {
        name: "AMC", href: "/pdf/", title: "AMC", alt: "AMC Liaisonbank",pdf:"/pdf/",
        items: [
          { name:"Licenses Renewal", href:"/amc/license-renewal", title: "", alt: "", pdf: "/pdf/licenses-renewal.pdf"  },  
          { name:"PNG Audit and Certification", href:"/amc/png-audit-certification", title: "", alt: "",  pdf: "/pdf/licenses-renewal.pdf"  },
          { name:"Fire Audit and Certification", href:"/amc/fire-audit-certification", title: "", alt: "",  pdf: "/pdf/licenses-renewal.pdf"  },
          { name:"Electric Audit and Certification", href:"/amc/electric-audit-certification", title: "", alt: "",  pdf: "/pdf/licenses-renewal.pdf"  },
          { name:"Pest Control Service and Certification", href:"/amc/pest-control-certification", title: "", alt: "",  pdf: "/pdf/licenses-renewal.pdf"  },
          { name:"Water Tank Cleaning and Certification (Ongoing)", href:"/amc/water-tank-cleaning-certification", title: "", alt: "",  pdf: "/pdf/licenses-renewal.pdf"  },
        ]
      },
      {
        name: "Licensing", href: "/pdf/licensing.pdf", title: "Licensing", alt: "Licensing", pdf:"/pdf/licensing.pdf",
        items: [
          { name:"F&B", href:"", title: "", alt: "",
            children:[
               {
                name:"Resort, Banquet, Hotel", href:"", title: "", alt: "", pdf: "/pdf/licenses-renewal.pdf",
                children:[
                  { name:"Lougging and boarding", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Traffic police permission", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Law and order approval", href:"", title: "", alt: "",  pdf: ""},
                ]
              }, 
              { name:"Restaurant, Dhaba, Sweet mart, Dry Fruit", href:"", title: "", alt: "", pdf: "/pdf/licenses-renewal.pdf",
                children: [
                  { name:"Shop & Establishment", href:"", title: "", alt: "",  pdf: ""},
                  { name:"FSSAI", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Building & Factory NOC", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Fire Compliance certificat6e", href:"", title: "", alt: "",  pdf: ""},
                  { name:"MOH License(Eating House)", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Sign Board License (Permit)", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Open space (Serving License)", href:"", title: "", alt: "",  pdf: ""},
                  { name:"FL III License", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Premises License", href:"", title: "", alt: "",  pdf: ""},
                  { name:"PPL License", href:"", title: "", alt: "",  pdf: ""},
                  { name:"Novex License", href:"", title: "", alt: "",  pdf: ""},
                ]
              }, 
            ]
          },
          {
            name:"Healthcare", href:"", title: "", alt: "",
            children: [
              {name:"Hospital, Clinic, Nursing Home", href:"", title:"", alt:"", pdf:"",
                children: [
                  { name: "SMS - Bio medical waste", href: "", title: "", alt: "", pdf: "" },
                  { name: "Clinic MPCB/BMW", href: "", title: "", alt: "", pdf: "" },
                  { name: "MPCB - Registration 1 - 25 beds", href: "", title: "", alt: "", pdf: "" },
                  { name: "MPCB - Registration 26 - 50 beds", href: "", title: "", alt: "", pdf: "" },
                  { name: "MPCB Autho/consent above 50 beds", href: "", title: "", alt: "", pdf: "" },
                  { name: "Fire NOC new with compliance", href: "", title: "", alt: "", pdf: "" },
                  { name: "FIRE - A form (alarm system) AMC with audit charges for every 6 months", href: "", title: "", alt: "", pdf: "" },
                  { name: "FIRE : Wiring for alarm etc", href: "", title: "", alt: "", pdf: "" },
                  { name: "Architect fees for compliance", href: "", title: "", alt: "", pdf: "" },
                  { name: "FIRE - B form", href: "", title: "", alt: "", pdf: "" },
                  { name: "PCPNDT", href: "", title: "", alt: "", pdf: "" },
                  { name: "MTP registration", href: "", title: "", alt: "", pdf: "" },
                  { name: "Electrical audit certificate yearly", href: "", title: "", alt: "", pdf: "" },
                  { name: "Structural audit", href: "", title: "", alt: "", pdf: "" },
                  { name: "Board sign", href: "", title: "", alt: "", pdf: "" },
                  { name: "Weather shed permission", href: "", title: "", alt: "", pdf: "" },
                  { name: "Change of user for clinics", href: "", title: "", alt: "", pdf: "" },
                  { name: "Change of user for nursing home", href: "", title: "", alt: "", pdf: "" },
                  { name: "NABH 0 - 25 beds", href: "", title: "", alt: "", pdf: "" }
                ]
              }
            ]
          },
          {
            name:"Industrial and Manufacturer", href:"", title: "", alt: "",
            children: [
              {name:"Textile, Colour Coating, Laundry, Factory", href:"", title:"", alt:"", pdf:"",
                children: [
                  { name: "Factory license", href: "", title: "", alt: "", pdf: "" },
                  { name: "Shop & establishment", href: "", title: "", alt: "", pdf: "" },
                  { name: "Building & factory NOC", href: "", title: "", alt: "", pdf: "" },
                  { name: "Fire compliance certificate", href: "", title: "", alt: "", pdf: "" },
                  { name: "MOH license (eating house)", href: "", title: "", alt: "", pdf: "" },
                  { name: "Sign board license (permit)", href: "", title: "", alt: "", pdf: "" }
                ]
              }
            ]
          },
          {
            name:"Real Estate", href:"", title: "", alt: "",
            children: [
              {name:"Building and construction ", href:"", title:"", alt:"", pdf:"",
                children: [
                  { name: "Labour permit", href: "", title: "", alt: "", pdf: "" },
                  { name: "Contractor license", href: "", title: "", alt: "", pdf: "" },
                  { name: "Mathadi registration", href: "", title: "", alt: "", pdf: "" }
                ]
              }
            ]
          },
          {
            name:"Entertainment", href:"", title: "", alt: "",
            children: [
              {name:"Gym, Club House,Events", href:"", title:"", alt:"", pdf:"",
                children: [
                  { name: "Shop & establishment", href: "", title: "", alt: "", pdf: "" },
                  { name: "Building & factory NOC", href: "", title: "", alt: "", pdf: "" },
                  { name: "MOH license (eating house) / Trade license", href: "", title: "", alt: "", pdf: "" },
                  { name: "Police NOC", href: "", title: "", alt: "", pdf: "" },
                  { name: "Staff fitness certificate", href: "", title: "", alt: "", pdf: "" }
                ]
              }
            ]
          },
        ]
      },
      {
        name: "Liaisoning", href: "/pdf/liaisoning.pdf", title: "Liaisoning", alt: "Liaisoning", pdf:"/pdf/liaisoning.pdf",
        items: [
            {
              name: "Brihanmumbai Municipal Corporation (B.M.C)",
              title: "Brihanmumbai municipal corporation approvals and licensing services",
              alt: "brihanmumbai municipal corporation approvals and licensing services",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Vasai-Virar Municipal Corporation (V.V.M.C)",
              title: "Vasai virar municipal corporation approvals and licensing services",
              alt: "vasai virar municipal corporation approvals and licensing services",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Kalyan-Dombivli Municipal Corporation (K.D.M.C)",
              title: "Kalyan dombivli municipal corporation approvals and licensing services",
              alt: "kalyan dombivli municipal corporation approvals and licensing services",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Thane Municipal Corporation (T.M.C)",
              title: "Thane municipal corporation approvals and licensing services",
              alt: "thane municipal corporation approvals and licensing services",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Maharashtra Housing and Area Development Authority (MHADA)",
              title: "Maharashtra housing and area development authority approvals and housing compliance",
              alt: "maharashtra housing and area development authority approvals and housing compliance",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Slum Rehabilitation Authority (S.R.A)",
              title: "Slum rehabilitation authority approvals and redevelopment compliance services",
              alt: "slum rehabilitation authority approvals and redevelopment compliance services",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Mumbai Metropolitan Region Development Authority (M.M.R.D.A)",
              title: "Mumbai metropolitan region development authority approvals and infrastructure compliance",
              alt: "mumbai metropolitan region development authority approvals and infrastructure compliance",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Maharashtra Industrial Development Corporation (M.I.D.C)",
              title: "Maharashtra industrial development corporation approvals and industrial compliance services",
              alt: "maharashtra industrial development corporation approvals and industrial compliance services",
              children: [
                { name: "Building Proposal (342)", href: "", title: "Building Proposal (342)", alt: "Building Proposal (342)", pdf: "/pdf/" },
                { name: "Building Proposal – Miscellaneous", href: "", title: "Building Proposal – Miscellaneous", alt: "Building Proposal – Miscellaneous", pdf: "/pdf/" },
                { name: "Retail Unit Approval", href: "", title: "Retail Unit Approval", alt: "Retail Unit Approval", pdf: "/pdf/" },
                { name: "Building Proposal (337)", href: "", title: "Building Proposal (337)", alt: "Building Proposal (337)", pdf: "/pdf/" },
                { name: "Shop to Restaurant Conversion", href: "", title: "Shop to Restaurant Conversion", alt: "Shop to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Floor Mill to Restaurant Conversion", href: "", title: "Floor Mill to Restaurant Conversion", alt: "Floor Mill to Restaurant Conversion", pdf: "/pdf/" },
                { name: "Shop to Clinic Conversion", href: "", title: "Shop to Clinic Conversion", alt: "Shop to Clinic Conversion", pdf: "/pdf/" }
              ]
            },
            {
              name: "Maharashtra Pollution Control Board (M.P.C.B)",
              title: "Maharashtra pollution control board approvals and environmental compliance services",
              alt: "maharashtra pollution control board approvals and environmental compliance services",
              children: [
                { name: "Maharashtra Pollution Control Board (NOC) for Consent", href: "", title: "Maharashtra Pollution Control Board (NOC) for Consent", alt: "Maharashtra Pollution Control Board (NOC) for Consent", pdf: "/pdf/",
                    children:[
                    { name:"Consent for Establishment", href:"", title: "", alt: "",  pdf: ""},
                    { name:"Consent for Operate", href:"", title: "", alt: "",  pdf: ""},
                    { name:"Consent for Renewal", href:"", title: "", alt: "",  pdf: ""},
                  ]
                 }
              ]
            },
            {
              name: "Mumbai Port Trust (M.B.P.T)",
              title: "Mumbai port trust approvals and port compliance services",
              alt: "mumbai port trust approvals and port compliance services"
            },
            {
              name: "Navi Mumbai Municipal Corporation (N.M.M.C)",
              title: "Navi mumbai municipal corporation approvals and licensing services",
              alt: "navi mumbai municipal corporation approvals and licensing services"
            },
            {
              name: "Pune Mahanagar Co",
              title: "Pune mahanagar corporation approvals and administrative services",
              alt: "pune mahanagar corporation approvals and administrative services"
            },
            {
              name: "Collector",
              title: "Collector office approvals and administrative services",
              alt: "collector office approvals and administrative services",
              children: [
                { name: "Collector Office Mumbai City Land Lease Renewal Approval", href: "", title: "Collector Office Mumbai City Land Lease Renewal Approval", alt: "Collector Office Mumbai City Land Lease Renewal Approval", pdf: "/pdf/" },
                { name: "Collector Office Mumbai City Adjudication", href: "", title: "Collector Office Mumbai City Adjudication", alt: "Collector Office Mumbai City Adjudication", pdf: "/pdf/" },
                { name: "Collector NOC for Approval and Completion (Residential to Commercial)", href: "", title: "Collector NOC for Approval and Completion (Residential to Commercial)", alt: "Collector NOC for Approval and Completion (Residential to Commercial)", pdf: "/pdf/" },
                { name: "Collector NOC for Approval and Completion (Commercial to Nursing Home)", href: "", title: "Collector NOC for Approval and Completion (Commercial to Nursing Home)", alt: "Collector NOC for Approval and Completion (Commercial to Nursing Home)", pdf: "/pdf/" }
              ]
            },
            {
              name: "S.L.R",
              title: "Slr approvals and land record services",
              alt: "slr approvals and land record services",
              children: [
                { name: "Property Card Area Name Change", href: "", title: "Property Card Area Name Change", alt: "Property Card Area Name Change", pdf: "/pdf/" },
                { name: "Property Card Area Correction", href: "", title: "Property Card Area Correction", alt: "Property Card Area Correction", pdf: "/pdf/" },
              ]
            },
            {
              name: "D.D.L.R",
              title: "Ddlr approvals and district land record services",
              alt: "ddlr approvals and district land record services"
            },
            {
              name: "Mumbai Fire Department",
              title: "Mumbai fire department noc and fire compliance services",
              alt: "mumbai fire department noc and fire compliance services",
              children: [
                { name: "Fire NOC Approval and Completion Amalgamation (342)", href: "", title: "Fire NOC Approval and Completion Amalgamation (342)", alt: "Fire NOC Approval and Completion Amalgamation (342)", pdf: "/pdf/" },
                { name: "Fire NOC Approval and Completion for Regularization (342) for Lodging (Hotel Rooms)", href: "", title: "Fire NOC Approval and Completion for Regularization (342) for Lodging (Hotel Rooms)", alt: "Fire NOC Approval and Completion for Regularization (342) for Lodging (Hotel Rooms)", pdf: "/pdf/" },
                { name: "Fire NOC Approval and Completion for Additional Alteration and Regularization (Commercial to Nursing Home)", href: "", title: "Fire NOC Approval and Completion for Additional Alteration and Regularization (Commercial to Nursing Home)", alt: "Fire NOC Approval and Completion for Additional Alteration and Regularization (Commercial to Nursing Home)", pdf: "/pdf/" },
              ]
            },
            {
              name: "Coastal Regulation Zone (CRZ)",
              title: "Coastal regulation zone clearance and environmental compliance services",
              alt: "coastal regulation zone clearance and environmental compliance services"
            },
            {
              name: "Mumbai Airport Authority of India (MAAI)",
              title: "Airport authority approvals and aviation compliance services",
              alt: "airport authority approvals and aviation compliance services"
            },
            {
              name: "R.&.F.M",
              title: "Rfm department approvals and regulatory services",
              alt: "rfm department approvals and regulatory services"
            },
            {
              name: "C.O.M",
              title: "Com department approvals and compliance services",
              alt: "com department approvals and compliance services"
            },
            {
              name: "N.V.M",
              title: "Nvm department approvals and regulatory services",
              alt: "nvm department approvals and regulatory services"
            },
            {
              name: "A.P.M",
              title: "Apm department approvals and compliance services",
              alt: "apm department approvals and compliance services"
            },
            {
              name: "M.I.D.C.M",
              title: "Midcm approvals and industrial compliance services",
              alt: "midcm approvals and industrial compliance services"
            },
            {
              name: "I.D.C",
              title: "Industrial development corporation approvals and compliance services",
              alt: "industrial development corporation approvals and compliance services"
            },
            {
              name: "P.W.D",
              title: "Public works department approvals and infrastructure compliance services",
              alt: "public works department approvals and infrastructure compliance services"
            },
            {
              name: "D.M",
              title: "District magistrate office approvals and administrative services",
              alt: "district magistrate office approvals and administrative services"
            },
            {
              name: "Adani Power",
              title: "Adani power approvals and electrical compliance services",
              alt: "adani power approvals and electrical compliance services",
              children: [
                { name: "Name Change", href: "", title: "Name Change", alt: "Name Change", pdf: "/pdf/" },
                { name: "Residential to Commercial", href: "", title: "Residential to Commercial", alt: "Residential to Commercial", pdf: "/pdf/" },
                { name: "KW Load Increase", href: "", title: "KW Load Increase", alt: "KW Load Increase", pdf: "/pdf/" },
                { name: "Changeover Adani to Tata", href: "", title: "Changeover Adani to Tata", alt: "Changeover Adani to Tata", pdf: "/pdf/" },
                { name: "New Meter Connection (Construction / Industry / Temporary Meter)", href: "", title: "New Meter Connection (Construction / Industry / Temporary Meter)", alt: "New Meter Connection (Construction / Industry / Temporary Meter)", pdf: "/pdf/" },
              ]
            },
            {
              name: "TATA Power",
              title: "Tata power approvals and electrical compliance services",
              alt: "tata power approvals and electrical compliance services",
               children: [
                { name: "Name Change", href: "", title: "Name Change", alt: "Name Change", pdf: "/pdf/" },
                { name: "Residential to Commercial", href: "", title: "Residential to Commercial", alt: "Residential to Commercial", pdf: "/pdf/" },
                { name: "KW Load Increase", href: "", title: "KW Load Increase", alt: "KW Load Increase", pdf: "/pdf/" },
                { name: "Changeover Adani to Tata", href: "", title: "Changeover Adani to Tata", alt: "Changeover Adani to Tata", pdf: "/pdf/" },
                { name: "New Meter Connection (Construction / Industry / Temporary Meter)", href: "", title: "New Meter Connection (Construction / Industry / Temporary Meter)", alt: "New Meter Connection (Construction / Industry / Temporary Meter)", pdf: "/pdf/" },
              ]
            },
            {
              name: "M.S.E.D.C.L",
              title: "Maharashtra state electricity distribution company limited approvals and electrical compliance services",
              alt: "maharashtra state electricity distribution company limited approvals and electrical compliance services",
               children: [
                { name: "Name Change", href: "", title: "Name Change", alt: "Name Change", pdf: "/pdf/" },
                { name: "Residential to Commercial", href: "", title: "Residential to Commercial", alt: "Residential to Commercial", pdf: "/pdf/" },
                { name: "KW Load Increase", href: "", title: "KW Load Increase", alt: "KW Load Increase", pdf: "/pdf/" },
                { name: "Changeover Adani to Tata", href: "", title: "Changeover Adani to Tata", alt: "Changeover Adani to Tata", pdf: "/pdf/" },
                { name: "New Meter Connection (Construction / Industry / Temporary Meter)", href: "", title: "New Meter Connection (Construction / Industry / Temporary Meter)", alt: "New Meter Connection (Construction / Industry / Temporary Meter)", pdf: "/pdf/" },
              ]
            }
          ]
      },
      { name: "Electrical ( SITC )", href: "/electrical-sitc", title: "Electrical Execution, Compliance & Maintenance Services", alt: "Electrical ( SITC )", pdf: "/pdf/electrical-sitc.pdf" },
      { name: "Fire ( SITC )", href: "/fire-sitc", title: "Fire & Safety Systems and Compliance Solutions", alt: "Fire ( SITC )", pdf: "/pdf/fss.pdf" },
      { name: "PNG ( SITC )", href: "/png-sitc", title: "Piped Natural Gas (Png) Services & Regulatory Compliance", alt: "PNG ( SITC )", pdf: "/pdf/piped_natural_gas.pdf" },
      { name: "Equipment Solution Department ( ESD )", href: "/equipment-solution-department-esd", title: "Equipment Solution Department", alt: "( ESD )", pdf: "/pdf/EEBP.pdf" },
      { name: "Group Profile", href: "/group-profile", title: "Group Profile", alt: "( ESD )", pdf: "" },
      // { name: "Integrated Licensing & Compliance Solutions ( ILCS )", href: "", title: "Integrated Licensing & Compliance Solutions", alt: "( ILCS )" },
      // { name: "Integrated Liaisoning, Approvals & Compliance Solutions ( ILACS )", href: "", title: "Integrated Liaisoning, Approvals & Compliance Solutions", alt: "( ILACS )" },
    ]
  },  
  { name: "Press Release", href: "/press-release-liaison-bank", title: "Press Release Liaisonbank", alt: "Press Release Liaisonbank"  },
  // { name: "Process", href: "/process-liaison-bank", title: "Process Liaisonbank", alt: "Process Liaisonbank"  },
  { name: "Contact Us", href: "/contact-us-liaison-bank", title: "Contact Liaisonbank", alt: "Contact Liaisonbank"  },
  // { name: "Login", href: "/Login" },
]

// Footer links
const importantLinks = [
  // { name: "Article", href: "/article-liaison-bank", title: "Article Liaisonbank", alt: "Article Liaisonbank" },
  { name: "CEO's Desk", href: "/ceos-desk", title: "CEO's Desk Liaisonbank", alt: "CEO's Desk Liaisonbank" },
  { name: "Careers", href: "/careers-liaison-bank/", title: "Careers Liaisonbank", alt: "Careers Liaisonbank" },
  { name: "Testimonials", href: "/testimonials-liaison-bank", title: "Testimonials Liaisonbank", alt: "Testimonials Liaisonbank" },
  { name: "Privacy Policy", href: "/privacy-policy", title: "Privacy Policy Liaisonbank", alt: "Privacy Policy Liaisonbank" },
  { name: "Terms of Service", href: "/terms-and-conditions", title: "Terms of Services Liaisonbank", alt: "Terms of Services Liaisonbank" },
  { name: "Sitemap", href: "/sitemap", title: "Sitemap Liaisonbank", alt: "Sitemap Liaisonbank" }
]

// Named exports
export { searchPhrases, navLinks, importantLinks, suggestions}
