import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";
import { Section, SectionHeading } from "@/components/ui/Section";

// Content lives in src/data/faq.ts so the FAQPage JSON-LD on the homepage
// renders from the exact same strings.

const FAQSection = () => {
  return (
    <Section
      id="faq"
      className="scroll-mt-20 rounded-b-2xl sm:rounded-b-3xl"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--brand-blue-light)) 66.87%)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-10 w-full">
        <div className="flex-1 lg:sticky lg:top-24">
          <SectionHeading>Anxiety app questions, answered</SectionHeading>
        </div>
        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="item-0"
          className="flex flex-col items-start gap-3 w-full lg:max-w-[590px]"
        >
          {faqItems.map((item, i) => (
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
      </div>
    </Section>
  );
};

export default FAQSection;
