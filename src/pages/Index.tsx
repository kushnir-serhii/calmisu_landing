import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesFlow from "@/components/FeaturesFlow";
import FeaturesScience from "@/components/FeaturesScience";
import ReviewsSection from "@/components/ReviewsSection";
import ChatSection from "@/components/ChatSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const AnimatedSection = ({ children, className = "", delay = 0 }: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: number 
}) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ 
        transitionDelay: isVisible ? `${delay}ms` : '0ms' 
      }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  return (
    <div className="flex flex-col items-center w-full bg-background overflow-hidden">
      <Header />
      <HeroSection />
      
      <AnimatedSection delay={100}>
        <FeaturesFlow />
      </AnimatedSection>
      
      <AnimatedSection delay={150}>
        <FeaturesScience />
      </AnimatedSection>
      
      <AnimatedSection delay={200}>
        <ReviewsSection />
      </AnimatedSection>
      
      <AnimatedSection delay={250}>
        <ChatSection />
      </AnimatedSection>
      
      <AnimatedSection delay={300}>
        <FAQSection />
      </AnimatedSection>
      
      <AnimatedSection delay={350}>
        <CTASection />
      </AnimatedSection>
      
      <AnimatedSection delay={400}>
        <Footer />
      </AnimatedSection>
    </div>
  );
};

export default Index;
