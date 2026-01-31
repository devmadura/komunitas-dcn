import About from "@/components/About";
import Events from "@/components/Events";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import Stats from "@/components/Stats";
import Support from "@/components/Support";
import TierSection from "@/components/TierSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Support />
      <Stats />
      <TierSection />
      <About />
      <Programs />
      <Events />
    </div>
  );
}
