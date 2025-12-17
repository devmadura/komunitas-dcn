import CoreTeam from "@/components/CoreTeam";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Team",
  description: "Kenali core team Dicoding Community Network Universitas Madura",
};

export default function TeamPage() {
  return <CoreTeam />;
}
