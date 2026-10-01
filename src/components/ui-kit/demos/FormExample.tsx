import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormExampleProps {
  fieldLabel: string;
  description?: string;
  errorMessage?: string;
}

interface FormExampleValues {
  field: string;
}

export const FormExample = ({ fieldLabel, description, errorMessage }: FormExampleProps) => {
  const form = useForm<FormExampleValues>({ defaultValues: { field: "" } });
  const errorApplied = useRef(false);

  // Guarded: Strict Mode runs effects twice, so set the error only once.
  useEffect(() => {
    if (!errorMessage || errorApplied.current) return;
    errorApplied.current = true;
    form.setError("field", { type: "manual", message: errorMessage });
  }, [errorMessage, form]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="field"
        render={({ field }) => (
          <FormItem className="w-full max-w-sm">
            <FormLabel>{fieldLabel}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};
