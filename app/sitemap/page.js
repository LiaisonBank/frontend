// app/sitemap/page.jsx - Professional Sitemap
"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import "./SitemapDiagram.css";

// ===== SVG Icons =====
const Icons = {
  Home: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  ),
  About: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Clients: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Projects: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  Services: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  Careers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  Press: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z"/>
      <path d="M8 8h8v2H8z"/>
      <path d="M8 12h6v2H8z"/>
      <path d="M8 16h4v2H8z"/>
    </svg>
  ),
  Contact: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  AMC: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  Licensing: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  Liaisoning: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/>
    </svg>
  ),
  Electrical: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Fire: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2c-3 4-7 8-7 12a7 7 0 0014 0c0-4-4-8-7-12z"/>
      <path d="M12 9c-1.5 2-2.5 4-2.5 6a2.5 2.5 0 005 0c0-2-1-4-2.5-6z"/>
    </svg>
  ),
  PNG: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  ESD: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Group: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Default: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z"/>
      <path d="M8 8h8v8H8z"/>
    </svg>
  ),
  Stats: {
    Sections: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    Pages: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    Links: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
  }
};

// ===== Constants =====
const ICON_MAP = {
  "Home": "Home",
  "About Us": "About",
  "Our Clients": "Clients",
  "Projects": "Projects",
  "Our Services": "Services",
  "Careers": "Careers",
  "Press Release": "Press",
  "Contact Us": "Contact",
  "AMC": "AMC",
  "Licensing": "Licensing",
  "Liaisoning": "Liaisoning",
  "Electrical (SITC)": "Electrical",
  "Fire & FAPA (SITC)": "Fire",
  "PNG (SITC)": "PNG",
  "Equipment Solution Department (ESD)": "ESD",
  "Group Profile": "Group",
};

const GRADIENT_MAP = {
  "Home": "linear-gradient(135deg, #FF6B6B, #ee5a24)",
  "About Us": "linear-gradient(135deg, #FF9F43, #e17055)",
  "Our Clients": "linear-gradient(135deg, #00B894, #00cec9)",
  "Projects": "linear-gradient(135deg, #6C5CE7, #a29bfe)",
  "Our Services": "linear-gradient(135deg, #FD79A8, #e84393)",
  "Careers": "linear-gradient(135deg, #00CEC9, #00b894)",
  "Press Release": "linear-gradient(135deg, #FDCB6E, #f39c12)",
  "Contact Us": "linear-gradient(135deg, #0984E3, #74b9ff)",
};

