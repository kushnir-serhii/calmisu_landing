import { CheckBox, RadioBtn } from "@/components/ui/SelectCard";

import { KitExample } from "../KitExample";
import { SelectCardExample } from "./SelectCardExample";
import type { SelectCardIndicator } from "./SelectCardExample";

type Align = "left" | "center";

interface SelectCardConfig {
  key: string;
  label: string;
  align: Align;
  indicator: SelectCardIndicator;
  initialSelected: boolean;
  icon?: string;
}

const ALIGNS: { value: Align; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Centered" },
];

const INDICATORS: { value: SelectCardIndicator; label: string }[] = [
  { value: "none", label: "No indicator" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
];

const STATES: { value: boolean; label: string }[] = [
  { value: false, label: "Unselected" },
  { value: true, label: "Selected" },
];

const MATRIX_EXAMPLES: SelectCardConfig[] = ALIGNS.flatMap((align) =>
  INDICATORS.flatMap((indicator) =>
    STATES.map((state) => ({
      key: `${align.value}-${indicator.value}-${state.value ? "selected" : "unselected"}`,
      label: `${align.label} · ${indicator.label} · ${state.label}`,
      align: align.value,
      indicator: indicator.value,
      initialSelected: state.value,
    })),
  ),
);

const SELECT_CARD_EXAMPLES: SelectCardConfig[] = [
  ...MATRIX_EXAMPLES,
  {
    key: "left-icon",
    label: "Left · Icon · Unselected",
    align: "left",
    indicator: "none",
    initialSelected: false,
    icon: "/images/quiz/anxiety.webp",
  },
];

const INDICATOR_EXAMPLES = [
  { key: "checkbox-checked", label: "Checkbox · Checked", Indicator: CheckBox, checked: true },
  { key: "checkbox-unchecked", label: "Checkbox · Unchecked", Indicator: CheckBox, checked: false },
  { key: "radio-checked", label: "Radio · Checked", Indicator: RadioBtn, checked: true },
  { key: "radio-unchecked", label: "Radio · Unchecked", Indicator: RadioBtn, checked: false },
];

export const SelectCardDemo = () => {
  return (
    <>
      {SELECT_CARD_EXAMPLES.map(({ key, label, ...props }) => (
        <KitExample key={key} label={label}>
          <SelectCardExample {...props}>Feeling anxious</SelectCardExample>
        </KitExample>
      ))}
      {INDICATOR_EXAMPLES.map(({ key, label, Indicator, checked }) => (
        <KitExample key={key} label={label}>
          <Indicator checked={checked} />
        </KitExample>
      ))}
    </>
  );
};
