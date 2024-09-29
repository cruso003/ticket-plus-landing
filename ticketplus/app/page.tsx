import { BetaProgramSection } from "@/components/beta-section/page";
import { FAQSection } from "@/components/faq-section/page";
import FeaturesSection from "@/components/features-section/page";
import { Footer } from "@/components/footer/page";
import { HeroSection } from "@/components/hero/page";
import { Header } from "@/components/header/page";
import ValuePropositionSection from "@/components/value-prop/page";
import { HowItWorksSection } from "@/components/why-section/page";
import AppDownloadSection from "./app-download-section/page";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ValuePropositionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FAQSection />
      <BetaProgramSection />
      <AppDownloadSection />
      <Footer />
    </>
  );
}
