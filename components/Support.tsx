"use client";
import LogoLoop from "./LogoLoop";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const imageLogos = [
  {
    src: "/support/codverse.jpg",
    alt: "Codverse",
    href: "https://codverse.site",
  },
  {
    src: "/support/dicoding.jpeg",
    alt: "Dicoding Indonesia",
    href: "https://dicoding.com",
  },
  {
    src: "/support/unira.png",
    alt: "Teknik Informatika Unira",
    href: "https://ft.unira.ac.id",
  },
];

export default function Support() {
  return (
    <section className="w-full py-20 bg-background">
      <div
        className={`${jakarta.className} container mx-auto px-4 mb-16 text-center`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Supported By
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Terima kasih kepada semua pihak yang telah mendukung perjalanan kami
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        <div className="relative h-40 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-r from-background via-background/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-l from-background via-background/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 flex items-center">
            <LogoLoop
              logos={imageLogos}
              speed={50}
              direction="left"
              logoHeight={80}
              gap={120}
              hoverSpeed={10}
              scaleOnHover
              ariaLabel="Our supporters"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}
