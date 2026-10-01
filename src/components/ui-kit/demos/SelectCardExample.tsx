import { useState } from "react";

import { SelectCard } from "@/components/ui/SelectCard";

export type SelectCardIndicator = "none" | "checkbox" | "radio";

interface SelectCardExampleProps {
  initialSelected?: boolean;
  align?: "left" | "center";
  indicator?: SelectCardIndicator;
  /** Leading icon path; ignored by the card when align is "center". */
  icon?: string;
  children: string;
}

export const SelectCardExample = ({
  initialSelected = false,
  align = "left",
  indicator = "none",
  icon,
  children,
}: SelectCardExampleProps) => {
  const [selected, setSelected] = useState(initialSelected);

  return (
    <SelectCard
      selected={selected}
      onClick={() => setSelected((value) => !value)}
      align={align}
      indicator={indicator !== "none"}
      radio={indicator === "radio"}
      icon={icon}
      aria-pressed={selected}
    >
      {children}
    </SelectCard>
  );
};
