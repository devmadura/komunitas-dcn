import { Metadata } from "next";
import TermsOfServicePage from "@/components/screen/terms-of-service";

export const metadata: Metadata = {
  title: "Terms Of Service | DCN UNIRA",
  description:
    "Syarat dan Ketentuan penggunaan layanan DCN Universitas Madura. Baca sebelum menggunakan layanan kami.",
};

export default function TermsOfService() {
  return <TermsOfServicePage />;
}
