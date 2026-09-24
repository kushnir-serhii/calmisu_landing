import React from "react";

/**
 * Scroll-reveal wrapper for sections that must live inside a React island.
 *
 * The reveal itself is pure CSS (`.reveal` in index.css). This component never
 * hides its children: it previously started at `opacity-0` and waited for a
 * hydrated IntersectionObserver to flip it, which meant the pre-rendered HTML
 * shipped invisible and stayed that way whenever hydration failed or landed
 * after the user had already scrolled past the section.
 *
 * Prefer AnimatedSection.astro when the children need no hydration.
 */
const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  /** Accepted for call-site compatibility; scroll-driven reveals are keyed to
   *  each section's own scroll position, so a stagger delay has no meaning. */
  delay?: number;
}) => <div className={`reveal ${className}`}>{children}</div>;

export default AnimatedSection;
