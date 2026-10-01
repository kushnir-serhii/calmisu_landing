import { KitExample } from "../KitExample";
import { FormExample } from "./FormExample";

interface FormExampleItem {
  id: string;
  label: string;
  fieldLabel: string;
  description?: string;
  errorMessage?: string;
}

const FORM_EXAMPLES: FormExampleItem[] = [
  {
    id: "with-description",
    label: "With description",
    fieldLabel: "Email",
    description: "We will never share your email.",
  },
  {
    id: "with-error",
    label: "With error",
    fieldLabel: "Email",
    errorMessage: "Please enter a valid email address.",
  },
];

export const FormDemo = () => {
  return (
    <>
      {FORM_EXAMPLES.map(({ id, label, ...props }) => (
        <KitExample key={id} label={label}>
          <FormExample {...props} />
        </KitExample>
      ))}
    </>
  );
};
