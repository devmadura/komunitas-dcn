import {
  GraduationCap,
  Users2,
  Trophy,
  Code,
  Laptop,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function Programs() {
  const programs = [
    {
      icon: GraduationCap,
      title: "Bootcamp Intensif",
      description:
        "Program pembelajaran intensif untuk menguasai skill programming dari dasar hingga advance",
      features: [
        "Full-stack Development",
        "Mobile Development",
        "Data Science",
        "Gen AI Engineering",
      ],
      color: "from-primary to-dcn-blue",
    },
    {
      icon: Users2,
      title: "Study Group",
      description:
        "Kelompok belajar bersama untuk berbagi pengetahuan dan memecahkan masalah secara kolaboratif",
      features: ["Peer Learning", "Code Review", "Project Collaboration"],
      color: "from-secondary to-dcn-purple",
    },
  ];

  //   {
  //       icon: Trophy,
  //       title: "Sertifikasi",
  //       description:
  //         "Persiapan dan pendampingan untuk mendapatkan sertifikasi profesional di bidang teknologi",
  //       features: [
  //         "Dicoding Expert",
  //         "Google Certification",
  //         "AWS Certification",
  //       ],
  //       color: "from-accent to-dcn-pink",
  //     },
  //     {
  //       icon: Code,
  //       title: "Workshop & Webinar",
  //       description:
  //         "Sesi pembelajaran dengan praktisi industri dan expert di berbagai bidang teknologi",
  //       features: ["Live Coding", "Industry Insights", "Q&A Session"],
  //       color: "from-dcn-blue to-primary",
  //     },
  //     {
  //       icon: Laptop,
  //       title: "Hackathon",
  //       description:
  //         "Kompetisi pengembangan aplikasi untuk mengasah skill dan kreativitas dalam waktu terbatas",
  //       features: ["Team Building", "Problem Solving", "Innovation"],
  //       color: "from-dcn-purple to-secondary",
  //     },
  //     {
  //       icon: BookOpen,
  //       title: "Mentoring",
  //       description:
  //         "Bimbingan langsung dari senior dan alumni untuk pengembangan karir dan skill",
  //       features: ["Career Guidance", "Skill Assessment", "Personal Development"],
  //       color: "from-dcn-pink to-accent",
  //     },

  return (
    <section id="programs" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Program Kami
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Kegiatan &
            <span className="block mt-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Program Unggulan
            </span>
          </h3>
          <p className="text-lg text-muted-foreground">
            Berbagai program dirancang untuk mendukung perjalanan belajar dan
            pengembangan skill kamu
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${program.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-xl bg-linear-to-br ${program.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <CardDescription className="text-base">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-primary to-secondary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
