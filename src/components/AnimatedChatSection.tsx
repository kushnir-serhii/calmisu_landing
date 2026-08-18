import AnimatedSection from "./AnimatedSection";
import ChatSection from "./ChatSection";

// ChatSection needs its own hydration (window scroll listener for the
// parallax effect). Passing it as a slotted child of a separately-hydrated
// AnimatedSection island would slot it in as static HTML and silently kill
// that interactivity — so this wrapper composes both into a single React
// tree that gets mounted as one island.
const AnimatedChatSection = ({ delay = 0 }: { delay?: number }) => (
  <AnimatedSection delay={delay}>
    <ChatSection />
  </AnimatedSection>
);

export default AnimatedChatSection;
