import type { ComponentType } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ChatSection from "./ChatSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";

/**
 * Each of these sections needs its own hydration (ChatSection's scroll
 * listener, FAQSection's Radix Accordion, CTASection's audio player +
 * NotifyMe modal). Passing any of them as a slotted child of a separately-
 * hydrated AnimatedSection island would slot it in as static HTML and
 * silently kill that interactivity — so each wrapper composes both into a
 * single React tree that gets mounted as one island. They're combined into
 * one file (rather than three near-identical ones) since Astro supports
 * named-export islands.
 */
const withReveal = (Component: ComponentType) => {
  const Wrapped = ({ delay = 0 }: { delay?: number }) => (
    <AnimatedSection delay={delay}>
      <Component />
    </AnimatedSection>
  );
  return Wrapped;
};

export const AnimatedChatSection = withReveal(ChatSection);
export const AnimatedFAQSection = withReveal(FAQSection);
export const AnimatedCTASection = withReveal(CTASection);
