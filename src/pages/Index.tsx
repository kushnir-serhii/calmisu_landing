import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesFlow from "@/components/FeaturesFlow";
import FeaturesScience from "@/components/FeaturesScience";
import ReviewsSection from "@/components/ReviewsSection";
import ChatSection from "@/components/ChatSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col items-center w-full bg-background overflow-hidden">
      <Header />
      <HeroSection />
      <FeaturesFlow />
      <FeaturesScience />
      <ReviewsSection />
      <ChatSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
