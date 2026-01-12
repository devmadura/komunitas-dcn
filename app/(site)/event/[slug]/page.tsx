import type { Metadata } from "next";
import { supabase, Event } from "@/lib/supabase";
import EventDetailClient from "./EventDetailClient";

const siteUrl = "https://dcnunira.dev";

async function getEvent(slug: string): Promise<Event | null> {
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slug
    );

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq(isUUID ? "id" : "slug", slug)
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event Tidak Ditemukan",
      description: "Event yang Anda cari tidak tersedia.",
    };
  }

  const eventUrl = `${siteUrl}/event/${event.slug}`;
  const eventImage = event.gambar || `${siteUrl}/og-image.png`;
  const description = event.deskripsi
    ? event.deskripsi.substring(0, 160)
    : `${event.tipe} - ${event.judul} di DCN UNIRA. Tanggal: ${new Date(
        event.tanggal
      ).toLocaleDateString("id-ID")}`;

  return {
    title: event.judul,
    description,
    keywords: [
      event.judul.toLowerCase(),
      event.tipe.toLowerCase(),
      "event dcn unira",
      "komunitas developer madura",
      event.lokasi?.toLowerCase() || "",
    ].filter(Boolean),
    openGraph: {
      title: event.judul,
      description,
      type: "article",
      url: eventUrl,
      images: [
        {
          url: eventImage,
          width: 1200,
          height: 630,
          alt: event.judul,
        },
      ],
      publishedTime: event.created_at,
      modifiedTime: event.created_at,
      authors: ["DCN UNIRA"],
      tags: [event.tipe, "Event", "DCN UNIRA"],
    },
    twitter: {
      card: "summary_large_image",
      title: event.judul,
      description,
      images: [eventImage],
    },
    alternates: {
      canonical: eventUrl,
    },
  };
}

function generateEventJsonLd(event: Event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.judul,
    description: event.deskripsi || `${event.tipe} dari DCN UNIRA`,
    startDate: event.tanggal,
    endDate: event.tanggal,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.lokasi
      ? {
          "@type": "Place",
          name: event.lokasi,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Pamekasan",
            addressRegion: "Jawa Timur",
            addressCountry: "ID",
          },
        }
      : undefined,
    image: event.gambar || `${siteUrl}/og-image.png`,
    organizer: {
      "@type": "Organization",
      name: "Dicoding Community Network Universitas Madura (DCN UNIRA)",
      url: siteUrl,
    },
    performer: {
      "@type": "Organization",
      name: "Dicoding Community Network Universitas Madura (DCN UNIRA)",
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  return (
    <>
      {event && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateEventJsonLd(event)),
          }}
        />
      )}
      <EventDetailClient initialEvent={event} slug={slug} />
    </>
  );
}
