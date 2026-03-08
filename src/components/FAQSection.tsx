import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "What is Calmisu?",
    answer: "Calmisu is a mental wellness app that helps you manage anxiety through a structured, science-based calming flow — combining breathing, grounding, mindful calligraphy, and meditation music.",
  },
  { question: "Do I need to follow the flow in order?", answer: "" },
  { question: "Is this a replacement for therapy?", answer: "" },
  { question: "How does the AI chat work?", answer: "" },
  { question: "How much does Calmisu cost?", answer: "" },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full px-6 md:px-[140px] py-[120px] rounded-b-3xl" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--brand-blue-light)) 66.87%)" }}>
      <div className="flex flex-col lg:flex-row items-start gap-10 w-full">
        <div className="flex-1">
          <h2 className="text-foreground font-display text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            Got questions? Here's clarity.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 w-full max-w-[590px]">
          {faqData.map((item, i) => (
            <div key={i} className="flex p-6 flex-col gap-6 w-full rounded-2xl bg-background cursor-pointer" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div className="flex justify-between items-start w-full">
                <span className="text-foreground font-body text-xl md:text-2xl font-normal leading-[150%]">{item.question}</span>
                <div className="flex w-10 h-10 justify-center items-center rounded-lg bg-brand-light shrink-0">
                  {openIndex === i ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>
              {openIndex === i && item.answer && (
                <p className="text-foreground font-body text-lg font-light leading-[140%]">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
