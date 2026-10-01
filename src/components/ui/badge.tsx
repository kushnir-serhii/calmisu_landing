import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full bg-brand-100 text-brand-dark font-body font-normal",
  {
    variants: {
      size: {
        sm: "px-3 py-1 text-xs",
        md: "px-3 py-1 text-sm sm:text-base",
        lg: "px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg leading-[150%]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, size, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ size }), className)} {...props}>
      {children}
    </span>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
