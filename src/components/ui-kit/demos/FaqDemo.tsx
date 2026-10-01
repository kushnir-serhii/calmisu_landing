import type { FaqItem } from "@/components/ui/FAQAccordion";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { KitExample } from "../KitExample";

const SAMPLE_FAQ: FaqItem[] = [
  {
    question: "What is this component gallery?",
    answer:
      "A showcase of reusable UI components used throughout Calmisu. Designers and developers can reference each component and its code for consistent implementation.",
  },
  {
    question: "How do I use these components?",
    answer:
      "Each component shows its states and variants. Copy the component code or import it directly into your project for immediate use.",
  },
  {
    question: "What does the accordion do?",
    answer:
      "The accordion displays question-and-answer pairs. It opens the first item by default and allows one item open at a time—clicking another closes the previous one.",
  },
];

export const FaqDemo = () => {
  return (
    <div className="col-span-full">
      <KitExample label="Accordion">
        <div className="w-full">
          <FAQAccordion items={SAMPLE_FAQ} />
        </div>
      </KitExample>
    </div>
  );
};
