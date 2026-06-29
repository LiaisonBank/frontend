// DesktopMenu.jsx
"use client";

import NavItem from "./NavItem";

export default function DesktopMenu({
  navLinks,
  activeMegaMenu,
  openMegaMenu,
  closeMegaMenu,
  handleNavigation,
  handleMegaScroll,
}) {
  return (
    <div className="menu xl:flex hidden">
      <ul className="flex space-x-8">
        {navLinks.map((link, index) => (
          <NavItem
            key={link.name}
            link={link}
            index={index}
            activeMegaMenu={activeMegaMenu}
            openMegaMenu={openMegaMenu}
            closeMegaMenu={closeMegaMenu}
            handleNavigation={handleNavigation}
            handleMegaScroll={handleMegaScroll}
          />
        ))}
      </ul>
    </div>
  );
}