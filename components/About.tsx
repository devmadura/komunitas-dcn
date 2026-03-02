import { Target, Eye, Heart } from "lucide-react";
import Image from "next/image";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Misi Kami",
      description:
        "Membangun ekosistem developer yang solid dan saling mendukung di Universitas Madura",
    },
    {
      icon: Eye,
      title: "Visi Kami",
      description:
        "Menjadi komunitas tech terdepan yang menghasilkan developer berkualitas tinggi",
    },
    {
      icon: Heart,
      title: "Nilai Kami",
      description:
        "Kolaborasi, pembelajaran berkelanjutan, dan pertumbuhan bersama dan dapat kelas gratis dari dicoding indonesia Gen AI Engginer",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Tentang Kami
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Dicoding Community Network
                <span className="block mt-2 bg-linear-to-r from-blue-400 to-yellow-200 bg-clip-text text-transparent py-2">
                  Universitas Madura
                </span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                DCN Unira adalah komunitas mahasiswa yang di support langsung
                dicoding indonesia yang fokus pada pengembangan skill
                programming dan teknologi. Kami menyediakan wadah bagi mahasiswa
                untuk belajar, berbagi pengetahuan, dan berkembang bersama dalam
                dunia teknologi.
              </p>
            </div>

            {/* Values Cards */}
            <div className="space-y-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-6 h-6 dark:text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {value.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={"/about.jpg"}
                width={500}
                height={500}
                alt="Foto DCN Unira"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-linear-to-br from-accent to-dcn-pink rounded-2xl opacity-20 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-br from-primary to-secondary rounded-2xl opacity-20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
