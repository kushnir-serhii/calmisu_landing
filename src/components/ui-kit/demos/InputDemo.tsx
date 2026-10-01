import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KitExample } from "../KitExample";

const WITH_LABEL_INPUT_ID = "ui-kit-input-with-label";
const ERROR_INPUT_ID = "ui-kit-input-error";
const ERROR_MESSAGE_ID = "ui-kit-input-error-message";

const INPUT_EXAMPLES: { id: string; label: string; render: () => React.ReactNode }[] = [
  {
    id: "placeholder",
    label: "Empty · placeholder",
    render: () => <Input placeholder="Type something" />,
  },
  {
    id: "filled",
    label: "Filled",
    render: () => <Input defaultValue="Filled value" />,
  },
  {
    id: "disabled",
    label: "Disabled",
    render: () => <Input disabled placeholder="Disabled" />,
  },
  {
    id: "error",
    label: "Error",
    render: () => (
      <div className="flex w-full flex-col gap-2">
        <Input
          id={ERROR_INPUT_ID}
          error
          aria-describedby={ERROR_MESSAGE_ID}
          defaultValue="not-an-email"
        />
        <p id={ERROR_MESSAGE_ID} role="alert" className="text-destructive-text text-sm">
          Enter a valid email address.
        </p>
      </div>
    ),
  },
  {
    id: "with-label",
    label: "With label",
    render: () => (
      <div className="flex w-full flex-col gap-2">
        <Label htmlFor={WITH_LABEL_INPUT_ID}>Email</Label>
        <Input id={WITH_LABEL_INPUT_ID} placeholder="Click the label to focus" />
      </div>
    ),
  },
  {
    id: "email",
    label: "Email",
    render: () => <Input type="email" placeholder="you@example.com" />,
  },
  {
    id: "password",
    label: "Password",
    render: () => <Input type="password" defaultValue="secret-password" />,
  },
];

export const InputDemo = () => {
  return (
    <>
      {INPUT_EXAMPLES.map((example) => (
        <KitExample key={example.id} label={example.label}>
          {example.render()}
        </KitExample>
      ))}
    </>
  );
};
