// // app/sitemap/page.jsx - Modern, Clean Sitemap
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// export default function SitemapPage() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const navLinks = [
//     { name: "Home", href: "/" },
//     { name: "About Us", href: "/about-us-liaison" },
//     { name: "Our Clients", href: "/client-liaison" },
//     { 
//       name: "Projects",
//       projects: [
//         { name: "Completed", href: "/completed-liaison-bank" },
//         { name: "On Going", href: "/ongoing-liaison-bank" },
//       ]
//     },
//     { 
//       name: "Our Services",
//       submenu: [
//         {
//           name: "AMC",
//           items: [
//             { name: "Licenses Renewal", href: "/contact-us-liaison-bank" },
//             { name: "PNG Audit and Certification", href: "/contact-us-liaison-bank" },
//             { name: "Fire Audit and Certification", href: "/contact-us-liaison-bank" },
//             { name: "Electric Audit and Certification", href: "/contact-us-liaison-bank" },
//             { name: "Pest Control Service and Certification", href: "/contact-us-liaison-bank" },
//             { name: "Water Tank Cleaning and Certification", href: "/contact-us-liaison-bank" },
//           ]
//         },
//         {
//           name: "Licensing",
//           items: [
//             { 
//               name: "F&B",
//               children: [
//                 { 
//                   name: "Resort, Banquet, Hotel",
//                   children: [
//                     { name: "Lougging and boarding", href: "/contact-us-liaison-bank" },
//                     { name: "Traffic police permission", href: "/contact-us-liaison-bank" },
//                     { name: "Law and order approval", href: "/contact-us-liaison-bank" },
//                   ]
//                 },
//                 { 
//                   name: "Restaurant, Dhaba, Sweet mart, Dry Fruit",
//                   children: [
//                     { name: "Shop & Establishment", href: "/contact-us-liaison-bank" },
//                     { name: "FSSAI", href: "/contact-us-liaison-bank" },
//                     { name: "Building & Factory NOC", href: "/contact-us-liaison-bank" },
//                     { name: "Fire Compliance certificate", href: "/contact-us-liaison-bank" },
//                     { name: "MOH License", href: "/contact-us-liaison-bank" },
//                   ]
//                 },
//               ]
//             },
//             {
//               name: "Healthcare",
//               children: [
//                 {
//                   name: "Hospital, Clinic, Nursing Home",
//                   children: [
//                     { name: "SMS - Bio medical waste", href: "/contact-us-liaison-bank" },
//                     { name: "Clinic MPCB/BMW", href: "/contact-us-liaison-bank" },
//                     { name: "MPCB Registration", href: "/contact-us-liaison-bank" },
//                     { name: "Fire NOC", href: "/contact-us-liaison-bank" },
//                     { name: "PCPNDT", href: "/contact-us-liaison-bank" },
//                     { name: "MTP registration", href: "/contact-us-liaison-bank" },
//                   ]
//                 }
//               ]
//             },
//             {
//               name: "Industrial and Manufacturer",
//               children: [
//                 {
//                   name: "Textile, Colour Coating, Laundry, Factory",
//                   children: [
//                     { name: "Factory license", href: "/contact-us-liaison-bank" },
//                     { name: "Shop & establishment", href: "/contact-us-liaison-bank" },
//                     { name: "Building & factory NOC", href: "/contact-us-liaison-bank" },
//                     { name: "Fire compliance certificate", href: "/contact-us-liaison-bank" },
//                   ]
//                 }
//               ]
//             },
//             {
//               name: "Real Estate",
//               children: [
//                 {
//                   name: "Building and construction",
//                   children: [
//                     { name: "Labour permit", href: "/contact-us-liaison-bank" },
//                     { name: "Contractor license", href: "/contact-us-liaison-bank" },
//                     { name: "Mathadi registration", href: "/contact-us-liaison-bank" },
//                   ]
//                 }
//               ]
//             },
//             {
//               name: "Entertainment",
//               children: [
//                 {
//                   name: "Gym, Club House, Events",
//                   children: [
//                     { name: "Shop & establishment", href: "/contact-us-liaison-bank" },
//                     { name: "Building & factory NOC", href: "/contact-us-liaison-bank" },
//                     { name: "MOH license / Trade license", href: "/contact-us-liaison-bank" },
//                     { name: "Police NOC", href: "/contact-us-liaison-bank" },
//                     { name: "Staff fitness certificate", href: "/contact-us-liaison-bank" },
//                   ]
//                 }
//               ]
//             },
//           ]
//         },
//         {
//           name: "Liaisoning",
//           items: [
//             { 
//               name: "Brihanmumbai Municipal Corporation (B.M.C)",
//               children: [
//                 { name: "Building Proposal (342)", href: "/contact-us-liaison-bank" },
//                 { name: "Building Proposal - Miscellaneous", href: "/contact-us-liaison-bank" },
//                 { name: "Retail Unit Approval", href: "/contact-us-liaison-bank" },
//                 { name: "Building Proposal (337)", href: "/contact-us-liaison-bank" },
//                 { name: "Shop to Restaurant Conversion", href: "/contact-us-liaison-bank" },
//                 { name: "Floor Mill to Restaurant Conversion", href: "/contact-us-liaison-bank" },
//                 { name: "Shop to Clinic Conversion", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             { name: "Vasai-Virar Municipal Corporation (V.V.M.C)", href: "/contact-us-liaison-bank" },
//             { name: "Kalyan-Dombivli Municipal Corporation (K.D.M.C)", href: "/contact-us-liaison-bank" },
//             { name: "Thane Municipal Corporation (T.M.C)", href: "/contact-us-liaison-bank" },
//             { name: "Maharashtra Housing and Area Development Authority (MHADA)", href: "/contact-us-liaison-bank" },
//             { name: "Slum Rehabilitation Authority (S.R.A)", href: "/contact-us-liaison-bank" },
//             { name: "Mumbai Metropolitan Region Development Authority (M.M.R.D.A)", href: "/contact-us-liaison-bank" },
//             { 
//               name: "Maharashtra Industrial Development Corporation (M.I.D.C)",
//               children: [
//                 { name: "Building Proposal (342)", href: "/contact-us-liaison-bank" },
//                 { name: "Building Proposal - Miscellaneous", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             {
//               name: "Maharashtra Pollution Control Board (M.P.C.B)",
//               children: [
//                 { name: "Consent for Establishment", href: "/contact-us-liaison-bank" },
//                 { name: "Consent for Operate", href: "/contact-us-liaison-bank" },
//                 { name: "Consent for Renewal", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             { name: "Mumbai Port Trust (M.B.P.T)", href: "/contact-us-liaison-bank" },
//             { name: "Navi Mumbai Municipal Corporation (N.M.M.C)", href: "/contact-us-liaison-bank" },
//             { name: "Pune Mahanagar Co", href: "/contact-us-liaison-bank" },
//             {
//               name: "Collector",
//               children: [
//                 { name: "Land Lease Renewal Approval", href: "/contact-us-liaison-bank" },
//                 { name: "Adjudication", href: "/contact-us-liaison-bank" },
//                 { name: "NOC for Approval and Completion", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             {
//               name: "Mumbai Fire Department",
//               children: [
//                 { name: "Fire NOC Approval and Completion", href: "/contact-us-liaison-bank" },
//                 { name: "Fire NOC for Regularization", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             { name: "Coastal Regulation Zone (CRZ)", href: "/contact-us-liaison-bank" },
//             { name: "Mumbai Airport Authority of India (MAAI)", href: "/contact-us-liaison-bank" },
//             {
//               name: "Adani Power",
//               children: [
//                 { name: "Name Change", href: "/contact-us-liaison-bank" },
//                 { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
//                 { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
//                 { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             {
//               name: "TATA Power",
//               children: [
//                 { name: "Name Change", href: "/contact-us-liaison-bank" },
//                 { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
//                 { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
//                 { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
//               ]
//             },
//             {
//               name: "M.S.E.D.C.L",
//               children: [
//                 { name: "Name Change", href: "/contact-us-liaison-bank" },
//                 { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
//                 { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
//                 { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
//               ]
//             }
//           ]
//         },
//         { name: "Electrical (SITC)", href: "/contact-us-liaison-bank" },
//         { name: "Fire & FAPA (SITC)", href: "/contact-us-liaison-bank" },
//         { name: "PNG (SITC)", href: "/contact-us-liaison-bank" },
//         { name: "Equipment Solution Department (ESD)", href: "/contact-us-liaison-bank" },
//         { name: "Group Profile", href: "/group-profile" },
//       ]
//     },
//     { name: "Careers", href: "/careers-liaison-bank/" },
//     { name: "Press Release", href: "/press-release-liaison-bank" },
//     { name: "Contact Us", href: "/contact-us-liaison-bank" },
//   ];

