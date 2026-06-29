// NavItem.jsx
"use client";

import Link from "next/link";
import { ChevronDown } from "react-bootstrap-icons";
import NavText from "@/components/NavReusable/NavText";
import MegaMenu from "./MegaMenu";
import SingleSubMenu from "./SingleSubMenu";

export default function NavItem({
  link,
  index,
  activeMegaMenu,
  openMegaMenu,
  closeMegaMenu,
  handleNavigation,
  handleMegaScroll,
}) {
  const hasProjects = link.projects?.length > 0;
  const hasMegaMenu = link.submenu?.length > 0;

  return (
    <li
      className={[
        hasMegaMenu ? "has-submenu" : "",
        hasProjects ? "has-single-submenu" : "",
      ].join(" ")}
      onMouseEnter={() =>
        (hasMegaMenu || hasProjects) &&
        openMegaMenu(link.name)
      }
      onMouseLeave={closeMegaMenu}
    >
      {link.href ? (
        <Link
          href={link.href}
          className="nav-link"
          data-aos="fade-left"
          data-aos-delay={index * 100}
          data-aos-duration="800"
          onClick={() => handleNavigation(link.href)}
        >
          <NavText text={link.name} />
        </Link>
      ) : (
        <span
          className="nav-link cursor-pointer flex items-center gap-1"
          data-aos="fade-left"
          data-aos-delay={index * 100}
          data-aos-duration="800"
        >
          <NavText text={link.name} />

          {(hasMegaMenu || hasProjects) && (
            <ChevronDown
              size={16}
              className="nav-arrow"
            />
          )}
        </span>
      )}

      {hasProjects && (
        <SingleSubMenu
          projects={link.projects}
          active={activeMegaMenu === link.name}
        />
      )}

      {hasMegaMenu && (
        <MegaMenu
          submenu={link.submenu}
          active={activeMegaMenu === link.name}
          handleMegaScroll={handleMegaScroll}
          handleNavigation={handleNavigation}
        />
      )}
    </li>
  );
}