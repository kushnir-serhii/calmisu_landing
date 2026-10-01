import { Badge, type BadgeProps } from "@/components/ui/badge";
import { KitExample } from "../KitExample";

// badgeVariants is not exported from ui/badge.tsx, so the variant type comes from BadgeProps (same VariantProps source).
type BadgeVariant = NonNullable<BadgeProps["variant"]>;

// Labels use the prop name, even though default/secondary look swapped. The gallery shows the components as they are.
const BADGE_VARIANTS: { value: BadgeVariant; label: string }[] = [
  { value: "default", label: "default" },
  { value: "secondary", label: "secondary" },
  { value: "destructive", label: "destructive" },
  { value: "outline", label: "outline" },
];

export const BadgeDemo = () => {
  return (
    <>
      {BADGE_VARIANTS.map((variant) => (
        <KitExample key={variant.value} label={variant.label}>
          <Badge variant={variant.value}>{variant.label}</Badge>
        </KitExample>
      ))}
    </>
  );
};
