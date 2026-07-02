"use client"

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
// import logoScrolled from "@/assets/images/logo_grey.png"
import logo from "@/assets/images/company/logo.png";
import name from "@/assets/images/company/name.png";
import whitename from "@/assets/images/company/whitename.png";
import { navLinks } from '@/lib/data/menus';
import pdfIcon from "@/public/pdf_icon.png";
import { ChevronDown } from 'react-bootstrap-icons';
import NewLauncb from "@/components/NewLaunch";
import NavText from "@/components/NavReusable/NavText";



export default function Header() {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Mobile SUbmenu
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

    
  const handleMegaScroll = (e) => {
    e.stopPropagation();
  };
  const handleNavigation = (href) => {
    setActiveMegaMenu(null);
    setIsOpen(false);
    setOpenSubmenu(null);
    
    if (pathname === href) {
     window.location.reload();
     return;
    }

    router.push(href);
  };
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const renderMenu = (items, level = 0) => {
  return (
    <ul className={level > 0 ? "px-4" : "mobilesubmenu row"}>
      {items.map((item) => {
        const children =
          item.submenu ||
          item.projects ||
          item.items ||
          item.children;

        const menuKey = `${level}-${item.name}`;

        return (
          <li key={menuKey}>
            <div className="flex items-center justify-between">
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="flex-1">
                  {item.name}
                </span>
              )}

              {children && (
                <button
                  onClick={() => toggleMenu(menuKey)}
                  className="ml-2"
                >
                  {openMenus[menuKey] ? "-" : "+"}
                </button>
              )}
            </div>

            {children &&
              openMenus[menuKey] &&
              renderMenu(children, level + 1)}
          </li>
        );
      })}
    </ul>
  );
};
  return (
    <>
      <header className={`fixed w-full z-50 py-2 transition-all ${isSticky ? "" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <nav key={pathname} className="flex items-center justify-between h-16">

            {/* LOGO: Left to Right Animation */}
            <div>
              <Link href="/" onClick={() => setIsOpen(false)} className='d-flex align-items-center '>
                {/* <Image
                  src={logoScrolled}
                  width={160}
                  title="Liaisonbank"
                  alt="Liaisonbank"
                  priority
                /> */}
                 <Image
                  src={logo}
                  width={68}
                  title="Liaisonbank"
                  alt="Liaisonbank"
                  className='lg-1 mr-2'
                  priority
                />
                 <Image
                  src={isOpen ? whitename : name}
                  // src={name}
                  width={101}
                  title="Liaisonbank"
                  alt="Liaisonbank"
                  className='lg-2'
                  priority
                />
              </Link>
            </div>

            <div className="menu xl:flex">
              <ul className="flex space-x-8">
                {navLinks.map((link, index) => {
                  const singleSubmenu = link.projects && link.projects.length > 0;
                  const hasSubmenu = link.submenu && link.submenu.length > 2;
                  return (
                    <li
                      key={link.name}
                       className={`
                        ${hasSubmenu ? "has-submenu" : ""}
                        ${singleSubmenu ? "has-single-submenu" : ""}
                      `}
                      onMouseEnter={() => setActiveMegaMenu(link.name)}
                      onMouseLeave={() => setActiveMegaMenu(null)}
                      // onMouseEnter={() => hasSubmenu && setMenuOpen(true)}
                      // onMouseLeave={() => hasSubmenu && setMenuOpen(false)}
                    >
                      {link.href ? (
                       <Link
                          href={link.href}
                          
                           onClick={(e) => {
                            handleNavigation(link.href);
                          }}
                          className="nav-link"
                        >
                          <NavText text={link.name} />
                        </Link>
                      ) : (
                        <span className="nav-link cursor-pointer flex items-center gap-1">
                          <NavText text={link.name} />
                          {(hasSubmenu || singleSubmenu) && (
                            <ChevronDown
                              size={16}
                              className="nav-arrow"
                            />
                          )}
                        </span>
                      )}
                      {singleSubmenu && (
                        <div
                          // className={`mega-menu ${menuOpen ? "active" : ""}`}
                          className={`mega-menu ${activeMegaMenu === link.name ? "active" : ""  }`}
                          onWheel={handleMegaScroll}
                          onTouchMove={(e) => e.stopPropagation()}
                          onScroll={(e) => e.stopPropagation()}
                        >
                          <div className="mega-menu-inner container">
                            {link.projects?.map((project) => (
                              <Link
                                key={project.href}
                                href={project.href}
                                title={project.title}
                                className="mega-menu-item"
                              >
                                {project.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {hasSubmenu && (
                        <div className={`mega-menu ${menuOpen ? "active" : ""}`}
                          onWheel={handleMegaScroll}
                          onTouchMove={(e) => e.stopPropagation()}
                          onScroll={(e) => e.stopPropagation()} // 🔥 extra safety
                          >
                          <div className="mega-menu-inner container">

                            {/* TOP CARDS */}
                            <div className="mega-top">
                              {link.submenu
                                .filter((sub) => sub.items)
                                .map((sub) => {
                                  const isLargeList = sub.items.length > 4;
                                  return (
                                    <div key={sub.name} className="mega-card">
                                      <h4 className="mega-title">
                                        <Link href={sub.href || "#"}>{sub.name}</Link> 
                                        <Link
                                          href={sub.pdf}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="pdf-download"
                                        >
                                          <Image
                                            src={pdfIcon}
                                            alt="Download PDF"
                                            width={16}
                                            height={16}
                                          />
                                        </Link>
                                      </h4>
                                      <ul className={`mega-section ${isLargeList ? "has-more" : ""}`}>
                                          {sub?.items?.map((item, index) => (
                                            <li
                                              key={item.name || index}
                                              className={`mega-item ${item.children ? "has-child" : ""}`}
                                            >
                                                <Link href={item?.href || "#"} className="mega-link">
                                                  <span>{item?.name}</span>
                                                </Link>

                                                {/* {item?.pdf && (
                                                  <a
                                                    href={item.pdf}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="pdf-download"
                                                  >
                                                    <Image src={pdfIcon} alt="Download PDF" width={16} height={16} />
                                                  </a>
                                                )} */}

                                              {/* SUBMENU */}
                                              {item?.children && (
                                                <ul className="mega-submenu">
                                                  {item.children.map((child, i) => (
                                                    <li key={i} 
                                                    className={`mega-item ${child?.children ? "has-child2" : ""}`}>
                                                      <Link href={child.href || "#"} >{child.name}</Link>
                                                        {/* THIRD LEVEL CHILDREN */}
                                                        {child?.children && (
                                                          <ul className="mega-submenu-level2">
                                                            {child.children.map((subChild, j) => (
                                                              <li key={j}>
                                                                <Link href={subChild?.href || "#"}>
                                                                  {subChild?.name}
                                                                </Link>
                                                              </li>
                                                            ))}
                                                          </ul>
                                                        )}
                                                    </li>
                                                  ))}
                                                </ul>
                                              )}
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  )
                                })}
                            </div>

                            {/* BOTTOM GRID */}
                            <div className="mega-bottom">
                              {link.submenu
                                .filter((sub) => !sub.items)
                                .map((sub) => (
                                  <div key={sub.name} className="mega-bottom-item">
                                    <Link href={sub.href || "#"} className="mega-bottom-link">
                                      {sub.name}
                                    </Link>
                                    {sub.pdf && (
                                      <a
                                        href={sub.pdf}
                                        target="_blank"
                                        className="pdf-download"
                                      >
                                        <Image
                                          src={pdfIcon}
                                          alt="Download PDF"
                                          width={16}
                                          height={16}
                                        />
                                      </a>
                                    )}

                                  </div>
                                ))}
                            </div>

                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <button
              className={`hamburger xl:hidden ${isOpen ? "active" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation remains standard transform for performance */}
        <div  id="myNav" className={`fixed top-0 right-0 h-screen w-full  shadow-xl transition-transform duration-300 
         ${isOpen ? "menu-open translate-x-0" : "translate-x-full"}`}
      >
  <div className="overflow-y-auto w-full h-full">
            <div className="overlay-content container ">
               {renderMenu(navLinks)}
               
            </div>
          </div>
        </div>
      </header> 
        {/* Marquee */}
      <div className="container-fluid theme-bg d-none">
        <div className="row theme-bg">
          <div className="marquee-branch flex items-center bg-white justify-between">
            <div className="comingsoontitle pl-4 w-1/3">
              <p>Our new branch is opening soon</p>
              <div className="arrow arrow-right"></div>
            </div>
            <div className="location">
              <NewLauncb />
            </div>
          </div>
        </div>
      </div>  
    </>
  )
}