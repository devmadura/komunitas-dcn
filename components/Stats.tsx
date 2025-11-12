import { Users, Calendar, Award, TrendingUp } from "lucide-react";

export default function Stats() {
  const statistics = [
    {
      icon: Users,
      value: "20+",
      label: "Member Aktif",
      color: "from-primary to-dcn-blue",
    },
    {
      icon: Calendar,
      value: "0",
      label: "Events Dilaksanakan",
      color: "from-secondary to-dcn-purple",
    },
    {
      icon: Award,
      value: "1+",
      label: "Sertifikat Diraih",
      color: "from-accent to-dcn-pink",
    },
    {
      icon: TrendingUp,
      value: "100%",
      label: "Tingkat Partisipasi",
      color: "from-dcn-blue to-secondary",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Value */}
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
