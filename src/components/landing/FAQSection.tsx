import { faqItems } from "@/data/faq";
import { Section, SectionHeading } from "@/components/ui/Section";
import FAQAccordion from "@/components/ui/FAQAccordion";

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
        <FAQAccordion items={faqItems} className="lg:max-w-[590px]" />
      </div>
    </Section>
  );
};

export default FAQSection;
