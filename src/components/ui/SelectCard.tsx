import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "./icons";

interface CheckBoxProps {
  checked: boolean;
}

/** The square selected-state indicator shared by quiz options and the
 *  platform picker — filled brand square with a checkmark when selected. */
export const CheckBox = ({ checked }: CheckBoxProps) => (
  <span
    aria-hidden="true"
    className={[
      "shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center",
      checked ? "bg-brand border-brand text-white" : "border-gray-100",
    ].join(" ")}
  >
    {checked && <CheckIcon className="w-3/4 h-3/4" />}
  </span>
);

interface SelectCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  /** Optional leading icon, e.g. a quiz option's app icon. */
  icon?: string;
  /** Shows the CheckBox indicator (multi-select quiz options, the platform
   *  picker). Single-select quiz options advance immediately and skip it. */
  indicator?: boolean;
  /** "left" (icon + label, indicator trailing inline) or "center" (label
   *  centered, indicator absolutely positioned) — see the platform picker. */
  align?: "left" | "center";
}

/**
 * The selectable white card with a brand border — used for quiz options
 * (single + multi-select) and the Android/iPhone platform picker. Unifies
 * their previously near-identical, hand-duplicated markup.
 */
export const SelectCard = ({
  selected,
  onClick,
  children,
  icon,
  indicator = false,
  align = "left",
  className = "",
  ...rest
}: SelectCardProps) => {
  const base = [
    "rounded-xl px-4 py-3 border-2 bg-white",
    "transition-all duration-150 active:scale-[0.99]",
    selected ? "border-brand" : "border-gray-100 hover:border-brand-200",
  ];

  if (align === "center") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          "relative flex items-center justify-center gap-3 w-full text-center",
          ...base,
          className,
        ].join(" ")}
        {...rest}
      >
        <span className="font-body text-base sm:text-[17px] text-foreground">
          {children}
        </span>
        {indicator && (
          <span className="absolute transform -translate-y-1/2 top-1/2 right-3">
            <CheckBox checked={selected} />
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 w-full text-left",
        ...base,
        className,
      ].join(" ")}
      {...rest}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          width={36}
          height={36}
          className="w-6 h-6 shrink-0"
          loading="eager"
        />
      )}
      <span className="font-body text-base sm:text-[17px] text-foreground">
        {children}
      </span>
      {indicator && (
        <span className="ml-auto">
          <CheckBox checked={selected} />
        </span>
      )}
    </button>
  );
};
