import KlaimSertifikatPage from "./KlaimClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klaim Sertifikat",
  description:
    "Klaim sertifikat kamu di Dicoding Community Network Universitas Madura",
  alternates: {
    canonical: `https://dcnunira.dev/team`,
  },
};

export default function KlaimSertifikat() {
  return <KlaimSertifikatPage />;
}
