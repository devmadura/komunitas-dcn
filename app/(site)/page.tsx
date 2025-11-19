import About from "@/components/About";
import Events from "@/components/Events";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Stats />
      <About />
      <Programs />
      <Events />
    </div>
  );
}
