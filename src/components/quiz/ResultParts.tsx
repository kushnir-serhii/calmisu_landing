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

interface ProfileSummaryCardProps {
  /** The Q1 icon for the visitor's resulting profile — see `PROFILE_ICONS`. */
  icon: string;
  children: ReactNode;
}

/** The subtitle card under the profile name — a white `border-brand-200`
 *  card rather than a tinted one, because the five watercolor icons run
 *  from pale blue to teal to rope-beige and a brand-100/brand-beige fill
 *  washes at least one of them out. Source art is 132px; display is capped
 *  at 64px so it stays crisp at 2x. The image is decorative (`alt=""`) —
 *  the subtitle text carries the meaning — and the card has no hover/focus
 *  styles since it isn't interactive. */
export const ProfileSummaryCard = ({ icon, children }: ProfileSummaryCardProps) => (
  <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl border-2 border-brand-200 bg-white text-left">
    <img
      src={icon}
      alt=""
      width={132}
      height={132}
      className="shrink-0 w-14 h-14 sm:w-16 sm:h-16"
      loading="eager"
      decoding="async"
    />
    <p className="min-w-0 text-foreground font-body text-lg sm:text-xl font-light leading-[145%] text-pretty">
      {children}
    </p>
  </div>
);
