import Link from "next/link";
import "./not-found.scss";

export const metadata = {
  title: "Page Not Found | Liaison Bank",
  description:
    "The page you're looking for could not be found. Explore Liaison Bank's liaisoning, licensing, fire, PNG, electrical, AMC and other services.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      {/* Decorative Background */}
      <div className="not-found-bg">
        <span className="circle circle-one"></span>
        <span className="circle circle-two"></span>
        <span className="line line-one"></span>
        <span className="line line-two"></span>
      </div>

      <section className="not-found-content">
        {/* Brand */}
        <Link href="/" className="not-found-brand" aria-label="Liaison Bank Home">
          <span className="brand-mark">LB</span>
          <span className="brand-name">LIAISON BANK</span>
        </Link>

        {/* 404 */}
        <div className="error-number" aria-hidden="true">
          404
        </div>

        <div className="error-divider">
          <span></span>
          <i></i>
          <span></span>
        </div>

        <p className="error-label">PAGE NOT FOUND</p>

        <h1>
          Looks like you've
          <br />
          taken a <span>wrong turn.</span>
        </h1>

        <p className="error-description">
          The page you are looking for may have been moved, renamed, or is
          temporarily unavailable. Let us help you get back on track.
        </p>

        {/* Actions */}
        <div className="error-actions">
          <Link href="/" className="primary-button">
            <span>Back to Home</span>
            <span className="button-arrow">→</span>
          </Link>

          <Link href="/our-services" className="secondary-button">
            Explore Our Services
          </Link>
        </div>

        {/* Service shortcuts */}
        <div className="quick-links">
          <span>Explore</span>

          <Link href="/about-us">About Us</Link>
          <Link href="/our-services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/our-clients">Our Clients</Link>
          <Link href="/career">Careers</Link>
        </div>
      </section>
    </main>
  );
}