//   // Get children from any node
//   const getChildren = (node) => {
//     return node?.children || node?.submenu || node?.items || node?.projects || [];
//   };

//   // Check if node has children
//   const hasChildren = (node) => {
//     return getChildren(node).length > 0;
//   };

//   // Count total pages
//   const countPages = (nodes) => {
//     let count = 0;
//     nodes.forEach(node => {
//       if (node.href) count++;
//       const children = getChildren(node);
//       if (children.length > 0) {
//         count += countPages(children);
//       }
//     });
//     return count;
//   };

//   const totalPages = countPages(navLinks);
//   const totalSections = navLinks.length;

//   // Recursive Tree Node
//   const TreeNode = ({ node, level = 0 }) => {
//     const children = getChildren(node);
//     const hasKids = children.length > 0;
//     const [isOpen, setIsOpen] = useState(true);

//     // Search filter
//     const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const childMatches = hasKids && children.some(child => {
//       const childChildren = getChildren(child);
//       return child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         childChildren.some(grandchild => 
//           grandchild.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     });

//     if (searchTerm && !matchesSearch && !childMatches) return null;

//     const getIcon = (name, level) => {
//       if (level === 0) {
//         const icons = {
//           "Home": "🏠",
//           "About Us": "ℹ️",
//           "Our Clients": "🤝",
//           "Projects": "📋",
//           "Our Services": "⚡",
//           "Careers": "💼",
//           "Press Release": "📰",
//           "Contact Us": "📞",
//         };
//         return icons[name] || "📁";
//       }
//       return hasKids ? "📂" : "📄";
//     };

