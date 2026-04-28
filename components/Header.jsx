"use client"

import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import logoScrolled from "@/assets/images/logo_grey.png"
import { navLinks } from '@/lib/data/menus';
import pdfIcon from "@/public/pdf_icon.png";
import { ChevronDown } from 'react-bootstrap-icons';


export default function Header() {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Mobile SUbmenu
  const [isScrolled, setIsScrolled] = useState(false);
 
  
  const handleMegaScroll = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      <header className={`fixed w-full z-50 py-2 transition-all ${isSticky ? "" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <nav key={pathname} className="flex items-center justify-between h-16">

            {/* LOGO: Left to Right Animation */}
            <div data-aos="fade-right" data-aos-duration="1000" data-aos-anchor="html">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src={logoScrolled}
                  width={150}
                  title="Liaisonbank"
                  alt="Liaisonbank"
                  priority
                />
              </Link>
            </div>

            <div className="hidden xl:flex">
              <ul className="flex space-x-8">
                {navLinks.map((link, index) => {
                  const hasSubmenu = link.submenu && link.submenu.length > 0;
                  return (
                    <li
                      key={link.name}
                      className={`${hasSubmenu ? "has-submenu" : ""}`}
                      // onMouseEnter={() => hasSubmenu && setMenuOpen(true)}
                      // onMouseLeave={() => hasSubmenu && setMenuOpen(false)}
                    >
                      {link.href ? (
                        <Link href={link.href} 
                          data-aos="fade-left"
                          data-aos-delay={index * 100}
                          data-aos-duration="800"
                        >
                          {link.name}
                          
                        </Link>
                      ) : (
                        <span
                          className="cursor-pointer"
                          data-aos="fade-left"
                          data-aos-delay={index * 100}
                          data-aos-duration="800"
                        >
                          {link.name}
                          {hasSubmenu &&  <ChevronDown color="black" size={16} />}
                        </span>
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
                                                      <Link href={child.href || "#"}>{child.name}</Link>
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
                                        download
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
        <div className={`fixed top-0 right-0 h-full w-100 shadow-lg transform transition-transform duration-300
                  ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div
            id="myNav"
            className="overlay"
            style={{ width: isOpen ? "100%" : "0%" }}
          >
            <div className="overlay-content">
              <ul className="submenu flex flex-col pt-4 px-4 space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block font-medium"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          setOpenSubmenu(
                            openSubmenu === link.name ? null : link.name
                          )
                        }
                        className="flex justify-between w-full font-medium"
                      >
                        {link.name}
                        <span>
                          {openSubmenu === link.name ? "-" : "+"}
                        </span>
                      </button>
                    )}

                    {link.submenu && openSubmenu === link.name && (
                      <ul className="mt-2 ml-4 space-y-2">
                        {link.submenu.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              onClick={() => setIsOpen(false)}
                              className="block text-sm text-gray-600"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>   
    </>
  )
}