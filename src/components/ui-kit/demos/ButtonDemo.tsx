import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { KitExample } from "../KitExample";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

const BUTTON_VARIANTS: { value: ButtonVariant; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "destructive", label: "Destructive" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "link", label: "Link" },
  { value: "black", label: "Black" },
];

const BUTTON_SIZES: { value: ButtonSize; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Large" },
  { value: "icon", label: "Icon-only" },
  { value: "xl", label: "Extra large" },
  { value: "pill", label: "Pill" },
];

export const ButtonDemo = () => {
  return (
    <>
      {BUTTON_VARIANTS.map((variant) =>
        BUTTON_SIZES.map((size) => (
          <KitExample key={`${variant.value}-${size.value}`} label={`${variant.label} · ${size.label}`}>
            <Button variant={variant.value} size={size.value}>
              {size.value === "icon" ? <CheckIcon /> : variant.label}
            </Button>
          </KitExample>
        )),
      )}
      {BUTTON_VARIANTS.map((variant) => (
        <KitExample key={`${variant.value}-disabled`} label={`${variant.label} · Disabled`}>
          <Button variant={variant.value} disabled>
            {variant.label}
          </Button>
        </KitExample>
      ))}
      <KitExample label="With icon">
        <Button>
          <CheckIcon />
          Confirm
        </Button>
      </KitExample>
      <KitExample label="As child (link)">
        <Button asChild>
          <a href="#button">Link button</a>
        </Button>
      </KitExample>
    </>
  );
};
