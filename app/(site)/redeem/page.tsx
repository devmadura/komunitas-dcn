import RedeemPage from "./RedeemClient";
import type { Metadata } from "next";

const siteUrl = "https://dcnunira.dev";
export const metadata: Metadata = {
  title: "Code Redeem",
  description:
    "Masukkan kode redeem untuk mendapatkan poin menarik di Komunitas Dicoding Community Network Universitas Madura.",
  alternates: {
    canonical: `${siteUrl}/redeem`,
  },
};

export default function Redeem() {
  return <RedeemPage />;
}
