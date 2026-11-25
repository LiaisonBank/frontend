"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import "./ourservices.scss";

import { getImageUrl } from "../../lib/utils/getImagehelper";
import ApiError from "@/components/ApiError/ApiError";
import useBodyClass from "@/components/useBodyClass";
import {
  FALLBACK_IMAGE,
  HERO_BANNER,
  INDUSTRIES,
  PROCESS_STEPS,
  WHY_CHOOSE_US,
  FAQS,
} from "./data";

const API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

// ---------- helpers ----------
const resolveImage = (path) => {
  if (!path || typeof path !== "string" || path.trim() === "")
    return FALLBACK_IMAGE;
  try {
    const resolved = getImageUrl(path);
    return typeof resolved === "string" && resolved.trim() !== ""
      ? resolved
      : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
};

const transformCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description || "",
  fullDescription: category.full_description || "",
  image: resolveImage(category.image),
  imageAlt: category.image_alt || `${category.name} services`,
  banner: resolveImage(category.banner),
  bannerAlt: category.banner_alt || `${category.name} banner`,
  optionalImage: category.optional_img ? resolveImage(category.optional_img) : null,
  optionalImageAlt: category.optional_img_alt || "",
  metaTitle: category.meta_title || "",
  metaDescription: category.meta_description || "",
  metaKeywords: category.meta_keywords || "",
  faq: Array.isArray(category.faq)
    ? category.faq.filter((i) => i?.question && i?.answer)
    : [],
  priority: category.priority ?? 999,
});

// ---------- Safe image ----------
function ServiceImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
  useEffect(() => setImgSrc(src || FALLBACK_IMAGE), [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt || "Service image"}
      fill
      sizes="(max-width: 768px) 100vw, 360px"
      style={{ objectFit: "cover" }}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}

