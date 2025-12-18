"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchEvents(pagination.page);
  }, [pagination.page]);

  const fetchEvents = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/events?limit=6&page=${page}&published=true`
      );
      const result = await response.json();
      setEvents(result.data || []);
      setPagination(result.pagination);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 mt-9 md:mt-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-5">
            Semua Event
          </h1>
          <p className="text-lg text-muted-foreground">
            Temukan dan ikuti berbagai event menarik dari DCN UNIRA
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Belum ada event yang tersedia.
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {events.map((event, index) => (
                <Link href={`/event/${event.slug}`} key={event.id}>
                  <Card
                    className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in h-full"
                    style={{ animationDelay: `${index * 0.05}s` }}
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
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r ${getTypeColor(
                          event.tipe
                        )} text-white text-xs font-semibold shadow-lg`}
                      >
                        {event.tipe}
                      </div>
                    </div>

                    <CardHeader>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {event.judul}
                      </h3>
                    </CardHeader>

                    <CardContent className="space-y-2">
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
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Total Info */}
            <p className="text-center text-muted-foreground text-sm mt-4">
              Menampilkan {events.length} dari {pagination.total} event
            </p>
          </>
        )}
      </div>
    </div>
  );
}
