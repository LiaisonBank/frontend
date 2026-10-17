
import Link from "next/link";

const navigation = [
  { href: "/company-profile", label: "Company Profile" },
  { href: "/legal-registrations", label: "Legal Registrations" },
  { href: "/media", label: "Media & Press" },
];

export default function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div className="digital-pr-page">
      <div className="digital-pr-nav" aria-label="Company information">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="digital-pr-hero">
        <p className="digital-pr-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <section className="digital-pr-content">{children}</section>
    </div>
  );
}
