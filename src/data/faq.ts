export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Single source of truth for the FAQ: rendered by FAQSection.tsx and emitted
 * as FAQPage JSON-LD from src/pages/index.astro. Keep them in sync by only
 * ever editing this file — Google penalises schema that doesn't match the
 * visible page.
 */
export const faqItems: FaqItem[] = [
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
    question: "How much does Calmisu cost?",
    answer:
      "Calmisu is free to download and includes the core calming tools — breathing, grounding, calligraphy, and meditation sounds. No account and no credit card are needed to start. A premium plan unlocks the full anxiety knowledge base, unlimited AI chat, and additional content.",
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
];
