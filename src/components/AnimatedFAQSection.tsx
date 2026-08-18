import AnimatedSection from "./AnimatedSection";
import FAQSection from "./FAQSection";

// FAQSection is a Radix Accordion that needs JS to expand/collapse. See
// AnimatedChatSection.tsx for why this composes into one island instead of
// slotting FAQSection as a child from the .astro page.
const AnimatedFAQSection = ({ delay = 0 }: { delay?: number }) => (
  <AnimatedSection delay={delay}>
    <FAQSection />
  </AnimatedSection>
);

export default AnimatedFAQSection;
