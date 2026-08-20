export interface NavLink {
  label: string;
  href: string;
  /**
   * True only for links that leave calmisu.com. Internal links must NOT open
   * in a new tab — it breaks back-navigation and hides internal linking from
   * crawlers.
   */
  isExternal?: boolean;
}

// Anchors are root-absolute so they still resolve when the header/footer is
// rendered on a page other than "/".
export const navLinks: NavLink[] = [
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog/" },
  { label: "Privacy Policy", href: "/en/privacy-policy/" },
  { label: "Terms of Service", href: "/en/terms-of-service/" },
];
