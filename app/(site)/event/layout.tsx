import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
  description:
    "Temukan dan ikuti berbagai event menarik dari Dicoding Community Network Universitas Madura - Workshop, Seminar, Hackathon,MeetUp dan kegiatan komunitas developer lainnya.",
  keywords: [
    "event dcn unira",
    "workshop programming",
    "seminar teknologi",
    "hackathon madura",
    "event developer",
    "komunitas developer madura",
  ],
  alternates: {
    canonical: "https://dcnunira.dev/event",
  },
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
