"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "react-bootstrap-icons";

import logo from "@/assets/images/company/logo.png";
import name from "@/assets/images/company/name.png";
import whitename from "@/assets/images/company/whitename.png";

import { navLinks } from "@/lib/data/menus";

import pdfIcon from "@/public/pdf_icon.png";

import NewLauncb from "@/components/NewLaunch";
// import NavText from "@/components/NavReusable/NavText";

import { useModal } from "@/context/ModalContext";

/* ============================================================================
   MOBILE MENU ITEM
   ============================================================================ */

function MobileMenuItems({
  items,
  level = 0,
  openMenus,
  onToggle,
  onNavigate,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <ul
      className={
        level > 0
          ? "px-4"
          : "mobilesubmenu row"
      }
    >
      {items.map((item, index) => {
        if (!item) {
          return null;
        }

        const children =
          item.submenu ||
          item.projects ||
          item.items ||
          item.children;

        const hasChildren =
          Array.isArray(children) &&
          children.length > 0;

        const menuKey = `${level}-${item.name}-${index}`;

        const isExpanded =
          Boolean(openMenus[menuKey]);

        const handleClick = () => {
          if (hasChildren) {
            onToggle(menuKey);
            return;
          }

          onNavigate(item);
        };

        return (
          <li key={menuKey}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={handleClick}
            >
              <span className="flex-1">
                {item.name}
              </span>

              {hasChildren && (
                <span
                  className="ml-2 text-lg font-medium"
                  aria-hidden="true"
                >
                  {isExpanded ? "-" : "+"}
                </span>
              )}
            </div>

            {hasChildren && isExpanded && (
              <MobileMenuItems
                items={children}
                level={level + 1}
                openMenus={openMenus}
                onToggle={onToggle}
                onNavigate={onNavigate}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ============================================================================
   HEADER
   ============================================================================ */

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { setServiceModalOpen } = useModal();

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  /* --------------------------------------------------------------------------
     Refs
     -------------------------------------------------------------------------- */

  const megaCloseTimerRef = useRef(null);

  /* --------------------------------------------------------------------------
     Mega Menu Timer Cleanup
     -------------------------------------------------------------------------- */

const clearMegaCloseTimer = useCallback(() => {
  if (megaCloseTimerRef.current) {
    clearTimeout(megaCloseTimerRef.current);
    megaCloseTimerRef.current = null;
  }
}, []);

  /* --------------------------------------------------------------------------
     Open Mega Menu
     -------------------------------------------------------------------------- */
const openMegaMenu = useCallback(
  (menuName) => {
    clearMegaCloseTimer();

    setActiveMegaMenu(menuName);

    setServiceModalOpen(
      menuName === "Our Services",
    );
  },
  [clearMegaCloseTimer, setServiceModalOpen],
);



  /* --------------------------------------------------------------------------
     Close Mega Menu
     -------------------------------------------------------------------------- */

  const closeMegaMenu = useCallback(() => {
    clearMegaCloseTimer();

    megaCloseTimerRef.current =
      window.setTimeout(() => {
        setActiveMegaMenu(null);
        setServiceModalOpen(false);

        megaCloseTimerRef.current = null;
      }, 80);
  }, [
    clearMegaCloseTimer,
    setServiceModalOpen,
  ]);


useEffect(() => {
  return () => {
    clearMegaCloseTimer();
  };
}, [clearMegaCloseTimer]);


  /* --------------------------------------------------------------------------
     Close Everything
     -------------------------------------------------------------------------- */

  const closeAllMenus = useCallback(() => {
    clearMegaCloseTimer();

    setActiveMegaMenu(null);
    setServiceModalOpen(false);
  }, [
    clearMegaCloseTimer,
    setServiceModalOpen,
  ]);

  /* --------------------------------------------------------------------------
     Navigation
     -------------------------------------------------------------------------- */

  const handleNavigation = useCallback(
    (href) => {
      if (!href) {
        return;
      }

      closeAllMenus();

      setIsOpen(false);

      router.push(href);
    },
    [closeAllMenus, router],
  );

  /* --------------------------------------------------------------------------
     Mobile Toggle
     -------------------------------------------------------------------------- */

  const toggleMobileMenu = useCallback(
    (key) => {
      setOpenMenus((previous) => ({
        ...previous,
        [key]: !previous[key],
      }));
    },
    [],
  );

  /* --------------------------------------------------------------------------
     Mobile Navigation
     -------------------------------------------------------------------------- */

  const handleMobileNavigation = useCallback(
    (item) => {
      if (!item) {
        return;
      }

      if (item.name === "Our Services") {
        setIsOpen(false);
        closeAllMenus();

        router.push("/ourservices");

        return;
      }

      if (!item.href) {
        return;
      }

      setIsOpen(false);
      closeAllMenus();

      router.push(item.href);
    },
    [closeAllMenus, router],
  );

  /* --------------------------------------------------------------------------
     Mega Menu Scroll
     -------------------------------------------------------------------------- */

  const handleMegaWheel = useCallback(
    (event) => {
      event.stopPropagation();
    },
    [],
  );

  const handleMegaTouchMove = useCallback(
    (event) => {
      event.stopPropagation();
    },
    [],
  );

  const handleMegaScroll = useCallback(
    (event) => {
      event.stopPropagation();
    },
    [],
  );

  /* --------------------------------------------------------------------------
     Render
     -------------------------------------------------------------------------- */

  return (
    <>
      {/* ======================================================================
          HEADER
          ====================================================================== */}

      <header
        className={`fixed w-full z-50 py-2 transition-all ${
          isSticky ? "is-sticky" : ""
        }`}
      >
        <div className="container-fluid mx-auto">
          <nav
            key={pathname}
            className="flex items-center justify-between h-16"
          >
            {/* ================================================================
                LOGO
                ================================================================ */}

            <div>
              <Link
                href="/"
                onClick={() => {
                  setIsOpen(false);
                  closeAllMenus();
                }}
                className="d-flex align-items-center"
              >
                <Image
                  src={logo}
                  width={68}
                  title="Liaisonbank"
                  alt="Liaisonbank"
                  className="lg-1 mr-2"
                  priority
                />

                <Image
                  src={isOpen ? whitename : name}
                  width={101}
                  title="Liaisonbank"
                  alt="Liaisonbank"
                  className="lg-2"
                  priority
                />
              </Link>
            </div>

            {/* ================================================================
                DESKTOP NAVIGATION
                ================================================================ */}

            <div className="menu xl:flex">
              <ul className="flex space-x-8">
                {Array.isArray(navLinks) &&
                  navLinks.map((link) => {
                    if (!link) {
                      return null;
                    }

                    const hasSubmenu =
                      Array.isArray(link.submenu) &&
                      link.submenu.length > 2;

                    const isActive =
                      activeMegaMenu === link.name;

                    return (
                      <li
                        key={link.name}
                        className={[
                          hasSubmenu
                            ? "has-submenu"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onMouseEnter={() =>
                          openMegaMenu(link.name)
                        }
                        onMouseLeave={
                          hasSubmenu
                            ? closeMegaMenu
                            : undefined
                        }
                      >
                        {/* ======================================================
                            NAV ITEM
                            ====================================================== */}

                        {link.name ===
                        "Our Services" ? (
                          <button
                            type="button"
                            className="nav-link bg-transparent border-0 cursor-pointer flex items-center gap-1"
                            aria-haspopup="true"
                            aria-expanded={isActive}
                          >
                            {/* <NavText
                              text={link.name}
                            /> */}
                            {link.name}
                            <ChevronDown
                              size={16}
                              className="nav-arrow"
                              aria-hidden="true"
                            />
                          </button>
                        ) : link.href ? (
                          <button
                            type="button"
                            className="nav-link bg-transparent border-0 cursor-pointer"
                            onClick={() =>
                              handleNavigation(
                                link.href,
                              )
                            }
                          >
                            {/* <NavText
                              text={link.name}
                            /> */}
                            {link.name}
                          </button>
                        ) : (
                          <span className="nav-link cursor-pointer flex items-center gap-1">
                            {/* <NavText
                              text={link.name}
                            /> */}
                            {link.name}

                            {hasSubmenu && (
                              <ChevronDown
                                size={16}
                                className="nav-arrow"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        )}

                        {/* ======================================================
                            MEGA MENU
                            ====================================================== */}

                        {hasSubmenu && (
                          <div
                            className={`mega-menu ${
                              isActive
                                ? "active"
                                : ""
                            }`}
                            aria-hidden={!isActive}
                            onWheel={
                              handleMegaWheel
                            }
                            onTouchMove={
                              handleMegaTouchMove
                            }
                            onScroll={
                              handleMegaScroll
                            }
                          >
                            <div className="mega-menu-inner container">
                              {/* ==================================================
                                  TOP CARDS
                                  ================================================== */}

                              <div className="mega-top">
                                {link.submenu
                                  .filter(
                                    (sub) =>
                                      Array.isArray(
                                        sub.items,
                                      ),
                                  )
                                  .map((sub) => {
                                    const isLargeList =
                                      sub.items.length >
                                      4;

                                    return (
                                      <div
                                        key={
                                          sub.name
                                        }
                                        className="mega-card"
                                      >
                                        {/* ======================================
                                            TITLE
                                            ====================================== */}

                                        <h4 className="mega-title">
                                          <button
                                            type="button"
                                            className="bg-transparent border-0 p-0 cursor-pointer"
                                            onClick={() =>
                                              handleNavigation(
                                                sub.href ||
                                                  "/",
                                              )
                                            }
                                          >
                                            {
                                              sub.name
                                            }
                                          </button>

                                          {sub.pdf && (
                                            <a
                                              href={
                                                sub.pdf
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="pdf-download"
                                              aria-label={`Download ${sub.name} PDF`}
                                              onClick={(
                                                event,
                                              ) =>
                                                event.stopPropagation()
                                              }
                                            >
                                              <Image
                                                src={
                                                  pdfIcon
                                                }
                                                alt=""
                                                width={
                                                  16
                                                }
                                                height={
                                                  16
                                                }
                                              />
                                            </a>
                                          )}
                                        </h4>

                                        {/* ======================================
                                            FIRST LEVEL
                                            ====================================== */}

                                        <ul
                                          className={`mega-section ${
                                            isLargeList
                                              ? "has-more"
                                              : ""
                                          }`}
                                        >
                                          {sub.items.map(
                                            (
                                              item,
                                              index,
                                            ) => (
                                              <li
                                                key={
                                                  item.name ||
                                                  index
                                                }
                                                className={`mega-item ${
                                                  item.children
                                                    ? "has-child"
                                                    : ""
                                                }`}
                                              >
                                                <button
                                                  type="button"
                                                  className="mega-link bg-transparent border-0 cursor-pointer"
                                                  onClick={() =>
                                                    handleNavigation(
                                                      item.href ||
                                                        "/",
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    {
                                                      item.name
                                                    }
                                                  </span>
                                                </button>

                                                {/* ==================================
                                                    SECOND LEVEL
                                                    ================================== */}

                                                {Array.isArray(
                                                  item.children,
                                                ) &&
                                                  item
                                                    .children
                                                    .length >
                                                    0 && (
                                                    <ul className="mega-submenu">
                                                      {item.children.map(
                                                        (
                                                          child,
                                                          childIndex,
                                                        ) => (
                                                          <li
                                                            key={
                                                              child.name ||
                                                              childIndex
                                                            }
                                                            className={`mega-item ${
                                                              child.children
                                                                ? "has-child2"
                                                                : ""
                                                            }`}
                                                          >
                                                            <button
                                                              type="button"
                                                              className="bg-transparent border-0 cursor-pointer"
                                                              onClick={() =>
                                                                handleNavigation(
                                                                  child.href ||
                                                                    "/",
                                                                )
                                                              }
                                                            >
                                                              {
                                                                child.name
                                                              }
                                                            </button>

                                                            {/* ==============================
                                                                THIRD LEVEL
                                                                ============================== */}

                                                            {Array.isArray(
                                                              child.children,
                                                            ) &&
                                                              child
                                                                .children
                                                                .length >
                                                                0 && (
                                                                <ul className="mega-submenu-level2">
                                                                  {child.children.map(
                                                                    (
                                                                      subChild,
                                                                      subChildIndex,
                                                                    ) => (
                                                                      <li
                                                                        key={
                                                                          subChild.name ||
                                                                          subChildIndex
                                                                        }
                                                                      >
                                                                        <button
                                                                          type="button"
                                                                          className="bg-transparent border-0 cursor-pointer"
                                                                          onClick={() =>
                                                                            handleNavigation(
                                                                              subChild.href ||
                                                                                "/",
                                                                            )
                                                                          }
                                                                        >
                                                                          {
                                                                            subChild.name
                                                                          }
                                                                        </button>
                                                                      </li>
                                                                    ),
                                                                  )}
                                                                </ul>
                                                              )}
                                                          </li>
                                                        ),
                                                      )}
                                                    </ul>
                                                  )}
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* ==================================================
                                  BOTTOM GRID
                                  ================================================== */}

                              <div className="mega-bottom">
                                {link.submenu
                                  .filter(
                                    (sub) =>
                                      !Array.isArray(
                                        sub.items,
                                      ),
                                  )
                                  .map((sub) => (
                                    <div
                                      key={sub.name}
                                      className="mega-bottom-item"
                                    >
                                      <button
                                        type="button"
                                        className="mega-bottom-link bg-transparent border-0 cursor-pointer"
                                        onClick={() =>
                                          handleNavigation(
                                            sub.href ||
                                              "/",
                                          )
                                        }
                                      >
                                        {sub.name}
                                      </button>

                                      {sub.pdf && (
                                        <a
                                          href={sub.pdf}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="pdf-download"
                                          aria-label={`Download ${sub.name} PDF`}
                                          onClick={(
                                            event,
                                          ) =>
                                            event.stopPropagation()
                                          }
                                        >
                                          <Image
                                            src={
                                              pdfIcon
                                            }
                                            alt=""
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
                    );
                  })}
              </ul>
            </div>

            {/* ================================================================
                HAMBURGER
                ================================================================ */}

            <button
              type="button"
              className={`hamburger xl:hidden ${
                isOpen ? "active" : ""
              }`}
              onClick={() => {
                setIsOpen((previous) => !previous);

                closeAllMenus();
              }}
              aria-label={
                isOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="myNav"
            >
              <span />
              <span />
            </button>
          </nav>
        </div>

        {/* ======================================================================
            MOBILE NAVIGATION
            ====================================================================== */}

        <div
          id="myNav"
          className={`fixed top-0 right-0 h-screen w-full shadow-xl transition-transform duration-300 ${
            isOpen
              ? "menu-open translate-x-0"
              : "translate-x-full"
          }`}
          aria-hidden={!isOpen}
        >
          <div className="overflow-y-auto w-full h-full">
            <div className="overlay-content container">
              <MobileMenuItems
                items={navLinks}
                openMenus={openMenus}
                onToggle={toggleMobileMenu}
                onNavigate={handleMobileNavigation}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================
          MARQUEE
          ======================================================================== */}

      <div className="container-fluid theme-bg d-none">
        <div className="row theme-bg">
          <div className="marquee-branch flex items-center bg-white justify-between">
            <div className="comingsoontitle pl-4 w-1/3">
              <p>
                Our new branch is opening soon
              </p>

              <div className="arrow arrow-right" />
            </div>

            <div className="location">
              <NewLauncb />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}