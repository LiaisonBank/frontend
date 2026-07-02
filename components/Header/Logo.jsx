
"use client";

import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/images/company/logo.png";
import name from "@/assets/images/company/name.png";
import whitename from "@/assets/images/company/whitename.png";

export default function Logo({
  isMobileMenuOpen,
  onNavigate,
}) {
  return (
    <div className="flex-shrink-0">
      <Link
        href="/"
        onClick={() => onNavigate("/")}
        className="brand-logo d-flex align-items-center"
        aria-label="Liaisonbank Home"
      >
        <Image
          src={logo}
          alt="Liaisonbank Logo"
          title="Liaisonbank"
          width={68}
          priority
          className="lg-1 me-2"
        />

        <Image
          src={isMobileMenuOpen ? whitename : name}
          alt="Liaisonbank"
          title="Liaisonbank"
          width={101}
          priority
          className="lg-2"
        />
      </Link>
    </div>
  );
}

