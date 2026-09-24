import { forwardRef, type CSSProperties, type ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Overrides the default vertical padding (py-16 sm:py-20 md:py-[120px]),
   *  e.g. sections that only need bottom padding because another section
   *  supplies the top. */
  paddingY?: string;
}

/** The landing page's standard full-bleed section: shared horizontal gutters
 *  and vertical rhythm across FeaturesFlow/Science, FAQ, CTA, quiz, etc. */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className = "", style, children, paddingY = "py-16 sm:py-20 md:py-[120px]" }, ref) => (
    <section
      ref={ref}
      id={id}
      style={style}
      className={["w-full px-6 sm:px-8 md:px-16 lg:px-[140px]", paddingY, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  ),
);
Section.displayName = "Section";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
  /** "section" is the large landing-page heading; "block" is the smaller
   *  in-page heading reused across QuizResultIsland/QuizIsland blocks. */
  size?: "section" | "block";
}

const SIZE_CLASSES: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  section:
    "font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]",
  block: "font-display text-2xl sm:text-3xl font-normal",
};

export const SectionHeading = ({
  children,
  className = "text-foreground",
  size = "section",
}: SectionHeadingProps) => (
  <h2 className={[SIZE_CLASSES[size], className].filter(Boolean).join(" ")}>
    {children}
  </h2>
);
