"use client";

import Link from "next/link";
import Image from "next/image";
import pdfIcon from "@/public/pdf_icon.png";

export default function MegaMenuItem({ item }) {

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="mega-item">

      <div className="mega-link-row">
        {item.href ? (
          <Link href={item.href}>{item.name}</Link>
        ) : (
          <span>{item.name}</span>
        )}

        {item.pdf && (
          <a href={item.pdf} target="_blank" download className="pdf-download">
            <Image src={pdfIcon} alt="PDF" width={16} height={16} />
          </a>
        )}
      </div>

      {hasChildren && (
        <div className="mega-children">
          {item.children.map((child) => (
            <MegaMenuItem key={child.name} item={child} />
          ))}
        </div>
      )}

    </div>
  );
}