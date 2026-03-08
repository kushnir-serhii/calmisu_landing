import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "What is Calmisu?",
    answer: "Calmisu is a mental wellness app designed to help you manage anxiety. It guides you through a structured Calming Flow — a sequence of breathing exercises, grounding techniques, mindful kanji calligraphy, and meditation music — where each step builds on the last to bring your nervous system back to calm.",
  },
  {
    question: "Do I need to follow the flow in order?",
    answer: "No. Every tool in Calmisu works on its own, so you can jump straight to breathing, grounding, or sounds whenever you need them. That said, following the full flow in sequence gives the strongest effect — each step deepens the one after it.",
  },
  {
    question: "Is this a replacement for therapy?",
    answer: "No, and we're clear about that. Calmisu is a self-regulation tool, not a clinical service. It works best alongside therapy — giving you practical support between sessions and helping you build daily calm habits. If you're experiencing severe anxiety or a mental health crisis, please reach out to a professional.",
  },
  {
    question: "How does the AI chat work?",
    answer: "The AI companion is available 24/7 for guidance, reflection, and gentle support. You can talk through what you're feeling, ask questions about anxiety, or get suggestions for which tool to use. It's not a therapist — but it's always there, especially in the moments when you just need someone to help you think clearly.",
  },
  {
    question: "How much does Calmisu cost?",
    answer: "Calmisu is free to download and includes the core calming tools. A premium plan unlocks the full anxiety knowledge base, unlimited AI chat, and additional content. No credit card needed to get started.",
  },
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