// ===== Navigation Data =====
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us-liaison" },
  { name: "Our Clients", href: "/client-liaison" },
  { 
    name: "Projects",
    projects: [
      { name: "Completed", href: "/completed-liaison-bank" },
      { name: "On Going", href: "/ongoing-liaison-bank" },
    ]
  },
  { 
    name: "Our Services",
    submenu: [
      {
        name: "AMC",
        items: [
          { name: "Licenses Renewal", href: "/contact-us-liaison-bank" },
          { name: "PNG Audit and Certification", href: "/contact-us-liaison-bank" },
          { name: "Fire Audit and Certification", href: "/contact-us-liaison-bank" },
          { name: "Electric Audit and Certification", href: "/contact-us-liaison-bank" },
          { name: "Pest Control Service and Certification", href: "/contact-us-liaison-bank" },
          { name: "Water Tank Cleaning and Certification", href: "/contact-us-liaison-bank" },
        ]
      },
      {
        name: "Licensing",
        items: [
          { 
            name: "F&B",
            children: [
              { 
                name: "Resort, Banquet, Hotel",
                children: [
                  { name: "Lougging and boarding", href: "/contact-us-liaison-bank" },
                  { name: "Traffic police permission", href: "/contact-us-liaison-bank" },
                  { name: "Law and order approval", href: "/contact-us-liaison-bank" },
                ]
              },
              { 
                name: "Restaurant, Dhaba, Sweet mart, Dry Fruit",
                children: [
                  { name: "Shop & Establishment", href: "/contact-us-liaison-bank" },
                  { name: "FSSAI", href: "/contact-us-liaison-bank" },
                  { name: "Building & Factory NOC", href: "/contact-us-liaison-bank" },
                  { name: "Fire Compliance certificate", href: "/contact-us-liaison-bank" },
                  { name: "MOH License", href: "/contact-us-liaison-bank" },
                  { name: "Sign Board License", href: "/contact-us-liaison-bank" },
                  { name: "Open space Serving License", href: "/contact-us-liaison-bank" },
                  { name: "FL III License", href: "/contact-us-liaison-bank" },
                  { name: "Premises License", href: "/contact-us-liaison-bank" },
                  { name: "PPL License", href: "/contact-us-liaison-bank" },
                  { name: "Novex License", href: "/contact-us-liaison-bank" },
                ]
              },
            ]
          },
          {
            name: "Healthcare",
            children: [
              {
                name: "Hospital, Clinic, Nursing Home",
                children: [
                  { name: "SMS - Bio medical waste", href: "/contact-us-liaison-bank" },
                  { name: "Clinic MPCB/BMW", href: "/contact-us-liaison-bank" },
                  { name: "MPCB Registration", href: "/contact-us-liaison-bank" },
                  { name: "Fire NOC", href: "/contact-us-liaison-bank" },
                  { name: "PCPNDT", href: "/contact-us-liaison-bank" },
                  { name: "MTP registration", href: "/contact-us-liaison-bank" },
                  { name: "Electrical audit certificate", href: "/contact-us-liaison-bank" },
                  { name: "Structural audit", href: "/contact-us-liaison-bank" },
                  { name: "Board sign", href: "/contact-us-liaison-bank" },
                  { name: "Weather shed permission", href: "/contact-us-liaison-bank" },
                  { name: "Change of user for clinics", href: "/contact-us-liaison-bank" },
                  { name: "Change of user for nursing home", href: "/contact-us-liaison-bank" },
                  { name: "NABH Certification", href: "/contact-us-liaison-bank" },
                ]
              }
            ]
          },
          {
            name: "Industrial and Manufacturer",
            children: [
              {
                name: "Textile, Colour Coating, Laundry, Factory",
                children: [
                  { name: "Factory license", href: "/contact-us-liaison-bank" },
                  { name: "Shop & establishment", href: "/contact-us-liaison-bank" },
                  { name: "Building & factory NOC", href: "/contact-us-liaison-bank" },
                  { name: "Fire compliance certificate", href: "/contact-us-liaison-bank" },
                  { name: "MOH license eating house", href: "/contact-us-liaison-bank" },
                  { name: "Sign board license", href: "/contact-us-liaison-bank" },
                ]
              }
            ]
          },
          {
            name: "Real Estate",
            children: [
              {
                name: "Building and construction",
                children: [
                  { name: "Labour permit", href: "/contact-us-liaison-bank" },
                  { name: "Contractor license", href: "/contact-us-liaison-bank" },
                  { name: "Mathadi registration", href: "/contact-us-liaison-bank" },
                ]
              }
            ]
          },
          {
            name: "Entertainment",
            children: [
              {
                name: "Gym, Club House, Events",
                children: [
                  { name: "Shop & establishment", href: "/contact-us-liaison-bank" },
                  { name: "Building & factory NOC", href: "/contact-us-liaison-bank" },
                  { name: "MOH license / Trade license", href: "/contact-us-liaison-bank" },
                  { name: "Police NOC", href: "/contact-us-liaison-bank" },
                  { name: "Staff fitness certificate", href: "/contact-us-liaison-bank" },
                ]
              }
            ]
          },
        ]
      },
      {
        name: "Liaisoning",
        items: [
          { 
            name: "Brihanmumbai Municipal Corporation (B.M.C)",
            children: [
              { name: "Building Proposal (342)", href: "/contact-us-liaison-bank" },
              { name: "Building Proposal - Miscellaneous", href: "/contact-us-liaison-bank" },
              { name: "Retail Unit Approval", href: "/contact-us-liaison-bank" },
              { name: "Building Proposal (337)", href: "/contact-us-liaison-bank" },
              { name: "Shop to Restaurant Conversion", href: "/contact-us-liaison-bank" },
              { name: "Floor Mill to Restaurant Conversion", href: "/contact-us-liaison-bank" },
              { name: "Shop to Clinic Conversion", href: "/contact-us-liaison-bank" },
            ]
          },
          { name: "Vasai-Virar Municipal Corporation (V.V.M.C)", href: "/contact-us-liaison-bank" },
          { name: "Kalyan-Dombivli Municipal Corporation (K.D.M.C)", href: "/contact-us-liaison-bank" },
          { name: "Thane Municipal Corporation (T.M.C)", href: "/contact-us-liaison-bank" },
          { name: "Maharashtra Housing and Area Development Authority (MHADA)", href: "/contact-us-liaison-bank" },
          { name: "Slum Rehabilitation Authority (S.R.A)", href: "/contact-us-liaison-bank" },
          { name: "Mumbai Metropolitan Region Development Authority (M.M.R.D.A)", href: "/contact-us-liaison-bank" },
          { 
            name: "Maharashtra Industrial Development Corporation (M.I.D.C)",
            children: [
              { name: "Building Proposal (342)", href: "/contact-us-liaison-bank" },
              { name: "Building Proposal - Miscellaneous", href: "/contact-us-liaison-bank" },
            ]
          },
          {
            name: "Maharashtra Pollution Control Board (M.P.C.B)",
            children: [
              { name: "Consent for Establishment", href: "/contact-us-liaison-bank" },
              { name: "Consent for Operate", href: "/contact-us-liaison-bank" },
              { name: "Consent for Renewal", href: "/contact-us-liaison-bank" },
            ]
          },
          { name: "Mumbai Port Trust (M.B.P.T)", href: "/contact-us-liaison-bank" },
          { name: "Navi Mumbai Municipal Corporation (N.M.M.C)", href: "/contact-us-liaison-bank" },
          { name: "Pune Mahanagar Co", href: "/contact-us-liaison-bank" },
          {
            name: "Collector",
            children: [
              { name: "Land Lease Renewal Approval", href: "/contact-us-liaison-bank" },
              { name: "Adjudication", href: "/contact-us-liaison-bank" },
              { name: "NOC for Approval and Completion", href: "/contact-us-liaison-bank" },
            ]
          },
          {
            name: "S.L.R",
            children: [
              { name: "Property Card Area Name Change", href: "/contact-us-liaison-bank" },
              { name: "Property Card Area Correction", href: "/contact-us-liaison-bank" },
            ]
          },
          { name: "D.D.L.R", href: "/contact-us-liaison-bank" },
          {
            name: "Mumbai Fire Department",
            children: [
              { name: "Fire NOC Approval and Completion", href: "/contact-us-liaison-bank" },
              { name: "Fire NOC for Regularization", href: "/contact-us-liaison-bank" },
              { name: "Fire NOC for Additional Alteration", href: "/contact-us-liaison-bank" },
            ]
          },
          { name: "Coastal Regulation Zone (CRZ)", href: "/contact-us-liaison-bank" },
          { name: "Mumbai Airport Authority of India (MAAI)", href: "/contact-us-liaison-bank" },
          { name: "R.&.F.M", href: "/contact-us-liaison-bank" },
          { name: "C.O.M", href: "/contact-us-liaison-bank" },
          { name: "N.V.M", href: "/contact-us-liaison-bank" },
          { name: "A.P.M", href: "/contact-us-liaison-bank" },
          { name: "M.I.D.C.M", href: "/contact-us-liaison-bank" },
          { name: "I.D.C", href: "/contact-us-liaison-bank" },
          { name: "P.W.D", href: "/contact-us-liaison-bank" },
          { name: "D.M", href: "/contact-us-liaison-bank" },
          {
            name: "Adani Power",
            children: [
              { name: "Name Change", href: "/contact-us-liaison-bank" },
              { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
              { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
              { name: "Changeover TATA to Adani", href: "/contact-us-liaison-bank" },
              { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
            ]
          },
          {
            name: "TATA Power",
            children: [
              { name: "Name Change", href: "/contact-us-liaison-bank" },
              { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
              { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
              { name: "Changeover Adani to TATA", href: "/contact-us-liaison-bank" },
              { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
            ]
          },
          {
            name: "M.S.E.D.C.L",
            children: [
              { name: "Name Change", href: "/contact-us-liaison-bank" },
              { name: "Residential to Commercial", href: "/contact-us-liaison-bank" },
              { name: "KW Load Increase", href: "/contact-us-liaison-bank" },
              { name: "Changeover Adani to Tata", href: "/contact-us-liaison-bank" },
              { name: "New Meter Connection", href: "/contact-us-liaison-bank" },
            ]
          }
        ]
      },
      { name: "Electrical (SITC)", href: "/contact-us-liaison-bank" },
      { name: "Fire & FAPA (SITC)", href: "/contact-us-liaison-bank" },
      { name: "PNG (SITC)", href: "/contact-us-liaison-bank" },
      { name: "Equipment Solution Department (ESD)", href: "/contact-us-liaison-bank" },
      { name: "Group Profile", href: "/group-profile" },
      { name: "Integrated Licensing & Compliance Solutions (ILCS)", href: "/contact-us-liaison-bank" },
      { name: "Integrated Liaisoning, Approvals & Compliance Solutions (ILACS)", href: "/contact-us-liaison-bank" },
    ]
  },
  { name: "Careers", href: "/careers-liaison-bank/" },
  { name: "Press Release", href: "/press-release-liaison-bank" },
  { name: "Contact Us", href: "/contact-us-liaison-bank" },
];

// ===== Helper Functions =====
const getChildren = (node) => {
  return node?.children || node?.submenu || node?.items || node?.projects || [];
};

const getIcon = (name) => {
  const iconKey = ICON_MAP[name] || "Default";
  return Icons[iconKey] || Icons.Default;
};

const getGradient = (name) => GRADIENT_MAP[name] || "linear-gradient(135deg, #636E72, #b2bec3)";

const countPages = (nodes) => {
  let count = 0;
  nodes.forEach(node => {
    if (node.href) count++;
    const children = getChildren(node);
    if (children.length > 0) {
      count += countPages(children);
    }
  });
  return count;
};

// ===== Main Component =====
export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [expandedItems, setExpandedItems] = useState({});

  // Memoized calculations
  const totalPages = useMemo(() => countPages(NAV_LINKS), []);
  const totalSections = NAV_LINKS.length;
  const directLinks = NAV_LINKS.filter(n => n.href).length;
  const servicesCount = NAV_LINKS.find(n => n.name === 'Our Services')?.submenu?.length || 0;

  // Memoized filter function
  const filterItems = useCallback((items, term) => {
    if (!term) return items;
    
    return items.filter(item => {
      const children = getChildren(item);
      const matchesName = item.name.toLowerCase().includes(term.toLowerCase());
      const matchesChildren = children.some(child => 
        child.name.toLowerCase().includes(term.toLowerCase()) ||
        getChildren(child).some(grandchild => 
          grandchild.name.toLowerCase().includes(term.toLowerCase())
        )
      );
      return matchesName || matchesChildren;
    });
  }, []);

  const filteredNavLinks = useMemo(() => 
    filterItems(NAV_LINKS, searchTerm), 
    [searchTerm, filterItems]
  );

  // Toggle expand
  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Stats data
  const stats = [
    { label: 'Main Sections', value: totalSections, icon: Icons.Stats.Sections },
    { label: 'Total Pages', value: totalPages, icon: Icons.Stats.Pages },
    { label: 'Direct Links', value: directLinks, icon: Icons.Stats.Links },
    { label: 'Services', value: servicesCount, icon: Icons.Services },
  ];

  // ===== Render Functions =====
  const renderIcon = (IconComponent, className = "") => {
    return (
      <span className={className}>
        <IconComponent />
      </span>
    );
  };

  const renderTreeItems = (items, level = 0, parentKey = '') => {
    return items.map((item, index) => {
      const children = getChildren(item);
      const key = `${parentKey}-${index}`;
      const hasChildren = children.length > 0;
      const IconComponent = getIcon(item.name);
      const isExpanded = expandedItems[key];

      if (!item.href && !hasChildren) return null;

      return (
        <div key={key} className={`tree-item level-${level}`}>
          <div className="tree-item-content">
            <div className="tree-item-left">
              {hasChildren && (
                <button 
                  className="tree-toggle"
                  onClick={() => toggleExpand(key)}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '−' : '+'}
                </button>
              )}
              {renderIcon(IconComponent, "tree-icon")}
              {item.href ? (
                <Link href={item.href} className="tree-link">
                  {item.name}
                </Link>
              ) : (
                <span className="tree-label">{item.name}</span>
              )}
              {hasChildren && (
                <span className="tree-count">{children.length}</span>
              )}
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="tree-children">
              {renderTreeItems(children, level + 1, key)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderGridView = () => (
    <div className="sitemap-grid">
      {filteredNavLinks.map((section, index) => {
        const children = getChildren(section);
        const gradient = getGradient(section.name);
        const IconComponent = getIcon(section.name);
        
        return (
          <div key={`grid-${index}`} className="sitemap-card">
            <div className="sitemap-card-header" style={{ background: gradient }}>
              <div className="sitemap-card-header-content">
                {renderIcon(IconComponent, "sitemap-card-icon")}
                <div>
                  <h3 className="sitemap-card-title">
                    {section.href ? (
                      <Link href={section.href}>{section.name}</Link>
                    ) : section.name}
                  </h3>
                  {children.length > 0 && (
                    <span className="sitemap-card-badge">
                      {children.length} items
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="sitemap-card-body">
              {children.length > 0 ? (
                <div>
                  {children.slice(0, 5).map((child, idx) => {
                    const childChildren = getChildren(child);
                    return (
                      <div key={`grid-child-${idx}`} className="sitemap-card-item">
                        {child.href ? (
                          <Link href={child.href} className="sitemap-card-link">
                            <span className="sitemap-card-link-icon">▸</span>
                            {child.name}
                            {childChildren.length > 0 && (
                              <span className="sitemap-card-item-count">
                                +{childChildren.length}
                              </span>
                            )}
                          </Link>
                        ) : (
                          <div className="sitemap-card-item-label">
                            <span className="sitemap-card-link-icon">▸</span>
                            {child.name}
                            {childChildren.length > 0 && (
                              <span className="sitemap-card-item-count">
                                +{childChildren.length}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {children.length > 5 && (
                    <div className="sitemap-card-more">
                      +{children.length - 5} more items
                    </div>
                  )}
                </div>
              ) : (
                <div className="sitemap-card-empty">
                  No sub-pages
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="sitemap-list">
      {filteredNavLinks.map((section, index) => {
        const children = getChildren(section);
        const IconComponent = getIcon(section.name);
        
        return (
          <div key={`list-${index}`} className="sitemap-list-item">
            <div className="sitemap-list-content">
              {renderIcon(IconComponent, "sitemap-list-icon")}
              <div className="sitemap-list-info">
                <div className="sitemap-list-name">
                  {section.href ? (
                    <Link href={section.href}>{section.name}</Link>
                  ) : section.name}
                </div>
                {children.length > 0 && (
                  <div className="sitemap-list-tags">
                    {children.slice(0, 8).map((child, idx) => (
                      <span key={`tag-${idx}`} className="sitemap-list-tag">
                        {child.name}
                      </span>
                    ))}
                    {children.length > 8 && (
                      <span className="sitemap-list-tag">
                        +{children.length - 8}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="sitemap-list-count">
                {children.length}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCompactView = () => (
    <div className="sitemap-compact">
      {filteredNavLinks.map((section, index) => {
        const children = getChildren(section);
        const IconComponent = getIcon(section.name);
        
        return (
          <div key={`compact-${index}`} className="sitemap-compact-item">
            {renderIcon(IconComponent, "sitemap-compact-icon")}
            {section.href ? (
              <Link href={section.href} className="sitemap-compact-name">
                {section.name}
              </Link>
            ) : (
              <span className="sitemap-compact-name">{section.name}</span>
            )}
            {children.length > 0 && (
              <div className="sitemap-compact-count">
                {children.length} items
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderTreeView = () => (
    <div className="sitemap-tree">
      <div className="tree-container">
        {filteredNavLinks.map((section, index) => {
          const children = getChildren(section);
          const IconComponent = getIcon(section.name);
          const key = `root-${index}`;
          const isExpanded = expandedItems[key];
          const hasChildren = children.length > 0;

          return (
            <div key={key} className="tree-root">
              <div className="tree-root-content">
                <div className="tree-root-left">
                  {hasChildren && (
                    <button 
                      className="tree-toggle root-toggle"
                      onClick={() => toggleExpand(key)}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? '−' : '+'}
                    </button>
                  )}
                  {renderIcon(IconComponent, "tree-icon root-icon")}
                  {section.href ? (
                    <Link href={section.href} className="tree-link root-link">
                      {section.name}
                    </Link>
                  ) : (
                    <span className="tree-label root-label">{section.name}</span>
                  )}
                  {hasChildren && (
                    <span className="tree-count root-count">{children.length}</span>
                  )}
                </div>
              </div>
              {hasChildren && isExpanded && (
                <div className="tree-children root-children">
                  {renderTreeItems(children, 1, key)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ===== Main Render =====
  return (
    <div className="sitemap-container">
      {/* Header Hero */}
      <div className="sitemap-hero">
        <div className="sitemap-hero-content">
          <div className="sitemap-hero-left">
            <span className="sitemap-hero-icon">🗺️</span>
            <div>
              <h1 className="sitemap-hero-title">Site Map</h1>
              <p className="sitemap-hero-subtitle">
                {totalSections} sections • {totalPages} pages
              </p>
            </div>
          </div>

          <div className="sitemap-hero-controls">
            {/* View Toggle */}
            <div className="sitemap-view-toggle">
              {[ 'list', 'compact', 'tree'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`sitemap-view-btn ${viewMode === mode ? 'active' : ''}`}
                  aria-label={`Switch to ${mode} view`}
                >
                  {mode === 'grid' ? '📊' : mode === 'list' ? '📋' : mode === 'compact' ? '📌' : '🌳'} {mode}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="sitemap-search">
              <span className="sitemap-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sitemap-search-input"
                aria-label="Search sitemap"
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="sitemap-stats">
          {stats.map((stat, idx) => (
            <div key={`stat-${idx}`} className="sitemap-stat-item">
              <span className="sitemap-stat-icon">
                <stat.icon />
              </span>
              <div>
                <div className="sitemap-stat-value">{stat.value}</div>
                <div className="sitemap-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
          {searchTerm && (
            <div className="sitemap-stat-item">
              <span className="sitemap-stat-icon" aria-hidden="true">🔍</span>
              <div>
                <div className="sitemap-stat-value sitemap-stat-match">
                  {filteredNavLinks.length}
                </div>
                <div className="sitemap-stat-label">Matches</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'compact' && renderCompactView()}
      {viewMode === 'tree' && renderTreeView()}

    
    </div>
  );
}