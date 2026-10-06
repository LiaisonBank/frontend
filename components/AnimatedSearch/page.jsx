"use client";

import React, {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import "./AnimatedSearch.scss";

/**
 * Production-ready animated search component
 *
 * Features:
 * - Next.js client component
 * - Controlled / uncontrolled value support
 * - Accessible dialog/searchbox
 * - ESC to close
 * - Click outside to close
 * - Automatic input focus
 * - Body scroll lock while expanded
 * - Reduced-motion support
 * - No external icon dependency
 * - Responsive
 * - Search submit callback
 */
const AnimatedSearch = forwardRef(
  (
    {
      value,
      defaultValue = "",
      onChange,
      onSubmit,

      placeholder = "Search...",
      ariaLabel = "Search",

      className = "",
      disabled = false,

      closeOnSubmit = true,
      closeOnEscape = true,
      closeOnOutsideClick = true,

      autoFocus = true,

      buttonLabel = "Open search",
      closeLabel = "Close search",
      submitLabel = "Submit search",

      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();

    const inputId = `animated-search-${generatedId}`;

    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] =
      useState(defaultValue);

    /**
     * Supports both controlled and uncontrolled usage.
     */
    const isControlled = value !== undefined;

    const searchValue = isControlled
      ? value
      : internalValue;

    /**
     * Keep forwarded ref synchronized.
     */
    useEffect(() => {
      if (!forwardedRef) return;

      if (typeof forwardedRef === "function") {
        forwardedRef(inputRef.current);
      } else {
        forwardedRef.current = inputRef.current;
      }
    }, [forwardedRef]);

    /**
     * Open search.
     */
    const openSearch = () => {
      if (disabled) return;

      setIsOpen(true);
    };

    /**
     * Close search.
     */
    const closeSearch = () => {
      setIsOpen(false);
    };

    /**
     * Toggle search.
     */
    const toggleSearch = () => {
      if (disabled) return;

      setIsOpen((previous) => !previous);
    };

    /**
     * Handle input changes.
     */
    const handleChange = (event) => {
      const nextValue = event.target.value;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(event);
    };

    /**
     * Submit search.
     */
    const handleSubmit = (event) => {
      event.preventDefault();

      const query = searchValue?.trim() ?? "";

      onSubmit?.(query, event);

      if (closeOnSubmit) {
        closeSearch();
      }
    };

    /**
     * ESC + body scroll lock.
     */
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (event) => {
        if (
          event.key === "Escape" &&
          closeOnEscape
        ) {
          event.preventDefault();
          closeSearch();
        }
      };

      document.addEventListener(
        "keydown",
        handleKeyDown
      );

      /**
       * Prevent page scrolling while search overlay
       * is active.
       */
      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener(
          "keydown",
          handleKeyDown
        );

        document.body.style.overflow =
          previousOverflow;
      };
    }, [
      isOpen,
      closeOnEscape,
    ]);

    /**
     * Focus input after animation starts.
     */
    useEffect(() => {
      if (!isOpen || !autoFocus) return;

      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => {
        window.clearTimeout(timer);
      };
    }, [isOpen, autoFocus]);

    /**
     * Click outside search container.
     */
    useEffect(() => {
      if (!isOpen || !closeOnOutsideClick) {
        return;
      }

      const handlePointerDown = (event) => {
        const target = event.target;

        if (
          containerRef.current &&
          !containerRef.current.contains(target)
        ) {
          closeSearch();
        }
      };

      document.addEventListener(
        "pointerdown",
        handlePointerDown
      );

      return () => {
        document.removeEventListener(
          "pointerdown",
          handlePointerDown
        );
      };
    }, [
      isOpen,
      closeOnOutsideClick,
    ]);

    return (
      <div
        className={[
          "animated-search",
          isOpen
            ? "animated-search--open"
            : "",
          disabled
            ? "animated-search--disabled"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {/* =========================================
            BACKDROP
        ========================================== */}
        <button
          type="button"
          className="animated-search__backdrop"
          aria-label="Close search"
          tabIndex={isOpen ? 0 : -1}
          aria-hidden={!isOpen}
          onClick={closeSearch}
        />

        {/* =========================================
            SEARCH CONTAINER
        ========================================== */}
        <div
          ref={containerRef}
          className="animated-search__container"
        >
          <form
            className="animated-search__form"
            role="search"
            onSubmit={handleSubmit}
          >
            {/* =====================================
                INPUT
            ====================================== */}
            <div className="animated-search__input-wrapper">
              <label
                htmlFor={inputId}
                className="animated-search__label"
              >
                {ariaLabel}
              </label>

              <input
                ref={inputRef}
                id={inputId}
                type="search"
                name="search"
                value={searchValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                spellCheck="false"
                enterKeyHint="search"
                tabIndex={isOpen ? 0 : -1}
                aria-label={ariaLabel}
                className="animated-search__input"
              />
            </div>

            {/* =====================================
                BUTTON
            ====================================== */}
            {!isOpen ? (
              <button
                type="button"
                className="animated-search__button"
                aria-label={buttonLabel}
                aria-expanded={false}
                onClick={openSearch}
                disabled={disabled}
              >
                <SearchIcon />
              </button>
            ) : (
              <button
                type={
                  searchValue?.trim()
                    ? "submit"
                    : "button"
                }
                className="animated-search__button"
                aria-label={
                  searchValue?.trim()
                    ? submitLabel
                    : closeLabel
                }
                aria-expanded={true}
                onClick={
                  searchValue?.trim()
                    ? undefined
                    : toggleSearch
                }
                disabled={disabled}
              >
                {searchValue?.trim() ? (
                  <SearchIcon />
                ) : (
                  <CloseIcon />
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
);

AnimatedSearch.displayName = "AnimatedSearch";

/* ================================================
   SEARCH ICON
================================================ */
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke="currentColor"
      strokeWidth="2"
    />

    <path
      d="M16 16L21 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ================================================
   CLOSE ICON
================================================ */
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default AnimatedSearch;
