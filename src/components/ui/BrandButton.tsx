import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Size = "lg" | "sm";

interface BrandButtonClassOptions {
  size?: Size;
  /** Full-width variant drops horizontal padding (the quiz Continue / Send
   *  my plan buttons). Not used with size "sm" (the pill is intrinsic width). */
  full?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<Size, string> = {
  lg: "text-lg px-10 py-4",
  sm: "px-4 py-2 rounded-full text-sm",
};

/**
 * Shared brand button styling, exposed as a plain class-string builder so
 * .astro files (which can't render a React component without an island) can
 * still use it directly on a native <a>/<button>.
 */
export function brandButtonClass({
  size = "lg",
  full = false,
  className = "",
}: BrandButtonClassOptions = {}) {
  return [
    "bg-brand text-white font-body rounded-2xl hover:bg-brand-dark transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    full ? "w-full text-lg py-4" : SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface CommonProps {
  size?: Size;
  full?: boolean;
  className?: string;
  children: ReactNode;
}

type BrandButtonProps =
  | (CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined });

/** Renders an <a> when `href` is given, else a <button>. */
export const BrandButton = ({
  size = "lg",
  full = false,
  className = "",
  children,
  ...rest
}: BrandButtonProps) => {
  const cls = brandButtonClass({ size, full, className });

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <a href={href} className={`${cls} inline-block no-underline`} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={cls} {...buttonRest}>
      {children}
    </button>
  );
};
