import KlaimSertifikatPage from "./KlaimClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klaim Sertifikat",
  description:
    "Klaim sertifikat kamu di Dicoding Community Network Universitas Madura",
  keywords: ["sertifikat dcn unira", "klaim sertifikat dcn unira", "dcnunira"],
  alternates: {
    canonical: `https://dcnunira.dev/sertifikat/klaim`,
  },
};

export default function KlaimSertifikat() {
  return <KlaimSertifikatPage />;
}
