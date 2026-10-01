import type { VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/PulseDot";
import { KitExample } from "../KitExample";

type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;

const BADGE_SIZES: { value: BadgeSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

export const BadgeDemo = () => {
  return (
    <>
      {BADGE_SIZES.map((size) => (
        <KitExample key={size.value} label={size.label}>
          <Badge size={size.value}>early access</Badge>
        </KitExample>
      ))}
      <KitExample label="With dot · Large">
        <Badge size="lg">
          <PulseDot />
          early access
        </Badge>
      </KitExample>
    </>
  );
};
