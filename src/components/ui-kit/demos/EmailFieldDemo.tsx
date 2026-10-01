import { KitExample } from "../KitExample";
import { EmailFieldExample } from "./EmailFieldExample";

interface EmailExample {
  key: string;
  label: string;
  initialValue?: string;
  error?: boolean;
  bordered?: boolean;
  tinted?: boolean;
}

const EMAIL_EXAMPLES: EmailExample[] = [
  { key: "empty", label: "Empty", tinted: true },
  { key: "filled", label: "Filled", initialValue: "jane@example.com", tinted: true },
  { key: "error", label: "Error", initialValue: "jane@", error: true, tinted: true },
  { key: "bordered-on-white", label: "Bordered on white", bordered: true },
  { key: "borderless-on-tinted", label: "Borderless on tinted", bordered: false, tinted: true },
];

export const EmailFieldDemo = () => {
  return (
    <>
      {EMAIL_EXAMPLES.map(({ key, label, ...props }) => (
        <KitExample key={key} label={label}>
          <EmailFieldExample id={key} {...props} />
        </KitExample>
      ))}
    </>
  );
};
