import { useState } from "react";

import { EmailField } from "@/components/ui/EmailField";
import { cn } from "@/lib/utils";

interface EmailFieldExampleProps {
  /** Static key-derived string; used to build the input and error ids. */
  id: string;
  initialValue?: string;
  error?: boolean;
  bordered?: boolean;
  /** Sit the field on the brand-100 tint instead of white. */
  tinted?: boolean;
}

export const EmailFieldExample = ({
  id,
  initialValue = "",
  error = false,
  bordered = false,
  tinted = false,
}: EmailFieldExampleProps) => {
  const [value, setValue] = useState(initialValue);
  const inputId = `kit-email-${id}`;
  const errorId = `${inputId}-error`;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl p-4",
        tinted ? "bg-brand-100" : "bg-white",
      )}
    >
      <EmailField
        id={inputId}
        value={value}
        onChange={setValue}
        error={error}
        errorId={errorId}
        bordered={bordered}
      />
      {error && (
        <p id={errorId} className="text-destructive-text font-body text-sm" role="alert">
          Please enter a valid email address.
        </p>
      )}
    </div>
  );
};
