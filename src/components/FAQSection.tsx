import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "What is Calmisu?",
    answer:
      "Calmisu is a mental wellness app designed to help you manage anxiety. It guides you through a structured Calming Flow — a sequence of breathing exercises, grounding techniques, mindful kanji calligraphy, and meditation music — where each step builds on the last to bring your nervous system back to calm.",
  },
  {
    question: "Do I need to follow the flow in order?",
    answer:
      "No. Every tool in Calmisu works on its own, so you can jump straight to breathing, grounding, or sounds whenever you need them. That said, following the full flow in sequence gives the strongest effect — each step deepens the one after it.",
  },
  {
    question: "Is this a replacement for therapy?",
    answer:
      "No, and we're clear about that. Calmisu is a self-regulation tool, not a clinical service. It works best alongside therapy — giving you practical support between sessions and helping you build daily calm habits. If you're experiencing severe anxiety or a mental health crisis, please reach out to a professional.",
  },
  {
    question: "How does the AI chat work?",
    answer:
      "The AI companion is available 24/7 for guidance, reflection, and gentle support. You can talk through what you're feeling, ask questions about anxiety, or get suggestions for which tool to use. It's not a therapist — but it's always there, especially in the moments when you just need someone to help you think clearly.",
  },
  // {
  //   question: "How much does Calmisu cost?",
  //   answer: "Calmisu is free to download and includes the core calming tools. A premium plan unlocks the full anxiety knowledge base, unlimited AI chat, and additional content. No credit card needed to get started.",
  // },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full px-6 sm:px-8 md:px-16 lg:px-[140px] py-16 sm:py-20 md:py-[120px] rounded-b-2xl sm:rounded-b-3xl"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--brand-blue-light)) 66.87%)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-10 w-full">
        <div className="flex-1 lg:sticky lg:top-24">
          <h2 className="text-foreground font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            Got questions? Here's clarity.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 w-full lg:max-w-[590px]">
          {faqData.map((item, i) => {
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
                    <ChevronUp
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
