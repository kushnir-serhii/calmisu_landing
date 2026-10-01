import type React from "react";

import { ButtonDemo } from "./demos/ButtonDemo";
import { BadgeDemo } from "./demos/BadgeDemo";
import { InputDemo } from "./demos/InputDemo";
import { EmailFieldDemo } from "./demos/EmailFieldDemo";
import { FormDemo } from "./demos/FormDemo";

export interface KitGroup {
  id: string;
  title: string;
  description: string;
  covers: string[];
  Demo: React.ComponentType;
}

export const kitGroups: KitGroup[] = [
  {
    id: "button",
    title: "Button",
    description: "Button styles and sizes, disabled state, icon and link usage.",
    covers: ["button"],
    Demo: ButtonDemo,
  },
  {
    id: "badge",
    title: "Badge",
    description: "Badge styles and variants for status and label display.",
    covers: ["badge"],
    Demo: BadgeDemo,
  },
  {
    id: "input",
    title: "Text input and label",
    description: "Text input states, file picker, and label association.",
    covers: ["input", "label"],
    Demo: InputDemo,
  },
  {
    id: "email-field",
    title: "Email field",
    description: "Email input field with error states and styling options.",
    covers: ["EmailField"],
    Demo: EmailFieldDemo,
  },
  {
    id: "form",
    title: "Form",
    description: "Form field with description and error message support.",
    covers: ["form"],
    Demo: FormDemo,
  },
];
