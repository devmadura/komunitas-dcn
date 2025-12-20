import CoreTeam from "@/components/CoreTeam";
import { Metadata } from "next";

const siteUrl = "https://dcnunira.dev";
export const metadata: Metadata = {
  title: "Core Team",
  description: "Kenali core team Dicoding Community Network Universitas Madura",
  alternates: {
    canonical: `${siteUrl}/team`,
  },
};

export default function TeamPage() {
  return <CoreTeam />;
}
