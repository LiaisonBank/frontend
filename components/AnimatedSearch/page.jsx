// components/AnimatedSearch/AnimatedSearch.jsx
"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import "./AnimatedSearch.scss";

const DEBUG = process.env.NODE_ENV !== "production";

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
      resetOnSubmit = true,

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

    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const triggerRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);

    const isControlled = value !== undefined;
    const searchValue = isControlled ? value : internalValue;
    const hasQuery = Boolean(searchValue?.trim());

    const isOpenRef = useRef(isOpen);
    const hasQueryRef = useRef(hasQuery);

    useEffect(() => {
      isOpenRef.current = isOpen;
      if (DEBUG) console.log("[AS] isOpen:", isOpen);
    }, [isOpen]);

    useEffect(() => {
      hasQueryRef.current = hasQuery;
      if (DEBUG) console.log("[AS] hasQuery:", hasQuery, "value:", searchValue);
    }, [hasQuery, searchValue]);

    /* ---------------------------------------------------------------- */
    useImperativeHandle(
      forwardedRef,
      () => ({
        focus: () => inputRef.current?.focus({ preventScroll: true }),
        blur: () => inputRef.current?.blur(),
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        get input() {
          return inputRef.current;
        },
        get isOpen() {
          return isOpenRef.current;
        },
      }),
      []
    );

    /* ---------------------------------------------------------------- */
    const closeSearch = useCallback(() => {
      if (!isOpenRef.current) return;
      if (DEBUG) console.log("[AS] closeSearch()");

      isOpenRef.current = false;
      setIsOpen(false);

      if (document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }

      window.requestAnimationFrame(() => {
        triggerRef.current?.focus?.({ preventScroll: true });
      });
    }, []);

    const openSearch = useCallback(() => {
      if (disabled || isOpenRef.current) return;
      if (DEBUG) console.log("[AS] openSearch()");
      isOpenRef.current = true;
      setIsOpen(true);
    }, [disabled]);

    const toggleSearch = useCallback(() => {
      if (disabled) return;
      if (!isOpenRef.current) {
        openSearch();
      } else if (!hasQueryRef.current) {
        closeSearch();
      }
    }, [disabled, openSearch, closeSearch]);

    /* ---------------------------------------------------------------- */
    const handleChange = useCallback(
      (event) => {
        const nextValue = event.target.value;
        hasQueryRef.current = Boolean(nextValue?.trim());
        if (!isControlled) setInternalValue(nextValue);
        onChange?.(event);
      },
      [isControlled, onChange]
    );

    const handleSubmit = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const query = searchValue?.trim() ?? "";

        if (closeOnSubmit) closeSearch();
        if (resetOnSubmit && !isControlled) setInternalValue("");

        if (query && onSubmit) {
          const evt = event;
          Promise.resolve().then(() => onSubmit(query, evt));
        }
      },
      [
        searchValue,
        closeOnSubmit,
        closeSearch,
        resetOnSubmit,
        isControlled,
        onSubmit,
      ]
    );

    const handleButtonClick = useCallback(
      (event) => {
        if (hasQueryRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        toggleSearch();
      },
      [toggleSearch]
    );

    /* ESC + scroll lock */
    useEffect(() => {
      if (!isOpen) return;

      const onKey = (event) => {
        if (event.key === "Escape" && closeOnEscape) {
          event.preventDefault();
          if (!hasQueryRef.current) closeSearch();
        }
      };

      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }, [isOpen, closeOnEscape, closeSearch]);

    /* Autofocus */
    useEffect(() => {
      if (!isOpen || !autoFocus) return;
      const t = window.setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 200);
      return () => window.clearTimeout(t);
    }, [isOpen, autoFocus]);

    /* ----------------------------------------------------------------
     * OUTSIDE CLICK
     *
     * Uses ONLY `contains()` on the ROOT element. The root element is
     * the outer wrapper — the entire component. Any click inside the
     * component (input, buttons, form) is "inside". Everything else
     * is "outside".
     *
     * No geometry checks — those were causing false positives when
     * the container's bounding rect overlapped other page elements.
     * ---------------------------------------------------------------- */
    useEffect(() => {
      if (!isOpen || !closeOnOutsideClick) return;

      const onPointer = (event) => {
        const target = event.target;
        if (!(target instanceof Node)) return;

        const root = rootRef.current;
        const isInside = root ? root.contains(target) : false;

        if (DEBUG) {
          console.log("[AS] outside-click check", {
            isInside,
            hasQuery: hasQueryRef.current,
            target,
          });
        }

        if (isInside) return;
        if (!hasQueryRef.current) closeSearch();
      };

      // Capture phase ensures this runs even if children call
      // stopPropagation. We listen to pointerdown (modern) and
      // mousedown (fallback) plus touchstart for iOS Safari.
      document.addEventListener("pointerdown", onPointer, true);
      document.addEventListener("mousedown", onPointer, true);
      document.addEventListener("touchstart", onPointer, true);

      return () => {
        document.removeEventListener("pointerdown", onPointer, true);
        document.removeEventListener("mousedown", onPointer, true);
        document.removeEventListener("touchstart", onPointer, true);
      };
    }, [isOpen, closeOnOutsideClick, closeSearch]);

    /* ---------------------------------------------------------------- */
    return (
      <div
        ref={rootRef}
        className={[
          "animated-search",
          isOpen ? "animated-search--open" : "",
          disabled ? "animated-search--disabled" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="animated-search__container">
          <form
            className="animated-search__form"
            role="search"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="animated-search__input-wrapper">
              <label htmlFor={inputId} className="animated-search__label">
                {ariaLabel}
              </label>

              <input
                ref={inputRef}
                id={inputId}
                type="search"
                name="search"
                value={searchValue}
                onChange={handleChange}
                onInput={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                enterKeyHint="search"
                tabIndex={isOpen ? 0 : -1}
                aria-label={ariaLabel}
                aria-expanded={isOpen}
                className="animated-search__input"
              />
            </div>

            {!isOpen ? (
              <button
                ref={triggerRef}
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
                type="submit"
                className="animated-search__button"
                aria-label={hasQuery ? submitLabel : closeLabel}
                aria-expanded={true}
                onClick={handleButtonClick}
                disabled={disabled}
              >
                {hasQuery ? <SearchIcon /> : <CloseIcon />}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
);

AnimatedSearch.displayName = "AnimatedSearch";

/* Icons */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default AnimatedSearch;
