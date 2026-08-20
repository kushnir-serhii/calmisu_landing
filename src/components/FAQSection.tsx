import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";

// Content lives in src/data/faq.ts so the FAQPage JSON-LD on the homepage
// renders from the exact same strings.

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full scroll-mt-20 px-6 sm:px-8 md:px-16 lg:px-[140px] py-16 sm:py-20 md:py-[120px] rounded-b-2xl sm:rounded-b-3xl"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--brand-blue-light)) 66.87%)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-10 w-full">
        <div className="flex-1 lg:sticky lg:top-24">
          <h2 className="text-foreground font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            Anxiety app questions, answered
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 w-full lg:max-w-[590px]">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`flex p-4 sm:p-6 flex-col w-full rounded-xl sm:rounded-2xl bg-background cursor-pointer touch-manipulation transition-shadow hover:shadow-sm overflow-hidden 
                
                `}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="flex justify-between items-start gap-3 w-full">
                  <span className="text-foreground font-body text-lg sm:text-xl md:text-2xl font-normal leading-[140%] sm:leading-[150%]">
                    {item.question}
                  </span>
                  <div className="flex w-9 h-9 sm:w-10 sm:h-10 justify-center items-center rounded-lg bg-brand-light shrink-0">
                    <ChevronDown
                      size={20}
                      className={`transition-all duration-300 ease-in-out ${isOpen && "rotate-180"}`}
                    />
                  </div>
                </div>
                <p
                  className={`text-foreground font-body text-base sm:text-lg font-light leading-[140%] transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "opacity-100 max-h-80 h-full mt-4 sm:mt-6"
                      : "opacity-0 max-h-0"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            );})}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
