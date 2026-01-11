import { Metadata } from "next";
import PrivacyPolicyPage from "@/components/screen/privacy-policy";

const siteUrl = "https://dcnunira.dev";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Kebijakan Privasi Dicoding Community Network Universitas Madura. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
