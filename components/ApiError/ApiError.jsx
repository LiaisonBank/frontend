"use client";

import "./ApiError.scss";

export default function ApiError({
  title = "Something Went Wrong",
  message = "We're having trouble loading this information right now. Please try again in a moment.",
  onRetry,
  // ---- optional status metadata ----
  statusLabel = "SYSTEM STATUS",          // e.g. "SYSTEM STATUS"
  statusCode,                             // e.g. "503", "ERR · 503", "TIMEOUT"
  statusTone = "warning",                 // "warning" | "danger" | "info"
  showStatus = true,                      // hide strip entirely when false
  backToHome,                             // optional; hides button if not provided
}) {
  const toneClass = `api-error__status-dot--${statusTone}`;

  return (
    <section className="api-error" aria-live="polite">
      {/* Ambient background layers */}
      <div className="api-error__grid" aria-hidden="true" />
      <div className="api-error__glow api-error__glow--one" aria-hidden="true" />
      <div className="api-error__glow api-error__glow--two" aria-hidden="true" />
      <div className="api-error__glow api-error__glow--three" aria-hidden="true" />

      <div className="api-error__container">
        <div className="api-error__card">
          {/* Fine border accent */}
          <div className="api-error__card-border" aria-hidden="true" />

          {/* Top status strip */}
          {showStatus && (
            <div className="api-error__status" aria-hidden="true">
              <span className={`api-error__status-dot ${toneClass}`} />
              <span className="api-error__status-text">{statusLabel}</span>

              {statusCode && (
                <>
                  <span className="api-error__status-divider" />
                  <span className="api-error__status-code">{statusCode}</span>
                </>
              )}
            </div>
          )}

          {/* Icon */}
          <div className="api-error__icon-wrap">
            <div className="api-error__icon-ring" aria-hidden="true" />
            <div className="api-error__icon">
              <span>!</span>
            </div>
          </div>

          {/* Content */}
          <div className="api-error__content">
            <span className="api-error__eyebrow">
              <span className="api-error__eyebrow-line" aria-hidden="true" />
              TEMPORARILY UNAVAILABLE
            </span>

            <h2>{title}</h2>
            <p>{message}</p>

            <div className="api-error__actions">
              <button
                type="button"
                className="api-error__retry"
                onClick={onRetry}
              >
                <span className="api-error__retry-shine" aria-hidden="true" />
                <span>Try Again</span>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {backToHome && (
                <button
                  type="button"
                  className="api-error__support"
                  onClick={backToHome}
                >
                  Back to Home
                </button>
              )}
            </div>
          </div>

          {/* Bottom brand line */}
          <div className="api-error__brand-line">
            <span />
            <strong>LIAISON BANK</strong>
            <span />
          </div>
        </div>

        <div className="api-error__reflection" aria-hidden="true" />
      </div>
    </section>
  );
}