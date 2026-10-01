import * as React from "react";

import { cn } from "@/lib/utils";

const emailDefaults: React.ComponentProps<"input"> = {
  autoComplete: "email",
  inputMode: "email",
  autoCapitalize: "none",
  spellCheck: false,
  maxLength: 254,
};

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { error?: boolean }
>(({ className, type, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive md:text-sm",
        className,
      )}
      ref={ref}
      {...(type === "email" ? emailDefaults : {})}
      {...props}
      aria-invalid={error ? "true" : ariaInvalid}
    />
  );
});
Input.displayName = "Input";

export { Input };
