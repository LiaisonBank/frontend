"use client";

import { useState, useEffect, useRef } from "react";
import "./SuggestionBox.scss";

export default function SuggestionBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);

  const [envData] = useState({
    page_url: typeof window !== "undefined" ? window.location.href : "",
    browser: getBrowserName(),
    device: getDeviceType(),
  });

  const [formData, setFormData] = useState({
    report_type: "suggestion",
    category: "UI / UX improvement",
    name: "",
    email: "",
    subject: "",
    description: "",
  });
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen || isSuccess) return;

    const panel = panelRef.current;
    const form = panel?.querySelector(".sb-form");

    if (!panel || !form) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      form.scrollTop += e.deltaY;
    };

    panel.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      panel.removeEventListener("wheel", handleWheel, true);
    };
  }, [isOpen, isSuccess]);

  function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Mozilla Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Internet";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Trident")) return "Microsoft Internet Explorer";
    if (ua.includes("Edge")) return "Microsoft Edge";
    if (ua.includes("Chrome")) return "Google Chrome";
    if (ua.includes("Safari")) return "Apple Safari";
    return "Unknown Browser";
  }

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
      return "Tablet";
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(
        ua,
      )
    )
      return "Mobile";
    return "Desktop";
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      report_type: formData.report_type,
      category: formData.category,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      description: formData.description,
      page_url: envData.page_url,
      browser: envData.browser,
      device: envData.device,
      screenshot: null,
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_URL?.replace(/\/$/, "");
      const apiUrl = `${baseUrl}/api/website-feedback`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          report_type: "suggestion",
          category: "UI / UX improvement",
          name: "",
          email: "",
          subject: "",
          description: "",
        });
        setScreenshotFile(null);

        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          errorData.detail?.[0]?.msg || "Failed to submit feedback.";
        alert(
          `Validation Error: ${errorMsg}\n\nPlease check your inputs and try again.`,
        );
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="suggestion-box-container">
      {/* Floating Toggle Button */}
      {/* Floating Toggle Button */}
      <div className="sb-widget-wrapper">
        <button
          className="sb-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close suggestion box" : "Open suggestion box"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <span className="close-icon" aria-hidden="true">
              ✕
            </span>
          ) : (
            <>
              <svg
                className="suggestion-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="unread-badge" aria-hidden="true"></span>
            </>
          )}
        </button>
        {!isOpen && <span className="sb-toggle-label">Give Feedback</span>}
      </div>

      {/* Suggestion Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="sb-panel"
          role="dialog"
          aria-label="Suggestion Box"
        >
          <div className="sb-header">
            <div className="header-content">
              <div className="brand-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div className="header-info">
                <h3>Share Feedback</h3>
                <p className="status">We're listening</p>
              </div>
            </div>
            <button
              className="minimize-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize"
            >
              −
            </button>
          </div>

          {isSuccess ? (
            <div className="sb-success">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M22 11.08V12a10 10 0 11-5.93-9.14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="22 4 12 14.01 9 11.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Thank you! Your feedback has been submitted.</p>
            </div>
          ) : (
            <form className="sb-form" onSubmit={handleSubmit}>
              <div className="sb-row">
                <div className="sb-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="UI / UX improvement">
                      UI / UX improvement
                    </option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>
              </div>

              <div className="sb-row sb-row-2">
                <div className="sb-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="sb-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="sb-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary"
                  required
                />
              </div>

              <div className="sb-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please describe your suggestion in detail..."
                  minLength={10}
                  required
                />
                <span className="sb-hint">
                  {formData.description.length}/10 characters minimum
                </span>
              </div>

              {/* <div className="sb-group">
                <label htmlFor="screenshot" className="sb-file-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="17 8 12 3 7 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="12"
                      y1="3"
                      x2="12"
                      y2="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {screenshotFile
                    ? screenshotFile.name
                    : "Attach screenshot (optional)"}
                </label>
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sb-file-input"
                />
              </div> */}

              <button
                type="submit"
                className="sb-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="sb-spinner"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <span className="btn-arrow">➤</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
