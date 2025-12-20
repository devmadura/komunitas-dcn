import { Metadata } from "next";
import TermsOfServicePage from "@/components/screen/terms-of-service";

const siteUrl = "https://dcnunira.dev";
export const metadata: Metadata = {
  title: "Terms Of Service",
  description:
    "Syarat dan Ketentuan penggunaan layanan DCN Universitas Madura. Baca sebelum menggunakan layanan kami.",
  alternates: {
    canonical: `${siteUrl}/terms-of-service`,
  },
};

export default function TermsOfService() {
  return <TermsOfServicePage />;
}
