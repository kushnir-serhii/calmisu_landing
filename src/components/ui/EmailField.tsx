import { cn } from "@/lib/utils";

interface EmailFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  errorId?: string;
  className?: string;
  /** Visible idle border — use on white backgrounds where the field would
   * otherwise blend into the surface. */
  bordered?: boolean;
}

/** Email input styled to match the quiz result screen's plan-gate field. */
export const EmailField = ({
  id,
  value,
  onChange,
  placeholder = "Enter your email address",
  label = "Email address",
  error = false,
  errorId,
  className,
  bordered = false,
}: EmailFieldProps) => {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        type="email"
        id={id}
        name="email"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={254}
        aria-invalid={error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full px-5 py-3.5 bg-white border rounded-xl focus:outline-none focus:border-brand focus-visible:ring-2 focus-visible:ring-ring transition-colors font-body text-foreground placeholder:text-muted-foreground",
          bordered ? "border-control-border" : "border-transparent",
          className,
        )}
      />
    </>
  );
};
