"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
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

interface EventDetailClientProps {
  initialEvent: Event | null;
  slug: string;
}

export default function EventDetailClient({
  initialEvent,
  slug,
}: EventDetailClientProps) {
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(initialEvent);
  const [loading, setLoading] = useState(!initialEvent);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialEvent) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Event tidak ditemukan");
        return;
      }

      setEvent(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat event");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTypeColor = (tipe: string) => {
    return TYPE_COLORS[tipe] || TYPE_COLORS["Event"];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat detail event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md text-center border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Event Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "Event yang Anda cari tidak tersedia."}
          </p>
          <Link href="/event">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Event
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${pathname}`;

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl mt-9 md:mt-12">
        {/* Back Button */}
        <Link href="/event" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        {/* Event Image */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src={
              event.gambar ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
            }
            alt={event.judul}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
          <div
            className={`absolute top-4 right-4 px-4 py-2 rounded-full bg-linear-to-r ${getTypeColor(
              event.tipe
            )} text-white text-sm font-semibold shadow-lg`}
          >
            {event.tipe}
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border border-border">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {event.judul}
          </h1>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="font-medium text-foreground">
                  {formatDate(event.tanggal)}
                </p>
              </div>
            </div>

            {event.waktu && (
              <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waktu</p>
                  <p className="font-medium text-foreground">{event.waktu}</p>
                </div>
              </div>
            )}

            {event.lokasi && (
              <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg">
                <div className="p-2 bg-accent/10 rounded-full">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium text-foreground">{event.lokasi}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.deskripsi && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Deskripsi
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="whitespace-pre-wrap">{event.deskripsi}</p>
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="pt-6 border-t border-border">
            <ShareButton
              url={currentUrl}
              title={event.judul}
              description={
                event.deskripsi || `Event ${event.tipe} dari DCN UNIRA`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
