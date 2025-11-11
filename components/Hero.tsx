import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={"/hero-bg.jpg"}
          width={500}
          height={500}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-blue/90 via-secondary/80 to-accent/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-white font-medium">
              DCN Universitas Madura
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
            Bergabung dengan
            <span className="block mt-2 bg-linear-to-r from-blue-400 to-white bg-clip-text text-transparent">
              DCN Unira
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Belajar, Berbagi, dan Berkembang bersama komunitas developer terbaik
            di Universitas Madura
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90 shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all px-8"
            >
              Gabung Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="glass"
              className="text-white border-white/30 hover:bg-white/20"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce mt-4">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
