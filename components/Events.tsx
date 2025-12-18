"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/supabase";

const TYPE_COLORS: Record<string, string> = {
  Onboarding: "from-secondary to-dcn-purple",
  Workshop: "from-primary to-dcn-blue",
  Competition: "from-accent to-dcn-pink",
  Seminar: "from-green-500 to-emerald-600",
  Meetup: "from-orange-500 to-amber-600",
  Event: "from-indigo-500 to-purple-600",
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events?limit=3&published=true");
      const result = await response.json();
      setEvents(result.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTypeColor = (tipe: string) => {
    return TYPE_COLORS[tipe] || TYPE_COLORS["Event"];
  };

  return (
    <section id="events" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Events Mendatang
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-5 ">
            Jangan Lewatkan
            <span className="block mt-2 bg-linear-to-r from-blue-400 to-yellow-200 bg-clip-text text-transparent py-2">
              Event Seru Kami
            </span>
          </h3>
          <p className="text-lg text-muted-foreground">
            Ikuti berbagai event menarik untuk mengembangkan skill dan
            memperluas networking
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <p className="text-center text-muted-foreground italic">
            Tidak ada event mendatang saat ini. Silakan cek kembali nanti!
          </p>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event, index) => (
              <Link href={`/event/${event.slug}`} key={event.id}>
                <Card
                  className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        event.gambar ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
                      }
                      alt={event.judul}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />

                    {/* Event Type Badge */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r ${getTypeColor(
                        event.tipe
                      )} text-white text-xs font-semibold shadow-lg`}
                    >
                      {event.tipe}
                    </div>
                  </div>

                  <CardHeader>
                    <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {event.judul}
                    </h4>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      {formatDate(event.tanggal)}
                    </div>
                    {event.waktu && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-secondary" />
                        {event.waktu}
                      </div>
                    )}
                    {event.lokasi && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-accent" />
                        {event.lokasi}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <p className="italic text-sm">
                      <span className="text-red-500 font-bold">*</span>{" "}
                      diharapkan jangan telat
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        {!loading && (
          <div className="flex justify-center mt-12">
            <Link href="/event">
              <Button
                variant="outline"
                size="lg"
                className="group hover:bg-primary hover:text-blue-400 hover:border-primary transition-all cursor-pointer"
              >
                Lihat Semua Event
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