//     return (
//       <div style={{ marginBottom: '0.15rem' }}>
//         <div 
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem',
//             padding: level === 0 ? '0.6rem 0.75rem' : '0.3rem 0.5rem',
//             paddingLeft: level > 0 ? `${level * 1.5}rem` : '0',
//             borderRadius: '8px',
//             background: level === 0 ? 'white' : 'transparent',
//             borderBottom: level === 0 ? '1px solid #f0f0f0' : 'none',
//             transition: 'all 0.2s ease',
//             cursor: 'pointer',
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = level === 0 ? '#f8f9fa' : 'rgba(52, 152, 219, 0.04)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = level === 0 ? 'white' : 'transparent';
//           }}
//         >
//           {hasKids && (
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               style={{
//                 width: '22px',
//                 height: '22px',
//                 minWidth: '22px',
//                 border: '1px solid #e0e0e0',
//                 borderRadius: '4px',
//                 background: 'white',
//                 fontSize: '0.8rem',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 transition: 'all 0.2s ease',
//               }}
//             >
//               {isOpen ? '−' : '+'}
//             </button>
//           )}
//           {!hasKids && <span style={{ width: '22px', minWidth: '22px' }} />}

//           <span style={{ fontSize: '1rem', opacity: 0.6 }}>{getIcon(node.name, level)}</span>

//           {node.href ? (
//             <Link 
//               href={node.href}
//               style={{
//                 color: level === 0 ? '#1a1a2e' : '#2c3e50',
//                 textDecoration: 'none',
//                 fontWeight: level === 0 ? 600 : 400,
//                 fontSize: level === 0 ? '1rem' : '0.9rem',
//                 padding: '0.15rem 0.3rem',
//                 borderRadius: '4px',
//                 transition: 'all 0.2s ease',
//               }}
//             >
//               {node.name}
//             </Link>
//           ) : (
//             <span style={{
//               color: level === 0 ? '#1a1a2e' : '#2c3e50',
//               fontWeight: level === 0 ? 600 : 500,
//               fontSize: level === 0 ? '1rem' : '0.9rem',
//             }}>
//               {node.name}
//               {level === 0 && node.name === "Our Services" && (
//                 <span style={{
//                   fontSize: '0.55rem',
//                   fontWeight: 600,
//                   padding: '0.1rem 0.5rem',
//                   borderRadius: '12px',
//                   background: '#3498db',
//                   color: 'white',
//                   marginLeft: '0.5rem',
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.3px',
//                 }}>
//                   Main
//                 </span>
//               )}
//             </span>
//           )}

//           {level === 0 && hasKids && (
//             <span style={{
//               fontSize: '0.7rem',
//               color: '#adb5bd',
//               marginLeft: 'auto',
//             }}>
//               {children.length} items
//             </span>
//           )}
//         </div>

//         {hasKids && isOpen && (
//           <div style={{ paddingLeft: level === 0 ? '0.5rem' : '0' }}>
//             {children.map((child, index) => (
//               <TreeNode key={index} node={child} level={level + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div style={{
//       maxWidth: '1100px',
//       margin: '0 auto',
//       padding: '2rem 1.5rem',
//       background: '#ffffff',
//       borderRadius: '20px',
//       boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
//     }}>
//       {/* Header */}
//       <div style={{
//         marginBottom: '2rem',
//         paddingBottom: '1.5rem',
//         borderBottom: '2px solid #f0f0f0',
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: '1rem',
//         }}>
//           <div>
//             <h1 style={{
//               fontSize: '1.8rem',
//               fontWeight: 700,
//               margin: 0,
//               color: '#1a1a2e',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//             }}>
//               <span>🗺️</span> Site Map
//             </h1>
//             <p style={{
//               color: '#6c757d',
//               margin: '0.25rem 0 0',
//               fontSize: '0.9rem',
//             }}>
//               {totalSections} main sections · {totalPages} total pages
//             </p>
//           </div>

//           {/* Stats */}
//           <div style={{
//             display: 'flex',
//             gap: '1.5rem',
//           }}>
//             <div style={{ textAlign: 'center' }}>
//               <div style={{
//                 fontSize: '1.5rem',
//                 fontWeight: 700,
//                 color: '#3498db',
//               }}>
//                 {totalSections}
//               </div>
//               <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>Sections</div>
//             </div>
//             <div style={{ textAlign: 'center' }}>
//               <div style={{
//                 fontSize: '1.5rem',
//                 fontWeight: 700,
//                 color: '#2ecc71',
//               }}>
//                 {totalPages}
//               </div>
//               <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>Pages</div>
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div style={{ marginTop: '1rem' }}>
//           <input
//             type="text"
//             placeholder="🔍 Search pages..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               width: '100%',
//               maxWidth: '400px',
//               padding: '0.6rem 1rem',
//               border: '2px solid #e9ecef',
//               borderRadius: '10px',
//               fontSize: '0.9rem',
//               transition: 'all 0.3s ease',
//               outline: 'none',
//             }}
//             onFocus={(e) => {
//               e.currentTarget.style.borderColor = '#3498db';
//               e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52,152,219,0.1)';
//             }}
//             onBlur={(e) => {
//               e.currentTarget.style.borderColor = '#e9ecef';
//               e.currentTarget.style.boxShadow = 'none';
//             }}
//           />
//         </div>
//       </div>

//       {/* Sitemap Tree */}
//       <div style={{
//         background: '#fafbfc',
//         borderRadius: '12px',
//         padding: '0.5rem',
//         maxHeight: '600px',
//         overflowY: 'auto',
//         border: '1px solid #f0f0f0',
//       }}>
//         {navLinks.map((node, index) => (
//           <TreeNode key={index} node={node} level={0} />
//         ))}
//       </div>

//       {/* Footer */}
//       <div style={{
//         marginTop: '1.5rem',
//         paddingTop: '1rem',
//         borderTop: '1px solid #f0f0f0',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flexWrap: 'wrap',
//         gap: '0.5rem',
//         fontSize: '0.8rem',
//         color: '#adb5bd',
//       }}>
//         <span>© {new Date().getFullYear()} Liaison Bank - Complete Site Map</span>
//         <span>
//           {searchTerm ? `🔍 Showing results for "${searchTerm}"` : '📋 All pages displayed'}
//         </span>
//       </div>
//     </div>
//   );
// }