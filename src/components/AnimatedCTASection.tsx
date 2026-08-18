import AnimatedSection from "./AnimatedSection";
import CTASection from "./CTASection";

// CTASection owns its own NotifyMe modal instance and the QRCodeGen — both
// need real hydration. See AnimatedChatSection.tsx for why this composes
// into one island instead of slotting CTASection as a child from the
// .astro page.
const AnimatedCTASection = ({ delay = 0 }: { delay?: number }) => (
  <AnimatedSection delay={delay}>
    <CTASection />
  </AnimatedSection>
);

export default AnimatedCTASection;
