import React from "react";
import Link from "next/link";

const Box = ({ children, className = "" }) => (
  <div className={`box ${className}`}>{children}</div>
);

// 🔁 Recursive renderer with unique class + full link wrapping
const RenderItems = ({ items, depth = 0, maxDepth = 2, parentKey = "" }) => {
  if (!items || depth > maxDepth) return null;

  return (
    <div className={`list depth-${depth} parent-${parentKey} ${depth === 0 ? "block" : "hidden group-hover:block"}`}>
      {items.map((item, i) => {
        const uniqueClass = `${parentKey}-item-${i}`;

        return (
          <div key={i} className={`item-group ${uniqueClass}`}>
            <Link href={item.href || "#"} className="block">
              <Box className={depth === 0 ? "block" : "hidden group-hover:block"}>
                {item.name}
              </Box>
            </Link>

            {/* children support */}
            {(item.children || item.items) && (
              <RenderItems
                items={item.children || item.items}
                depth={depth + 1}
                maxDepth={maxDepth}
                parentKey={uniqueClass}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function SitemapDiagram({ navLinks }) {
  const home = navLinks.find((x) => x.name === "Home");

  const leftLinks = navLinks.filter((x) =>
    [
      "About Us",
      "Completed",
      "On Going",
      "Press Release",
      "Contact Us",
    ].includes(x.name)
  );
  const EXTRA_MENU = [
  "CEO's Desk",
  "Testimonials",
  "Privacy Policy",
  "Terms & Conditions",
];

const extraLinks = EXTRA_MENU.map((name) => {
  const item = navLinks.find((x) => x.name === name);

  return (
    item || {
      name,
      href: `/${name
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/\s+/g, "-")}`,
      isStatic: true,
    }
  );
});

  const services = navLinks.find((x) => x.name === "Our Services");

  const amc = services?.submenu?.find((x) => x.name === "AMC");
  const licensing = services?.submenu?.find((x) => x.name === "Licensing");
  const liaisoning = services?.submenu?.find((x) => x.name === "Liaisoning");

  const sitc = services?.submenu?.filter((x) =>
    [
      "Fire ( SITC )",
      "Electrical ( SITC )",
      "PNG ( SITC )",
      "Equipment Solution Department ( ESD )",
    ].includes(x.name)
  );

  return (
    <div className="sitemap">
      {/* HOME */}
      <div className="top col-3 mx-auto">
        <Box className="home">
          <Link href={home?.href || "/"}>{home?.name}</Link>
        </Box>
      </div>

      <div className="level top-row">
        {/* LEFT */}
        <div className="column">
          {leftLinks.map((item, i) => (
            <Box key={i} className="main">
              <Link href={item.href}>{item.name}</Link>
            </Box>
          ))}
          {extraLinks.map((item, i) => (
            <Box key={i} className="main">
              <Link href={item.href}>{item.name}</Link>
            </Box>
          ))}
          
        </div>

        {/* SERVICES */}
        <div className="column services">
          <Box className="main highlight">{services?.name}</Box>

          {/* AMC */}
          <div className="sub sub-amc group">
            <Box className="sub-title sub-title-amc">{amc?.name}</Box>
            <div className="sub-list sub-list-amc hidden group-hover:block">
              <RenderItems items={amc?.items} maxDepth={1} parentKey="amc" />
            </div>
          </div>

          {/* LICENSING */}
          <div className="sub sub-licensing group">
            <Box className="sub-title sub-title-licensing">{licensing?.name}</Box>
            <div className="sub-list sub-list-licensing hidden group-hover:block">
              <RenderItems items={licensing?.items} maxDepth={3} parentKey="licensing" />
            </div>
          </div>

          {/* LIAISONING */}
          <div className="sub sub-liaisoning group">
            <Box className="sub-title sub-title-liaisoning">{liaisoning?.name}</Box>
            <div className="sub-list sub-list-liaisoning hidden group-hover:block">
              <RenderItems items={liaisoning?.items} maxDepth={3} parentKey="liaisoning" />
            </div>
          </div>

          {/* SITC */}
          <div className="sub bottom">
            {sitc?.map((item, i) => (
              <Link key={i} href={item.href || "#"}>
                <Box className="main">
                  {item.name.replace("Equipment Solution Department", "ESD")}
                </Box>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
✅ Improvements Done:
- Unique class added for each sub-section (sub-title-amc, sub-title-licensing, etc.)
- Unique class per item-group using parentKey
- Hover-based visibility using group + group-hover
- Entire box clickable using Link wrapper (production safe)
- Deep hierarchy supported with unique structured class naming

💡 You can now target like:
.sub-amc:hover .sub-list-amc { display:block }
.parent-licensing-item-0 { ... }
*/
