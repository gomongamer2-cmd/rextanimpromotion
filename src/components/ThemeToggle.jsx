"use client";

import React, { useState, useEffect, useCallback } from "react";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("mex-theme") || "dark";
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } catch (e) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(
    (e) => {
      const nextTheme = theme === "dark" ? "light" : "dark";
      const docEl = document.documentElement;

      try {
        localStorage.setItem("mex-theme", nextTheme);
      } catch (err) {}

      if (docEl.getAttribute("data-theme") === nextTheme) return;

      const updateDOM = () => {
        docEl.setAttribute("data-theme", nextTheme);
        setTheme(nextTheme);
        window.dispatchEvent(
          new CustomEvent("mex-theme-changed", { detail: nextTheme })
        );
      };

      // If user prefers reduced motion or View Transitions API is not supported
      if (
        typeof window !== "undefined" &&
        (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          !document.startViewTransition)
      ) {
        docEl.classList.add("mex-tt");
        updateDOM();
        window.setTimeout(() => docEl.classList.remove("mex-tt"), 500);
        return;
      }

      // Exact authentic XTE circular ripple animation originating from click point
      const x = e?.clientX != null ? e.clientX : window.innerWidth - 90;
      const y = e?.clientY != null ? e.clientY : 40;
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      docEl.classList.add("mex-vt");
      const transition = document.startViewTransition(updateDOM);

      transition.ready
        .then(() =>
          docEl.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 750,
              easing: "cubic-bezier(.65,0,.35,1)",
              pseudoElement: "::view-transition-new(root)",
            }
          )
        )
        .catch(() => {});

      transition.finished.finally(() => docEl.classList.remove("mex-vt"));
    },
    [theme]
  );

  const isLight = mounted && theme === "light";
  const label = isLight ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => toggleTheme(e)}
      className={`x-theme-btn ${className}`}
      style={{
        position: "relative",
        width: "40px",
        height: "40px",
        flexShrink: 0,
        borderRadius: "50%",
        border: "1px solid var(--line)",
        background: "var(--card)",
        boxShadow: "var(--sh)",
        padding: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        color: "var(--tx)",
        cursor: "pointer",
      }}
    >
      {/* Sun Icon: Exact XTE rotation & cubic bezier */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          position: "absolute",
          opacity: isLight ? 1 : 0,
          transform: isLight ? "none" : "rotate(-90deg) scale(.4)",
          transition:
            "transform 1.3s cubic-bezier(.16,1,.3,1), opacity 0.76s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>

      {/* Moon Icon: Exact XTE rotation & cubic bezier */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          position: "absolute",
          opacity: !isLight ? 1 : 0,
          transform: !isLight ? "none" : "rotate(90deg) scale(.4)",
          transition:
            "transform 1.3s cubic-bezier(.16,1,.3,1), opacity 0.76s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
