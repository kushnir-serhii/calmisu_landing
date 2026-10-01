import type React from "react";

import { ButtonDemo } from "./demos/ButtonDemo";
import { BadgeDemo } from "./demos/BadgeDemo";
import { InputDemo } from "./demos/InputDemo";
import { FormDemo } from "./demos/FormDemo";
import { SelectCardDemo } from "./demos/SelectCardDemo";
import { DownloadButtonsDemo } from "./demos/DownloadButtonsDemo";
import { FaqDemo } from "./demos/FaqDemo";
import { DialogDemo } from "./demos/DialogDemo";
import { ToastDemo } from "./demos/ToastDemo";
import { SectionDemo } from "./demos/SectionDemo";
import { AnimatedSectionDemo } from "./demos/AnimatedSectionDemo";
import { IconsDemo } from "./demos/IconsDemo";
import { FlagsDemo } from "./demos/FlagsDemo";

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
    description: "Badge sizes and PulseDot indicator for status and label display.",
    covers: ["badge", "PulseDot"],
    Demo: BadgeDemo,
  },
  {
    id: "input",
    title: "Input",
    description: "Input states, error message, email and password types, and label association.",
    covers: ["input", "label"],
    Demo: InputDemo,
  },
  {
    id: "form",
    title: "Form",
    description: "Form field with description and error message support.",
    covers: ["form"],
    Demo: FormDemo,
  },
  {
    id: "select-card",
    title: "Selectable card and indicators",
    description: "Selectable card in left and centered layouts with no, checkbox or radio indicator, plus standalone indicators.",
    covers: ["SelectCard"],
    Demo: SelectCardDemo,
  },
  {
    id: "download-buttons",
    title: "Download buttons",
    description: "iOS waitlist and Android download buttons in row, column and single-platform layouts, without analytics.",
    covers: ["DownloadButtons"],
    Demo: DownloadButtonsDemo,
  },
  {
    id: "faq",
    title: "FAQ accordion",
    description: "Accordion component for question and answer pairs with single-collapsible mode and smooth animations.",
    covers: ["FAQAccordion"],
    Demo: FaqDemo,
  },
  {
    id: "dialog",
    title: "Dialog",
    description: "Modal dialog for confirmations and user interactions with header, body, and footer sections.",
    covers: ["dialog"],
    Demo: DialogDemo,
  },
  {
    id: "toasts",
    title: "Toasts",
    description: "Toast notifications: plain, with description, success, error and with an action that closes the toast.",
    covers: ["sonner"],
    Demo: ToastDemo,
  },
  {
    id: "section",
    title: "Section and heading",
    description: "Full-bleed Section with default and custom vertical padding, and SectionHeading in section and block sizes.",
    covers: ["Section", "Section.astro"],
    Demo: SectionDemo,
  },
  {
    id: "scroll-reveal",
    title: "Scroll-reveal",
    description: "AnimatedSection fades and slides its content in as it scrolls into view, with a Replay button.",
    covers: ["AnimatedSection", "AnimatedSection.astro"],
    Demo: AnimatedSectionDemo,
  },
  {
    id: "icons",
    title: "Icons",
    description: "Icons used throughout the application including check, Apple, and Play Store.",
    covers: ["icons", "AppleIcon", "PlayStoreIcon"],
    Demo: IconsDemo,
  },
  {
    id: "flags",
    title: "Flags",
    description: "Flag icons for language selection in multiple sizes.",
    covers: ["flags/EsFlagIcon", "flags/PlFlagIcon", "flags/UaFlagIcon", "flags/UkFlagIcon"],
    Demo: FlagsDemo,
  },
];
