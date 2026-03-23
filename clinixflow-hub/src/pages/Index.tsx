import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AudienceSection from "@/components/landing/AudienceSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PaymentsSection from "@/components/landing/PaymentsSection";
import SecuritySection from "@/components/landing/SecuritySection";
import ConsultingSection from "@/components/landing/ConsultingSection";
import ComingSoonSection from "@/components/landing/ComingSoonSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AudienceSection />
      <BenefitsSection />
      {/* <PaymentsSection /> */}
      <SecuritySection />
      {/* <ConsultingSection /> */}
      <ComingSoonSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
