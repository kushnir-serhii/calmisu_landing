interface CheckIconProps {
  className?: string;
  strokeWidth?: number;
}

/** The checkmark used across selected states (quiz options, gate radios,
 *  success toasts) — kept as one glyph so it stays visually consistent. */
export const CheckIcon = ({ className, strokeWidth = 3 }: CheckIconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
  >
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
