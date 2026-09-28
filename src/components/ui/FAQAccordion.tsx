import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FaqItem[];
  className?: string;
}

/**
 * Shared Radix accordion for question/answer lists — the same look used by
 * the homepage FAQ section, factored out so other pages (e.g. blog post
 * FAQs) can reuse it instead of re-styling their own accordion.
 */
const FAQAccordion = ({ items, className = "" }: FAQAccordionProps) => {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue="item-0"
      className={`flex flex-col items-start gap-3 w-full ${className}`}
    >
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`item-${i}`}
          className="w-full rounded-xl sm:rounded-2xl bg-background overflow-hidden transition-shadow hover:shadow-sm"
        >
          <h3 className="w-full">
            <AccordionPrimitive.Trigger className="flex w-full justify-between items-start gap-3 p-4 sm:p-6 text-left touch-manipulation [&[data-state=open]_svg]:rotate-180">
              <span className="text-foreground font-body text-lg sm:text-xl md:text-2xl font-normal leading-[140%] sm:leading-[150%]">
                {item.question}
              </span>
              <span aria-hidden="true" className="flex w-9 h-9 sm:w-10 sm:h-10 justify-center items-center rounded-lg bg-brand-light shrink-0">
                <ChevronDown
                  size={20}
                  className="transition-transform duration-300 ease-in-out motion-reduce:transition-none"
                />
              </span>
            </AccordionPrimitive.Trigger>
          </h3>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up motion-reduce:animate-none">
            <p className="text-foreground font-body text-base sm:text-lg font-light leading-[140%] px-4 sm:px-6 pb-4 sm:pb-6">
              {item.answer}
            </p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};

export default FAQAccordion;
