import type { ReactNode } from "react";

interface NumberedCardProps {
  /** Badge content — a 1-based index for "Your two tools", the "Day N"
   *  two-line label for the 7-day plan. */
  badge: ReactNode;
  /** Circle size classes; the plan's Day badge is larger than the tools'. */
  badgeClassName?: string;
  title: ReactNode;
  titleClassName?: string;
  children: ReactNode;
  /** Trailing slot, e.g. the per-day "Start" button. */
  action?: ReactNode;
  /** The plan's list item also centers items and tightens padding. */
  className?: string;
}

/** The `rounded-xl border-2 border-brand-200 bg-white` card with a round
 *  bg-brand-100 badge — used for "Your two tools" (number badge) and the
 *  7-day plan (Day N badge, with a trailing action slot). */
export const NumberedCard = ({
  badge,
  badgeClassName = "w-8 h-8",
  title,
  titleClassName = "text-lg",
  children,
  action,
  className = "gap-4 p-5",
}: NumberedCardProps) => (
  <div className={`flex ${className} rounded-xl border-2 border-brand-200 bg-white`}>
    <span
      className={`shrink-0 ${badgeClassName} rounded-full bg-brand-100 text-brand-dark font-body flex items-center justify-center`}
    >
      {badge}
    </span>
    <div className="min-w-0 flex-1">
      <p className={`font-body text-foreground ${titleClassName}`}>{title}</p>
      <p className="mt-1 text-muted-foreground font-body text-base font-light leading-[150%]">
        {children}
      </p>
    </div>
    {action}
  </div>
);

interface InfoPanelProps {
  title: string;
  children: ReactNode;
}

/** The `rounded-2xl bg-brand-100 p-6 text-center` panel — used for the iOS
 *  "coming soon" panel and the PRO promo panel. */
export const InfoPanel = ({ title, children }: InfoPanelProps) => (
  <div className="mt-8 p-6 rounded-2xl bg-brand-100 text-center">
    <h3 className="text-foreground font-display text-xl sm:text-2xl font-normal">
      {title}
    </h3>
    {children}
  </div>
);
