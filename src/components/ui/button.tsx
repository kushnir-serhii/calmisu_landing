import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AppleIcon } from "@/components/ui/AppleIcon";
import { PlayStoreIcon } from "@/components/ui/PlayStoreIcon";

const darkClasses = "cta-btn bg-foreground text-background";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-normal touch-manipulation ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        dark: `${darkClasses} [&_svg]:size-4`,
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 [&_svg]:size-4",
        store: `${darkClasses} [&_svg]:size-6`,
      },
      size: {
        default: "h-[54px] px-6 rounded-xl text-base sm:text-lg leading-[150%]",
        pill: "h-auto rounded-full px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Appends the matching store icon after the children. */
  store?: "ios" | "android";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, store, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <Slottable>{children}</Slottable>
        {store === "ios" && (
          <span className="mb-1">
            <AppleIcon />
          </span>
        )}
        {store === "android" && <PlayStoreIcon />}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
