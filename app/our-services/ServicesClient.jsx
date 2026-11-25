"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
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

// 1. MAP THE KEYWORDS FOR THE SERVICE CARDS
// This overrides the placeholder text coming from your API database
const SERVICE_KEYWORD_MAP = {
    "liaisoning": "End-to-end government liaisoning services, municipal approval services, BMC liaisoning services, building approval services.",
    "licensing": "Business licensing services, trade licence assistance, commercial licensing services, industrial licensing services, shop licence services.",
    "piped-natural-gas": "Commercial PNG services, industrial PNG services, PNG pipeline inspection, PNG infrastructure services.",
    "fire": "Fire safety consultant Mumbai, fire safety audit services, fire NOC assistance, fire safety inspection, fire extinguisher refilling.",
    "electrical": "Electrical safety audit Mumbai, electrical inspection services, electrical audit certificate, CEIG approval assistance.",
    "amc": "AMC services Mumbai, commercial AMC services, industrial AMC services, preventive maintenance services, water tank cleaning services.",
    "real-estate": "Residential property services, commercial property services, property permission services.",
    "equipment-solution-department": "Equipment solution services, commercial property services, industrial facility services."
};

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
    // 2. OVERRIDE API DESCRIPTION WITH YOUR KEYWORDS
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

    // FAQPage structured data for rich results
    const faqJsonLd = useMemo(() => {
        if (!FAQS?.length) return null;
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        };
    }, []);

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

    const toggleFaq = (index) =>
        setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));

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
            {/* FAQPage JSON-LD structured data */}
            {faqJsonLd && (
                <Script
                    id="faq-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

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
                                Government liaisoning services, licensing &amp; essential business solutions in Mumbai — all under one roof.
                            </h1>
                            <p className="ec-hero-lede">
                                From government NOC assistance and business licence renewal to fire safety maintenance, electrical audit services, PNG pipeline inspection, and annual maintenance contracts (AMC), Liaison Bank provides coordinated support to simplify your property and operational requirements.
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
                                Comprehensive liaisoning &amp; licensing services. <br />
                                <span className="accent-text">One trusted partner.</span>
                            </h2>
                        </div>
                        <p className="ec-services-intro">
                            Explore our range of professional services designed to support commercial property services, industrial facility services, and housing society services. We provide end-to-end coordination for government approval services, municipal approval services, and business services in Maharashtra.
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
                            Every sector has different operational requirements and regulatory responsibilities. From factory safety services and warehouse maintenance services to restaurant licensing services, our expertise covers all regulatory and safety compliance needs.
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
                        One trusted partner for property permission services, government NOC assistance, and industrial maintenance contracts across India.
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
                            From understanding your needs to executing the work and providing continued support, our team coordinates every stage for building approval services, electrical maintenance services, and fire safety inspections.
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
                                One partner for complete compliance. <br />
                                <span className="accent-text">Every requirement handled.</span>
                            </h2>
                        </div>
                        <p className="ec-why-intro">
                            We go beyond individual services — we deliver integrated solutions that simplify the challenges of managing BMC liaisoning services, municipal approval services, and ongoing preventive maintenance services.
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
                                Tell us about your business and we will help identify the right liaisoning services, commercial licensing services, fire safety consultant Mumbai, or commercial AMC services for your exact requirements.
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
                            <h2 className="ec-faq-title">
                                Questions, answered.
                            </h2>
                            <p className="ec-faq-lede">
                                Find answers to common questions about Liaison Bank's liaisoning, licensing, fire safety, electrical, PNG and annual maintenance contract services.
                            </p>
                            <p className="ec-faq-lede">
                                Need more information? Our team is happy to assist with your specific requirements.
                            </p>
                            <Link href="/contact-us-liaison-bank" className="ec-entry-link">
                                Contact Our Team
                            </Link>
                        </div>

                        <div className="ec-faq-columns">
                            {FAQS.length > 0 ? (
                                [
                                    FAQS.slice(0, Math.ceil(FAQS.length / 2)),
                                    FAQS.slice(Math.ceil(FAQS.length / 2)),
                                ].map((column, columnIndex) => (
                                    <div className="ec-faq-list" key={`faq-col-${columnIndex}`}>
                                        {column.map((item, index) => {
                                            const faqIndex =
                                                columnIndex === 0
                                                    ? index
                                                    : Math.ceil(FAQS.length / 2) + index;

                                            const isOpen = Boolean(openFaqs[faqIndex]);
                                            const answerId = `faq-answer-${faqIndex}`;

                                            return (
                                                <div
                                                    key={faqIndex}
                                                    className={`ec-faq-item ${isOpen ? "is-open" : ""}`}
                                                >
                                                    <a
                                                        href={`#${answerId}`}
                                                        className={`ec-faq-q ${isOpen ? "is-open" : ""}`}
                                                        aria-expanded={isOpen}
                                                        aria-controls={answerId}
                                                        role="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleFaq(faqIndex);
                                                            if (typeof window !== "undefined") {
                                                                history.replaceState(null, "", `#${answerId}`);
                                                            }
                                                        }}
                                                    >
                                                        <span>{item.q}</span>

                                                        <span className="ec-faq-icon" aria-hidden="true">
                                                            {isOpen ? "×" : "+"}
                                                        </span>
                                                    </a>

                                                    <div
                                                        id={answerId}
                                                        className={`ec-faq-answer ${isOpen ? "is-open" : ""}`}
                                                        aria-hidden={!isOpen}
                                                    >
                                                        <div className="ec-faq-answer-inner">
                                                            <p className="ec-faq-a">{item.a}</p>
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