// ---------- Component ----------
export default function OurServicesClient({
  initialServices = [],
  initialError = null,
}) {
  useBodyClass("ourservices");

  const [servicesData, setServicesData] = useState(initialServices);
  const [loading, setLoading] = useState(
    initialServices.length === 0 && !initialError
  );
  const [error, setError] = useState(initialError);
  const [openFaqs, setOpenFaqs] = useState({});

  // Client fallback fetch — only runs if server returned nothing
  useEffect(() => {
    if (initialServices.length > 0 || initialError) return;

    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (!API_URL) throw new Error("API config missing");

        const res = await fetch(`${API_URL}/api/categories`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          const err = new Error(`Fetch failed: ${res.status}`);
          err.status = res.status;
          throw err;
        }

        const result = await res.json();
        if (!result.success || !Array.isArray(result.data))
          throw new Error("Invalid response");

        setServicesData(
          result.data
            .filter((c) => c.status === true)
            .map(transformCategory)
            .sort((a, b) => a.priority - b.priority)
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [initialServices, initialError]);

  // FAQ selection mirrors the server schema logic exactly:
  // if any service exposes API FAQs → those; else static FAQS.
  const categoryFaqs = useMemo(() => {
    const apiFaqs = servicesData.flatMap((s) =>
      s.faq.map((item, i) => ({
        id: `${s.id}-${i}`,
        category: s.name,
        question: item.question,
        answer: item.answer,
      }))
    );

    if (apiFaqs.length > 0) return apiFaqs;

    return FAQS.map((f, i) => ({
      id: `static-${i}`,
      category: "General",
      question: f.q,
      answer: f.a,
    }));
  }, [servicesData]);

  const toggleFaq = (id) =>
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));

  const errorStatusCode =
    typeof error?.status === "number"
      ? `ERR · ${error.status}`
      : "ERR · CONNECTION";
  const errorStatusTone =
    typeof error?.status === "number" && error.status >= 500
      ? "danger"
      : "warning";

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="ec-hero">
        <div className="ec-hero-bg">
          <Image
            src={HERO_BANNER}
            alt="Liaison Bank professional services and government approval coordination"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="ec-hero-overlay" />
        <div className="ec-hero-inner">
          <div className="container">
            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="ec-hero-copy"
            >
              <h1 className="ec-hero-title">
                Government liaisoning, licensing &amp; essential business
                services — all under one roof.
              </h1>
              <p className="ec-hero-lede">
                From government approvals and business licensing to fire safety,
                electrical services, PNG solutions and annual maintenance
                contracts, Liaison Bank provides coordinated support to simplify
                your business and property requirements.
              </p>
              <div className="ec-hero-actions">
                <Link href="#services" className="ec-btn ec-btn--light">
                  Explore Services
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/contact-us-liaison-bank" className="ec-btn ec-btn--light">
                  Request a Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="ec-hero-stats">
          <div className="container">
            <div className="ec-hero-stats-inner">
              {[
                { v: "500+", l: "Projects delivered" },
                { v: "300+", l: "Businesses served" },
                { v: "10+", l: "Years of experience" },
                { v: "98%", l: "Client-focused delivery" },
              ].map((stat, i) => (
                <div key={i} className="ec-hero-stat">
                  <span className="ec-hero-stat-value">{stat.v}</span>
                  <span className="ec-hero-stat-label">{stat.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="ec-services" id="services">
        <div className="container">
          <div className="ec-services-head">
            <div>
              <span className="ec-overline">Our expertise</span>
              <h2 className="ec-services-title">
                Our services. <br />
                <span className="accent-text">One trusted partner.</span>
              </h2>
            </div>
            <p className="ec-services-intro">
              Explore our range of professional services designed to support
              businesses, property owners, residential communities and
              industrial establishments through coordinated expertise.
            </p>
          </div>

          {loading && (
            <div className="ec-entries">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="ec-skeleton-entry">
                  <div className="ec-skeleton ec-skeleton-media" />
                  <div className="ec-skeleton-entry-body">
                    <div className="ec-skeleton ec-skeleton-entry-tag" />
                    <div className="ec-skeleton ec-skeleton-entry-title" />
                    <div className="ec-skeleton ec-skeleton-entry-desc" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="ec-services-error">
              <ApiError
                title="Services Temporarily Unavailable"
                message="Our service information is temporarily unavailable. Please try again shortly."
                onRetry={() => window.location.reload()}
                statusCode={errorStatusCode}
                statusTone={errorStatusTone}
                backToHome={() => window.open("/", "_self")}
              />
            </div>
          )}

          {!loading && !error && servicesData.length > 0 && (
            <div className="ec-entries">
              {servicesData.map((service, index) => (
                <motion.article
                  key={service.id}
                  id={service.slug}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.2) }}
                  className="ec-entry"
                >
                  <div className="ec-entry-grid">
                    <div className="ec-entry-media">
                      <ServiceImage src={service.image} alt={service.imageAlt} />
                    </div>
                    <div className="ec-entry-body">
                      <div className="ec-entry-meta">
                        <span className="ec-entry-num">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="ec-entry-tag">{service.name}</span>
                      </div>
                      <h3 className="ec-entry-title">{service.name} Services</h3>
                      <p className="ec-entry-desc">{service.description}</p>

                      {/* FIX: real anchor via <Link> — crawlable, prefetchable,
                          supports right-click / open-in-new-tab / copy-link. */}
                      <Link
                        href={`/our-services/${service.slug}`}
                        className="ec-entry-link"
                        title={`Explore ${service.name} services`}
                      >
                        Explore More
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {!loading && !error && servicesData.length === 0 && (
            <div className="ec-empty-state">
              <h3>No Services Available</h3>
              <p>
                Service information is currently unavailable. Please contact our
                team for assistance.
              </p>
              <Link href="/contact-us-liaison-bank" className="ec-btn ec-btn--solid">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============ INDUSTRIES ============ */}
      <section className="ec-industries">
        <div className="container">
          <div className="ec-industries-head">
            <div>
              <span className="ec-overline">Industries we serve</span>
              <h2 className="ec-industries-title">
                Built for residential, <br />
                <span className="accent-text">commercial &amp; industrial.</span>
              </h2>
            </div>
            <p className="ec-industries-intro">
              Every sector has different operational requirements, regulatory
              responsibilities and maintenance needs. Our services are designed
              to simplify these requirements through professional expertise,
              coordinated support and reliable solutions.
            </p>
          </div>
          <div className="ec-industry-grid">
            {INDUSTRIES.map((industry, index) => (
              <motion.div
                key={industry.num}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="ec-industry-card"
              >
                <span className="ec-industry-num">{industry.num}</span>
                <h3 className="ec-industry-title">{industry.title}</h3>
                <p className="ec-industry-text">{industry.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="ec-industries-closing">
            One trusted partner for residential, commercial and industrial
            requirements — simplifying approvals, strengthening safety and
            supporting uninterrupted operations.
          </p>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="ec-process">
        <div className="container">
          <div className="ec-process-head">
            <span className="ec-overline">How we work</span>
            <h2 className="ec-process-title">
              A structured, transparent process — <br />
              <span className="accent-text">every step coordinated.</span>
            </h2>
            <p className="ec-process-lede">
              From understanding your needs to executing the work and providing
              continued support, our team coordinates every stage with
              professionalism, expertise and attention to detail.
            </p>
          </div>
          <ol className="ec-process-steps">
            {PROCESS_STEPS.map((step, index) => (
              <motion.li
                key={step.num}
                initial={{ x: -16 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="ec-process-step"
              >
                <div className="ec-process-step-marker">
                  <span className="ec-process-step-num">{step.num}</span>
                </div>
                <div className="ec-process-step-body">
                  <h3 className="ec-process-step-title">{step.title}</h3>
                  <p className="ec-process-step-text">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ WHY ============ */}
      <section className="ec-why">
        <div className="container">
          <div className="ec-why-head">
            <div>
              <span className="ec-overline">Why choose us</span>
              <h2 className="ec-why-title">
                One partner. <br />
                <span className="accent-text">Every requirement handled.</span>
              </h2>
            </div>
            <p className="ec-why-intro">
              We go beyond individual services — we deliver integrated solutions
              that simplify the challenges of managing approvals, licensing,
              safety, infrastructure and maintenance across one reliable service
              partner.
            </p>
          </div>
          <div className="ec-why-grid">
            {WHY_CHOOSE_US.map((reason, index) => (
              <motion.div
                key={reason.num}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
                className="ec-why-card"
              >
                <span className="ec-why-num">{reason.num}</span>
                <h3 className="ec-why-card-title">{reason.title}</h3>
                <p className="ec-why-card-text">{reason.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="ec-cta">
        <div className="container">
          <div className="ec-cta-block">
            <div>
              <span className="ec-overline">Next step</span>
              <h2 className="ec-cta-title">
                Not sure which service you need? Start here.
              </h2>
              <p className="ec-cta-text">
                Tell us about your business and we will help identify the right
                liaisoning, licensing, safety, infrastructure or maintenance
                service for your requirements.
              </p>
            </div>
            <div className="ec-cta-actions">
              <Link href="/contact-us-liaison-bank" className="ec-btn ec-btn--solid">
                Request a Free Consultation
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="tel:+919769458515" className="ec-btn-phone">
                or call +91 97694 58515
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="ec-faq">
        <div className="container">
          <div className="ec-faq-grid">
            <div className="ec-faq-heading">
              <span className="ec-overline">Common questions</span>
              <h2 className="ec-faq-title">Questions, answered.</h2>
              <p className="ec-faq-lede">
                Find answers to common questions about our services, approvals,
                licensing, safety and maintenance solutions.
              </p>
              <p className="ec-faq-lede">
                Need more information? Our team is happy to assist with your
                specific requirements.
              </p>
              <Link href="/contact-us-liaison-bank" className="ec-entry-link">
                Contact Our Team
              </Link>
            </div>

            <div className="ec-faq-columns">
              {categoryFaqs.length > 0 ? (
                [
                  categoryFaqs.slice(0, Math.ceil(categoryFaqs.length / 2)),
                  categoryFaqs.slice(Math.ceil(categoryFaqs.length / 2)),
                ].map((col, ci) => (
                  <div className="ec-faq-list" key={`faq-col-${ci}`}>
                    {col.map((item) => {
                      const isOpen = Boolean(openFaqs[item.id]);
                      const answerId = `faq-answer-${item.id}`;
                      return (
                        <div key={item.id} className={`ec-faq-item ${isOpen ? "is-open" : ""}`}>
                          {/* FAQ toggle is a genuine action (aria-expanded /
                              aria-controls), so <button> is correct here. */}
                          <button
                            type="button"
                            className={`ec-faq-q ${isOpen ? "is-open" : ""}`}
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            onClick={() => toggleFaq(item.id)}
                          >
                            <span>{item.question}</span>
                            <span className="ec-faq-icon" aria-hidden="true">
                              {isOpen ? "×" : "+"}
                            </span>
                          </button>
                          <div
                            id={answerId}
                            className={`ec-faq-answer ${isOpen ? "is-open" : ""}`}
                            aria-hidden={!isOpen}
                          >
                            <div className="ec-faq-answer-inner">
                              <p className="ec-faq-a">{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="ec-faq-list">
                  <p>For questions about our services, please contact our team.</p>
                  <Link href="/contact-us-liaison-bank" className="ec-entry-link">
                    Contact Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}