import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KitExample } from "../KitExample";

const WITH_LABEL_INPUT_ID = "ui-kit-input-with-label";

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
    id: "file",
    label: "File picker",
    render: () => <Input type="file" />,
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
