import GaleriClient from "@/components/GaleriClient";
import { Metadata } from "next";

const siteUrl = "https://dcnunira.dev";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Galeri foto dokumentasi kegiatan Dicoding Community Network Universitas Madura - event, workshop,meetup dan kegiatan komunitas lainnya.",
  keywords: [
    "galeri dcn unira",
    "foto kegiatan dcn",
    "dokumentasi event",
    "dcnunira",
  ],
  alternates: {
    canonical: `${siteUrl}/galeri`,
  },
};

export default function GaleriPage() {
  return (
    <div className="min-h-screen bg-background py-20 mt-9 md:mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-5">
            Galeri
          </h1>
          <p className="text-lg text-muted-foreground">
            Dokumentasi kegiatan dan momen berharga dari DCN UNIRA
          </p>
        </div>

        <GaleriClient />
      </div>
    </div>
  );
}
