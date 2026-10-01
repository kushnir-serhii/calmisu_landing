import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { KitExample } from "../KitExample";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

const BUTTON_VARIANTS: { value: ButtonVariant; label: string; text: string; store?: "ios" }[] = [
  { value: "dark", label: "Dark", text: "Dark" },
  { value: "destructive", label: "Destructive", text: "Destructive" },
  { value: "store", label: "Store (iOS)", text: "Store", store: "ios" },
];

const BUTTON_SIZES: { value: ButtonSize; label: string }[] = [
  { value: "default", label: "Standard" },
  { value: "pill", label: "Pill" },
];

export const ButtonDemo = () => {
  return (
    <>
      {BUTTON_VARIANTS.map((variant) =>
        BUTTON_SIZES.map((size) => (
          <KitExample key={`${variant.value}-${size.value}`} label={`${variant.label} · ${size.label}`}>
            <Button variant={variant.value} size={size.value} store={variant.store}>
              {variant.text}
            </Button>
          </KitExample>
        )),
      )}
      {BUTTON_VARIANTS.map((variant) => (
        <KitExample key={`${variant.value}-disabled`} label={`${variant.label} · Disabled`}>
          <Button variant={variant.value} store={variant.store} disabled>
            {variant.text}
          </Button>
        </KitExample>
      ))}
      <KitExample label="Store (Google Play) · Standard">
        <Button variant="store" store="android">
          Store
        </Button>
      </KitExample>
      <KitExample label="With icon">
        <Button variant="dark">
          <CheckIcon />
          Confirm
        </Button>
      </KitExample>
      <KitExample label="As child (link)">
        <Button variant="dark" asChild>
          <a href="#button">Link button</a>
        </Button>
      </KitExample>
    </>
  );
};
