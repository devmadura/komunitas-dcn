import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
  description:
    "Temukan dan ikuti berbagai event menarik dari DCN UNIRA - Workshop, Seminar, Hackathon,MeetUp dan kegiatan komunitas developer lainnya.",
  keywords: [
    "event dcn unira",
    "workshop programming",
    "seminar teknologi",
    "hackathon madura",
    "event developer",
    "komunitas developer madura",
  ],
  openGraph: {
    title: "Event DCN UNIRA",
    description:
      "Temukan dan ikuti berbagai event menarik dari DCN UNIRA - Workshop, Seminar, Hackathon, dan kegiatan komunitas developer lainnya.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event DCN UNIRA",
    description:
      "Temukan dan ikuti berbagai event menarik dari DCN UNIRA - Workshop, Seminar, Hackathon, dan kegiatan komunitas developer lainnya.",
  },
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
