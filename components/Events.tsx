import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Events() {
  type eventType = {
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    image: string;
    color: string;
  };
  const events: eventType[] = [];
  //   const events = [
  //     {
  //       title: "Web Development Bootcamp",
  //       date: "15 Desember 2024",
  //       time: "09:00 - 16:00 WIB",
  //       location: "Lab Komputer Unira",
  //       type: "Workshop",
  //       image:
  //         "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  //       color: "from-primary to-dcn-blue",
  //     },
  //     {
  //       title: "Tech Talk: Career in Tech",
  //       date: "20 Desember 2024",
  //       time: "14:00 - 16:00 WIB",
  //       location: "Aula Unira",
  //       type: "Seminar",
  //       image:
  //         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  //       color: "from-secondary to-dcn-purple",
  //     },
  //     {
  //       title: "Hackathon DCN 2024",
  //       date: "5-7 Januari 2025",
  //       time: "Full Day",
  //       location: "Kampus Unira",
  //       type: "Competition",
  //       image:
  //         "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  //       color: "from-accent to-dcn-pink",
  //     },
  //   ];

  return (
    <section id="events" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Events Mendatang
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Jangan Lewatkan
            <span className="block mt-2 bg-linear-to-r from-primary to-secondary bg-clip-text">
              Event Seru Kami
            </span>
          </h3>
          <p className="text-lg text-muted-foreground">
            Ikuti berbagai event menarik untuk mengembangkan skill dan
            memperluas networking
          </p>
        </div>

        {events.length === 0 && (
          <p className="text-center text-muted-foreground italic">
            Tidak ada event mendatang saat ini. Silakan cek kembali nanti!
          </p>
        )}

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />

                {/* Event Type Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r ${event.color} text-white text-xs font-semibold shadow-lg`}
                >
                  {event.type}
                </div>
              </div>

              <CardHeader>
                <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-secondary" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-accent" />
                  {event.location}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                >
                  Daftar Sekarang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
